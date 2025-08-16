addEventListener("fetch", event => {
  console.log('Request received')
  event.respondWith(handleRequest(event.request))
})

// respond with JSON body
function json(body, code) {
  return new Response(JSON.stringify(body), {
    status: code || 200,
    headers: {
      "Content-Type": "application/json",
    }
  })
}

// respond with JSON error
function error(error, code) {
  console.error(error)
  return json({ error }, code || 400)
}

// convert a string to a Uint8Array
function uintArray(str) {
  return new Uint8Array(Array.from(str).map(c => c.charCodeAt(0)))
}

// decode a base64-URL encoded string
function base64UrlDecode(str) {
  return atob(str.replace(/_/g, "/").replace(/-/g, "+"))
}

// verify the JWS signature
// https://gist.github.com/bcnzer/e6a7265fd368fa22ef960b17b9a76488
// https://github.com/tsndr/cloudflare-worker-jwt/blob/main/index.js
async function checkSignature(token, body) {
  if (!token) { return "Missing JWS token" }

  // header.payload.signature
  const tokenData = token.split(".")
  if (tokenData.length != 3) { return "Malformed JWS token" }

  const secret = uintArray(JWS_SECRET)
  const key = await crypto.subtle.importKey("raw", secret, {
    name: "HMAC",
    hash: {name: "SHA-256"},
  }, false, ["verify"])

  const encoder = new TextEncoder()
  const data = encoder.encode(tokenData.slice(0, 2).join("."))
  const signature = uintArray(base64UrlDecode(tokenData[2]))

  // verify the JWT's signature matches the data within
  const verify = await crypto.subtle.verify("HMAC", key, signature, data)
  if (!verify) { return "Invalid JWS token" }

  // get the payload of the JWT and confirm the issuer
  const jwsPayload = JSON.parse(base64UrlDecode(tokenData[1]))
  if (jwsPayload.iss != "netlify") { return "Invalid JWS issuer" }

  // compare the sha256 with the body digest
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(body))
  const actualHash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("")
  const expectedHash = jwsPayload.sha256

  if (actualHash != expectedHash) { return "Invalid JWS digest" }
}

// handle the notifiation and dispatch GitHub workflow
async function handleRequest(request) {
  const body = await request.text()

  const jwtError = await checkSignature(
    request.headers.get("X-Webhook-Signature") || "",
    body
  )

  if (jwtError) { return error(jwtError, 401) }

  const contentType = request.headers.get("Content-Type") || ""
  let payload

  if (request.method == "POST" && contentType.includes("application/json")) {
    try {
      payload = JSON.parse(body)
    } catch (err) {}
  }

  if (!payload) { return error("Must POST JSON") }
  console.log('Payload:', payload)

  if (payload.context == "deploy-preview" && payload.state == "ready") {
    const apiUrl = (payload.review_url || "")
      .replace('//github.com', '//api.github.com/repos')
      .replace(/pull\/\d+$/, '');

    let ref = payload.commit_ref;
    if (!ref) {
      const branchData = await fetch(apiUrl + 'branches/' + payload.branch)
        .then(r => r.json());

      ref = branchData.commit.sha;
    }

    if (!payload.review_id) { return error("Missing PR number") }
    console.log(`Dispatching to ${apiUrl} with ref ${ref} and issue ${payload.review_id}`);

    try {
      workflowDispatch = await fetch(apiUrl + 'actions/workflows/deploy-preview.yml/dispatches', {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + GH_TOKEN,
          "User-Agent": "NetlifyDeploy/0.1.0",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: ref || 'main',
          inputs: {
            issue: payload.review_id.toString(),
            log: `${payload.admin_url}/deploys/${payload.id}`,
          }
        })
      })
    } catch (err) {
        return error(err)
    }

    console.log('GitHub response:', workflowDispatch.body)
    return new Response(workflowDispatch.body, {
      status: (workflowDispatch.ok ? 200 : 503),
      headers: workflowDispatch.headers,
    })
  }

  console.log('Not notifying GitHub')
  return json({status: "Nothing to do"})
}

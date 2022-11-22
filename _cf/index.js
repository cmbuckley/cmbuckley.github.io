const nonce = Math.random().toString(36).substring(7)

const csp = {
    'default-src': "'self'",
    'script-src': [
        "'self'",
        "'unsafe-hashes'",
        "'strict-dynamic'",
        `'nonce-${nonce}'`,
        "'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='", // CSS print inline
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
    ],
    'img-src': [
        "'self'",
        'https://res.cloudinary.com',
        'https://github.com/cmbuckley/',
        'https://www.gravatar.com',
        'https://www.herokucdn.com/',
        'data:',
    ],
    'font-src': [
        'https://fonts.gstatic.com',
        'about:', // https://github.com/mathjax/MathJax/issues/256#issuecomment-37990603
    ],
    'object-src': "'none'",
    'connect-src': [
        "'self'",
        'https://forms.cmbuckley.co.uk',
        'https://staticman.cmbuckley.co.uk',
    ],
    'media-src': [
        "'self'",
        'https://res.cloudinary.com'
    ],
    'frame-src': [
        "'self'",
        'https://www.youtube.com',
        'https://www.google.com',
    ],
    'form-action': [
        "'self'",
        'https://forms.cmbuckley.co.uk',
        'https://formcarry.com',
        'https://api.staticman.net/',
    ],
    'frame-ancestors': "'none'",
    'report-uri': 'https://cmbuckley.report-uri.com/r/d/csp/reportOnly',
}

const cspHeader = Object.keys(csp)
    .map(d => d + ' ' + (csp[d].join ? csp[d].join(' ') : csp[d]))
    .join('; ')

const securityHeaders = {
    'Content-Security-Policy': 'upgrade-insecure-requests',
    'Content-Security-Policy-Report-Only': cspHeader,
    'X-Xss-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
    'X-Clacks-Overhead': 'GNU Terry Pratchett',
}

const sanitiseHeaders = {
    'Server': 'cmbuckley.co.uk',
    'Strict-Transport-Security': 'max-age=31536000',
}

const removeHeaders = [
    'Access-Control-Allow-Origin',
    'Public-Key-Pins',
    'X-Powered-By',
    'X-AspNet-Version',
]

const trustOrigin = [
    'Content-Security-Policy',
    'Content-Security-Policy-Report-Only',
]

const redirects = {
    '/security.txt': '/.well-known/security.txt',
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(req) {
    const requestUrl = new URL(req.url)

    if (match = requestUrl.hostname.match(/^staging-(\d+)\./)) {
        requestUrl.hostname = `deploy-preview-${match[1]}--cmbuckley.netlify.app`
        return addSecurity(req, requestUrl)
    }

    if (redirects[requestUrl.pathname]) {
        let dest = redirects[requestUrl.pathname]
        if (dest[0] == '/') { dest = requestUrl.origin + dest }
        return Response.redirect(dest, 302)
    }

    if (requestUrl.hostname.match(/scripts\.cmbuckley\.co\.uk$/)) {
        return await fetch(req)
    }

    return addSecurity(req)
}

async function addSecurity(req, url) {
    const response = await fetch(url || req.url, req)
    const newHdrs = new Headers(response.headers)

    if (newHdrs.has('Content-Type') && !newHdrs.get('Content-Type').includes('text/html')) {
        return new Response(response.body, {
            status:     response.status,
            statusText: response.statusText,
            headers:    newHdrs
        })
    }

    const setHeaders = Object.assign({}, securityHeaders, sanitiseHeaders)
    const newBody = (await response.text()).replace(/nonce=""/gm, `nonce="${nonce}"`)

    Object.keys(setHeaders).forEach(name => {
        if (!trustOrigin.includes(name) || !newHdrs.has(name)) {
            newHdrs.set(name, setHeaders[name])
        }
    })

    if (new URL(url || req.url).hostname == 'forms.cmbuckley.co.uk') {
        if (/cmbuckley\.co\.uk$/.test(req.headers.get('Origin') || '')) {
            newHdrs.set('Access-Control-Allow-Origin', req.headers.get('Origin'))
        }
    }

    removeHeaders.forEach(name => {
        newHdrs.delete(name)
    })

    return new Response(newBody, {
        status:     response.status,
        statusText: response.statusText,
        headers:    newHdrs
    })
}

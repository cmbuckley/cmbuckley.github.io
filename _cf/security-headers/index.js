import { dependencies } from './package.json'
const nonce = Math.random().toString(36).substring(7)

const csp = {
    'default-src': [
        "'self'",
    ],
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
        'https://www.gravatar.com', // blog
        'https://www.herokucdn.com', // letterboxd-ics
        'https://raw.githubusercontent.com/iamcal/emoji-data/', // charcopy
        'data:',
    ],
    'font-src': [
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net/npm/@mathjax/',
    ],
    'object-src': [
        "'self'",
    ],
    'connect-src': [
        "'self'",
        'https://staticman.cmbuckley.co.uk',
        `https://cdn.jsdelivr.net/npm/mathjax@4/`,
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
        'https://formcarry.com',
        'https://api.staticman.net/',
    ],
    'frame-ancestors': "'none'",
    'report-uri': 'https://o4505875414777856.ingest.us.sentry.io/api/4508321253556224/security/?sentry_key=3379f07ad4facf6a5d862d7d856eee9a',
}

const securityHeaders = {
    'Content-Security-Policy': 'upgrade-insecure-requests',
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
    '/cv/cv.pdf': '/cv/chris-buckley-cv.pdf',
    '/security.txt': '/.well-known/security.txt',
    '/graphics/mosaic.jpg': '/assets/img/graphics/mosaic.jpg',
}

function getSecurityHeaders(req) {
    const requestUrl = new URL(req.url)

    if (requestUrl.hostname == 'test.cmbuckley.co.uk') {
        ['default', 'script', 'style', 'img'].forEach(type => csp[`${type}-src`].push('https://cmbuckley.co.uk'));
    }

    securityHeaders['Content-Security-Policy-Report-Only'] = Object.keys(csp)
        .map(d => d + ' ' + (csp[d].join ? csp[d].join(' ') : csp[d]))
        .join('; ')

    return securityHeaders;
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

    if (match = requestUrl.hostname.match(/^cv-(staging|role)-([^.]+)\./)) {
        const type = (match[1] == 'staging' ? 'deploy-preview' : 'role')
        requestUrl.hostname = `${type}-${match[2]}--cmbuckley-cv.netlify.app`
        return addSecurity(req, requestUrl)
    }

    if (req.method == 'POST' && requestUrl.hostname == 'cmbuckley.co.uk') {
        requestUrl.hostname = 'cmbuckley.netlify.app'
        return addSecurity(req, requestUrl)
    }

    if (redirects[requestUrl.pathname]) {
        let dest = redirects[requestUrl.pathname]
        if (dest[0] == '/') { dest = requestUrl.origin + dest }
        return Response.redirect(dest, 302)
    }

    if (requestUrl.hostname.endsWith('scripts.cmbuckley.co.uk')) {
        return await fetch(req)
    }

    return addSecurity(req)
}

async function addSecurity(req, url) {
    const response = await fetch(url || req.url, req)
    const newHdrs = new Headers(response.headers)
    let body = (req.method == 'POST' && url && !response.ok ? '' : response.body);

    if (newHdrs.has('Content-Type') && !newHdrs.get('Content-Type').includes('text/html')) {
        return new Response(body, {
            status:     response.status,
            statusText: response.statusText,
            headers:    newHdrs
        })
    }

    const setHeaders = Object.assign({}, getSecurityHeaders(req), sanitiseHeaders)
    Object.keys(setHeaders).forEach(name => {
        if (!trustOrigin.includes(name) || !newHdrs.has(name)) {
            newHdrs.set(name, setHeaders[name])
        }
    })

    removeHeaders.forEach(name => {
        newHdrs.delete(name)
    })

    // only parse the body for non-altered URLs
    if (!url) {
        body = (await response.text()).replace(/nonce=""/gm, `nonce="${nonce}"`)
    }

    return new Response(body, {
        status:     response.status,
        statusText: response.statusText,
        headers:    newHdrs
    })
}

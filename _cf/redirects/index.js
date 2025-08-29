const redirectUrls = {
  'video.scholesmafia.co.uk': {
    '/?id=3':  'https://cmbuckley.co.uk/videos/climbing/#v-leapoffaith',
    '/?id=4':  'https://cmbuckley.co.uk/videos/climbing/#v-pockets',
    '/?id=5':  'https://cmbuckley.co.uk/videos/climbing/#v-ibar',
    '/?id=18': 'https://cmbuckley.co.uk/videos/climbing/#v-leeds-abseil',
    '/?id=20': 'https://cmbuckley.co.uk/videos/climbing/#v-leeds-jay',
    '/?id=21': 'https://cmbuckley.co.uk/videos/climbing/#v-leeds-georgina',
    '/?id=22': 'https://cmbuckley.co.uk/videos/misc/#v-catenary-road',

    '/?p=2':   'https://cmbuckley.co.uk/videos/climbing/',
    '/?p=5':   'https://cmbuckley.co.uk/videos/climbing/',
    '/?p=6':   'https://cmbuckley.co.uk/videos/misc/',
    default:   'https://cmbuckley.co.uk/videos/',
  },
  'starsquare.co.uk': {
    '/security.txt':             '/.well-known/security.txt',
    '/images/checkerboard':      '/images/checkerboard.png',
    '/images/transparent':       '/images/transparent.png',
    '/code/php/bugs/55348.phps': 'https://gist.github.com/cmbuckley/1165020',
  },
};
const redirectPatterns = {
  'blog.cmbuckley.co.uk': {
    '^/section/(\\w+)/page[:/](\\d+)/?': 'https://cmbuckley.co.uk/blog/category/$1/',
    '^/section/(\\w+)/?':                'https://cmbuckley.co.uk/blog/category/$1/',
    '^/archives/([\\d/]+\\d)/?':         'https://cmbuckley.co.uk/blog/$1/',
    '^/archives/?':                      'https://cmbuckley.co.uk/blog/',
    '^/search':                          'https://cmbuckley.co.uk/blog/search',
    '^/index.php/page:(\\d+)/?':         'https://cmbuckley.co.uk/blog/page/$1/',
    '^/(?:index.php/)?(.*)':             'https://cmbuckley.co.uk/blog/$1',
  },
};

async function handleRequest(request) {
  const requestUrl = new URL(request.url),
        pathWithSearch = requestUrl.pathname + requestUrl.search;
  let location;

  if (redirectUrls[requestUrl.hostname]) {
    if (redirectUrls[requestUrl.hostname][pathWithSearch]) {
      location = redirectUrls[requestUrl.hostname][pathWithSearch];
    } else if (redirectUrls[requestUrl.hostname][requestUrl.pathname]) {
      location = redirectUrls[requestUrl.hostname][requestUrl.pathname];
    } else if (redirectUrls[requestUrl.hostname].default) {
      location = redirectUrls[requestUrl.hostname].default;
    }
  }

  if (redirectPatterns[requestUrl.hostname]) {
    Object.keys(redirectPatterns[requestUrl.hostname]).some(pattern => {
      let re = new RegExp(pattern);

      if (re.test(requestUrl.pathname)) {
        location = requestUrl.pathname.replace(re, redirectPatterns[requestUrl.hostname][pattern])
        return true;
      }
    });
  }

  if (location) {
    if (location[0] == '/') {
      location = requestUrl.origin + location;
    }

    return Response.redirect(location, 301);
  }

  // If request not in map, return the original request
  return fetch(request);
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request));
});

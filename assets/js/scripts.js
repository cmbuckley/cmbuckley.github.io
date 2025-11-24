document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js');

    let style = document.createElement('style'),
        nav = document.querySelector('.nav-collapse'),
        navButton = document.createElement('button'),
        navButtonStyle = getComputedStyle(navButton);

    // add max-height style for menu transition
    function updateMenu() {
        let list = nav.querySelector('ul'),
            height = list.offsetHeight,
            cssText = '.nav-toggle[aria-expanded="true"]+.nav-collapse{max-height:' + height + 'px}';

        if (height) {
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.innerHTML = cssText;
            }
        }

        if (!style.parentNode) {
            document.querySelector('head').appendChild(style);
        }

        // the list should be marked as hidden if the menu button is visible and not expanded
        list.hidden = (navButtonStyle.display == 'block' ? !nav.classList.contains('open') : false);
    }

    // add nav toggle button before the nav
    navButton.setAttribute('id', 'nav-toggle');
    navButton.setAttribute('aria-expanded', 'false');
    navButton.classList.add('nav-toggle');
    navButton.innerText = nav.getAttribute('aria-label');
    navButton.setAttribute('aria-controls', 'nav');
    nav.setAttribute('id', 'nav');
    nav.removeAttribute('aria-label');
    nav.setAttribute('aria-labelledby', 'nav-toggle');
    nav.parentNode.insertBefore(navButton, nav);

    // toggle menu on button click
    navButton.addEventListener('click', function (e) {
        let open = !(this.getAttribute('aria-expanded') === 'true'),
            list = this.nextElementSibling;

        this.setAttribute('aria-expanded', open);

        if (open) {
            list.classList.add('open');
            list.querySelector('ul').hidden = false;
        } else {
            setTimeout(() => {
                list.classList.remove('open');
                list.querySelector('ul').hidden = true;
            }, 270);
        }
    });

    // update the menu height if screen changes
    // first update on window load to be sure CSS has applied
    window.addEventListener('resize', updateMenu);
    window.addEventListener('load', updateMenu);

    // loop through all elements and replace with breakpoint elements
    if (window.CSS && CSS.supports('display', 'none')) {
        document.querySelectorAll('.break-text').forEach(function (el) {
            var span;

            for (var key in el.dataset) {
                // create span with the appropriate text
                span = document.createElement('span');
                span.className = {xs: 'hide-s-up', sUp: 'hide-xs'}[key];
                span.textContent = el.dataset[key];
                el.parentNode.insertBefore(span, el);
            }

            // now remove the default element
            el.parentNode.removeChild(el);
        });
    }

    // add an interacted class to forms to highlight required fields
    document.querySelectorAll('[type="submit"]').forEach(function (el) {
        el.addEventListener('click', function () {
            el.closest('form').classList.add('interacted');
        });
    });

    // forms that should be submitted via XHR
    document.querySelectorAll('form.xhr').forEach(function (form) {
        form.addEventListener('submit', function (submitEvent) {
            submitEvent.preventDefault();

            form.classList.add('form--loading');
            form.querySelectorAll('[type="submit"]').forEach(el => el.disabled = true);
            form.querySelectorAll('input.not-xhr').forEach(el => el.remove());

            var toast = form.querySelector('.form__notification');
            if (toast) {
                toast.innerText = '';
            } else {
                toast = document.createElement('output');
                toast.classList.add('form__notification');
                toast.setAttribute('role', 'status');
                form.appendChild(toast);
            }

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function () {
                form.classList.add('form--success');
                form.classList.remove('interacted');
                toast.innerText = form.dataset.messageSuccess;
                form.querySelectorAll('[type="submit"]').forEach(el => el.remove());
                form.reset();
            });

            xhr.addEventListener('error', function () {
                form.classList.add('form--error');
                toast.innerText = form.dataset.messageError;
            });

            xhr.addEventListener('loadend', function () {
                form.classList.remove('form--loading');
                form.querySelectorAll('[type="submit"]').forEach(el => el.disabled = false);
            });

            xhr.open(form.method, form.action);
            xhr.setRequestHeader('Content-Type', form.enctype);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send(new URLSearchParams(new FormData(form)).toString());
        });
    });

    // media metadata
    if ('mediaSession' in navigator) {
        function updateMediaSession(e) {

            const metaProps = [...document.querySelectorAll('meta[property^="og:"]')].reduce((ms, m) => {
                    ms[m.getAttribute('property')] = m.content;
                    return ms;
                }, {}),
                poster = e.target.getAttribute('poster'),
                sizes = [128, 192];

            navigator.mediaSession.metadata = new MediaMetadata({
                title:   e.target.parentNode.querySelector('figcaption').innerText,
                album:   metaProps['og:title'],
                artist:  metaProps['og:site_name'],
                artwork: sizes.map(size => ({
                    src:   poster.replace('so_0', ['c_thumb,h_', ',so_0,w_', ''].join(size)),
                    sizes: [size, size].join('x'),
                    type:  'image/jpg',
                })),
            });
        }

        document.querySelectorAll('video:has(+figcaption)').forEach(function (video) {
            video.addEventListener('play', updateMediaSession);
            video.addEventListener('pause', updateMediaSession);
        });
    }

    // search keyboard navigation
    if (search = document.querySelector('input[type="search"]')) {
        document.addEventListener('keyup', function (e) {
            if (!e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement != search) {
                // focus search box with "/"
                if (e.key == '/') {
                    search.focus();
                    if (search.select) {
                        search.select();
                    } else {
                        search.setSelectionRange(0, search.value.length);
                    }
                }

                // scrolling with J/K keys
                if (e.key == 'j' || e.key == 'k') {
                    let inFocus = document.querySelector('.posts .post:focus-within'),
                        spec = {sibling: {j: 'next', k: 'previous'}, child: {j: 'first', k: 'last'}},
                        toFocus;

                    if (inFocus) {
                        toFocus = inFocus[spec.sibling[e.key] + 'ElementSibling'];
                    } else {
                        toFocus = document.querySelector('.posts')[spec.child[e.key] + 'ElementChild'];
                    }

                    if (toFocus) {
                        toFocus.scrollIntoView({behavior: 'smooth', block: 'center'});
                        toFocus.querySelector('.post__link').focus();
                    }
                }
            }
        });

        search.addEventListener('keyup', function (e) {
            if ((e.key == 'Esc' || e.key == 'Escape') && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
                e.target.blur();
            }
        });
    }

    // deep link into Facebook app if possible
    let fbLinks = document.querySelectorAll('a[data-fb-profile]');
    if (fbLinks) {
        function fbAppLink(id) {
            if (/^iP(ad|hone)/.test(navigator.platform)) {
                return 'https://m.facebook.com/profile.php/?id=' + id;
            }
        }

        fbLinks.forEach(a => a.addEventListener('click', e => {
            let appLink = fbAppLink(a.dataset.fbProfile);

            if (appLink) {
                if (appLink.startsWith('https://')) {
                    e.preventDefault();
                    window.location.href = appLink;
                } else if (window.open(appLink)) {
                    e.preventDefault();
                }
            }
        }));
    }
});

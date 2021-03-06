document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js');

    let style = document.createElement('style'),
        nav = document.querySelector('.nav-collapse'),
        navButton = document.createElement('button');

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
        list.hidden = (navButton.offsetParent ? !nav.classList.contains('open') : false);
    }

    // add nav toggle button before the nav
    navButton.setAttribute('id', 'nav-toggle');
    navButton.setAttribute('aria-expanded', 'false');
    navButton.classList.add('nav-toggle');
    navButton.innerText = nav.getAttribute('aria-label');
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
    window.addEventListener('resize', updateMenu);
    updateMenu();

    // loop through all elements and replace with breakpoint elements
    if (window.CSS && CSS.supports('display', 'none')) {
        document.querySelectorAll('.break-text').forEach(function (el) {
            var span, attr;

            for (var key in el.attributes) {
                attr = el.attributes[key];

                if (/^data-/.test(attr.nodeName)) {
                    // create span with the appropriate text
                    span = document.createElement('span');
                    span.className = {xs: 'hide-s-up', 's-up': 'hide-xs'}[attr.nodeName.replace(/^data-/, '')];
                    span.textContent = attr.nodeValue;
                    el.parentNode.insertBefore(span, el);
                }
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
                toast = document.createElement('div');
                toast.classList.add('form__notification');
                form.appendChild(toast);
            }

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function () {
                form.classList.add('form--success');
                form.classList.remove('interacted');
                toast.innerText = 'Thanks for your post! It will appear here once it has been approved.';
                form.querySelectorAll('[type="submit"]').forEach(el => el.remove());
                form.reset();
            });

            xhr.addEventListener('error', function () {
                form.classList.add('form--error');
                toast.innerText = 'The comment could not be posted.';
            });

            xhr.addEventListener('loadend', function () {
                form.classList.remove('form--loading');
                form.querySelectorAll('[type="submit"]').forEach(el => el.disabled = false);
            });

            xhr.open(form.method, form.action);
            xhr.setRequestHeader('Content-Type', form.enctype);
            xhr.send(Array.from(new FormData(form), e => e.map(encodeURIComponent).join('=')).join('&'));
        });
    });

    // media metadata
    if ('mediaSession' in navigator) {
        function updateMediaSession(e) {
            let size = 192;

            navigator.mediaSession.metadata = new MediaMetadata({
                title:   e.target.parentNode.querySelector('figcaption').innerText,
                artwork: [{
                    src:   e.target.getAttribute('poster').replace('so_0', ['c_thumb,h_', ',so_0,w_', ''].join(size)),
                    sizes: [size, size].join('x'),
                    type:  'image/jpg',
                }],
            });
        }

        document.querySelectorAll('video').forEach(function (video) {
            video.addEventListener('play', updateMediaSession);
            video.addEventListener('pause', updateMediaSession);
        });
    }

    // search keyboard navigation
    if (search = document.querySelector('input[type="search"]')) {
        document.addEventListener('keyup', function (e) {
            if (!e.ctrlKey && !e.altKey && !e.metaKey) {
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
                    let inFocus = document.querySelector('.search-results .key-focussed'),
                        spec = {sibling: {j: 'next', k: 'previous'}, child: {j: 'first', k: 'last'}},
                        toFocus;

                    if (inFocus) {
                        inFocus.classList.remove('key-focussed');
                        toFocus = inFocus[spec.sibling[e.key] + 'ElementSibling'];
                    } else {
                        toFocus = document.querySelector('.search-results')[spec.child[e.key] + 'ElementChild'];
                    }

                    if (toFocus) {
                        toFocus.classList.add('key-focussed');
                        toFocus.scrollIntoView({behavior: 'smooth', block: 'center'});
                    }
                }

                // visit the selected result
                if (e.key == 'Enter') {
                    let inFocus = document.querySelector('.search-results .key-focussed');

                    if (inFocus) {
                        inFocus.querySelector('a').click();
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
});

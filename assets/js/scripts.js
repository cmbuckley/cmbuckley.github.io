document.addEventListener('DOMContentLoaded', function(event) {
    var nav = responsiveNav('.nav-collapse');

    // loop through all elements and replace with breakpoint elements
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
});

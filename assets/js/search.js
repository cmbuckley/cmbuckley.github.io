---
---
(function (doc) {
    var posts = JSON.parse(document.getElementById('posts').innerHTML);

    var searchIndex = lunr(function () {
        this.ref('id');
        this.field('title', {boost: 10});
        this.field('excerpt', {boost: 5});
        this.field('content');
        this.field('categories');
        this.metadataWhitelist = ['position'];

        for (var id in posts) {
            var post = posts[id];
            post.id = id;
            this.add(post);
        }
    });

    // mark the search terms in an element
    function mark(element, matches) {
        var positions, previous, position, index;

        for (var term in matches) {
            // sort matches by where they appear in the text
            positions = matches[term].sort((a, b) => a[0] - b[0]).slice();
            position = positions.shift();
            previous = [-1, -1];
            index = 0;

            var nodeWalker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT, {acceptNode: function (node) {
                return /^[\t\n\r ]*$/.test(node.nodeValue) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
            }}, false);

            while (node = nodeWalker.nextNode()) {
                if (!position || (position[0] == previous[0])) { continue; }

                // if the next match is in this node
                if (position[0] < index + node.length) {
                    // use a range to surround the match
                    var range = doc.createRange();
                    range.setStart(node, position[0] - index);
                    range.setEnd(node, Math.min(node.length, position[0] + position[1] - index));
                    range.surroundContents(doc.createElement('mark'));

                    // update counters
                    index = position[0] + position[1];
                    previous = position;
                    position = positions.shift();
                    nodeWalker.nextNode(); // skip what we just wrapped
                } else {
                    index += node.length;
                }
            }
        }
    }

    // create a post entry
    function buildSearchResult(result) {
        var post = posts[result.ref],
            li = doc.createElement('li'),
            date = doc.createElement('time'),
            heading = doc.createElement('h3'),
            postLink = doc.createElement('a'),
            excerpt = doc.createElement('p'),
            positions = {};

        // flip the match data to be keyed on field first
        for (var term in result.matchData.metadata) {
            for (var field in result.matchData.metadata[term]) {
                if (!positions[field]) { positions[field] = {}; }
                positions[field][term] = result.matchData.metadata[term][field].position;
            }
        }

        // post date
        date.textContent = post.date;
        date.className = 'date';
        date.setAttribute('datetime', post.isoDate);

        // post title/url
        postLink.href = post.url;
        postLink.innerHTML = post.title_html;
        postLink.className = 'post__link';

        if (positions.title && Object.keys(positions.title).length) {
            mark(postLink, positions.title);
        }
        heading.appendChild(postLink);

        // post excerpt
        excerpt.innerHTML = post.excerpt_html;
        if (positions.excerpt && Object.keys(positions.excerpt).length) {
            mark(excerpt, positions.excerpt);
        }

        // add the post
        li.appendChild(date);
        li.appendChild(heading);
        li.appendChild(excerpt);
        li.className = 'post post--excerpt';
        li.setAttribute('role', 'article');
        doc.querySelector('ul.posts').appendChild(li);
    }

    doc.addEventListener('DOMContentLoaded', function(event) {
        var params = (new URL(doc.location)).searchParams,
            query = params.get('q');

        if (!query) { return; }
        doc.getElementById('q').value = query;
        var results = searchIndex.search(query);

        if (results.length) {
            results.forEach(buildSearchResult);
        }
        else {
            var noResults = doc.createElement('p');
            noResults.setAttribute('role', 'status');
            noResults.textContent = 'No results found.';
            doc.querySelector('ul.posts').replaceWith(noResults);
        }
    });
})(document);

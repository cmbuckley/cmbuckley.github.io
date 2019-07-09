---
layout: null
---
(function (doc) {
    var posts = {
     {% for post in site.posts %}
      {{ post.slug | jsonify }}: {
        title: {{ post.title | smartify | strip_html | normalize_whitespace | jsonify }},
        date: {{ post.date | date: '%e %B %Y' | jsonify }},
        excerpt: {{ post.description | default: post.excerpt | smartify | strip_html | normalize_whitespace | jsonify }},
        content: {{ post.content | strip_html | normalize_whitespace | jsonify }},
        categories: {{ post.categories | join: ' ' | normalize_whitespace | jsonify }},
        url: {{ post.url | absolute_url | jsonify }}
      }{% unless forloop.last %}, {% endunless %}
     {% endfor %}
    };

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
                    range.setEnd(node, position[0] + position[1] - index);
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
            date = doc.createElement('span'),
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

        // post title/url
        postLink.href = post.url;
        postLink.textContent = post.title;
        postLink.className = 'post-link';

        if (positions.title && Object.keys(positions.title).length) {
            mark(postLink, positions.title);
        }
        heading.appendChild(postLink);

        // post excerpt
        excerpt.textContent = post.excerpt;
        if (positions.excerpt && Object.keys(positions.excerpt).length) {
            mark(excerpt, positions.excerpt);
        }

        // add the post
        li.appendChild(date);
        li.appendChild(heading);
        li.appendChild(excerpt);
        doc.querySelector('ul.posts').appendChild(li);
    }

    doc.addEventListener('DOMContentLoaded', function(event) {
        var params = (new URL(doc.location)).searchParams;
        doc.getElementById('q').value = params.get('q');

        var results = searchIndex.search(params.get('q'));
        results.forEach(buildSearchResult);
    });
})(document);

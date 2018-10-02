---
title: Projects
layout: page
---

* [Laptop Digital Picture Frame](/projects/laptop/)
* [Word Clock](/projects/word-clock/)

{% assign gh_pages = site.github.public_repositories | where_exp:'r','r.has_pages == true' | where_exp:'r','r.fork == false' | where_exp:'r','r.private == false' %}
{% if gh_pages.size %}
## Showcase

<ul>
{% for gh_page in gh_pages %}{% unless gh_page.name == site.github.repository_name %}
{% assign default_href = gh_page.name | prepend: '/' | append: '/' %}
<li><a href="{{ gh_page.homepage | default: default_href }}">{{ gh_page.description | default: gh_page.name }}</a>
(<a href="{{ gh_page.html_url }}">source</a>)</li>
{% endunless %}{% endfor %}
</ul>
{% endif %}

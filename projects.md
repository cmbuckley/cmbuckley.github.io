---
title: Projects
layout: page
---

* [Laptop Digital Picture Frame](/projects/laptop/)
* [Word Clock](/projects/word-clock/)

{% assign gh_pages = site.github.public_repositories | where_exp:'repo','repo.has_pages == true' | where_exp:'repo','repo.fork == false' %}
{% if gh_pages.size %}
## Showcase

<ul>
{% for gh_page in gh_pages %}{% unless gh_page.name == site.github.repository_name %}
<li><a href="{{ gh_page.name | prepend: '/' | append: '/' }}">{{ gh_page.description | default: gh_page.name }}</a></li>
{% endunless %}{% endfor %}
</ul>
{% endif %}

---
layout: gallery
title: Videos
---

Video collections:

<ul>
{% assign pages = site.pages | where_exp:"p","p.url contains page.url" | where_exp:"p","p.url != page.url" | sort:"url" %}
{% for pg in pages %}
<li><a href="{{ pg.url }}">{{ pg.title }}</a></li>
{% endfor %}
</ul>

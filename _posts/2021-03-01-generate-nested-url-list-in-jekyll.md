---
title: Generate Nested URL List in Jekyll
categories:
  - Computing
last_modified_at: 2021-03-02 00:04 +00:00
---
This site uses Jekyll on [GitHub Pages](https://pages.github.com), which has a restricted set of
plugins that can be used when generating the static site.

I generate a human-readable [site map](/site-map/) (as well as the [Sitemap XML file](/sitemap.xml),
which I also generate manually instead of using the [jekyll-sitemap plugin](https://github.com/jekyll/jekyll-sitemap),
to have a little more control over the output).

{%- assign main_repo = site.github.public_repositories | where_exp:'r','r.name == site.github.repository_name' | first %}

Part of this site map is a set of pages, nested by URL heirarchy. I use a recursive include for this.
The [full source]({{ main_repo.html_url | replace: 'http:','https:' }}/blob/{{ main_repo.default_branch }}/_includes/listing.html)
is in the repo, but here's a breakdown of the script.

Firstly, here's how it's called:

{% raw %}
```liquid
{% assign pages = site.html_pages | sort:'url' %}
{% include listing.html pages=pages prefix='/' %}
```
{% endraw %}

The include parameters:

`pages`
: The pages to output. An array of objects with `url` and `title` properties.

`prefix`
: The base URL to start outputting from.

`indent`
: Optional spaces to indent the HTML output.

{% raw %}
```liquid
{{ include.indent }}<ul>

{%- for page in include.pages %}
  {%- if page.url contains include.prefix %}
    ...
  {%- endif %}
{%- endfor %}
{{ include.indent }}</ul>
```
{% endraw %}

This is the start and end of the loop, which first checks if the URL contains the base URL.

{% raw %}
```liquid
{%- assign split_by_prefix = page.url | split: include.prefix %}
{%- if page.url == include.prefix or split_by_prefix[0] == empty %}
```
{% endraw %}

Then, check the URL actually begins with the prefix. Liquid doesn't have a "starts with" operator,
so split the string by the prefix, and check that the first element is empty.

Notice how Liquid has some inconsistencies in how splits are handled at the beginning and end:

```liquid
{% raw %}{{ 'a/b' | split: '/' }}{% endraw %} = {{ 'a/b' | split: '/' | jsonify }}
{% raw %}{{  '/b' | split: '/' }}{% endraw %} = {{ '/b' | split: '/' | jsonify }}
{% raw %}{{ 'a/'  | split: '/' }}{% endraw %} = {{ 'a/' | split: '/' | jsonify }}
{% raw %}{{  '/'  | split: '/' }}{% endraw %} = {{ '/' | split: '/' | jsonify }}
```

Empty strings appear at the beginning of the split, but not at the end, and the initial empty string
disappears too in the last case; hence the extra check. (I previously used `[0] == nil` and `size == 0`,
but this equality check seemed easier to understand later.)

{% raw %}
```liquid
{%- assign remainder = split_by_prefix | slice: 1, split_by_prefix.size - 1 | join: include.prefix %}
{%- if include.prefix != '/' %}
  {%- assign remainder = remainder | split: "" | reverse | slice: 1, remainder.size - 1 | reverse | join: "" %}
{%- endif %}
```
{% endraw %}

Now, stick the rest of the URL back together. I could `remove: include.prefix` from the URL, but my
permalinks have trailing slashes so I need to remove the final character anyway (unless the prefix was
"/", in which case it's swallowed by the split inconsistencies mentioned above).

{% raw %}
```liquid
{%- unless remainder contains '/' %}
{{ include.indent }}  <li>
{{ include.indent }}    <a href="{{ page.url }}">{{ page.title }}</a>
```
{% endraw %}

If the rest of the URL contains a slash, it's not a direct child, so we can ignore this URL. This script
doesn't handle URLs with gaps in the tree structure, so if a child doesn't exist, any grandchildren
won't be rendered.

{% raw %}
```liquid
{%- if page.url != '/' %}
  {%- assign subpages = include.pages | where_exp:'p':'p.url != page.url' | where_exp:'p','p.url contains page.url' %}
  {%- if subpages.size > 0 %}
    {%- capture indent %}{{ include.indent }}    {% endcapture %}
{% include listing.html pages=subpages prefix=page.url indent=indent %}

  {%- endif %}
{%- endif %}
{{ include.indent }}  </li>
```
{% endraw %}

Here's where the recusion happens. The pages are filtered for those containing the current URL, the
indent is increased and the child pages are output in a nested list. The index page is listed at the
same level as the first children, so there's a slight edge case to handle here.

The end result is a directory structure like this:

```html
{%- assign pages = site.html_pages | sort:'url' %}
{% include listing.html pages=pages prefix='/interests' %}
```

Liquid is a pretty powerful templating language, so even with a few quirks it's nice to be able to build a recursive list like this!

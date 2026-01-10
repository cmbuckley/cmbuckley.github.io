---
title: Making SVGs Dark Mode & Reading Mode Friendly
description: >
   It's not easy to include SVGs in a page in a way that survives all rendering contexts.
date: 2026-01-10 20:53 +0000
categories:
  - Computing
image:
  meta:
    src: /files/2026/01/flowchart.png
    alt: A diagram in light and dark modes
last_modified_at: 2026-01-10 23:41 +0000
---

I use Scalable Vector Graphics (SVGs) on this site as they're an effective format for diagrams; they can be easily modified, styled, animated and localised.

However, it's not easy to include SVGs in a page in a way that survives all rendering contexts. I originally used a standard `<img>` tag, but found that browsers would not respect the `prefers-color-scheme` media feature to style the SVG for dark mode.

I considered inline SVGs directly in the page, but due to Jekyll's `include` tag not supporting symlinks in safe mode, I would have had to move files around, and CSS styles are not well respected in Chrome/Safari's reading modes.

I switched the `<img>` tag for an `<object>` tag, which supports media features, as well as interactivity if required. But Safari rears its head again --- Safari's [Reader Mode][1] strips out complex or non-semantic elements like `<object>`, meaning that SVG figures disappear. The `<object>` element does support fallback content which is [intended to be used in a scenario like this][2], but Safari doesn't use it in this way.

The only way I've found to cope with this is to include 2 copies of the image:

```html
<figure>
  <object role="img" data="img.svg" aria-label="Description"></object>
  <img src="img.svg" alt="" class="reader-only" />
  <figcaption>Caption</figcaption>
</figure>
```

Another quirk now: the [usual way][3] to visually hide elements that should remain accessible to Assistive Technology does not work in Safari's Reader Mode. Anything using `text-indent`, `clip` or even `height: 1px` prevents the element from showing in Reader Mode.

So with a slightly modified CSS mixin, and something of a concern for the accessibility of the solution, this works well, at least in Chrome and Safari.

One problem that still remains is the intersection of dark mode and reading mode, because the `<img>` tag doesn't support media queries as mentioned before. But reading mode has a choice of background colours, from light to dark.

There's no way to apply CSS to the reading mode view, so any background colour needs to be in the SVG itself. But we don't want the background colour to show at all in the standard view. We can use the fact that media features only work in the `<object>` context to our advantage now:

```html
<svg>
  <style>
    @media (scripting: enabled) { .bg { fill: none !important; } }
  </style>
  <rect class="bg" height="100%" width="100%" style="fill:white" />
  <text>Rest of SVG content</text>
</svg>
```

Again, this isn't exactly a satisfying solution, but it does mean a single SVG can be used in all rendering contexts.

Have I missed a neater solution? Is there something I've not considered with this approach? Do other browsers run into the same (or different) problems?

[1]: https://support.apple.com/en-gb/guide/iphone/iphdc30e3b86/ios
[2]: https://www.w3.org/WAI/WCAG21/Techniques/html/H53.html
[3]: https://gist.github.com/ffoodd/000b59f431e3e64e4ce1a24d5bb36034

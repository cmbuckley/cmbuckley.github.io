---
title: Internal Anchors
layout: post
categories:
  - Computing
---
Well, it was an interesting hour that resulted in this…

[Facebook](http://facebook.com) notes employ a redirect script for any links found in the note. There is a problem, however, when the link in question contains an apostrophe. The apostrophe is then matched out to its numerical code `&#036;`.

This was relevant to me since the [pictures site](http://pictures.scholesmafia.co.uk/index.php/) has certain URLs containing apostrophes, and the Facebook links were displaying the [error page](http://pictures.scholesmafia.co.uk/index.php/error).

Before this error page is shown, I check a number of options to see if the link might be corrected, so I wanted to add a correction for this case. So I thought a simple string replace of `&#036;` with `'` would work. Nope.

I soon realised that this was because the URL contained a hash, meaning it was pointing to an internal anchor (for example, `/path/to/page-with'apostrophe` actually went to `/path/to/page-with&` and tried to find an anchor called `039;apostrophe`. So I needed to get the name of the anchor requested as well.

Not possible with PHP. After seeing the explanation in [one forum topic](http://webmasterworld.com/forum92/528.htm), and seeing it clarified in [another](http://webmasterworld.com/forum88/2665.htm), I find that the anchor request never actually leaves the browser — it makes the page request, then searches in the result for the anchor. This means that no server-side scripting is going to work.

JavaScript it is, then. Here’s the workaround:

```js
if (!isNaN(parseInt(window.location.hash.substring(1, 2)))) {
    window.location = window.location.href.replace(/&#(d+);/g, function(w, p) {
        return String.fromCharCode(+p);
    });
}
```

This matches any case, thanks to [TheScripts](http://thescripts.com/forum/thread152866.html): since the anchor is `CDATA` (either through `name` or `id`), it must begin with a letter, so only incorrect anchors are checked.

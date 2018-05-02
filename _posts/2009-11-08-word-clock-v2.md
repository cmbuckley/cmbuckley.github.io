---
title: Word Clock v2
layout: post
categories:
  - Computing
  - Play
---
I’ve seen a few nice-looking representations of clocks around, but when I saw [Gumuz’s word clock](http://gumuz.nl/weblog/javascript-word-clock/) I though I could make some improvements to it. Here’s a couple of the changes:

  * Rewrote using [MooTools](http://mootools.net) (only because I know it better, I’m currently developing in it, and it gave me a chance to play with Google’s JS API)
  * Rewrote some of the JavaScript logic to be a bit tidier
  * Replaced the letters with dots for an arguably prettier output
  * Reordered the hours in the HTML so that “twelve o’clock” wouldn’t be missing the space (I had to combine _two_ and _one_ for this)
  * Highlighted the _a_ in _half_ for quarter-past and quarter-to, as per [mattatwhoosh’s suggestion](http://gumuz.nl/weblog/javascript-word-clock/#comment-18582925)

The result is tested in IE (5.5–8), Safari, Chrome and Firefox. I hit a slight issue in IE6− (what a surprise) whereby it interprets `a.sec.lit` as `a.lit` ([example](http://www.oppenheim.com.au/examples/multiple-css-classes-a-little-known-ie6-hack/)); I got around it by making `sec` an ID rather than a class (yes, I know it’s dirty).

[Have a look for yourself](http://cmbuckley.co.uk/projects/word-clock/).
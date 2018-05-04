---
title: Get a Grid for Transparent Images in Firefox
layout: post
categories:
  - Computing
---
Here's a useful bit of [Firefox](http://getfirefox.com/) hackery for you all. It puts a checkerboard (or chequerboard, for you elitists) image as the background for your transparent images. It works for any image when viewed directly in Firefox, by checking for a HTML page containing a single `img` tag. If you reproduce this structure manually, then you'll see the checkerboard, but there's very little chance that a legitimate HTML page would match these selectors. It works by adding some content to your `userContent.css`:

  1. Lifehacker has a [guide](http://lifehacker.com/software/firefox/customize-firefox-with-userchromecss-197715.php) to finding your `userChrome.css` file --- your `userContent.css` resides in the same folder.
  2. You may not have a `userContent.css` file; if not, you should create it. In some instances you may have a `userContent-example.css` file, which you can rename to get the idea of what goes in this file.
  3. Open the file and insert the following CSS:

```css
/*
 * Image from https://commons.wikimedia.org/wiki/File:Checker-16x16.png?oldid=19631383
 */
html > body > img:only-child {
	background: url('https://starsquare.co.uk/images/checkerboard') repeat;
}

html > body > img:only-child:hover {
	background: none;
}
```

    With the above CSS, viewing an image directly displays the checkerboard at all times, unless you hover over the image, in which case it reverts back to show the normal image. If you want it the other way round, so the checkerboard only shows when you hover over the image, insert the following CSS:

```css
/*
 * Image from https://commons.wikimedia.org/wiki/File:Checker-16x16.png?oldid=19631383
 */
html > body > img:only-child:hover {
	background: url('https://starsquare.co.uk/images/checkerboard') repeat;
}
```

  4. Save the file. If you had Firefox open, you should restart your browser. If not, simply start it up.
  5. Find an image that contains transparency and open it in your browser; a good example is [this image](https://starsquare.co.uk/images/transparent).
  6. Pretend you're in your favourite image editor!

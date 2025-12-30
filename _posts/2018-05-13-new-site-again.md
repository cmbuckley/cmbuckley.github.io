---
title: New Site (Again)
categories:
  - Computing
last_modified_at: 2025-12-30 10:25 +0000
---

This isn't the first time I've moved my personal site; the [first post I still have]({% post_url 2006-08-03-back-up-running %}) was after I lost some old blog posts, and I [moved to WordPress]({% post_url 2012-04-19-everything-changes %}) in 2012 to avoid supporting a separate blog and page builder. However, it was still running on my VPS, and I've been trying to remove all production content from there for a while.

Enter [Jekyll](https://jekyllrb.com) and [GitHub Pages](https://pages.github.com).

We've been using GitHub Pages on the [technology blog](https://sbg.technology) for a while, and for the most part it's quite easy to manage blog posts and pages in a simple structure, and of course all version controlled. With it being static, there are some restrictions to what can be done directly, but thankfully there are some helpful tools out there to add back in the important dynamic features.

## Basics

I first chose an appropriate theme for the site. For this I used Brian Maier Jr's [Long Haul theme](http://brianmaierjr.com/long-haul/), which fitted very closely to what I had in mind. I've changed very little of the site structure and it's great that there are such well-designed themes to use.

I added a contact form using [formcarry](https://formcarry.com/), which allows you to build a very straightforward contact form to send on to an email address.

## Migration

To migrate the existing content from my WordPress site, I used the [WordPress Jekyll Exporter](https://wordpress.org/plugins/jekyll-exporter/) to export all posts and content into Jekyll posts and pages. I did a little work to tidy up the posts and images, and I decided to revert the parsing for smart quotes and the like, but avoided the bulk of the heavy lifting.

The few comments I had were exported using [WordPress Comments Import & Export](https://wordpress.org/plugins/comments-import-export-woocommerce/) plus a [quick PHP script](https://gist.github.com/{{ site.github.owner_name }}/cb15828f02965721a31be025db4d0d0b) to convert them to a suitable YAML format (more on that later).

## Site Map

I added an XML site map for Google, and a [more human-readable version](/site-map/) for everyone else. I started off using the [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap) plugin, but that did not pull any GitHub project pages, which meant my [CV page](/cv/) wasn't included - I have a separate project for that and decided to keep them separate for now. So I copied the layout from the plugin and [added my own section]({{ site.github.repository_url }}/blob/v2.0/sitemap.xml#L30-L36) for the showcase, using [github-metadata](https://github.com/jekyll/github-metadata) instead.

I've seen some rather messy solutions for category/tag pages including using query string parameters / JavaScript to manipulate a page, but {% include archive.html text="found a nice solution" url="http://www.minddust.com/post/alternative-tags-and-categories-on-github-pages/" %} using collections instead.

## Comments

The technology blog uses Disqus and while it doesn't really require any effort to moderate, the performance burden is terrible. [This post](http://donw.io/post/github-comments/) shows exactly the effect Disqus can have on a page load. That post goes on to suggest using GitHub comments instead, which requires a long-running issue for each post with comments, and requires JavaScript to post them.

Instead I found [Hacker News](https://news.ycombinator.com/item?id=14170041) to be very helpful in suggesting [Staticman](https://staticman.net/), which allows comments to be stored as data in the repo, and the comment form ultimately results in a Pull Request being generated with the comment details. Fits perfectly with the rest of the site! It also meant I could recreate the existing comments with very little effort.

## Summary

I'm pretty happy that, with everything else going on, this was a nice way to do some digital housekeeping and I'm happy with the output after a couple of weeks. I'm sure I will keep working on it though --- maybe I will finish the [interests section](/interests/) after {% include archive.html date="2008-03-24 19:57:33" url="http://cmbuckley.co.uk/interests/computing/" text="10 years" %}...

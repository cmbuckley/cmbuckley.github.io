---
title: Adapting for OpenID
description: Adapting for OpenID is no fun.
layout: post
categories:
  - Computing
last_modified_at: 2021-08-19 22:46 +01:00
---
Adapting for [OpenID](https://openid.net) is no fun. Especially when:

  1. bBlog is particularly difficult to extend in this area, even though being Smarty-based it's supposed to be highly customisable;
  2. there is so little comprehensive documentation for being an OpenID consumer.

Being an <abbr title="identity provider">IdP</abbr> is simple; the OpenID consumer sends a request to the IdP (in this case, https://cmbuckley.co.uk/myid/) and, if successful, the user is redirected back to the consumer to confirm that the user has logged in successfully.

Doing this the other way round, with the blog as the consumer, the bBlog class gives a bit of a problem: The commenting method is written quite strongly for the POST method --- which I'd like to keep, as I don't really like submitting forms with GET anyway. However, the set-up for OpenID is very GET-orientated, so I'd have to almost completely rewrite the function for adding a new comment. And then I have to decide whether I send the comment to the IdP as part of the successful URL, or hold it in some sort of session variable or other method. Either way, if the comment is submitted at the same time as the OpenID, then the comment has to wait.

Add to this the fact that hardly anyone really supports, uses or even knows about OpenID, and you might wonder why I'm even thinking about this yet. I'll probably have to change everything for the 2.0 specification anyway...

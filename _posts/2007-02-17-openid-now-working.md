---
title: OpenID Now Working
layout: post
categories:
  - Computing
---
After my [attempts earlier this week](http://blog.cmbuckley.co.uk/2007/02/14/adapting-for-openid/), I have managed to get [OpenID](http://openid.net) working on the blog. I haven't yet sorted out any linking of an OpenID with either a Media Network profile or a tag profile, but it'll be added in soon.

Fortunately, it actually only required minor modification of the bBlog class. I decided to post the comment prior to authentication, simply awaiting moderation. Then the comment ID is passed as part of the return URL, along with an auth code to make sure that no-one can steal another user's comments by modifying the authentication URL. I really need to check what happens in the event of a failure or a cancel, but otherwise it's all good!
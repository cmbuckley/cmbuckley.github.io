---
title: Google Home So Far
categories:
  - Computing
---

I've been playing with [Google Home](https://store.google.com/gb/product/google_home) quite a bit recently, with mixed success to say the least.

Most basic functionality seems to be fine, and we regularly use the Home Assistant to set a quick timer. We've just bought a Home Hub too, which I'm sure will get plenty of use in the kitchen with helpful videos and music.

However, even some basic functionality isn't available with my set-up, because I use a [G Suite](https://gsuite.google.co.uk/) (formerly Google Apps) account rather than a standard Google account. Because G Suite is a multi-user suite of tools commonly used for businesses, there's no proper Google Home integration yet. I've had Google Apps since it was offered as "Gmail for your domain" so have become incorporated into the paid-for suite.

The immediate problem is that I can't access my calendar with the Assistant, so typical actions like "how's my calendar for tomorrow?" or "schedule an event for me" aren't possible. It is a similar story with email. It also means I currently can't share the devices with anyone else.

I did have a play with using a standard Google Account, but it's by no means ideal (I don't want to use it for everything, which would mean I'd need to synchronise my mail, calendar, photos, music, and probably more).

Where Google Home is meant to excel, however, is with integrations with other IoT products. So far, this has not been my experience. I'm aware this is a relatively new space, and there is plenty that needs to be improved upon (security, safety, privacy, wellbeing being the top of the list), so for now I've learned to do my research a little better.

The first problem I experienced was linking to our [Ring](https://ring.com/) doorbell. This is to be expected with Google and Amazon both pushing their own set of tecnologies, but I thought it would be better than this. The advertised "Ring integration" essentially allows me to ask "when did my doorbell last ring?" or to find out the battery health. If I want to actually get doorbell alerts in the house, I have three choices: buy a Nest doorbell instead, use Ring with Alexa, or get a separate Ring Chime.

I ended up with a convoluted fourth option:

* Set up Stringify[^1] with Ring integration
* Create a flow to make an HTTP POST when the doorbell rings
* Set up a Raspberry Pi on the home network to receive the POST
* Use npm package [`google-home-push`](https://www.npmjs.com/package/google-home-push) to announce the doorbell

If this seems over the top, it's because it is. We'll probably end up with Nest for doorbell and heating, unless Google Home continues to be a pain.

Most recently, I ran into the biggest pain trying to integrate with our LG TV. With a few button clicks on the TV I could register my Google account with ThinQ (although typing a 30+ character password with an on-screen keyboard wasn't fun). But I still couldn't get the Home to talk to LG. I had noticed previously that the Google Home app doesn't show the setup instructions when I say "Link to X", which I've now found is another issue related to G Suite accounts. So I de-registered the TV, and tried to set it up with a standard account (another 30+ character password). This didn't work immediately, and forums suggested this could be related to ThinQ being available for US only.

Not wanting to set up another Gmail account, I tried another suggestion, using the Google Assistant app to link to LG. After this, and also switching the Home Mini to be on the same Google account, they could talk! I figured this must be repeatable with my G Suite account, so switched the Mini back, switched the TV registration (third long password entry) and tried again with Google Assistant. Everything looked to work, and I can use the Assistant app to control the TV, but the Home Mini can't control the TV (I just get "I'm afraid something went wrong").

All in all, that's quite a lot of effort for minimal return at this point!

[^1]: Stringify has since been deactivated, but response time on [IFTTT](https://ifttt.com/) has improved enough for me to switch to that.

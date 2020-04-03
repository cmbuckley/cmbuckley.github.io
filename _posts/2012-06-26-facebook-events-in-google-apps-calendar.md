---
title: Facebook Events in Google (Apps) Calendar
layout: post
categories:
  - Computing
---
I subscribe to a number of third-party calendars in my own Google Calendar, one of which being my Facebook events. However, there are a couple of issues to work around to get everything working perfectly.

If a friend has marked an event as "private", Google Calendar only shows free/busy information because the iCal event has `CLASS:PRIVATE`.

A number of helpful scripts exists to solve this, simply by changing the `CLASS` field to `PUBLIC`. [Make Tech Easier](http://maketecheasier.com/export-facebook-events-to-google-calendar/2011/07/29) points to [Event Busy Fix](http://eventbusyfix.info/), but unfortunately this doesn't work in Google Apps. My solution came from [an answer on WebApps.SE](https://webapps.stackexchange.com/a/10219/21553), which suggested [iCal Stripper](http://icalstripper.appspot.com/). Here's how to do it:

Open up your [Facebook Events page](https://www.facebook.com/events/).

Click on the dropdown and select "Export Events":

{% include figure.html img="/files/2012/06/events-dropdown.png" alt="Facebook events export button" %}
{% include figure.html img="/files/2012/06/events-export.png" alt="Facebook events link" %}

Copy the link and take it over to [iCal Stripper](http://icalstripper.appspot.com/).

Grab the stripped iCal URL and add it in Google Calendar:

{% include figure.html img="/files/2012/06/add-google-calendar.png" alt="Adding Facebook events link to Google Calendar" %}

And you're done!

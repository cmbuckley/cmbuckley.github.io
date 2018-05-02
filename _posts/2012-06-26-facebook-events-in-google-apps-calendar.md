---
title: Facebook Events in Google (Apps) Calendar
layout: post
categories:
  - Computing
---
I subscribe to a number of third-party calendars in my own Google Calendar, one of which being my Facebook events. However, there are a couple of issues to work around to get everything working perfectly.

If a friend has marked an event as "private", Google Calendar only shows free/busy information because the iCal event has `CLASS:PRIVATE`.

A number of helpful scripts exists to solve this, simply by changing the `CLASS` field to `PUBLIC`. [Make Tech Easier](http://maketecheasier.com/export-facebook-events-to-google-calendar/2011/07/29) points to [Event Busy Fix](http://eventbusyfix.info/), but unfortunately this doesn't work in Google Apps. My solution came from [an answer on WebApps.SE](http://webapps.stackexchange.com/a/10219/21553), which suggested [iCal Stripper](http://icalstripper.appspot.com/). Here's how to do it:

Open up your [Facebook Events page](http://www.facebook.com/events/).

Click on the dropdown and select "Export Events":

<img class="alignnone size-full wp-image-567" title="events-dropdown" src="http://cmbuckley.co.uk/files/2012/06/events-dropdown.png" alt="" width="511" height="237" srcset="https://cmbuckley.co.uk/files/2012/06/events-dropdown.png 511w, https://cmbuckley.co.uk/files/2012/06/events-dropdown-195x90.png 195w" sizes="(max-width: 511px) 100vw, 511px" />

<img class="alignnone size-full wp-image-568" title="events-export" src="http://cmbuckley.co.uk/files/2012/06/events-export.png" alt="" width="540" height="311" srcset="https://cmbuckley.co.uk/files/2012/06/events-export.png 540w, https://cmbuckley.co.uk/files/2012/06/events-export-195x112.png 195w" sizes="(max-width: 540px) 100vw, 540px" />

Copy the link and take it over to [iCal Stripper](http://icalstripper.appspot.com/).

Grab the stripped iCal URL and add it in Google Calendar:

<img class="alignnone size-full wp-image-569" title="add-google-calendar" src="http://cmbuckley.co.uk/files/2012/06/add-google-calendar.png" alt="" width="547" height="299" srcset="https://cmbuckley.co.uk/files/2012/06/add-google-calendar.png 547w, https://cmbuckley.co.uk/files/2012/06/add-google-calendar-195x106.png 195w" sizes="(max-width: 547px) 100vw, 547px" />

And you're done!

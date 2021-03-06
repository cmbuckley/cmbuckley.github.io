---
title: Samba and Vista
layout: post
categories:
  - Computing
---
Vista's lock-down strikes again...

In short, we have [Samba](https://www.samba.org) v2.2.7a running here, and a new machine was just added running Vista, for some reason. It wouldn't connect to our Samba shares, where my XP box had managed absolutely fine. The culprit? Vista's security policies. Finally we found [the fix](https://www.techrepublic.com/article/get-vista-and-samba-to-work/) ({% include archive.html url="http://www.builderau.com.au/blogs/codemonkeybusiness/viewblogpost.htm?p=339270746" text="archive" %}):

  1. Open the Run command and type `secpol.msc`. Finding the [Run command](https://www.computerperformance.co.uk/vista/run-command-2/) in Vista is fun in itself; we just used Win + R.
  2. In the security policies dialogue, navigate to `Local Policies/Security Options`.
  3. Open the policy "Network Security: LAN Manager authentication level".
  4. Change the option to "LM and NTLM --- use NTLMv2 session security if negotiated". Pre-3.0 Samba doesn't support NTLMv2, hence the change from the default refusal.

Then, cry because you've "updated" to your shiny new operating system and you now have to search Google for "getting X to work in Vista" every time you want to install an application...

---
title: Contact Me
description: Contact Chris Buckley via email or social media. Includes PGP keys for private messages.
layout: page
---

<div id="contact">
  <div class="contact__content">
    <dl class="vcard">
    <dt>Name:</dt>
    <dd class="fn n"><span class="given-name">Christopher</span> <span class="additional-name">Mark</span> <span class="family-name">Buckley</span></dd>

    <dt>Home page:</dt>
    <dd class="url">{{ site.url }}</dd>

    <dt>Email address / Google Talk:</dt>
    <dd class="email">{% include social.html id='email' %}</dd>

    <dt>PGP key:</dt>
    {%- capture pgp -%}
    {%- include social.html id='pgp' -%}
    {%- endcapture -%}
    <dd><a class="key" href="https://keybase.io/{% include social.html id='keybase' %}/pgp_keys.asc">{{ pgp | replace: ' ', '&nbsp;' }}</a></dd>
    </dl>
  </div>
  <form name="Contact Form" class="contact__form xhr" method="post"
    {%- if site.formurl == 'netlify' %} data-netlify="true"
    {%- else %} action="{{ site.formurl }}{{ page.url }}"
    {%- endif %} data-message-success="Thanks! Your message was sent." data-message-error="Sorry, your message could not be sent.">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required autocomplete="name" autocapitalize="words" class="full-width"><br>

    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required autocomplete="email" class="full-width"><br>

    <label for="message">Message</label>
    <textarea name="message" id="message" required cols="30" rows="10" class="full-width"></textarea><br>

    <button type="submit" class="button">Send</button>
  </form>
</div>

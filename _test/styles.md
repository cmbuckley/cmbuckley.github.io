---
title: Test
last_modified_at: 2026-02-17 15:14 +0000
---

# Heading One
## Heading Two
### Heading Three
#### Heading Four
##### Heading Five
###### Heading Six

## Inline Elements

Some metadata
{:.meta}

This is some text with **bold**, *italic* and ***bold italic*** text[^1]. It also has a [link](https://cmbuckley.co.uk).

There is also <ins>inserted text</ins> and <del>deleted text</del>. Search results get a <mark>highlight</mark> as well, and <abbr title="abbreviations">abbrs</abbr> are clear.

## Blockquote

> This is a blockquote

## Lists

### Ordered List

1. This
2. is a
3. numbered
    list
5. containing
    - an
    - unordered
    - list
6. and
7. continuing

### Unordered List

- Unordered
- list
    - with
    - sub-list
- and
- more

## Horizontal Rule

Foo

---

Bar

## Table

Some text

| Table Heading | Center align    | Right align     | Table Heading |
| :------------ | :-------------: | --------------: | :------------ |
| Item 1        | Item 3          | Item 4          | Item 5        |
| Item 1        | Item 3          | Item 4          | Item 5        |
| Item 1        | Item 3          | Item 4          | Item 5        |
| Item 1        | Item 3          | Item 4          | Item 5        |
| Item 1        | Item 3          | Item 4          | Item 5        |

Some more text

## Code

### Inline code

Some normal text with some `inline code` in it, plus <kbd>keyboard input</kbd> and <samp>sample output</samp>.

You can copy text with <kbd><kbd>Ctrl</kbd>+<kbd>C</kbd></kbd>, or by clicking <kbd><samp>Edit</samp> > <samp>Copy</samp></kbd>.

### Block Code

Text

```ruby
require 'twitter_ebooks'

class MyBot < Ebooks::Bot
  # Configuration here applies to all MyBots
  def configure

    self.consumer_key = ENV['TWITTER_CONSUMER_KEY']
    self.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']

  end

  def on_startup
    model = Ebooks::Model.load("model/text.model")
    scheduler.cron '0 6,18,22 * * * America/New_York' do
      tweet(model.make_statement(140))
    end
  end
end

# Make a MyBot and attach it to an account
MyBot.new("mage__ebooks") do |bot|
  bot.access_token = ENV['TWITTER_ACCESS_TOKEN']
  bot.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
end
```

More text

## Messages

This is OK. [Link](#)
{:.ok}

This is info. [Link](#)
{:.info}

This is a warning. [Link](#)
{:.warning}

This is an error. [Link](#)
{:.error}

## Forms

<form>
  <label for="testinput">Text input</label>
  <input id="testinput" type="text" /><br />

  <label for="testta">Textarea</label>
  <textarea id="testta"></textarea><br />
</form>

Primary
{:.button}

Secondary
{:.button--secondary}

Tertiary
{:.button--tertiary}

Outline
{:.button--outline}

[^1]: This is a [footnote](https://en.wikipedia.org/wiki/Note_(typography)). It also has **bold**, *italic*, ***bold italic*** and `code` in it.

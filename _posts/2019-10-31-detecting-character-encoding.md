---
title: Detecting Character Encoding
categories:
  - Computing
---

I occasionally find myself having to determine the character encoding of a file, either for foreign-language content or other data files that don't identify their encoding.

In general, [it's not always possible to determine the encoding](https://medium.com/better-programming/character-encodings-the-pain-that-wont-go-away-part-1-2-non-unicode-dee7650fb6bf), but languages are not random text, so it's often quite easy to determine the language based on character sequences, and from there it's relatively easy to determine the character encoding by knowing which languages tend to use which encodings. Most character encoding detectors (such as [chardet](https://chardet.readthedocs.io/en/latest/index.html)) work in this way.

As an example, I often download Polish subtitles for films, and I might see a line like this:

> Napisy zosta³y specjalnie dopasowane do Twojej wersji filmu.
{:lang="pl"}

Here, I can see that the ł has been interpreted in UTF-8 as ³. If I didn't know it was an ł, Google Translate (or Search) can often give a suggestion. For Polish-language text, I'm looking for words I recognise containing ł, ś or ć as those will help me quickly identify the encoding.

Now that I have identified a non-ASCII character, I can look at the byte representation:

> Napisy zosta`<b3>`y specjalnie dopasowane do Twojej wersji filmu.
{:lang="pl"}

Now I know that ł is encoded as `b3` in this file. Looking at the [encodings of ł in different character sets](http://www.fileformat.info/info/unicode/char/0142/charset_support.htm), I can see that ISO-8859-2 encodes ł in this way. So running the file through `iconv -f ISO-8859-2 -t UTF-8` should give me what I want:

> Napisy zostały specjalnie dopasowane do Twojej wersji filmu.
{:lang="pl"}

I have to say I don't really follow this manual process that often any more, since Polish text is almost always in ISO-8859-2 due to its support for Slavic languages. I'll often just try this conversion first as a default, or Windows-1252 comes up quite a lot for data files, or I'll run the file through a [very basic detection and conversion script](https://github.com/cmbuckley/toutf8) that uses Google's [Compact Encoding Detection](https://github.com/google/compact_enc_det). However, it's quite rewarding to watch the mojibake transform into the original text after a bit of digging!

Further essential reading for programmers: [What Every Programmer Absolutely, Positively Needs To Know About Encodings And Character Sets To Work With Text](http://kunststube.net/encoding/)

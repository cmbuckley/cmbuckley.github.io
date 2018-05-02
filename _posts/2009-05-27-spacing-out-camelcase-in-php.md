---
title: Spacing out CamelCase in PHP
layout: post
categories:
  - Computing
---
Here’s a nifty function to put spaces in your CamelCased words:

```php
function spacify($camel, $glue = ' ') {
    return $camel[0] . substr(implode($glue, array_map('implode', array_chunk(preg_split('/([A-Z])/',
        ucfirst($camel), -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE), 2))), 1);
}

echo spacify('CamelCaseWords'); // 'Camel Case Words'
```

I added in the `$glue` parameter to be even more nifty, but a bit of thinking made it clear that it wouldn’t work when the first letter was lower-case. Should be fine now!

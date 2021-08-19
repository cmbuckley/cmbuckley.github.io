---
title: Mootools Hash.setFromPath
layout: post
categories:
  - Computing
last_modified_at: 2021-08-19 22:47 +01:00
---
[MooTools More](https://mootools.net/more) implements a [`getFromPath` method in `Hash.Extras`](https://mootools.net/more/docs/1.2.5.1/Native/Hash.Extras#Hash:getFromPath), but doesn't provide a corresponding setter. Here's an implementation:

```js
Hash.implement({
    setFromPath: function(path, value) {
        var source = this;
        var prop = '';

        path.replace(/[([^]]+)]|.([^.[]+)|[^[.]+/g, function(match) {
            if (!source) return;
            prop = arguments[2] || arguments[1] || arguments[0];

            if (!(prop in source)) source[prop] = {};
            lastSource = source;
            source = source[prop];
            return match;
        });

        lastSource[prop] = value;
        return this;
    }
});
```

Just to explain the `lastSource` part, it's a fudge to maintain object references throughout.

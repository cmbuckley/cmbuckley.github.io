---
layout: post
title: Shorter Git Remotes
description: Use shorter URLs for Git remotes using your SSH config file.
date: 2020-06-11 16:05 +0100
categories:
  - Computing
---

When using Bitbucket, you can end up with quite unwieldy Git URLs:

```bash
git clone ssh://git@bitbucket.example.com:7999/project/repo.git
```

To save copying the URL from the UI any time you clone a new repository, add the following to your `~/.ssh/config`:

```ssh
Host bb
    User git
    Hostname bitbucket.example.com
    Port 7999
```

If you're using a separate `IdentityFile`, you can add this here as well.

This means clone commands can be much cleaner:

```bash
git clone bb:project/repo
```

The same is true for GitHub URLs:

```ssh
Host gh
    User git
    Hostname github.com
```

And the clone command is the same:

```
git clone gh:username/repository
```

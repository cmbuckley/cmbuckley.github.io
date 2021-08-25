---
title: Using Ant and Phing in the same repository
layout: post
categories:
  - Computing
last_modified_at: 2021-08-25 12:11 +01:00
---
Here's the scenario: you use Apache Ant for some of your build process, but you also have some tools in Phing. You run both `ant` and `phing` from your repository root. Because you use Ant most, the Ant targets are in `build.xml`, and Phing has to use `phing.xml`. Sure, you can run `phing -f phing.xml ...`, but where's the fun in that? Enter the following build file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project name="myproject" default="usage">
    <condition property="file" value="phing.xml">
        <isset property="phing.version" />
    </condition>
    <condition property="file" value="ant.xml">
        <isset property="ant.version" />
    </condition>
    <import file="${file}" />
</project>
```

Now you can have Ant targets in `ant.xml`, and Phing targets in `phing.xml`! No doubt there are some repercussions with this approach --- I've no idea how well `antcall`/`phingcall` tasks will fare using this --- but it worked for us!

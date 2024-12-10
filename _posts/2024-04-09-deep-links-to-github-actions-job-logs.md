---
title: Deep Links to GitHub Actions Job Logs
description: >
  How to link directly to the logs for a specific GitHub Actions
  workflow job, and even expand the logs for a chosen step.
date: 2024-04-09 18:37 +0100
categories:
  - Computing
last_modified_at: 2024-12-10 22:48 +00:00
---

In GitHub Actions, you can rather easily create a link to the current workflow run:

{% raw %}
```bash
${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```
{% endraw %}

However, it's not as easy to link to a specific job within that workflow run.
The variable {% raw %}`${{`&nbsp;`github.job`&nbsp;`}}`{% endraw %} says it contains a job ID,
but in this case it means the key from your workflow:

{% raw %}
```yaml
jobs:
  run_tests:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - run: echo ${{ github.job }} # outputs 'run_tests'
```
{% endraw %}

To link to the job logs, you can use the [GitHub CLI](https://cli.github.com)
which is available on all GitHub-hosted runners:

{% raw %}
```yaml
jobs:
  run_tests:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - env:
          GH_TOKEN: ${{ github.token }}
        run: |
          gh run view ${{ github.run_id }} --json jobs --jq '
            .jobs[] | select(.name == "Run Tests") | .url'
```
{% endraw %}

You need to provide the `GH_TOKEN` environment variable for the CLI tool. If
you've modified the default token permissions, you need at least read access
to actions:

```yaml
permissions:
  actions: read
```

The CLI tool determines the repo from the current working directory. If you haven't
performed an `actions/checkout` step, or you are referencing a different repo,
pass the relevant flag to the CLI tool:

{% raw %}
```bash
gh -R ${{ github.repository }} run view ...
```
{% endraw %}

The JQ filter selects the job by name. If you don't want to hardcode the job
name, you need a further API call:

{% raw %}
```bash
JOB_NAME=$(gh workflow view '${{ github.workflow }}' -r ${{ github.ref}} -y |
  yq eval .jobs.${{ github.job }}.name -)

gh run view ${{ github.run_id }} --json jobs --jq "
  .jobs[] | select(.name == \"$JOB_NAME\") | .url"
```
{% endraw %}

## Linking back to Pull Requests

This URL can be useful when posting comments in a Pull Request. By default it
doesn't link to the PR, but you can add the `?pr` query string parameter to add
a backlink:

{% raw %}
```bash
gh run view ${{ github.run_id }} --json jobs --jq '
  .jobs[] | select(.name == "Run Tests") | (.url + "?pr=${{ github.event.number }}")'
```
{% endraw %}

{% include figure.html img="/files/2024/04/run-url-pr.png" alt="Section of the job page showing the job title and a 'back to pull request' link" %}

## Expanding the logs for a specific step

Within the job there are a number of ordered steps. To expand the logs for a
specific step, add a fragment like `#step:x:y`, corresponding to the step
number and line number. The step number is based on the order, so you can use
the API for that too:

{% raw %}
```yaml
jobs:
  run_tests:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - name: Run Test Script
        run: make test

      - name: Get URL
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          gh run view ${{ github.run_id }} --json jobs --jq '
            .jobs[] | select(.name == "Run Tests")
            | (.url + (.steps[] | select(.name == "Run Test Script")
              | "#step:\(.number):1"))'
```
{% endraw %}

If you run this example, you might find that the URL step happens so quickly
after the test step that the API response doesn't contain the previous step's
result yet. You can either perform the API call a little later in the job, in
a separate dependent job, or add a small `sleep` before calling the API.

_Inspired by [Grant G's answer on Stack Overflow](https://stackoverflow.com/a/76681922/283078).
Expanding the logs for a step used to require the `check_suite_focus` query
string param, but this lo longer seems to be needed._

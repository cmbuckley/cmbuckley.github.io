#!/bin/bash

paths=(
    assets
    _includes/icons
    _sass
)

changed=$(git diff --cached --name-only --diff-filter=ACM ${paths[@]} | wc -l)

if [ $changed -gt 0 ]; then
    ./_ci/fingerprints.sh
fi

git diff -z --cached --name-only --diff-filter=M _posts | ./_ci/last-modified.sh

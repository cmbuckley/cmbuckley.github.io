#!/bin/bash

paths=(
    assets
    _includes
    _sass
)

changed=$(git diff --cached --name-only --diff-filter=ACM ${paths[@]} | wc -l)

if [ $changed -gt 0 ]; then
    ./_ci/fingerprints.sh
fi

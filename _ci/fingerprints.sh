#!/bin/bash

fingerprints=_data/fingerprints.yml

files=(
    "icons:assets/img/icons/icons.svg"
    "scripts:assets/js/scripts.js"
    "search:assets/js/search.js"
    "style:assets/css/style.css"
)

bundle exec jekyll build

for data in "${files[@]}"; do
    id=${data%%:*}
    file=${data##*:}

    sed -i'' "/$id:/d" $fingerprints
    echo "$id: $(md5sum "_site/$file" | cut -c1-8)" >> $fingerprints
done

sed -i'' "s/fingerprints = '[^']*'/fingerprints = '$(grep -vF . $fingerprints | tr '\n' ',' | sed 's/,$//')'/" _includes/v.html

git add $fingerprints _includes/v.html

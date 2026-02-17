#!/bin/bash

awkcmd='
$0 ~ "---" && ++count == 2 {
    print "last_modified_at:", date
}

!/^last_modified_at:/{print}
'

date="$(date +'%Y-%m-%d %H:%M %z')"
awk 2>&1 | grep -q includefile && inplace=1 || inplace=0

patchdate () {
    if [ $inplace -eq 1 ]; then
        awk -i inplace -v date="$date" "$awkcmd" "$1"
    else
        tmp=$(mktemp)
        awk -v date="$date" "$awkcmd" "$1" > "$tmp"
        mv "$tmp" "$1"
    fi
}

while read -d $'\0' file; do
    # move file out and get rid of unstaged changes
    tmp=$(mktemp)
    cp "$file" "$tmp"
    git restore "$file"

    # patch and add the file
    patchdate "$file"
    git add "$file"

    # restore the unstaged changes and reapply the patch
    mv "$tmp" "$file"
    patchdate "$file"
done

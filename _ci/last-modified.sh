#!/bin/bash

awkcmd='
$0 ~ "---" && ++count == 2 {
    print "last_modified_at:", date
}

!/^last_modified_at:/{print}
'

date="$(date +'%Y-%m-%d %H:%M %:z')"
awk 2>&1 | grep -q includefile && inplace=1 || inplace=0

while read -d $'\0' file; do
    if [ $inplace -eq 1 ]; then
        awk -i inplace -v date="$date" "$awkcmd" "$file"
    else
        tmp=$(mktemp)
        awk -v date="$date" "$awkcmd" "$file" > "$tmp"
        mv "$tmp" "$file"
    fi
    git add "$file" # @todo avoid committing any other changes
done

#!/bin/bash

awkcmd='
$0 ~ "---" && ++count == 2 {
    print "last_modified_at:", date
}

!/^last_modified_at:/{print}
'

while read -d $'\0' file; do
    awk -i inplace -v date="$(date +'%Y-%m-%d %H:%M %:z')" "$awkcmd" "$file"
done

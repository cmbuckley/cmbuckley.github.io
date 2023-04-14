#!/bin/bash

vcf=assets/chris-buckley.vcf
awkcmd='
$0 ~ "^PHOTO" {
    print "PHOTO;ENCODING=b;TYPE=JPEG:", photo
}

!/^PHOTO/{print}
'

photo="$(base64 < assets/img/headshot-300w.jpg | tr -d '\n')"
awk 2>&1 | grep -q includefile && inplace=1 || inplace=0

if [ $inplace -eq 1 ]; then
    awk -i inplace -v photo="$photo" "$awkcmd" "$vcf"
else
    tmp=$(mktemp)
    awk -v photo="$photo" "$awkcmd" "$vcf" > "$tmp"
    mv "$tmp" "$vcf"
fi

git add "$vcf"

#!/bin/sh
spiders="apparatuur attractieparken heelal landen steden sterrenbeelden"
rm -f allitems.json
for spider in $spiders ; do
    scrapy crawl $spider -o allitems.json -t json
done

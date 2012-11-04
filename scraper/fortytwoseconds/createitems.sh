#!/bin/sh
spiders="actors apparatuur attractieparken heelal landen movies sporten steden sterrenbeelden televisie"
rm -f items.json
for spider in $spiders ; do
    scrapy crawl $spider -o items.json -t json
done
sed -i "s/\]\[/,/g" items.json

echo 'testdata = ' > items.txt
cat items.json >> items.txt
echo ';

for (i in testdata){
    answers.insert({
        answer: testdata[i]["answer"],
        link: testdata[i]["link"],
        language: testdata[i]["language"],
        category: testdata[i]["category"],
        answered_correctly: 0,
        played: 0
    });
}' >> items.txt

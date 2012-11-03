from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from fortytwoseconds.items import FortyTwoSecondsItem

class WikiAttractieparkenSpider(BaseSpider):
    name = "attractieparken"
    allowed_domains = ["nl.wikipedia.org"]
    start_urls = ["http://nl.wikipedia.org/wiki/Lijst_van_attractieparken_in_Nederland",]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        answers = hxs.select('//tr/td[1]')
        language = hxs.select('/html/@lang').extract()
        items = []
        for answer in answers:
            item = FortyTwoSecondsItem()
            item['answer'] = answer.select('a/text()').extract()[0]
            item['link'] = answer.select('a/@href').extract()[0]
            item['language'] = language[0]
            item['category'] = 'Attractieparken'
            items.append(item)
        return items

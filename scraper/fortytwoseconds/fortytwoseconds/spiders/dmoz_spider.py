from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from fortytwoseconds.items import FortyTwoSecondsItem

class WikiSpider(BaseSpider):
    name = "wiki"
    allowed_domains = ["nl.wikipedia.org"]
    start_urls = []

    def parse(self, response):
        pass

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from fortytwoseconds.items import FortyTwoSecondsItem

imdb_domain = 'http://www.imdb.com'


def create_items(response, xpath, category):
    '''
    Helper function for the spiders below to create scrapy items.
    '''
    hxs = HtmlXPathSelector(response)
    language = "nl"
    answers = hxs.select(xpath)
    items = []
    for answer in answers:
        link = answer.select('@href').extract()[0]
        if link.startswith('/'):
            link = imdb_domain + link
        item = FortyTwoSecondsItem()
        item['answer'] = answer.select('text()').extract()[0]
        item['link'] = link
        item['language'] = language
        item['category'] = category
        items.append(item)
    return items


class ActorSpider(BaseSpider):
    name = 'actors'
    allowed_domains = [imdb_domain,]
    start_urls = ['http://www.imdb.com/features/yearinreview/2010/starmeter_full',]

    def parse(self, response):
        xpath = '//table/tr/td//a[2]'
        return create_items(response, xpath, 'Acteurs')


class MovieSpider(BaseSpider):
    name = 'movies'
    allowed_domains = [imdb_domain]
    start_urls = ['http://www.imdb.com/chart/top',]

    def parse(self, response):
        xpath = '//table/tr/td/font/a'
        hxs = HtmlXPathSelector(response)
        language = "nl"
        answers = hxs.select(xpath)
        items = []
        for answer in answers:
            year = answer.select('../text()').extract()[0].strip()
            year = int(year[1:5])
            if year < 1990:
                continue
            link = answer.select('@href').extract()[0]
            if link.startswith('/'):
                link = imdb_domain + link
            item = FortyTwoSecondsItem()
            item['answer'] = "%s (%d)" % (answer.select('text()').extract()[0], year)
            item['link'] = link
            item['language'] = language
            item['category'] = 'Films'
            items.append(item)
        return items


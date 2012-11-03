from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from fortytwoseconds.items import FortyTwoSecondsItem

nl_domain = 'http://nl.wikipedia.org'


def create_items(answers, language, category):
    '''
    Helper function for the spiders below to create scrapy items.
    '''
    items = []
    for answer in answers:
        link = answer.select('@href').extract()[0]
        if link.startswith('/'):
            link = nl_domain + link
        item = FortyTwoSecondsItem()
        item['answer'] = answer.select('text()').extract()[0]
        item['link'] = link
        item['language'] = language
        item['category'] = category
        items.append(item)
    return items


class WikiApparatuurSpider(BaseSpider):
    name = 'apparatuur'
    allowed_domains = [nl_domain,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_huishoudelijke_apparatuur',]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select('//html/body/div[3]/div[3]/div[4]/ul/li/a')
        return create_items(answers, language, 'Apparatuur')


class WikiAttractieparkenSpider(BaseSpider):
    name = 'attractieparken'
    allowed_domains = [nl_domain,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_attractieparken_in_Nederland',]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select('//tr/td[1]/a')
        return create_items(answers, language, 'Attractieparken')


class WikiLandenSpider(BaseSpider):
    name = 'landen'
    allowed_domains = ['nl.wikipedia.org',]
    allowed_domains = [nl_domain,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_Europese_landen',]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select('//tr/td/a[2]')
        return create_items(answers, language, 'Landen')


class WikiStedenSpider(BaseSpider):
    name = 'steden'
    allowed_domains = [nl_domain,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_grote_Nederlandse_steden',]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select('//tr/td[2]/span/a[2]')
        return create_items(answers, language, 'Steden')


class WikiSterrenbeeldenSpider(BaseSpider):
    name = 'sterrenbeelden'
    allowed_domains = [nl_domain,]
    start_urls = ['http://nl.wikipedia.org/wiki/Dierenriem',]

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select('//td[3]/a')
        return create_items(answers, language, 'Sterrenbeelden')

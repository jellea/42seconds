from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from fortytwoseconds.items import FortyTwoSecondsItem

WIKI_NL_DOMAIN = 'http://nl.wikipedia.org'


def create_items(response, xpath, category):
    '''
    Helper function for the spiders below to create scrapy items.
    '''
    hxs = HtmlXPathSelector(response)
    language = hxs.select('/html/@lang').extract()[0]
    answers = hxs.select(xpath)
    items = []
    for answer in answers:
        link = answer.select('@href').extract()[0]
        if link.endswith('redlink=1'):
            continue
        if link.startswith('/'):
            link = WIKI_NL_DOMAIN + link
        item = FortyTwoSecondsItem()
        item['answer'] = answer.select('text()').extract()[0]
        item['link'] = link
        item['language'] = language
        item['category'] = category
        items.append(item)
    return items


class WikiApparatuurSpider(BaseSpider):
    name = 'apparatuur'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_huishoudelijke_apparatuur',]

    def parse(self, response):
        xpath = '//html/body/div[3]/div[3]/div[4]/ul/li/a'
        return create_items(response, xpath, 'Apparatuur')


class WikiAttractieparkenSpider(BaseSpider):
    name = 'attractieparken'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_attractieparken_in_Nederland',]

    def parse(self, response):
        xpath = '//tr/td[1]/a'
        return create_items(response, xpath, 'Attractieparken')


class WikiHeelalSpider(BaseSpider):
    name = 'heelal'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Zonnestelsel',]

    def parse(self, response):
        xpath = '//tr[2]/td/a'
        return create_items(response, xpath, 'Heelal')


class WikiLandenSpider(BaseSpider):
    name = 'landen'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_Europese_landen',]

    def parse(self, response):
        xpath ='//tr/td/a[2]'
        return create_items(response, xpath, 'Landen')


class WikiSportenSpider(BaseSpider):
    name = 'sporten'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_sporten',]

    def parse(self, response):
        xpath = '//dd/a'
        return create_items(response, xpath, 'Sporten')


class WikiStedenSpider(BaseSpider):
    name = 'steden'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_grote_Nederlandse_steden',]

    def parse(self, response):
        xpath = '//tr/td[2]/span/a[2]'
        return create_items(response, xpath, 'Steden')


class WikiSterrenbeeldenSpider(BaseSpider):
    name = 'sterrenbeelden'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Dierenriem',]

    def parse(self, response):
        xpath = '//td[3]/a'
        return create_items(response, xpath, 'Sterrenbeelden')


class WikiTelevisieSpider(BaseSpider):
    name = 'televisie'
    allowed_domains = [WIKI_NL_DOMAIN,]
    start_urls = ['http://nl.wikipedia.org/wiki/Lijst_van_televisieprogramma%27s_naar_genre',]

    def parse(self, response):
        xpath = '//div[@id="mw-content-text"]/ul/li/a'
        hxs = HtmlXPathSelector(response)
        language = hxs.select('/html/@lang').extract()[0]
        answers = hxs.select(xpath)
        items = []
        for answer in answers:
            link = answer.select('@href').extract()[0]
            if link.endswith('redlink=1'):
                continue
            answer_ = answer.select('text()').extract()[0]
            # exclude a few links
            if answer_.find(':') != -1 or answer_.isdigit():
                continue
            if link.startswith('/'):
                link = WIKI_NL_DOMAIN + link
            item = FortyTwoSecondsItem()
            item['answer'] = answer_
            item['link'] = link
            item['language'] = language
            item['category'] = 'Televisie'
            items.append(item)
        return items[:-1] # exclude the last link

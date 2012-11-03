from scrapy.item import Item, Field

class FortyTwoSecondsItem(Item):
    answer = Field()
    link = Field()
    language = Field()
    category = Field()

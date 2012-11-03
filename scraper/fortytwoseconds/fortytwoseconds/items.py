from scrapy.item import Item, Field

class FortytwosecondsItem(Item):
    answer = Field()
    link = Field()
    language = Field()
    category = Field()

class DmozItem(Item):
    title = Field()
    link = Field()
    desc = Field()

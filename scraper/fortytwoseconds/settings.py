# Scrapy settings for fortytwoseconds project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/topics/settings.html
#

BOT_NAME = 'fortytwoseconds'

SPIDER_MODULES = ['fortytwoseconds.spiders']
NEWSPIDER_MODULE = 'fortytwoseconds.spiders'

ITEM_PIPELINES = [
    'fortytwoseconds.pipelines.DuplicatesPipeline',
    ]

#Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = 'Deep thougth\'s answering machine (+http://www.fortytwoapp.com)'

from configparser import ConfigParser


config = ConfigParser(interpolation=None)
config.read('../script_settings.cfg')

# Number of companies to scrape
num_companies = config['COMPANY']['num_companies']

# PDF settings
download_pdfs = config['PDF']['download_pdfs']
extract_text = config['PDF']['extract_text']

# Crawler settings
crawl_press_release = config['CRAWLER']['crawl_press_release']
crawl_annual_and_sustainability = config['CRAWLER']['crawl_annual_and_sustainability']

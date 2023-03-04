from configparser import ConfigParser

config = ConfigParser(interpolation=None)
config.read('../script_settings.cfg')

file_save_format = str(config['MAIL']['file_save_format']) #xlsx or csv
timeframe = int(config['MAIL']['timeframe']) #number of weeks

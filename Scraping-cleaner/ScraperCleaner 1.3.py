import pandas as pd
import openpyxl
import nltk
import csv
import pandas as pd
import numpy as np
import os, glob
import spacy
from spacy.matcher import Matcher
from nltk.stem.porter import *
from nltk.tokenize import sent_tokenize
from textblob import TextBlob
from re import search
import openpyxl
from datetime import date
import logging


#1 Import file from scraper and save into readable format:
#Define path to which csv file is to be saved
#Scraperoutputs-update used for monthly update of gmail scraper
#Scraperoutputs used for multiple scraper updates
path = r"cleaner-output"
list_of_files = glob.glob('../Scraper-Gmail/email-output/*.csv')
latest_file = max(list_of_files, key=os.path.getctime)
logging.info(latest_file)
#csv_file = os.path.basename(latest_file)
# 1. PDF reports - save under the NLP/NLP folder
#Activate df0 functions below if are adding annual report scrapers
df0 = pd.read_csv('../Scraper-PDF/outputs/master_workbook.csv')
#Save into readable csv format
df0.to_csv(os.path.join(path,r'scraper_pdfreportsresultsraw.csv'))

# 2. Gmail press releases - save under NLP/NLP folder
# Rename file to latest gmail results file, i.e. change start / end date
df1 = pd.read_csv(latest_file)
dfclean = df1[(df1['company'] != 'Not found')]
#Save into readable csv format
#df1.to_csv(path=r'C:\Users\ASUS\PycharmProjects\esgspider\NLP\NLP\Scraperoutputs\TESTING.csv', index=False)
dfclean.to_csv(os.path.join(path,r'scraper_pressreleasesresultsraw.csv'))


#Merge multiple csv files using os and globe. See for more info: https://blog.softhints.com/how-to-merge-multiple-csv-files-with-python/

all_files = glob.glob(os.path.join(path, "*.csv"))
df_from_each_file = (pd.read_csv(f, sep=',') for f in all_files)
df_merged = pd.concat(df_from_each_file, ignore_index=True)
df_merged.to_csv("cleaner-output/consolidated sources clean.csv")

df = pd.read_csv("cleaner-output/consolidated sources clean.csv")

def searchyears(s):
    # Regex search for "20.." that follows "by", "to", "before" or "in"
    #    outputyearcompile = re.compile('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+')
    outputyearscompile = re.findall('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+|in\s\\b20\d+', str(s))
    # Extract only the numbers (i.e. years)
    outputyearscompile2 = re.findall('\d+', str(outputyearscompile))
    # Convert to list of numbers
    outputyearscompile3 = list(map(int, outputyearscompile2))
    # Extract only future years, and order by year
    outputyearscompile4 = sorted(i for i in outputyearscompile3 if i > 2022)
    # Remove brackets so that non-targetyear sentences get an empty column (and can be filtered out for the next step)
#    outputyearscompile5 = ','.join( str(a) for a in outputyearscompile4)
    if search('20', str(outputyearscompile4)):
        return outputyearscompile4
#    else:
#        return 'none'

df['ArticleTargetYear'] = df['full_text'].apply(searchyears)

df2 = df[df.ArticleTargetYear.notnull()]

logging.info(df2.head(n=3))

#to test saving
#Reference csv file used for next step (CompanyProcessing)
df2.to_csv(f'cleaner-output/sources withtargetyears-{date.today().strftime("%B")}.csv', encoding="utf-8-sig", index=False)

#df3['ArticleTargetYear'] = df3['full_text'].apply(searchyears)
#df4 = df3[df1.ArticleTargetYear.notnull()]
#logging.info(df4.head(n=3))
#to test saving
#Reference csv file used for next step (CompanyProcessing)
#df4.to_csv('pressreleases withtargetyears.csv', encoding="utf-8-sig", index=False)

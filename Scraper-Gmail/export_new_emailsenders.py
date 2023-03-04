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
#from datetime import datetime
import datetime

#Formats
time_format = '%d %b %Y'


# Update name for latest csv file (eg. start to end date adjust)
df = pd.read_csv("Email Scraping Results 25 Feb 2022 to 02 Apr 2022.csv")

#Keep only the company name and e-mail sender column (Only ones were interested in for this purpose)

df = df[['company', 'Email Sender']]

dfnewnames = df[(df['company'] == 'Not found')]

print(dfnewnames.head(n=3))

# Drop duplicate e-mail senders

dfnewnamesunique = dfnewnames.drop_duplicates(subset='Email Sender', keep='first')

# Export, adding timestamp

def get_now_time():
    return datetime.datetime.now().strftime('%d%m%y %H%M%S')

dfnewnamesunique.to_csv('newemailsenders{}.csv'.format(get_now_time()), encoding="utf-8-sig", index=False)





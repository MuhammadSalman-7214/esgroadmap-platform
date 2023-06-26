import nltk
import csv
import pandas as pd
import numpy as np
import spacy
from spacy.matcher import Matcher
from nltk.stem.porter import *
from nltk.tokenize import sent_tokenize
#from spacy import displacy
#import visualise_spacy_tree
#from IPython.display import Image, display
from textblob import TextBlob
from re import search
import openpyxl
import pymysql
from sqlalchemy import create_engine
from datetime import date
import logging

# Add sectors to file using company name
# DF1 = Company population
# Columns are Company	Ticker(s)	PR Agency	Example 2020 press release URL	Company Main Website URL	Company press release site URL	Country	sector #1	sector #2	sector #3	sector #4	sector #5
logging.info('Start Integrate and Upload')
print('Start Integrate and Upload')

#De-activating merger, as will take place in MySQL (through view)
#df = pd.read_excel('integrate-input/ESGC Company data 2.4.xls')

# DF2 = Sentence data
df3 = pd.read_csv(f'../NLP/nlp-output/targetsentences clean {date.today().strftime("%B")}.csv', engine = 'python')

#De-activating merger, as will take place in MySQL (through view)
# Merge operation. Left join operation provides all the rows from 1st dataframe and matching rows from the 2nd dataframe.
# See for more info https://www.geeksforgeeks.org/how-to-do-a-vlookup-in-python-using-pandas/
# See also https://datacarpentry.org/python-ecology-lesson/05-merging-data/
# Ensure "company" (matching column) in same case in both - eg. currently in lower case

#Left_join = pd.merge(df1,
#                     df2,
#                     on ='company',
#                     how ='right')
#df3 = Left_join

#Left_join

#logging.info(Left_join.head(n=3))
#print(Left_join.head(n=3))

#df3['Primarysource'] = df3.apply(lambda row: row.source in row.companylist, axis=1)




#def check(a,b)
#    if "Mel" in a["Names"].values:
#        logging.info("Yep")

#df.apply(lambda row: row.source in row.companylist, axis=1)

# Rename column headings so work for roadmaps by creating a dictionary
dict = {'company': 'Company',
        'link': 'Source link',
        'PressRelease Date Only': 'Source date',
        'PressReleaseFullSentence': 'Target sentence',
        'SentenceTargetYearclean': 'Targetyear(s)'
        }


# call rename () method
df3.rename(columns=dict,
          inplace=True)

#to check function companylist and primary source, i.e. code starting with A
#Adf['companylist'].fillna('Unknown', inplace=True)

df3['source'].fillna('Unknown', inplace=True)
df3['pr_site'].fillna('Unknown', inplace=True)

#Change csvfile name for relevant month
# date.today().year, date.today().strftime("%B")
df3.to_csv(f'integrate-output/integratedtargetdata-{date.today().strftime("%B")}{date.today().year}.csv', encoding="utf-8-sig", index=False)

dfmaster = pd.read_csv('integrate-input/integratedtargetdata-master.csv')
dfmonth = pd.read_csv(f'integrate-output/integratedtargetdata-{date.today().strftime("%B")}{date.today().year}.csv')

# Check if source is a Primary Source, i.e. from company, one of its aliases or its subsidiaries. First requires values in each source and companylist column
# https://blog.softhints.com/pandas-check-value-column-contained-another-column-same-row/

logging.info("Checking for new entries")

# column '_merge' do not exists



# Read the parent CSV file
parent_df = dfmaster

# Read the child CSV file
child_df = dfmonth

import pandas as pd



# Find the common columns
common_columns = list(set(child_df.columns).intersection(parent_df.columns))

# Convert the columns to compatible data types
for column in common_columns:
    parent_df[column] = parent_df[column].astype(str)
    child_df[column] = child_df[column].astype(str)

# Merge the parent_df with the child_df using pd.concat()
merged_df = pd.concat([parent_df[common_columns], child_df[common_columns]])

# Save the merged DataFrame to a new CSV file
merged_df.to_csv('merged.csv', index=False)






# newmasterdf = pd.concat([dfnewentries,dfmaster])
# newmasterdf.to_csv('integrate-input/integratedtargetdata-master.csv', encoding="utf-8-sig", index=False)

merged_df = pd.read_csv(f'integrate-output/integratedtargetdata-{date.today().strftime("%B")}{date.today().year}.csv')
merged_df = df.drop(columns=['company press release alias'], errors='ignore')
# 2 Save to mysql

# https://stackoverflow.com/questions/16476413/how-to-insert-pandas-dataframe-via-mysqldb-into-database
# => used https://www.opentechguides.com/how-to/article/pandas/195/pandas-to-mysql.html

logging.info('Starting upload MySQL')
print('Starting upload MySQL')

#Mysql details for website
# old
hostname="esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com"
dbname="esgroadmap"
uname="admin"
pwd="hassanarshad1122"
# new
'''hostname="server64.web-hosting.com"
dbname="esgrzlyo_wp275"
uname="esgrzlyo_esgroadmap"
pwd="duurzaamheid12!"'''

engine = create_engine("mysql+pymysql://{user}:{pw}@{host}/{db}"
				.format(host=hostname, db=dbname, user=uname, pw=pwd))

# Current setting is to replace entire targetsentence table with data. Can consider in future to 'append' in the future

logging.info('Starting all sentence upload')
print('Starting all sentence upload')

merged_df.to_sql('sentence-all', engine, index=False, if_exists='append')

# No more thematic tables (eg. with only carbon sentences). These all are now created as views from the main 'sentence-all' MySQL database. This saves disk space
# MySql code example: CREATE view sentencewaterview as SELECT * from `sentence-all` where `sentence-water`=1

logging.info("All done")
print("All done")

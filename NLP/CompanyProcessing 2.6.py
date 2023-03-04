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
from datetime import date
import logging
import re


# Trial file
# To amend
#df = pd.read_csv('210218releases clean.csv')

#Open file that has been cleaned by ScraperCleaner + where only press releases with forward-looking components are included (target year)
df = pd.read_csv(f'../Scraping-cleaner/cleaner-output/sources withtargetyears-{date.today().strftime("%B")}.csv')



# 1 Remove rows with missing data
# Removes articles that have not been "neatly" scraped, as data scattered across various rows. Typically articles with certain types of tables
# https://www.geeksforgeeks.org/drop-rows-from-pandas-dataframe-with-missing-values-or-nan-in-columns/

df = df[['company', 'emails', 'full_text', 'link', 'pr_site', 'release_date', 'source', 'ticker', 'title', 'ArticleTargetYear']]
#df = df[['company', 'emails', 'full_text', 'link', 'pr_site', 'release_date', 'source', 'ticker', 'title', 'ArticleTargetYear']]

#df = df.dropna(how='any', subset=['company', 'full_text', 'link', 'pr_site', 'release_date', 'source', 'ticker', 'title'])


# Remove market research articles (i.e. non-press releases)
# based on the following code: https://www.statology.org/pandas-drop-rows-that-contain-string/
#df = df[df["source"].str.contains("OilPrice.com|Fortune Business Insights|Research and Markets|ReportLinker|Reportlinker|Million Insights|ABI Research|Allied Market Research|Grand View Research, Inc.|MarketsandMarkets|The Business Research Company|Verified Market Research|P&S Intelligence")==False]

#code in case want only items where name under PR agency source exactly matches predefined company name. Too restrictive, i.e. "limited" vs "ltd"
#df = df[df["source"]==df["company"]]


# 3. Clean up press articles

htmltags = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')
linespace = re.compile(r"\n")
df['PressReleaseFullCleanstep1'] = df.full_text.str.replace(htmltags,'', regex=True)
df['PressReleaseFullClean'] = df.PressReleaseFullCleanstep1.str.replace(linespace,' ', regex=True)


# 4. Extract date
# Year
#df['PressReleaseYear']
# Search for year
# Search for month - American style recording in PR agencies, i.e. "2020-02-20". Hence Feb would be "-02-"


# Extract date only
# Should make it to work for Gmail press releases, where format is "Sat, 05 Mar 2022 12:10:46 +0000 (UTC)"
#df['Source Date'] = df['release_date'].str[4:16]
df['Source Date'] = df['release_date']


#Function to generate date for annual reports. Will require updating once have multiple years of annual reports
def Assignannualreportdate(s):
    if search('Annual Report', str(s)):
        return '31/12/2020'

df['Annual Report Date'] = df['title'].apply(Assignannualreportdate)

#Fill in blanks

df['Source Date'] = df['Source Date'].replace(r'^\s*$', np.NaN, regex=True)
df['Source Date'].fillna(df['Annual Report Date'], inplace=True)

#Check it's working:
#logging.info(df[['company','Annual Report Date', 'Source Date']].head(n=3))


def YearFunc(s):
    if search('2022', str(s)):
        return '2022'
    if search('2021', str(s)):
        return '2021'
    if search('2020', str(s)):
        return '2020'
    elif search('2019', str(s)):
        return '2019'
    elif search('2018', str(s)):
        return '2018'
    elif search('2017', str(s)):
        return '2017'
    elif search('2016', str(s)):
        return '2016'
    elif search('2015', str(s)):
        return '2015'
    return 'too old or not found'

df['PressReleaseYear'] = df['release_date'].apply(YearFunc)

#add str(s)

def MonthFunc(s):
    if search('Jan|jan|-01-', str(s)):
        return '01'
    elif search('Feb|feb|-02-', str(s)):
        return '02'
    elif search('Mar|mar|-03-', str(s)):
        return '03'
    elif search('Apr|apr|-04-', str(s)):
        return '04'
    elif search('May|may|-05-', str(s)):
        return '05'
    elif search('Jun|jun|-06-', str(s)):
        return '06'
    elif search('Jul|jul|-07-', str(s)):
        return '07'
    elif search('Aug|aug|-08-', str(s)):
        return '08'
    elif search('Sep|sep|-09-', str(s)):
        return '09'
    elif search('Oct|oct|-10-', str(s)):
        return '10'
    elif search('Nov|nov|-11-', str(s)):
        return '11'
    elif search('Dec|dec|-12-', str(s)):
        return '12'
    return 'no month found'

df['PressReleaseMonth'] = df['release_date'].apply(MonthFunc)


#    = np.where(df.PressReleaseDate.str.contains("2020"), True, False)


# 5. Split up each sentence in PressReleaseMainClean column. Add new row for each sentence

df['PressReleaseFullClean'] = df['PressReleaseFullClean'].str.strip()
df['PressReleaseFullSentence'] = df.apply(lambda row: nltk.sent_tokenize(row['PressReleaseFullClean'], language='english'), axis=1)
df = df.explode('PressReleaseFullSentence')
df = df.reset_index()
df.drop('index',axis=1,inplace=True)
df.head()



# 6. Does the sentence contain a forward-looking goal?

# Keyword matching for carbon language

# Refers to company name / we / "company"

# Linguistic pattern : conjugation of range of verbs (aim, anticipate, assume) and verb appears in main or clause-level subject-verb-object
# Mentions future time / Year
#df['yeargoal'] = np.where(df.PressReleaseFullSentence.str.contains("2025|2030|2050"), True, False)

# Extract forward-looking goals
# Which year?

#\d The digit character matches all numeric symbols between 0 and 9. You can use it to match integers with an arbitrary number of digits: the regex ‘\d+’ matches integer numbers ‘10’, ‘1000’, ‘942’, and ‘99999999999’.
# ‘\\b’? This is the word boundary character that matches the empty string at the beginning or at the end of a word
# \s The whitespace character is, in contrast to the newline character, a special symbol of the regex libraries. You’ll find it in many other programming languages, too.
# source: https://blog.finxter.com/python-regex/
# Determine whether further prepositions are required

def searchyears(s):
    # Regex search for "20.." that follows "by", "to" or "before"
    #    outputyearcompile = re.compile('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+')
    outputyearscompile = re.findall('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+', str(s))
    # Extract only the numbers (i.e. years)
    outputyearscompile2 = re.findall('\d+', str(outputyearscompile))
    # Convert to list of numbers
    outputyearscompile3 = list(map(int, outputyearscompile2))
    # Extract only future years, and order by year
    outputyearscompile4 = sorted(i for i in outputyearscompile3 if i > 2021)
    # Remove brackets so that non-targetyear sentences get an empty column (and can be filtered out for the next step)
#    outputyearscompile5 = ','.join( str(a) for a in outputyearscompile4)
    if search('20', str(outputyearscompile4)):
        return outputyearscompile4
#    else:
#       return 'none'

#    res = str(outputyearscompile4)[1:-1]
#searchyears("by 2030 and by 2050")
#searchyears("all ok")

df['SentenceTargetYear'] = df['PressReleaseFullSentence'].apply(searchyears)


df['SentenceTargetYearclean'] = df['SentenceTargetYear'].astype(str).str.replace(r'\[|\]|,', '')



# N/A 2. Does press release relate to climate / carbon ?
# Assign column 'Carbonnews' to articles which include carbon words in main press article

df['sentence-carbon'] = np.where(df.PressReleaseFullSentence.str.contains("climate|carbon|co2|emissions"), True, False)

df['sentence-gender'] = np.where(df.PressReleaseFullSentence.str.contains("gender|female"), True, False)

df['sentence-renewables'] = np.where(df.PressReleaseFullSentence.str.contains("renewables|wind|solar|renewable|energy"), True, False)

df['sentence-suppliers'] = np.where(df.PressReleaseFullSentence.str.contains("scope 3|supply chain|suppliers"), True, False)

df['sentence-water'] = np.where(df.PressReleaseFullSentence.str.contains("water|h20|freshwater"), True, False)

df['sentence-waste'] = np.where(df.PressReleaseFullSentence.str.contains("waste|landfill|recycling"), True, False)

#Captures any sustainability (or other forward looking) goal not captured in keyword categories above. ensure for any new category that it is added to the and condition

def other_theme (row):
    if row['sentence-carbon'] == False and row['sentence-gender'] == False and row['sentence-renewables'] == False and row['sentence-suppliers'] == False and row['sentence-water'] == False and row['sentence-waste'] == False:
        return 'True'
    return 'False'

df['sentence-other'] = df.apply (lambda row: other_theme(row), axis=1)

# Add a date stamp (so users can see when an ESG target was identified by ESG Roadmap, even if cannot source exact date of source document)

df['upload-date'] = pd.to_datetime('today').normalize()

#TO CHECK => DOES THIS THEN APPEAR CORRECTLY IN THE FINAL MYSQL UPLOAD?

#df.to_csv('companypresstargets.csv', encoding="utf-8-sig")

# Remove sentences without forward looking targets

df2 = df[df.SentenceTargetYear.notnull()]
logging.info(df2.head(n=3))

#to test saving
df2.to_csv(f'nlp-output/targetsentences clean {date.today().strftime("%B")}.csv', encoding="utf-8-sig", index=False)


#only 2021 sentences with targets

# Can be applied if only extracting releases from a particular year

#df3 = df[(df.PressReleaseYear == '2021') & (df.SentenceTargetYear.notnull())]



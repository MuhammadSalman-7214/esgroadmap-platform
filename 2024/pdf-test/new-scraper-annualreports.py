import numpy as np
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import pandas as pd
import logging
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import pymysql
from sqlalchemy import create_engine
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import InvalidArgumentException
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options
import undetected_chromedriver as uc
import time
import requests
from fuzzywuzzy import fuzz
#from PyPDF2 import PdfReader
import io
#import pdftitle
import spacy
from tqdm import tqdm
import re
from re import search
import pdfplumber
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime
#import seleniumwire.undetected_chromedriver as uc
from pyvirtualdisplay import Display
display = Display(visible=0, size=(1920, 1080))
display.start()
hostname='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com'
dbname="esgroadmap"
uname="admin"
pwd="hassanarshad1122"
cnx = create_engine("mysql+pymysql://{user}:{pw}@{host}/{db}"
				.format(host=hostname, db=dbname, user=uname, pw=pwd))
conn = cnx.connect()
query = "SELECT * FROM `company_universe`;"
df = pd.read_sql_query(query, cnx)
print(len(df))
def add_existing_links(log,existing_links):
    # Read the two CSV files
    try:
        # Append the combined DataFrame to the CSV file
        csv_output_path = 'Existing_Links_DB.csv'
        df_csv = pd.read_csv(csv_output_path)
        log.info(f"Total Number of Existing Links: {len(df_csv)}")
        df_combined=existing_links[~existing_links['DocURL'].isin(df_csv['DocURL'])]
        log.info(f"Number of New Existing Links Found: {len(df_combined)}")

        df_combined.to_csv(csv_output_path, mode='a', index=False, header=False)
    except Exception as e:
       log.info(f"Error adding Existing Links {str(e)}")
       pass
	  
def process_sustainability_sentences(log):
	df=pd.read_csv("Test_output-extra-2_sustain.csv")
	#df = pd.read_excel("database.xlsx")
	df['sentence-carbon'] = np.where(df['Target Sentence'].str.contains("climate|carbon|co2|emissions"), True, False)
	
	df['sentence-gender'] = np.where(df['Target Sentence'].str.contains("gender|female"), True, False)
	
	df['sentence-renewables'] = np.where(df['Target Sentence'].str.contains("renewables|wind|solar|renewable|energy"), True, False)
	
	df['sentence-suppliers'] = np.where(df['Target Sentence'].str.contains("scope 3|supply chain|suppliers"), True, False)
	
	df['sentence-water'] = np.where(df['Target Sentence'].str.contains("water|h20|freshwater"), True, False)
	
	df['sentence-waste'] = np.where(df['Target Sentence'].str.contains("waste|landfill|recycling"), True, False)
	
	#Captures any sustainability (or other forward looking) goal not captured in keyword categories above. ensure for any new category that it is added to the and condition
	
	def other_theme(row):
	    if (row['sentence-carbon'] == False and 
	        row['sentence-gender'] == False and 
	        row['sentence-renewables'] == False and 
	        row['sentence-suppliers'] == False and 
	        row['sentence-water'] == False and 
	        row['sentence-waste'] == False):
	        return 'True'
	    return 'False'
	
	df['sentence-other'] = df.apply(other_theme, axis=1)
	df['Target sentence'] = df['Target Sentence']
	df['SentenceTargetYear'] = df['Target Sentence Year']
	df['upload-date'] = pd.to_datetime('today').normalize()
	return df


def sql_update(df,log):
	hostname='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com'
	dbname="esgroadmap"
	uname="admin"
	pwd="hassanarshad1122"
	# new
	'''hostname="server64.web-hosting.com"
	dbname="esgrzlyo_wp275"
	uname="esgrzlyo_esgroadmap"
	pwd="duurzaamheid12!"'''
	
	cnx = create_engine("mysql+pymysql://{user}:{pw}@{host}/{db}"
					.format(host=hostname, db=dbname, user=uname, pw=pwd))
	conn = cnx.connect()
	
	query = "SELECT * FROM `sentence-all`;"
	df_R = pd.read_sql_query(query, cnx)
	df=df[~df['Target sentence'].isin(df_R['Target sentence'])]
	df=df.drop_duplicates(subset=['Target sentence'])
	if len(df)>0:
		log.info(f"Uploading {len(df)} Target Sentences")
		
		
		engine = create_engine("mysql+pymysql://{user}:{pw}@{host}/{db}"
						.format(host=hostname, db=dbname, user=uname, pw=pwd))
		
		# Current setting is to replace entire targetsentence table with data. Can consider in future to 'append' in the future
		
		df=df[['Company', 'Ticker', 'PageURL', 'DocURL', 'DocTitle', 'DocName',
		       'Target Sentence', 'Target Sentence Page', 'SentenceTargetYear','upload-date','sentence-carbon','sentence-gender','sentence-renewables','sentence-suppliers','sentence-water','sentence-waste']]
		
		df.to_sql('sentence-all', engine, index=False, if_exists='append')
		log.info(f"Succesfully Added {len(df)} Rows to SQL DB")
	
	# No more thematic tables (eg. with only carbon sentences). These all are now created as views from the main 'sentence-all' MySQL database. This saves disk space
	# MySql code example: CREATE view sentencewaterview as SELECT * from `sentence-all` where `sentence-water`=1
	
def setLogs(logfile):
    '''Set Up logging'''
    logging.basicConfig(
    filename=logfile,
    level=20, filemode='a', # You can adjust the log level as needed
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
    log = logging.getLogger("my-logger")
    # Create a console (stream) handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    # Create a formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    # Set the formatter for the console handler
    console_handler.setFormatter(formatter)
    # Add the console handler to the logger
    log.addHandler(console_handler)
    return log
log = setLogs('AnnualReportScraper.log')


username = "upwork100"
password = "f7a25785-8c6a-413f-af20-e043f869e40e"

PROXY_RACK_DNS = "premium.residential.proxyrack.net:9000"

def chrome_proxy(user: str, password: str, endpoint: str) -> dict:
    wire_options = {
        "proxy": {
            "http": f"http://{user}:{password}@{endpoint}",
            "https": f"http://{user}:{password}@{endpoint}",
        }
    }

    return wire_options
proxy = {"http":"http://{}:{}@{}".format(username, password, PROXY_RACK_DNS)}


def extract_data_from_pdf(url):
    if url.startswith('//'):
        url = url.lstrip('/')
    if not 'http' in url:
        url = 'https://' + url
    
    pdf_link = requests.get(url,timeout=10)#https://s26.q4cdn.com/483754055/files/doc_financials/2001/ar/Complete-Annual-Report.pdf")
    # except: 	print("more than 10 seconds -> timeout") # 	raise 
    response = pdf_link
    with io.BytesIO(response.content) as f:
        pdf = PdfReader(f, strict=False)
        print("Successfully Extracted Text From pdf: ",pdf.metadata)
        number_of_pages = len(pdf.pages)
        print("Number of pages=",number_of_pages)
        text = ""
        for page in pdf.pages:
            try:
                text += page.extract_text() + "\n"
            except:
                print(page)
    return text
# Load the spaCy Engchrome_lish model

nlp = spacy.load('en_core_web_sm')
print("Loaded spacy nlp")
nlp.max_length = 5000000
#chrome_options = uc.ChromeOptions()
chrome_options = Options()
proxies = chrome_proxy(username,password,PROXY_RACK_DNS)
#options.headless = False
#chrome_options = Options()
#Options.binary_location = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
#chrome_options.add_argument("--headless") #For AWS/GCP 
#driver=uc.Chrome(use_subprocess=True, options = chrome_options)
driver=uc.Chrome(driver_executable_path=ChromeDriverManager().install(), seleniumwire_options=proxies, options=chrome_options)
print("created driver")
#driver=webdriver.Chrome(options=chrome_options)
driver.delete_all_cookies()
driver.maximize_window()
action = ActionChains(driver)
# Specify the file path
file_path = "database.xlsx"

# Read the Excel file and the specified sheet

#existing_company_names = pd.read_excel(file_path, sheet_name="Completed Company List")['Company'].unique()
#print("Number of existing companies: ",len(existing_company_names))
existing_links=pd.DataFrame()
#df=pd.read_csv("company-universe.csv")
all_links=df['Company annual reports page URL'].to_list() #+ df['Company sustainability / ESG reports page URL'].to_list()

#df=pd.read_csv("extras.csv")
#all_links=df['Link'].to_list()



def searchyears(s):
    # Get the current year 
    current_year = datetime.now().year -1
    outputyearscompile = re.findall('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+|in\s\\b20\d+|of\s\\b20\d+', str(s))
    # Extract only the numbers (i.e. years)
    outputyearscompile2 = re.findall('\d+', str(outputyearscompile))
    # Convert to list of numbers
    outputyearscompile3 = list(map(int, outputyearscompile2))
    # Extract only future years, and order by year
    outputyearscompile4 = sorted(i for i in outputyearscompile3 if i > current_year)
    if search('20', str(outputyearscompile4)):
        return str(outputyearscompile4)




output_df=pd.DataFrame()
errors=pd.DataFrame()
#errors=pd.read_csv("Errors_esg.csv")
visited_links=[]
company=0#372 has 1k pages 510 bug
y=0#len(existing_links)
#y=
x=0
z=0#len(errors)

for link in all_links[company:]:
    
    log.info(f"Link: {link}")
    el = pd.read_csv("Existing_Links_DB.csv")
    log.info(f"Number of existing links {len(el)}")
    try:
        cName=df['Company'].to_list()[company]
        log.info(cName)
        ticker=df['Ticker(s)'].to_list()[company]
        errors.at[z,"Company"]=cName
        errors.at[z,"Link"]=link    
        driver.get(link)
        time.sleep(2)
        print(driver.find_element(By.XPATH,"//body").text)
        #time.sleep(30)
        documents=driver.find_elements(By.XPATH,"//a[contains(@href,'.pdf') or contains(@href,'static-file')]")
        if len(documents)==0:
            documents=[]
            frames=driver.find_elements(By.XPATH,"//iframe")
            for frame in frames:
                driver.switch_to.frame(frame)
                s=driver.find_elements(By.XPATH,"//a[contains(@href,'.pdf') or contains(@href,'static-file')]")
                for k in s:
                    documents.append(k)
        log.info(f"Found {len(documents)} pdfs at {link}")
        errors.at[z,"Link-Count"]=len(documents)
        el=el[el['Company']==cName]
        for doc in documents:
            log.info(f"Found {len(el)} links for {cName}")
            existing_linkz=el['DocURL'].to_list()
            try:
                if doc not in existing_linkz:
                    docFlag = 0
                else:
                    docFlag = 1
            except Exception as e:
                pass
            if docFlag == 1:
                continue
	    
            
            
            doc_link=doc.get_attribute('href')
            given_url_components = doc_link.split("/")
            avg_similarity_scores = []
            for url in existing_linkz:
                url_components = url.split("/")
                similarity_scores = []
                for comp1, comp2 in zip(given_url_components, url_components):
                    similarity = fuzz.ratio(comp1, comp2)
                    similarity_scores.append(similarity)

                # Calculate the average similarity score for the components
                average_similarity_score = sum(similarity_scores) / len(similarity_scores)
                avg_similarity_scores.append(average_similarity_score)
            
            
            try:
                if max(avg_similarity_scores) < 90:
                    maxFlag=0
                else:
                    maxFlag=1
            except Exception as e:
                
                print(e)
                maxFlag=0
                pass
            try:
                if len(avg_similarity_scores)==0:
                    lenFlag=0
                else:
                    lenFlag=1
            except Exception as e:

                print(e)
                lenFlag=0
                pass
            if maxFlag==0 or lenFlag==0:
                try:
                    try:
                        doc_title=doc.text
                    except Exception as e:
                        doc_title=''
                        print("doc Title Error",e)
                    
                    doc_name=doc_link.split("/")[-1].replace("%20"," ")
                    visited_links.append(doc_link)
                    existing_links.at[y,"Company"]=cName
                    existing_links.at[y,"Ticker"]=ticker
                    existing_links.at[y,"PageURL"]=link
                    existing_links.at[y,"DocURL"]=doc_link
                    existing_links.at[y,"DocTitle"]=doc_title
                    existing_links.at[y,"DocName"]=doc_name
                    log.info(f"Extracting Text from: {doc_link}")

                    headers = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.6',
                    'Cache-Control': 'max-age=0',
                    'Cookie': 'AWSALBCORS=JOzd4P325n+TB3mUgg6stJSgEnPhYuU0WfJVy/uoCaeLGNry1uto+szBK4z7eUhM3GuRJ9FFOUVMvRBN+LcC969mywxVbDDPYSDVPhx5GoCPDouZr573geV6o6Z8; AWSALB=rOrlCJK5zlUJa4rj512/uP6/qBdh/WSm9io84xstGi0n/73rPNNnal1S8EazeZuPH0LsdXSww1d/Mkeu4zmkHuwCYE6wB1wGaD4sQ438/EWWaKn0ezU/KBmUldhW',
                    'Sec-Ch-Ua': '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Sec-Gpc': '1',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                    }
                    
                    response = requests.get(doc_link,headers=headers,timeout=10)
                    log.info(response.status_code)
                    with io.BytesIO(response.content) as f:
                        with pdfplumber.open(f) as pdf:
                            pages=len(pdf.pages)
                            log.info(f"There are {pages} pages")
                            text=""
                            s_count=0
                            if pages < 400:
                                for i in range(pages):
                                        page=pdf.pages[i]
                                        try:
                                            regex_dot=r'([^0-9])\.([^ 0-9])'
                                            doc_text=page.extract_text(x_tolerance=1)
                                            #log.info(f"Doc Text: {len(doc_text)}")
                                            new_text = re.sub(regex_dot, r'. \1', doc_text.replace("\n","").replace(" .","."))
                                            new_text=doc_text
                                            new_text = new_text.lower()
                                            #log.info(f"New Text: {len(new_text)}")
                                            sentence_list=nlp(new_text).sents
                                            for s in sentence_list:
                                                #print(s.text,"\n\n")
                                                sy=searchyears(s.text)
                                                if sy:
                                                    output_df.at[x,"Company"]=cName
                                                    output_df.at[x,"Ticker"]=ticker
                                                    output_df.at[x,"PageURL"]=link
                                                    output_df.at[x,"DocURL"]=doc_link
                                                    output_df.at[x,"DocTitle"]=doc_title
                                                    output_df.at[x,"DocName"]=doc_name
                                                    output_df.at[x,"Target Sentence"]=s.text
                                                    output_df.at[x,"Target Sentence Page"]=i+1
                                                    output_df.at[x,"Target Sentence Year"]=sy
                                                    x=x+1
                                                    s_count+=1
                                                    output_df.to_csv("Test_output-extra-2.csv",index=False)
                                        except Exception as e:
                                            pass
                    log.info(f"Extracted {s_count} Target Sentences")
                    existing_links.at[y,"Number of Sentences"]=s_count
                except Exception as e:
                    pass
                
                y=y+1
            else:
                log.info("Skipping PDF")

        
            
        
        z=z+1
        errors.to_csv("Errors-extra.csv",index=False)
    except Exception as e:
    
        print(e)
        try:
            errors.at[z,"DocURL"]=doc_link
            errors.at[z,"Error"]=e
            errors.to_csv("Errors-extra.csv",index=False)
        except Exception as e:
            pass
        z+=1
        pass
    log.info(f"Number of existing_links: {len(existing_links)}")
    existing_links.to_csv("Existing_Links-extra.csv",index=False)
    try:
        df_update=process_sustainability_sentences(log)
        sql_update(df_update,log)
        add_existing_links(log,existing_links)
    except Exception as e:
        add_existing_links(log,existing_links)
        log.info(f'Error Updating Database {str(e)}')
        pass
    company+=1
    print(company)


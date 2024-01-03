import pandas as pd
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
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
#import undetected_chromedriver as uc
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
#from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime

#import seleniumwire.undetected_chromedriver as uc


##Run on virtual machine (linux support)
from pyvirtualdisplay import Display
display = Display(visible=0, size=(1920, 1080))
display.start()


##Proxy service
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
nlp.max_length = 5000000
#chrome_options = uc.ChromeOptions()
chrome_options = Options()
proxies = chrome_proxy(username,password,PROXY_RACK_DNS)
#options.headless = False
#chrome_options = Options()
#Options.binary_location = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
#chrome_options.add_argument("--headless") #For AWS/GCP 
#driver=uc.Chrome(use_subprocess=True, options = chrome_options)
#driver=uc.Chrome(driver_executable_path=ChromeDriverManager().install(), seleniumwire_options=proxies, options=chrome_options)
driver=webdriver.Chrome(options=chrome_options)
driver.delete_all_cookies()
driver.maximize_window()
action = ActionChains(driver)

##Read existing links and get urls from company universe
el=pd.read_csv("Existing_Links_p1.csv")

existing_links=pd.DataFrame()
df=pd.read_csv("company-universe.csv")
all_links=df['Company annual reports page URL'].to_list()
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
##Go to each link in the list 
for link in all_links[company:]:
    ##Check if company has been scraped previously - test
    if df['Company'].to_list()[company] in existing_company_names:
        print("Skipping Company")
        company+=1
        continue
    else:
        print("Link:",link)
        el=pd.read_csv("Existing_Links_p1.csv")
        print("Number of existing links",len(el))
        ##Get pdf and update excel sheets
        try:
            cName=df['Company'].to_list()[company]
            print(cName)
            ticker=df['Ticker(s)'].to_list()[company]
            errors.at[z,"Company"]=cName
            errors.at[z,"Link"]=link 

            ##Open page link
            driver.get(link)
            time.sleep(2)
            time.sleep(30)
            #Get all pdf on page
            documents=driver.find_elements(By.XPATH,"//a[contains(@href,'.pdf') or contains(@href,'static-file')]")
            
    
            ###Added support for iframes to improve coverage
            if len(documents)==0:
                documents=[]
                frames=driver.find_elements(By.XPATH,"//iframe")
                for frame in frames:
                    driver.switch_to.frame(frame)
                    s=driver.find_elements(By.XPATH,"//a[contains(@href,'.pdf') or contains(@href,'static-file')]")
                    for k in s:
                        documents.append(k)
            print("Found ",len(documents),"pdfs at ",link)
            errors.at[z,"Link-Count"]=len(documents)

            ##DOwnload all pdfs in page
            for doc in documents:
                el=el[el['PageURL']==link]
                print(len(el))
                existing_linkz=el['DocURL'].to_list()
                doc_link=doc.get_attribute('href')
                given_url_components = doc_link.split("/")
                avg_similarity_scores = []
                ###CHeck if pdf has already been previously scraped
                for url in existing_linkz:
                    url_components = url.split("/")
                    similarity_scores = []
                    ##Check similarity to skip existing pdfs
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
                        #Create/append existing links row with all details below
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
                        print("Extracting Text from: ",doc_link)

                        ##Added headers to bypass cloudflare
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
                        #DOwnloading the PDF
                        response = requests.get(doc_link,headers=headers,timeout=10)
                        print(response.status_code)
                        with io.BytesIO(response.content) as f:
                            ##Open the pdf
                            with pdfplumber.open(f) as pdf:
                                pages=len(pdf.pages)
                                print("There are ",pages," pages")
                                text=""#This is 
                                s_count=0
                                #Navigate to each page
                                for i in range(pages):
                                    page=pdf.pages[i]
                                    try:
                                        #Regex and NLP operations to improve text collection
                                        regex_dot=r'([^0-9])\.([^ 0-9])'
                                        doc_text=page.extract_text(x_tolerance=1)
                                        new_text = re.sub(regex_dot, r'. \1', doc_text.replace("\n","").replace(" .","."))
                                        new_text=doc_text
                                        new_text = new_text.lower()
                                        sentence_list=nlp(new_text).sents
                                        #Tokenize into sentences and search for specific years in the text
                                        for s in sentence_list:
                                            #print(s.text,"\n\n")
                                            sy=searchyears(s.text)
                                            if sy:
                                                #Add a row with company details to the sentence database
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
                        print("Extracted ",s_count," Target Sentences")
                        existing_links.at[y,"Number of Sentences"]=s_count
                    except Exception as e:
                        pass
                    
                    y=y+1
                else:
                    print("Skipping PDF")

            
                
            
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
        existing_links.to_csv("Existing_Links-extra.csv",index=False)
        company+=1
        print(company)
                

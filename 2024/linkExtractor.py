from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.webdriver.support import expected_conditions as EC
import time
import pandas as pd
import re
from urllib.parse import urlparse
from fuzzywuzzy import fuzz, process
# import sys

# read the Database.xlsx file as a pandas dataframe
df = pd.read_excel('Database.xlsx', sheet_name='Errors')

company_names = df["Company"].tolist()
company_names = list(set(company_names))

search_terms = []
for company in company_names:
    search_terms.append(company + " " + "esg")
    search_terms.append(company + " " + "annual report")


driver = webdriver.Chrome(service=Service(executable_path="/Users/chetan/Desktop/Internships/GoCargo/esgroadmap/chromedriver"))

data = []
print("Start Searching")

for idx, search in enumerate(search_terms):
    driver.get("https://www.google.com")

    print(f"{idx} Searching for: " + search)

    try:
        search_bar_class = "gLFyf"

        wait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, search_bar_class))
        )

        search_bar = driver.find_element(By.CLASS_NAME, search_bar_class)

        search_bar.send_keys(search + Keys.ENTER)

        link_xpath = "//div[@class='yuRUbf']"

        wait(driver, 30).until(
            EC.presence_of_element_located((By.XPATH, link_xpath))
        )

        div = driver.find_elements(By.XPATH, link_xpath)

        report_type = "annual report" if re.search('annual report', search, re.IGNORECASE) else "esg"
        company_name = re.split('esg|annual report', search, flags=re.IGNORECASE)[0].strip()

        print(company_name)
        annual_report = ""
        best_link = ""
        best_link_score = 0
        best_do = ""
        for d in div:
            link = d.find_element(By.TAG_NAME, "a").get_attribute("href")
            domain = urlparse(link).netloc
            # print(domain)
            parts = domain.split(".")
            best_match = process.extractOne(company_name, parts)
            # best_do = best_match
            if domain == "www.annualreports.com":
                annual_report = link
            # score = fuzz.ratio(company_name, best_match)
            if best_match[1] > best_link_score and best_match[1] > 30:
                best_link = link
                best_link_score = best_match[1]
                best_do = best_match[0]

        
        print(best_do)
        try:
            driver.get(best_link)
            wait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            documents=driver.find_elements(By.XPATH,"//a[contains(@href,'pdf') or contains(@href,'static-file')]")
            pdf_count = len(documents)
        except Exception as e:
            print("Timeout")
            pdf_count = "time_out"
        

        data.append({
            "Company": company_name, 
            "Type": report_type, 
            "Link": best_link, 
            "Score": best_link_score, 
            "Annual Report": annual_report,
            "domain_extracted": best_do,
            "pdf_count": pdf_count
        })

        time.sleep(1)
    except Exception as e:
        print("Error: " + str(e))
        print(f"Got {len(data)} links so far")
        break

# id = sys.argv[1]

print("Done Searching")
output_df = pd.DataFrame(data)
output_df.to_csv(f"final_pdf.csv", index=False)
print("Bye")

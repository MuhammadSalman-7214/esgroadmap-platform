import re
import time
import logging
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.webdriver.support import expected_conditions as EC

from urllib.parse import urlparse
from fuzzywuzzy import fuzz, process

def set_logs(logfile):
    """
    Utility function for setting up logging
    @param logfile: Log filename (str)

    @return log: Logger object (Object)
    """
    logging.basicConfig(
        filename=logfile,
        level=20,
        filemode="a",
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    log = logging.getLogger("my-logger")
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(formatter)
    log.addHandler(console_handler)
    return log

def main():
    """Main Process"""
    try:
        logger = set_logs('linkExtractor_logs.log')
        df = pd.read_excel("Database.xlsx", sheet_name="Errors")

        company_names = df["Company"].tolist()
        company_names = list(set(company_names))

        search_terms = []
        for company in company_names:
            search_terms.append(company + " " + "esg")
            search_terms.append(company + " " + "annual report")

        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.140 Safari/537.36"
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument(
            "--no-sandbox"
        )
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument(f"user-agent={user_agent}")

        # Initialize WebDriver with the specified options
        driver = webdriver.Chrome(options=chrome_options)
        driver.delete_all_cookies()
        driver.maximize_window()

        data = []
        logger.info("Start Searching")

        for idx, search in enumerate(search_terms):
            driver.get("https://www.google.com")
            logger.info(f"{idx} Searching for: {search}")

            try:
                search_bar_class = "gLFyf"
                wait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, search_bar_class))
                )
                search_bar = driver.find_element(By.CLASS_NAME, search_bar_class)
                search_bar.send_keys(search + Keys.ENTER)
                link_xpath = "//div[@class='yuRUbf']"
                wait(driver, 30).until(EC.presence_of_element_located((By.XPATH, link_xpath)))
                div = driver.find_elements(By.XPATH, link_xpath)
                report_type = (
                    "annual report"
                    if re.search("annual report", search, re.IGNORECASE)
                    else "esg"
                )
                company_name = re.split("esg|annual report", search, flags=re.IGNORECASE)[
                    0
                ].strip()
                logger.info(f"Looking up Company: {company_name}")
                annual_report = ""
                best_link = ""
                best_link_score = 0
                best_do = ""
                for d in div:
                    link = d.find_element(By.TAG_NAME, "a").get_attribute("href")
                    domain = urlparse(link).netloc
                    parts = domain.split(".")
                    best_match = process.extractOne(company_name, parts)
                    if domain == "www.annualreports.com":
                        annual_report = link
                    if best_match[1] > best_link_score and best_match[1] > 30:
                        best_link = link
                        best_link_score = best_match[1]
                        best_do = best_match[0]
                try:
                    driver.get(best_link)
                    wait(driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    documents = driver.find_elements(
                        By.XPATH, "//a[contains(@href,'pdf') or contains(@href,'static-file')]"
                    )
                    pdf_count = len(documents)
                except Exception as e:
                    logger.error(f"Error whle hitting best link: {e}")
                    pdf_count = "time_out"

                data.append(
                    {
                        "Company": company_name,
                        "Type": report_type,
                        "Link": best_link,
                        "Score": best_link_score,
                        "Annual Report": annual_report,
                        "domain_extracted": best_do,
                        "pdf_count": pdf_count,
                    }
                )
                time.sleep(1)
            except Exception as e:
                logger.error(f"Error: {e}")
                logger.error(f"Got {len(data)} links so far")
                break

        logger.info("Done Searching")
        output_df = pd.DataFrame(data)
        output_df.to_csv(f"final_pdf.csv", index=False)
    except Exception as e:
        logger.error(f"An unexpected error occured: {e}")

if __name__ == "__main__":
    main()
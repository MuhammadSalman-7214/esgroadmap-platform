import io
import os
import re
import time
import logging
import requests
from re import search
from datetime import datetime

import spacy
import pdfplumber
import numpy as np
import pandas as pd
import pymysql.cursors
from sqlalchemy import create_engine

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

from fuzzywuzzy import fuzz
from pyvirtualdisplay import Display


def add_existing_links(log, existing_links):
    """
    Function to add existing links to CSV
    @param log: Logger Object (Object)
    @param existing_links: List of Existing Links to add in CSV (list)

    @return None
    """
    try:
        # Append the combined DataFrame to the CSV file
        csv_output_path = "Existing_Links_DB.csv"
        df_csv = pd.read_csv(csv_output_path)
        log.info(f"Total Number of Existing Links: {len(df_csv)}")
        df_combined = existing_links[~existing_links["DocURL"].isin(df_csv["DocURL"])]
        log.info(f"Number of New Existing Links Found: {len(df_combined)}")
        df_combined.to_csv(csv_output_path, mode="a", index=False, header=False)
    except Exception as e:
        log.error(f"Error adding Existing Links {str(e)}")
        pass


def sql_update(df, log, connection):
    """
    Function to update new data into sentence-all table
    @param df: Dataframe containing new data (Dataframe)
    @param log: Logger Object (Object)
    @param connection: SQLAlchemy connection object (Object)

    @return None
    """
    try:
        query = "SELECT * FROM `sentence-all`;"
        df_R = pd.read_sql_query(query, connection)
        df = df[~df["Target sentence"].isin(df_R["Target sentence"])]
        df = df.drop_duplicates(subset=["Target sentence"])
        if len(df) > 0:
            log.info(f"Uploading {len(df)} Target Sentences")
            df = df[
                [
                    "Company",
                    "Ticker",
                    "PageURL",
                    "DocURL",
                    "DocTitle",
                    "DocName",
                    "Target sentence",
                    "Target Sentence Page",
                    "SentenceTargetYear",
                    "upload-date",
                ]
            ]
            df.to_sql("sentence-all", connection, index=False, if_exists="append")
            log.info(f"Succesfully Added {len(df)} Rows to SQL DB")
    except pymysql.connect.Error as err:
        log.error(f"Error while connecting: {err}")
    except Exception as e:
        log.error(f"Error occured while db update: {e}")
    # No more thematic tables (eg. with only carbon sentences). These all are now created as views from the main 'sentence-all' MySQL database. This saves disk space
    # MySql code example: CREATE view sentencewaterview as SELECT * from `sentence-all` where `sentence-water`=1


def set_logs(logfile):
    """
    Utility function for setting up logging
    @param logfile: Log filename (str)

    @return log: Logger object (Object)
    """
    try:
        logging.basicConfig(
            filename=logfile,
            level=20,
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
    except Exception as e:
        logfile.error(f"Error while setting up logger: {e}")


def chrome_proxy(user, password, endpoint):
    """
    Function for creating dict for Selenium Wire proxy option
    @param user: proxy user (str)
    @param password: proxy password (str)
    @param endpoint: proxy endpoint (str)

    @return wire_options: proxy options dictionary (dict)
    """
    wire_options = {
        "proxy": {
            "http": f"http://{user}:{password}@{endpoint}",
            "https": f"http://{user}:{password}@{endpoint}",
        }
    }

    return wire_options


def searchyears(text, log):
    """
    Function to return year extracted from string based on regex 
    @param text: Text to look into (str)
    @param log: Logger Object (Object)

    @return outputyearscompile4: year (str)
    """
    try:
        # Get the current year
        current_year = datetime.now().year - 1
        outputyearscompile = re.findall(
            "by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+|in\s\\b20\d+|of\s\\b20\d+",
            str(text),
        )
        outputyearscompile2 = re.findall("\d+", str(outputyearscompile))
        outputyearscompile3 = list(map(int, outputyearscompile2))
        outputyearscompile4 = sorted(i for i in outputyearscompile3 if i > current_year)
        if search("20", str(outputyearscompile4)):
            return str(outputyearscompile4)
    except Exception as e:
        log.error(f"Error while searching years: {e}")


def extract_data_from_pdf(url, log):
    """
    Extract Text from PDF
    @param url: URL to fetch PDF from (str)
    @param log: Logger Object (Object)

    @return text: Extracted text from PDF (str)
    """
    try:
        if url.startswith("//"):
            url = url.lstrip("/")
        if not "http" in url:
            url = "https://" + url

        pdf_link = requests.get(url, timeout=10)
        response = pdf_link
        with io.BytesIO(response.content) as f:
            pdf = PdfReader(f, strict=False)
            log.info("Successfully Extracted Text From pdf: ", pdf.metadata)
            number_of_pages = len(pdf.pages)
            log.info("Number of pages=", number_of_pages)
            text = ""
            for page in pdf.pages:
                try:
                    text += page.extract_text() + "\n"
                except:
                    log.info(page)
        return text
    except Exception as e:
        log.error(f"Error while extracting data from PDF: {e}")


def get_companies_from_db(log, connection):
    """
    Get Companies from DB
    @param log: Logger Object (Object)
    @param connection: SQLAlchemy connection object (Object)

    @return df: Dataframe containing Company Data (df)
    """
    try:
        query = "SELECT * FROM `company_universe`;"
        df = pd.read_sql_query(query, connection)
        return df
    except pymysql.connect.Error as err:
        log.error(f"Error: {err}")
    except Exception as e:
        log.error(f"Error while getting data: {e}")


def main():
    """Main Process"""
    logger = set_logs("AnnualReportScraper.log")
    display = Display(visible=0, size=(1920, 1080))
    display.start()

    nlp = spacy.load("en_core_web_sm")
    logger.info("Loaded spacy nlp")
    nlp.max_length = 5000000
    try:
        connection = create_engine(
            "mysql+pymysql://{user}:{pw}@{host}/{db}".format(
                host=os.getenv("DB_HOST"),
                db=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                pw=os.getenv("DB_PASS"),
            )
        )

        df = get_companies_from_db(logger, connection)
        all_links = df["Company annual reports page URL"].to_list()

        username = os.getenv("PROXY_RACK_USER")
        password = os.getenv("PROXY_RACK_PASS")
        dns = os.getenv("PROXY_RACK_DNS")
        proxy = f"http://{username}:{password}@{dns}"

        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.140 Safari/537.36"
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument(f"user-agent={user_agent}")
        # chrome_options.add_argument(f"--proxy-server={proxy}")

        # Initialize WebDriver with the specified options
        driver = webdriver.Chrome(options=chrome_options)
        driver.delete_all_cookies()
        driver.maximize_window()
        logger.info("created driver")
        existing_links = pd.DataFrame()
        output_df = pd.DataFrame()
        errors = pd.DataFrame()
        visited_links = []
        company = 0
        y = 0
        x = 0
        z = 0
        for link in all_links[company:]:

            logger.info(f"Link: {link}")
            el = pd.read_csv("Existing_Links_DB.csv")
            logger.info(f"Number of existing links {len(el)}")
            try:
                cName = df["Company"].to_list()[company]
                logger.info(cName)
                ticker = df["Ticker(s)"].to_list()[company]
                errors.at[z, "Company"] = cName
                errors.at[z, "Link"] = link
                driver.get(link)
                time.sleep(2)
                documents = driver.find_elements(
                    By.XPATH,
                    "//a[contains(@href,'.pdf') or contains(@href,'static-file')]",
                )
                if len(documents) == 0:
                    documents = []
                    frames = driver.find_elements(By.XPATH, "//iframe")
                    for frame in frames:
                        driver.switch_to.frame(frame)
                        s = driver.find_elements(
                            By.XPATH,
                            "//a[contains(@href,'.pdf') or contains(@href,'static-file')]",
                        )
                        for k in s:
                            documents.append(k)
                logger.info(f"Found {len(documents)} pdfs at {link}")
                errors.at[z, "Link-Count"] = len(documents)
                el = el[el["Company"] == cName]
                for ind, doc in enumerate(documents):
                    logger.info(f"Found {len(el)} links for {cName}")
                    existing_linkz = el["DocURL"].to_list()
                    try:
                        if doc not in existing_linkz:
                            docFlag = 0
                        else:
                            docFlag = 1
                    except Exception as e:
                        pass
                    if docFlag == 1:
                        continue

                    doc_link = doc.get_attribute("href")
                    given_url_components = doc_link.split("/")
                    avg_similarity_scores = []
                    for url in existing_linkz:
                        url_components = url.split("/")
                        similarity_scores = []
                        for comp1, comp2 in zip(given_url_components, url_components):
                            similarity = fuzz.ratio(comp1, comp2)
                            similarity_scores.append(similarity)

                        # Calculate the average similarity score for the components
                        average_similarity_score = sum(similarity_scores) / len(
                            similarity_scores
                        )
                        avg_similarity_scores.append(average_similarity_score)

                    try:
                        if max(avg_similarity_scores) > 90:
                            maxFlag = 0
                        else:
                            maxFlag = 1
                    except Exception as e:
                        logger.error(f"Error: {e}")
                        maxFlag = 0
                        pass
                    try:
                        if len(avg_similarity_scores) == 0:
                            lenFlag = 0
                        else:
                            lenFlag = 1
                    except Exception as e:

                        logger.error(f"Error: {e}")
                        lenFlag = 0
                        pass
                    if maxFlag == 0 or lenFlag == 0:
                        try:
                            try:
                                doc_title = doc.text
                            except Exception as e:
                                doc_title = ""
                                logger.error(f"Doc Title Error: {e}")

                            doc_name = doc_link.split("/")[-1].replace("%20", " ")
                            visited_links.append(doc_link)
                            existing_links.at[y, "Company"] = cName
                            existing_links.at[y, "Ticker"] = ticker
                            existing_links.at[y, "PageURL"] = link
                            existing_links.at[y, "DocURL"] = doc_link
                            existing_links.at[y, "DocTitle"] = doc_title
                            existing_links.at[y, "DocName"] = doc_name
                            logger.info(f"Extracting Text from: {doc_link}")

                            headers = {
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                                "Accept-Encoding": "gzip, deflate, br",
                                "Accept-Language": "en-US,en;q=0.6",
                                "Cache-Control": "max-age=0",
                                "Cookie": "AWSALBCORS=JOzd4P325n+TB3mUgg6stJSgEnPhYuU0WfJVy/uoCaeLGNry1uto+szBK4z7eUhM3GuRJ9FFOUVMvRBN+LcC969mywxVbDDPYSDVPhx5GoCPDouZr573geV6o6Z8; AWSALB=rOrlCJK5zlUJa4rj512/uP6/qBdh/WSm9io84xstGi0n/73rPNNnal1S8EazeZuPH0LsdXSww1d/Mkeu4zmkHuwCYE6wB1wGaD4sQ438/EWWaKn0ezU/KBmUldhW",
                                "Sec-Ch-Ua": '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
                                "Sec-Ch-Ua-Mobile": "?0",
                                "Sec-Ch-Ua-Platform": '"Windows"',
                                "Sec-Fetch-Dest": "document",
                                "Sec-Fetch-Mode": "navigate",
                                "Sec-Fetch-Site": "none",
                                "Sec-Fetch-User": "?1",
                                "Sec-Gpc": "1",
                                "Upgrade-Insecure-Requests": "1",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                            }

                            response = requests.get(
                                doc_link, headers=headers, timeout=10
                            )
                            logger.info(response.status_code)
                            with io.BytesIO(response.content) as f:
                                with pdfplumber.open(f) as pdf:
                                    pages = len(pdf.pages)
                                    logger.info(f"There are {pages} pages")
                                    text = ""
                                    s_count = 0
                                    if pages < 400:
                                        for i in range(pages):
                                            page = pdf.pages[i]
                                            try:
                                                regex_dot = r"([^0-9])\.([^ 0-9])"
                                                doc_text = page.extract_text(
                                                    x_tolerance=1
                                                )
                                                new_text = re.sub(
                                                    regex_dot,
                                                    r". \1",
                                                    doc_text.replace("\n", "").replace(
                                                        " .", "."
                                                    ),
                                                )
                                                new_text = doc_text
                                                new_text = new_text.lower()
                                                sentence_list = nlp(new_text).sents
                                                for s in sentence_list:
                                                    sy = searchyears(s.text, logger)
                                                    if sy:
                                                        output_df.at[x, "Company"] = (
                                                            cName
                                                        )
                                                        output_df.at[x, "Ticker"] = (
                                                            ticker
                                                        )
                                                        output_df.at[x, "PageURL"] = (
                                                            link
                                                        )
                                                        output_df.at[x, "DocURL"] = (
                                                            doc_link
                                                        )
                                                        output_df.at[x, "DocTitle"] = (
                                                            doc_title
                                                        )
                                                        output_df.at[x, "DocName"] = (
                                                            doc_name
                                                        )
                                                        output_df.at[
                                                            x, "Target sentence"
                                                        ] = s.text
                                                        output_df.at[
                                                            x, "Target Sentence Page"
                                                        ] = (i + 1)
                                                        output_df.at[
                                                            x, "Target Sentence Year"
                                                        ] = sy
                                                        x = x + 1
                                                        s_count += 1
                                                        output_df.to_csv(
                                                            "Test_output-extra-2_annualreports.csv",
                                                            index=False,
                                                        )
                                            except Exception as e:
                                                pass
                            logger.info(f"Extracted {s_count} Target Sentences")
                            existing_links.at[y, "Number of Sentences"] = s_count
                        except Exception as e:
                            pass

                        y = y + 1
                    else:
                        logger.info("Skipping PDF")

                z = z + 1
                errors.to_csv("Errors-extra.csv", index=False)
            except Exception as e:

                logger.error(f"Error: {e}")
                try:
                    errors.at[z, "DocURL"] = doc_link
                    errors.at[z, "Error"] = e
                    errors.to_csv("Errors-extra.csv", index=False)
                except Exception as e:
                    pass
                z += 1
            logger.info(f"Number of existing_links: {len(existing_links)}")
            existing_links.to_csv("Existing_Links-extra.csv", index=False)
            if len(output_df) > 0:
                try:
                    df_out = pd.read_csv("Test_output-extra-2_annualreports.csv")
                    df_out["SentenceTargetYear"] = df_out["Target Sentence Year"]
                    df_out["upload-date"] = pd.to_datetime("today").normalize()
                    sql_update(df_out, logger, connection)
                    add_existing_links(logger, existing_links)
                except Exception as e:
                    add_existing_links(logger, existing_links)
                    logger.error(f"Error Updating Database {str(e)}")
            company += 1
            logger.info(f"Error number: {company}")
    except Exception as e:
        logger.error(f"Error occured: {e}")


if __name__ == "__main__":
    main()

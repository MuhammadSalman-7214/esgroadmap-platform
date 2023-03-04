import smtplib
import time
import imaplib
import email
import traceback 
import re
from bs4 import BeautifulSoup
import datetime
import pandas as pd
import requests
import env
import logging

# -------------------------------------------------
#
# Utility to read email from Gmail Using Python
#
# ------------------------------------------------
ORG_EMAIL = "@gmail.com" 
FROM_EMAIL = "jameskijani" + ORG_EMAIL 
FROM_PWD = "ltpaizrwjjqzaaph" 
SMTP_SERVER = "imap.gmail.com" 
SMTP_PORT = 993
emails_regex_2= r'[\w\.-]+@[\w\.-]+(?:\.[\w]+)+'
time_format = '%d %b %Y'


def week_check(msg):
    num_days = (env.timeframe*7)+1
    check_date = (datetime.datetime.now()-datetime.timedelta(days=num_days)).strftime('%d %b %Y')
    # check_date = '14 Feb 2022'
    logging.info(msg['Date'])
    if check_date in msg['Date'] or check_date[1:] in msg['Date']:
        return True
    else:
        return False

def get_all_relevant_email_messages(latest_email_id,first_email_id):
    logging.info('Getting the past {} weeks emails'.format(str(env.timeframe)))
    msg_objs = []
    week_old_check=False
    for i in range(latest_email_id,first_email_id, -1):
        if week_old_check:
            break
        data = mail.fetch(str(i), '(RFC822)' )
        for response_part in data:
            arr = response_part[0]
            if isinstance(arr, tuple):
                msg = email.message_from_string(str(arr[1],'utf-8'))
                if week_check(msg):
                    week_old_check = True
                    break
                else:
                    msg_objs.append(msg)
    logging.info("Total emails collected = {}".format(str(len(msg_objs))))
    return msg_objs


def get_email_body(msg):
    for part in msg.walk():
        try:
            body = part.get_payload(decode=True).decode()
            return body
        except:
            pass
    

def get_href_from_body(body):
    soup = BeautifulSoup(body,'html.parser')
    return soup.find_all('a')[0].attrs['href']

def get_text_from_href(href):
    user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)'
    user_agent_pc = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36'
    session = requests.Session()
    session.headers.update({'User-Agent': user_agent})
    resp = session.get(href)
    soup = BeautifulSoup(resp.text,'html.parser')
    return soup.find('body').text


def get_emails_from_text(text):
    emails = re.findall(emails_regex_2,text)
    if len(emails)==0:
        return 'None'
    else:
        return ','.join(emails)


def read_lookup_file():
    df = pd.read_excel('Email sender company lookup 1.3.xlsx',engine='openpyxl')
    df['E-mail sender'] = df['E-mail sender'].str.replace('"','')
    return df

def get_data_corresponding_from_email_sender(df,sender,data_point):
    sender = sender.replace('"','')
    try:
        value = df[df['E-mail sender']==sender][data_point].iloc[0]
    except Exception as e:
        # logging.info(e)
        logging.info(sender)
        value = 'Not found'
    return value

mail = imaplib.IMAP4_SSL(SMTP_SERVER)
mail.login(FROM_EMAIL,FROM_PWD)
mail.select('inbox')
data = mail.search(None, 'ALL')
mail_ids = data[1]
id_list = mail_ids[0].split()   
first_email_id = int(id_list[0])
latest_email_id = int(id_list[-1])
df_lookup = read_lookup_file()
all_msgs = get_all_relevant_email_messages(latest_email_id,first_email_id)
obj = {}
obj['company'] = []
obj['ticker'] = []
obj['title'] = []
obj['Page'] = []
obj['full_text'] = []
obj['emails'] = []
obj['link'] = []
obj['source'] = []
obj['pr_site'] = []
obj['Email Sender'] = []
obj['release_date'] = []
for msg in all_msgs:
    body = get_email_body(msg)
    try:
        href = get_href_from_body(body)
    except Exception as e:
        # logging.info(e)
        logging.info('Skipping {} {} (Cant get link)'.format(msg['From'],msg['Date']))
        continue
    try:
        text = get_text_from_href(href)
    except Exception as e:
        # logging.info(e)
        logging.info('Skipping. Cant fetch text from link.')
        continue
    emails = get_emails_from_text(text)
    obj['company'].append(get_data_corresponding_from_email_sender(df_lookup,msg['From'],'company'))
    obj['ticker'].append(get_data_corresponding_from_email_sender(df_lookup,msg['From'],'Ticker'))
    obj['title'].append(msg['Subject'])
    obj['Page'].append('NA')
    obj['full_text'].append(text)
    obj['emails'].append(emails)
    obj['link'].append(href)
    obj['source'].append('')
    obj['pr_site'].append('NA')
    obj['Email Sender'].append(msg['From'])
    obj['release_date'].append(msg['Date'])
    df = pd.DataFrame(obj)
    time_now = datetime.datetime.now()
    num_days = (env.timeframe*7)+1
    date_today = time_now.strftime(time_format)
    date_start = (time_now-datetime.timedelta(days=num_days)).strftime(time_format)
    if env.file_save_format=='xlsx':
        df.to_excel('email-output/Email Scraping Results {} to {}.xlsx'.format(date_start,date_today),engine='openpyxl')
    elif env.file_save_format=='csv':
        df.to_csv('email-output/Email Scraping Results {} to {}.csv'.format(date_start,date_today))



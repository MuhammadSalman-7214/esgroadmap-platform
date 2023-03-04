from datetime import datetime
from logging import exception
# from sys import intern
from PyPDF2 import PdfFileReader
import pandas as pd
import pdftitle
import requests
import re,os,io
import csv
import nltk

from settings import extract_text,download_pdfs

from email.header import decode_header

import quopri

emails_regex_2= r'[\w\.-]+@[\w\.-]+(?:\.[\w]+)+'

def sentence_tk(text):
	text = text.strip()
	df['text'] = df['text'].str.strip()
	df['Sentence-text'] = df.apply(lambda row: nltk.sent_tokenize(row['text'], language='english'), axis=1)
	df = df.explode('Sentence-text')
	df = df.reset_index()
	df.drop('index',axis=1,inplace=True)
	df.head()
 	###########
	# sentence_tex
 	# obj['full_text'].append(page.extract_text())#.decode('utf-8'))
def search_years(text):
    # Regex search for "20.." that follows "by", "to", "before" or "in"
    #    outputyearcompile = re.compile('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+')
    outputyearscompile = re.findall('by\s\\b20\d+|to\s\\b20\d+|before\s\\b20\d+|in\s\\b20\d+', str(text))
    # Extract only the numbers (i.e. years)
    outputyearscompile2 = re.findall('\d+', str(outputyearscompile))
    # Convert to list of numbers
    outputyearscompile3 = list(map(int, outputyearscompile2))
    # Extract only future years, and order by year
    outputyearscompile4 = sorted(i for i in outputyearscompile3 if i > 2023)
    # Remove brackets so that non-targetyear sentences get an empty column (and can be filtered out for the next step)
#    outputyearscompile5 = ','.join( str(a) for a in outputyearscompile4)
    # if search('20', str(outputyearscompile4)):
    if '20' in  str(outputyearscompile4):
        return outputyearscompile4
    
def find_emails_from_text(text):
    emails = re.findall(emails_regex_2,text)
    if len(emails)==0:
        return 'None'
    else:
        return ','.join(emails)
def extract_data_from_pdf(url):
	if url.startswith('//'):
		url = url.lstrip('/')
	if not 'http' in url:
		url = 'https://' + url

	pdf_link = requests.get(url,timeout=10)#https://s26.q4cdn.com/483754055/files/doc_financials/2001/ar/Complete-Annual-Report.pdf")
	# except: 	print("more than 10 seconds -> timeout") # 	raise 
	response = pdf_link
	with io.BytesIO(response.content) as f:
		pdf = PdfFileReader(f, strict=False)
		information = pdf.getDocumentInfo()
		# pdf.get
		number_of_pages = pdf.getNumPages()
		text = ""
		for page in pdf.pages:
			try:
				text += page.extract_text() + "\n"
			except:
				print(page)
		pdf_path = ''
		try:
			internalTitle = pdftitle.get_title_from_io(f)
		except:
			internalTitle = ''
		res = {
		"PDF Path": {pdf_path},
		"Title": internalTitle,
        "Title2": information.title,
		"Author": {information.author},
		"Subject": {information.subject},
		"Number of pages": {number_of_pages},
		"Text": {text},
		}
	return res
def exrtact_data_from_pdf_by_page(pdfUrl,companyName,ticker):
	print("Extracting data from pdf...")
	pdf_response = requests.get(pdfUrl,timeout=10)
	f = io.BytesIO(pdf_response.content)
	pdf = PdfFileReader(f, strict=False)
	# Extract two possible titles from first page and using library pdftitle
	first_page = pdf.getPage(0).extract_text()
	# internalTitle1 = pdftitle.get_title_from_io(f)
	internalTitle2 = parse_document_type(first_page) # + internalTitle
	# internalTitle = internalTitle1 + '-' + internalTitle2
	internalTitle = internalTitle2
	obj = {}
	obj['company'] = []
	obj['ticker'] = []
	obj['full_title'] = []
	obj['Page'] = []
	obj['full_text'] = []
	obj['emails'] = []
	obj['link'] = []
	page_num = 0

	for page in pdf.pages:
		try:
			page_num+=1
			obj['company'].append(companyName)
			obj['ticker'].append(ticker)
			obj['full_title'].append(internalTitle)
			obj['Page'].append(page_num)
			# Text tokenization and future year search TODO
			page_text = page.extract_text()
			obj['full_text'].append(page_text)
			# obj['full_text'].append(page.extract_text())#.decode('utf-8'))
			obj['emails'].append(find_emails_from_text(page.extract_text()))
			obj['link'].append(pdfUrl)
		except exception as e:
			print(e)
			pass
	df = pd.DataFrame(obj, columns=['company','ticker','full_title','Page','full_text','emails','link'],dtype=str)
	##################### NEW
	df['full_text'] = df['full_text'].str.strip()
	df['full_text'] = df.apply(lambda row: nltk.sent_tokenize(row['full_text'].strip(), language='english'), axis=1)
	df = df.explode('full_text')
	df = df.reset_index()
	df.drop('index', axis=1, inplace=True)

	df['Sentence-text-targetyear'] = df['full_text'].apply(search_years)
	# df = df[df['Sentence-text-targetyear'].str.len() > 0]
	df = df[df['Sentence-text-targetyear'].notnull()]
 	#######################
	# can get author, subject, and title from information dictionary:
	f.close()
	print('Done extracting data from pdf...')
	return df,internalTitle
	
def clean_url(url):
	url = url.replace('http:', 'https:')
	url = url.replace('////','//')
	if url.startswith('//'):
		url=url[2:]
	if not url.startswith('https://'):
		url = 'https://' + url
	return url
def clean_title(title):
	title = title.replace('\n','')
	title = title.replace('\t','')
	title = title.replace('\r','')
	title = title.replace('\xa0','')
	title = title.replace('(opens in new window)','')
	# if 
	return title.strip()
#check if title or url contains any of the key words(annual,report,financial,proxy,esg,sustainability,press-release, crs...)
def parse_document_type(title):
	keywords = ['annual','report','press','release','proxy','esg','sustainability',
				'crs','q1', 'q2', 'q3', 'q4','sec-filing','financials',#'press-release',
				'governance','risk','earnings','impact','quarterly','news','policy','social','tax']
	title = title.lower()
	docTypes = []
	wordsSeen = []
	# check if title contains any of the keywords and label docType by keyword
	for keyword in keywords:
		# remove the domain part - everything before .com and search for keywords after
		if keyword in title and not keyword in docTypes:
			wordsSeen.append(keyword)
			docTypes.append(keyword)
	docType = '-'.join(docTypes)
	if docType:
		docType = '-'.join(set(docType.split('-')))
	return f'{docType}'#-{docYear}'
def extract_year(txt, isUrl=False):
	if isUrl:
		dateMatch = re.search(r'/\d{4}/',txt)
	else:
		dateMatch = re.search(r'\d{4}',txt)
	if dateMatch:
		year = dateMatch.group()
		# print(year)
		year= year.strip('/')
		if int(year) > 2000 and int(year) < 2023 and year is not None:
			return year
		else:
			return ''
	else:
		return ''	
def extract_date(txt):	
	dateMatch = re.search(r'\d{2}/\d{2}/\d{4}',txt)
	if dateMatch:
		date = dateMatch.group()
		try:
			date = datetime.strptime(date, '%d/%m/%Y')
		except:
			date = datetime.strptime(date,'%m/%d/%Y')
		return date.strftime('%Y-%m-%d'), date.year

	dateMatch = re.search(r'\d{4}/\d{2}/\d{2}',txt)
	if dateMatch:
		date = dateMatch.group()
		date = datetime.strptime(date, '%Y/%m/%d')
		return date.strftime('%Y-%m-%d'), date.year

	dateMatch = re.search(r'\d{2}/\d{2}/\d{2}',txt)
	if dateMatch:
		date = dateMatch.group()
		date = datetime.strptime(date, '%y.%m.%d')#%Y
		return date.strftime('%Y-%m-%d'), date.year

	dateMatch = re.search(r'\d{2}\.\d{2}\.\d{4}',txt)
	if dateMatch:
		date = dateMatch.group()
		# return date and year pair
		date = datetime.strptime(date, '%d.%m.%Y')
		return date.strftime('%Y-%m-%d'), date.year

	dateMatch = re.search(r'\d{4}\.\d{2}\.\d{2}',txt)
	if dateMatch:
		date = dateMatch.group()
		date = datetime.strptime(date, '%Y.%m.%d')
		return date.strftime('%Y-%m-%d'), date.year

	dateMatch = re.search(r'\d{2}\-\d{2}\-\d{2}',txt)
	if dateMatch:
		date = dateMatch.group()
		for datePart in date.split('-'):
			if int(datePart) < 1 :
				return '',''
		try:
			date = datetime.strptime(date,'%d-%m-%y')#.strftime('%Y-%m-%d')
		except:
			try:
				date = datetime.strptime(date,'%d-%y-%m')
			except:
				try:
					date = datetime.strptime(date,'%y-%m-%d')
				except:
					date = datetime.strptime(date,'%y-%d-%m')

		return date.strftime('%Y-%m-%d'), date.year
	return '', ''
def clean_doc_url(url):
	endPoints = url.split('/')
	return '/'.join(dict.fromkeys(endPoints))


class CrawlmasterPipeline:


	def process_item(self,item,company,ticker,docNumber):
		# Step 1: cleaning

		# df_universe = self.df_universe
		if '.aspx' in item['docUrl']:
			return None	
		if '.html' in item['docUrl']:
			item['docUrl'] = item['Domain'] + item['nakedUrl']

		item['title']= clean_title(item['title'])
		item['title2']= clean_title(item['title2'])
		after_com = item['nakedUrl'].split('.com')
		if len(after_com) < 2:
			after_com = item['nakedUrl'].split('.net')
		if len(after_com) < 2:
			after_com = item['nakedUrl']
		else:
			after_com = after_com[1]
		
		# Step 2: extract document type to name the file
		item['docType'] = parse_document_type(item['title'] + ' ' + item['title2'] + ' ' + after_com)
		item['date'] = ''
		item['year'] = ''
		item['name'] = ''		
		item['year'] = extract_year(item['title'] + extract_year(item['title2']))
		if item['nakedUrl'] is None:
			item['nakedUrl'] = ''
			print("naked url is empty, DEBUGG")  
		date,dateYear = extract_date(item['nakedUrl'] + ' ' + item['title2'] + ' ' + item['title'])
		if date != '' and dateYear <= 2050 and dateYear > 2005:
			item['date'] = date
			# if year is empty, take year extracted from url
			if item['year'] == '' and dateYear != '':
				item['year'] = dateYear
			item['name'] = item['docType'] + '-' + item['date']
		if item['year'] == '':
			item['year'] = extract_year(item['nakedUrl'], isUrl=True)
		if item['year'] != '':# and item['year'] is not None:
			item['name'] = item['docType'] + '-' + str(item['year'])
		if 'annual' in item['docType'].lower() or 'esg' in item['docType'].lower() or 'sustainability' in item['docType'].lower():
			if item['year'] != '':
				item['name'] = item['docType'] + ' ' + str(item['year'])
		if len(item['name']) < 3:
			item['name'] = item['docType']
		if len(item['name']) < 3 and 'quarterly' in item['Report Url']:
			item['name'] = 'quarterly'
			
		item['docUrl'] =clean_doc_url(item['docUrl'])
		pdfUrl = clean_url(item['docUrl'])
		# Step 2: get text from pdf file
		if bool(extract_text) is True:
			print("extracting text from pdf")
			try:
				internalData,internalName = exrtact_data_from_pdf_by_page(pdfUrl, company, ticker)
				item['docUrl'] = pdfUrl
			except:
				# print(f'Failed first try to extract data, wrong url: {pdfUrl}, retrying with',pdfUrlNaked)
				pdfUrlNaked = clean_url(item['nakedUrl'])
				try:
					internalData,internalName = exrtact_data_from_pdf_by_page(pdfUrlNaked,company,ticker)
					item['docUrl'] = pdfUrlNaked
				except:
					pdfUrl = clean_url(item['Domain'] + item['nakedUrl'])
					internalData,internalName = exrtact_data_from_pdf_by_page(pdfUrl,company,ticker)
					# item['docUrl'] = item['Domain'] + item['nakedUrl']
		

			if internalName is None or internalName == '':
				internalName = item['name']
			internalName = internalName.lstrip('-') + '-document'
			if len(internalData) > 1:
				# fullText = fullText.encode('utf-16').decode('utf-16').replace('\x00','') # fullText = re.sub(r'[^\x00-\x7F]', ' ', fullText)
				fullText = internalData['full_text'].str.cat(sep=' ')
				fullText= fullText.replace('\x00','')
				internalData['full_text'] = fullText
				docNumber = str(docNumber)
				companyName = item['Company'] 
				# internalData.to_csv(f'outputs/text/{companyName}-{internalName}-{docNumber}.csv')#, index=False)
				OUTPUT_PATH = 'outputs/master_workbook.csv'
				# if not os.path.exists(OUTPUT_PATH):
				# 	internalData.to_csv(OUTPUT_PATH,mode='a',index=False)
				internalData.to_csv(OUTPUT_PATH,mode='a',index=False,
                        header=not os.path.exists(OUTPUT_PATH))
			else:
				print('No text extracted from pdf')
			# except Exception as e:
			# 	print('failed to save text',e)			
			item['nameInternal'] = os.path.basename(item['Company']+'-'+internalName)#+'.pdf')
			item['finalName'] = parse_document_type(item['nameInternal']+' '+item['name'])
		
		# Step 3: Downloading
		# duplciate check -> download 
		download_on = int(download_pdfs)
		if bool(download_on) == True:
			PATH = 'outputs/pdfs/'
			# if directory does not exist, create it
			if not os.path.exists(PATH):
				os.makedirs(PATH)
			pdfUrl = clean_url(item['docUrl'])
			fileName = os.path.basename(item['name']+str(docNumber)+'.pdf')
			if 'nameInternal' in item:
				fileName = os.path.basename(item['nameInternal']+'-'+str(docNumber)+'.pdf')
			pdf_path = os.path.join(PATH, fileName)
			if not os.path.isfile(pdf_path):
				response = requests.get(pdfUrl, stream=True)
				with open(pdf_path, 'wb') as outfile:
					outfile.write(response.content)
			else:
				# ignore if already downloaded
				print(f"File {pdf_path} exists")
		else:
			print("Downloading disabled")

		return item


# import chardet
# the_encoding = chardet.detect(b'your string')['encoding']


# import cchardet
# def convert_encoding(data, new_coding = 'UTF-8'):
#   encoding = cchardet.detect(data)['encoding']

#   if new_coding.upper() != encoding.upper():
#     data = data.decode(encoding, data).encode(new_coding)

#   return data

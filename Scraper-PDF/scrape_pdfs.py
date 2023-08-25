import time,os
import pandas as pd
import requests
from lxml import etree
import undetected_chromedriver as uc
from webdriver_manager.chrome import ChromeDriverManager
from settings import num_companies,  crawl_press_release,crawl_annual_and_sustainability#download_pdfs, extract_text,
import traceback
import pipelines

# Fix PDF urls
def addDomain(url,investorUrl,domain=False):
	
	# replace position of folowing two if statements

	if '.com' not in url:
		investorUrl = investorUrl.split('.com/')[0]+'.com'
		url = investorUrl.rstrip('/') + url
	
	# add domain as third optional argument and check if investorUrl contains html add domain instead
	if domain != False and '.html' in url:
		return domain.rstrip('/') + url	

	print('after adding domain: ', url)
	return url
# Fix report page urls
def convertReportPage(url, domain):
	if '.com' not in url:
		url = domain.rstrip('/') + url
	if  'uploadedFiles' in url:
		url = url.replace('investor.', '')
	if '/static-files/' in url:
		# Remove text between .com/ {and} /static-files/ 
		urlStart = url.split('/static-files/')[0]	
		trash = urlStart.split('.com')
		if len(trash)>1:
			trash = trash[1]
			url = url.replace(trash, '')
	if 'investors.html' in url:
		url = url.replace('investors.html', '')
	if not url.startswith('http://') and not url.startswith('https://'):
		return 'http://' + url#s
	# if url.startswith('/'): url = domain.rstrip('/') + url
	# if 'financial-reports/' in url: url = url.replace('financial-reports/', '')
	return url
# Get page content
def getTree(url, domain=False,driver=False):
	if driver != False:
		print('getting tree from selenium')
		try:
			driver.get(url) # add timeout
			tree = etree.HTML(driver.page_source)
			return tree
		except Exception as e:
			print('error getting tree from selenium', e)
			return None# None
	else:
		try:
			res = requests.get(url, timeout=6)
			response = res.content
			tree = etree.HTML(response)
			return tree
		except:
			
			print(' Following report/investor Page failed, ', url)
			if domain != False:
				url = addDomain(url, domain)
				print('affter adding domain url is: ', url)
				try:
					res = requests.get(url, timeout=6)
					response = res.content
					tree = etree.HTML(response)
					return tree
				except Exception as e:
					# f= open('failed_urls.txt', 'a')# f.write(url + '\n')
					print('Failed loading the page, skipping this url ', url, e)
					return None
			return None	
# Extract pdf links titles from a page html if available
def extract_title_pdf(pdf,aTag=False):
	# find title in the html
	if 'title' in pdf.attrib:
		return pdf.attrib['title']
	elif 'text' in pdf.attrib:
		if len(pdf.text)>5:
			return pdf.text
	elif len(pdf.xpath('descendant::text() | descendant::*/text()')) > 1:
		t = pdf.xpath('descendant::text() | descendant::*/text()')
		if type(t) == list:
			# t = [ ' '.join(x.extract()) for x in t ]
			t = ' '.join(t)
			return t
		return ' '.join(t.extract())
	else:
		return "no title"
# find all links to annual/sustainability pdfs
def extractPdfs(tree, removeDuplicates=True):
	# find all links to annual/sustainability pdfs using keywords in the url
	allPdfs = tree.xpath(' \
			//a[contains(@href, "pdf")] | //a[contains(@href, "PDF")] | \
			//a[contains(@type, "pdf")] | //a[contains(@href, "Pdf")] | \
			//a[contains(@type, "PDF")] | //a[contains(@type, "Pdf")] | \
			//a[contains(@href, "static-files")] | //a[contains(@text(), "report")] | \
			//a[contains(@href, "Report")]| //a[contains(@href, "report")] | \
			//a[contains(@href, "financial")] | //a[contains(@href, "Financial")] | \
			//a[contains(@href, "result")] | //a[contains(@href, "Result")] | \
			//a[contains(@href, "sustain")] | //a[contains(@href, "Sustain")] | \
			//a[contains(@href, "esg")] | //a[contains(@href, "ESG")] | \
			//a[contains(@href, "CRS")] | //a[contains(@href, "crs")] | \
			//a[contains(@href, "environment")] | //a[contains(@href, "Environment")] | \
			//a[contains(@href, "Social")] | //a[contains(@href, "social")] | \
			//a[text()[contains(., "esg")]] | //a[contains(@text(), "impact")] | \
			//a[contains(@href, "Q22")] | //a[contains(@href, "Impact")] | \
			//a[contains(@href,"press")] | //a[contains(@href,"Press")]')
	
	# Checking duplicate href attributes
	allPdfs = list(set(allPdfs))
	if removeDuplicates == True:
		pdfUrls = []
		uniquePdfs = []
		for pdf in allPdfs:
			pdfUrl = pdf.get('href')
			if pdfUrl not in pdfUrls \
				  and not pdfUrl.endswith('.html') \
				  and not pdfUrl.endswith('.aspx') \
				  and not pdfUrl.endswith('proxy') \
				  and not pdfUrl.endswith('/') \
				  and not pdfUrl.count('#') > 0:
				pdfUrls.append(pdf.get('href'))
				uniquePdfs.append(pdf) 
		# pdfUrls = [pdfUrl for pdfUrl in pdfUrls if pdfUrl.endswith('.pdf')]
		return uniquePdfs

	return allPdfs
def findAllPdfs(reportUrl, investorUrl,companyName,domainUrl,driver):
	if 'investor-relations' in investorUrl:
		investorUrl = investorUrl.replace('investor-relations', '') 
	
	# driver = webdriver.Chrome(ChromeDriverManager().install())
	tree = getTree(reportUrl, investorUrl,driver)
	if tree is not None:
		allPdfs = extractPdfs(tree)			
		allPdfLinks = [{ 								# or maybe domain
			'docUrl': convertReportPage(pdf.attrib['href'], investorUrl), 
			'title' : pdf.text if pdf.text is not None and pdf.text != '' or
					  len(pdf.xpath('descendant::text()')) < 1 
					  else pdf.xpath('descendant::text()')[0] ,
			'title2' : extract_title_pdf(pdf),
			'nakedUrl' : pdf.attrib['href'],
			'Company' : companyName,
			'Domain' : domainUrl,
			'pageUrl':reportUrl} for pdf in allPdfs if '.aspx' not in pdf.attrib['href']  ]
		return allPdfLinks
	else:
		# write url to a txt file
		f= open('outputs/failed/failed_urls.txt', 'a')
		f.write(reportUrl + '\n')
		return []

def crawlInvestorPage(investorUrl, domainUrl,companyName,existing_links,getLocalPdfs=True,getReportPages=True,driver=False): 
	localPdfs = []
	crawledPdfs = []
	
	if 'investor-relations' in investorUrl:
		investorUrl = investorUrl.replace('investor-relations', '') 
		
	investorTree = getTree(investorUrl,domainUrl, driver=driver)
	if investorTree is None:
		print('failed to getTree for input report page url(investorTree) line: 190')
		return [],[]
	if getLocalPdfs ==True: #and investorTree is not None:
		# findAllPdfs(reportUrl, investorUrl,companyName,domainUrl, driver=driver)
		investorPdfs = extractPdfs(investorTree)
		# if link is in outputs/master_workbook.csv, skip it
		if (len(investorPdfs) > 0):		
			localPdfs =  [{
		# localPdfs.append( [{
				'docUrl'  : convertReportPage(pdf.attrib['href'], investorUrl), 
				'title'   : pdf.text if pdf.text is not None and pdf.text != '' or
							len(pdf.xpath('descendant::text()')) < 1 
							else pdf.xpath('descendant::text()')[0],
				'title2' : extract_title_pdf(pdf),
				'nakedUrl' : pdf.attrib['href'],
				'Domain': domainUrl, 
				'Company': companyName,
				'pageUrl' : investorUrl,
				} for pdf in investorPdfs ] 
			
			# if len(localPdfs) > 0:
			localPdfs = [pdf for pdf in localPdfs if pdf['docUrl'] not in existing_links]

	seenReportUrls = []
	if getReportPages == True:
		print('Investor Url being crawled', investorUrl,domainUrl)
		
		# get all reports pages
		reportsUrl = investorTree.xpath(' \
				//a[contains(@href, "Report")]    | //a[contains(@href, "report")] | \
				//a[contains(@href, "financial")] | //a[contains(@href, "Reports")] | \
				//a[contains(@href, "sustain")] | //a[contains(@href, "annual")] | \
				//a[contains(@href, "governance")] | //a[contains(@href, "Governance")] | \
				//a[contains(@href, "Sustain")] | //a[contains(@href, "ESG")] | \
				//a[contains(@href, "esg")] 	 | //a[contains(@href, "CRS")] | \
				//a[contains(@href, "SUSTAINABILITY")] | //a[contains(@href, "Esg")] | \
				//a[contains(@href, "Quarter")] | //a[contains(@href, "2021")] ')
		
		# find all pdfs in each report page and append to resultPdfs
		for reportPage in reportsUrl:
			reportUrl = reportPage.attrib['href']
			if reportUrl in seenReportUrls or reportUrl in existing_links:
				continue
			print('found reports page : ', reportUrl)		
			seenReportUrls.append(reportUrl)
			reportUrl = addDomain(reportUrl,  investorUrl)
			print('found reports page after adding domain: ', reportUrl)	
			allPdfs2 = findAllPdfs(reportUrl, investorUrl,companyName,domainUrl, driver)
			# remove duplicate urls
			allPdfs2 = [pdf for pdf in allPdfs2 if pdf['docUrl'] not in existing_links]# # Duplicatecheck
			crawledPdfs.append(allPdfs2)

	return localPdfs, crawledPdfs

def crawlPdfs(dfRoadmap,existing_links):
	'''
	Main function to initiate crawling for a company
	'''
	cleanPipeline = pipelines.CrawlmasterPipeline()
	options = uc.ChromeOptions()
	options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36')
	driver = uc.Chrome(options=options, driver_executable_path=ChromeDriverManager().install())
	pdfDocuments = []
	cleanPdfs = []
	seenPdfUrls = []
	i = 0
	print(f'crawling {num_companies} companies')
	for index, row in dfRoadmap.head( int(num_companies) ).iterrows():
		companyName = row['Company']
		ticker = row['Ticker(s)']
		domain = row['Domain']
		annualUrl = row['Company annual reports page URL']
		sustUrl = row['Company sustainability / ESG reports page URL']
		globalUrl = row['Company global/main press - news release site URL']

		print(annualUrl,domain)
		k = -1
		for pageUrl in [annualUrl,sustUrl,globalUrl]:
			k += 1
			if pageUrl is None or pageUrl == 'not available':
				continue
			# if # company global/mainpress url is the target, allow crawling
			if k ==2: 
				start = time.time()
				crawlReports = crawl_press_release
				investorPdfs, crawledPdfs = crawlInvestorPage(pageUrl, domain, companyName, existing_links,getLocalPdfs=True, getReportPages=crawlReports,driver=driver)
				end = time.time()
				print('finished Company global/main press - news release site URL')
				print('time taken: ', end-start)
			else:
				start = time.time()
				crawlReports = crawl_annual_and_sustainability
				investorPdfs, crawledPdfs = crawlInvestorPage(pageUrl, domain, companyName, existing_links,getLocalPdfs=True, getReportPages=crawlReports,driver=driver)
				end = time.time()
				print('finished Company annual reports page or sustainability / ESG reports page URL')
				print('time taken: ', end-start)
			resultPdfs = investorPdfs + crawledPdfs
			# for row2 in resultPdfs:
			for pdf in resultPdfs:
				if pdf['docUrl'] in seenPdfUrls or pdf['docUrl'] in existing_links:
					continue
				seenPdfUrls.append(pdf['docUrl'])
				i = i + 1
				if pdf['title'] is None or len(pdf['title']) < 2:
					pdf['title'] = ""
				resultRow = {   'Report Url': pdf['pageUrl'],'Company': row['Company'] ,'docUrl' :pdf['docUrl'],
								'Document number': i,  'Document link': pdf['docUrl'] ,
								'title' :  pdf['title2'] , 'title2' : pdf['title'].strip('.pdf'),
								'nakedUrl' : pdf['nakedUrl'], 'Domain':domain, }
	
				pdfDocuments.append(resultRow)
				docNumber=i
				try:
					cleanPdf = cleanPipeline.process_item(resultRow,companyName,ticker,docNumber)
					if cleanPdf:
						cleanPdfs.append(cleanPdf)

				except Exception as e:
					print(traceback.format_exc(),'here')
					print('error 295: during cleaning pipeline',row['Domain'],pdf['docUrl'], e)
	# if cleanPdfs:
	# 	pd.DataFrame(cleanPdfs).to_csv(f'outputs/all_pdf_data.csv')
	return pd.DataFrame(pdfDocuments)


if __name__ == '__main__':
	
	if not os.path.exists('outputs/master_workbook.csv'):#,company,ticker,full_title,Page,full_text,emails,link
		existing_links = []
	else:
		master_df = pd.read_csv('outputs/master_workbook.csv')
		existing_links = master_df['link'].tolist()
  
	df = pd.read_csv('inputs/company-universe.csv').tail(500)
	start = time.time()
	df_all_pdfs = crawlPdfs(df,existing_links)
	end = time.time()
	print('time taken to crawl pdfs : ', end - start)
	
	# Drop duplicates from master_df column link
 	# master_df = pd.read_csv('outputs/master_workbook.csv')
	# master_df = master_df.drop_duplicates(subset=['link','Page'],)
 

	
	


# def crawlReportPagePdfs(investorTree, investorUrl):#seenReportUrls):
# 	'''
# 	Main function to get all report pages
# 	'''
# 	reportsUrl = investorTree.xpath(' \
# 		//a[contains(@href, "Report")]    | //a[contains(@href, "report")] | \
# 		//a[contains(@href, "financial")] | //a[contains(@href, "Reports")] | \
# 		//a[contains(@href, "sustain")] | //a[contains(@href, "annual")] | \
# 		//a[contains(@href, "governance")] | //a[contains(@href, "Governance")] | \
# 		//a[contains(@href, "Sustain")] | //a[contains(@href, "ESG")] | \
# 		//a[contains(@href, "esg")] 	 | //a[contains(@href, "CRS")] | \
# 		//a[contains(@href, "SUSTAINABILITY")] | //a[contains(@href, "Esg")] | \
# 		//a[contains(@href, "Quarter")] | //a[contains(@href, "2021")] ')
# 	# find all pdfs in each report page and append to resultPdfs
# 	for reportPage in reportsUrl:
# 		# Could check duplicates here
# 		reportUrl = reportPage.attrib['href']
# 		print('found reports page : ', reportUrl)			
# 		reportUrl = addDomain(reportUrl,  investorUrl)
# 		print('after addDomain : ', reportUrl)
# 		allPdfs2 = findAllPdfs(reportUrl, investorUrl)	
# 	# 
# 	return allPdfs2

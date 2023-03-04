import subprocess, os, time
import logging


# logging configuration
logging.basicConfig(filename='log_app.log',
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p',
                    level=logging.DEBUG)


py_list = ['Scraper-PDF/scrape_pdfs.py',
           #'Scraper-Gmail/Gmail PR scraper 1.0.py', 
		   'Scraping-cleaner/ScraperCleaner 1.3.py', 
		   'NLP/CompanyProcessing 2.6.py', 
           'Integrate & upload/Integrate 1.2.py']


if __name__=='__main__':
    logging.info('Start app')
    for py in py_list:
        os.chdir(py.split('/')[0])
        print('inside {}'.format(os.getcwd()))
        logging.info('Running script {}'.format(py.split('/')[1]))
        subprocess.call(['python', py.split('/')[1]])
        os.chdir('..')
    logging.info('End')

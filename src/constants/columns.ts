import { Prisma } from '@prisma/client'

const CompanyUniverse = {
  Company: 'Company',
  x: 'x',
  Member_of_the_S_P500: 'Member of the S&P500',
  Member_of_the_Russell_1000_Index: 'Member of the Russell 1000 Index',
  source: 'source',
  Scraping_code_set_up__: 'Scraping code set up ?',
  Ticker_s_: 'Ticker(s)',
  PR_Agency: 'PR Agency',
  Example_2020_company_PR_agency_press_release_URL:
    'Example 2020 company PR agency press release URL',
  Domain: 'Domain',
  Company_global_main_press___news_release_site_URL:
    'Company global/main press - news release site URL',
  Subscribed_to_press_releases_esgroadmap_gmail_com__:
    'Subscribed to press releases esgroadmap@gmail.com ?',
  Subscribed_to_press_releases_jameskijani_gmail_com__:
    'Subscribed to press releases jameskijani@gmail.com ?',
  Plain_text_press_release_subscription_possible___yes_no_:
    'Plain text press release subscription possible? (yes/no)',
  Company_annual_reports_page_URL: 'Company annual reports page URL',
  Company_annual_report_2020_URL_of_pdf_document__including_10_k_:
    'Company annual report 2020 URL of pdf document (including 10-k)',
  Company_sustainability___ESG_reports_page_URL:
    'Company sustainability / ESG reports page URL',
  Company_Sustainability___ESG_report_2020_URL_of_pdf_document:
    'Company Sustainability / ESG report 2020 URL of pdf document',
  Country: 'Country',
  NAICS__1: 'NAICS #1',
  NAICS_TITLE: '2017 NAICS TITLE',
  NAICS__2: 'NAICS #2',
  NAICS_TITLE_1: '2017 NAICS TITLE.1',
  NAICS__3: 'NAICS #3',
  NAICS_TITLE_2: '2017 NAICS TITLE.2',
  NAICS__4: 'NAICS #4',
  NAICS_TITLE_3: '2017 NAICS TITLE.3',
  NAICS__5: 'NAICS #5',
  NAICS_TITLE_4: '2017 NAICS TITLE.4',
  WORKED_BY_: 'WORKED BY:',
  COMMENTS___NOTES: 'COMMENTS / NOTES',
  Carbon_sentence_available__: 'Carbon sentence available ?',
} as const

const Percentage = {
  id: 'ID',
  KPI_Report_Date: 'KPI Report Date',
  Company: 'Company',
  Member_of_the_S_P500: 'Member of the S&P500',
  Member_of_the_Russell_1000_Index: 'Member of the Russell 1000 Index',
  Ticker_s_: 'Ticker(s)',
  PR_Agency: 'PR Agency',
  Example_2020_company_PR_agency_press_release_URL:
    'Example 2020 company PR agency press release URL',
  Company_Global___Main_Website_URL: 'Company Global / Main Website URL',
  Company_global_main_press___news_release_site_URL:
    'Company global/main press - news release site URL',
  Company_annual_reports_page_URL: 'Company annual reports page URL',
  Company_annual___financial_report_2020_URL_of_pdf_document:
    'Company annual / financial report 2020 URL of pdf document',
  Company_sustainability___ESG_reports_page_URL:
    'Company sustainability / ESG reports page URL',
  Company_Sustainability___ESG_report_2020_URL_of_pdf_document:
    'Company Sustainability / ESG report 2020 URL of pdf document',
  Country: 'Country',
  sector_code__1__NAICS_: 'sector code #1 (NAICS)',
  sector_name__1__NAICS_: 'sector name #1 (NAICS)',
  sector_code__2__NAICS_: 'sector code #2 (NAICS)',
  sector_name__2__NAICS_: 'sector name #2 (NAICS)',
  sector_code__3__NAICS_: 'sector code #3 (NAICS)',
  sector_name__3__NAICS_: 'sector name #3 (NAICS)',
  sector_code__4__NAICS_: 'sector code #4 (NAICS)',
  sector_name__4__NAICS_: 'sector name #4 (NAICS)',
  sector_code__5__NAICS_: 'sector code #5 (NAICS)',
  sector_name__5__NAICS_: 'sector name #5 (NAICS)',
  sector_codes_all__NAICS_: 'sector codes all (NAICS)',
  sector_name_all__NAICS_: 'sector name all (NAICS)',
  climateaction100: 'climateaction100',
  emails: 'emails',
  full_text: 'full_text',
  Source_link: 'Source link',
  pr_site: 'pr_site',
  release_date: 'release_date',
  source: 'source',
  ticker: 'ticker',
  title: 'title',
  ArticleTargetYear: 'ArticleTargetYear',
  PressReleaseFullCleanstep1: 'PressReleaseFullCleanstep1',
  PressReleaseFullClean: 'PressReleaseFullClean',
  Source_Date: 'Source Date',
  Annual_Report_Date: 'Annual Report Date',
  PressReleaseYear: 'PressReleaseYear',
  PressReleaseMonth: 'PressReleaseMonth',
  Target_sentence: 'Target sentence',
  SentenceTargetYear: 'SentenceTargetYear',
  Targetyear_s_: 'Targetyear(s)',
  sentence_carbon: 'sentence-carbon',
  sentence_gender: 'sentence-gender',
  sentence_renewables: 'sentence-renewables',
  sentence_suppliers: 'sentence-suppliers',
  sentence_water: 'sentence-water',
  sentence_waste: 'sentence-waste',
  sentence_other: 'sentence-other',
} as const

const UniqueFactor = {
  id: 'ID',
  KPI_Report_Date: 'KPI Report Date',
  Company__NON_NULL_Total_: 'Company (NON-NULL Total)',
  Company__NON_NULL_Unique_: 'Company (NON-NULL Unique)',
  Member_of_the_S_P500__YES_Total_: 'Member of the S&P500 (YES Total)',
  Member_of_the_Russell_1000_Index__YES_Total_:
    'Member of the Russell 1000 Index (YES Total)',
  Ticker_s___NON_NULL_Total_: 'Ticker(s) (NON-NULL Total)',
  Ticker_s___NON_NULL_Unique_: 'Ticker(s) (NON-NULL Unique)',
  Country__NON_NULL_Total_: 'Country (NON-NULL Total)',
  Country__NON_NULL_Unique_: 'Country (NON-NULL Unique)',
  sector_code__1__NAICS___NON_NULL_Unique_:
    'sector code #1 (NAICS) (NON-NULL Unique)',
  sector_code__2__NAICS___NON_NULL_Unique_:
    'sector code #2 (NAICS) (NON-NULL Unique)',
  sector_code__3__NAICS___NON_NULL_Unique_:
    'sector code #3 (NAICS) (NON-NULL Unique)',
  sector_code__4__NAICS___NON_NULL_Unique_:
    'sector code #4 (NAICS) (NON-NULL Unique)',
  sector_code__5__NAICS___NON_NULL_Unique_:
    'sector code #5 (NAICS) (NON-NULL Unique)',
  sector_codes_all__NAICS___NON_NULL_Unique_:
    'sector codes all (NAICS) (NON-NULL Unique)',
  ArticleTargetYear__NON_NULL_Unique_: 'ArticleTargetYear (NON-NULL Unique)',
  Source_Date__NON_NULL_Unique_: 'Source Date (NON-NULL Unique)',
  PressReleaseYear__NON_NULL_Unique_: 'PressReleaseYear (NON-NULL Unique)',
  Target_sentence__NON_NULL_Total_: 'Target sentence (NON-NULL Total)',
  Target_sentence__NON_NULL_Unique_: 'Target sentence (NON-NULL Unique)',
  Targetyear_s___NON_NULL_Unique_: 'Targetyear(s) (NON-NULL Unique)',
  sentence_carbon__1_Total_: 'sentence-carbon (1 Total)',
  sentence_gender__1_Total_: 'sentence-gender (1 Total)',
  sentence_renewables__1_Total_: 'sentence-renewables (1 Total)',
  sentence_suppliers__1_Total_: 'sentence-suppliers (1 Total)',
  sentence_water__1_Total_: 'sentence-water (1 Total)',
  sentence_waste__1_Total_: 'sentence-waste (1 Total)',
  sentence_other__1_Total_: 'sentence-other (1 Total)',
} as const

const RoadmapCarbon = {
  Company: 'Company',
  Ticker_s_: 'Ticker(s)',
  PR_Agency: 'PR Agency',
  Company_Main_Website_URL: 'Company Main Website URL',
  Company_Source_site_URL: 'Company Source site URL',
  Country: 'Country',
  sector_code__1__NAICS_: 'sector code #1 (NAICS)',
  sector_name__1__NAICS_: 'sector name #1 (NAICS)',
  sector_code__2__NAICS_: 'sector code #2 (NAICS)',
  sector_name__2__NAICS_: 'sector name #2 (NAICS)',
  sector_code__3__NAICS_: 'sector code #3 (NAICS)',
  sector_name__3__NAICS_: 'sector name #3 (NAICS)',
  sector_code__4__NAICS_: 'sector code #4 (NAICS)',
  sector_name__4__NAICS_: 'sector name #4 (NAICS)',
  sector_code__5__NAICS_: 'sector code #5 (NAICS)',
  sector_name__5__NAICS_: 'sector name #5 (NAICS)',
  S_P500member: 'S&P500member',
  Russell_1000_member: 'Russell 1000 member',
  Source_link_1: 'Source link 1',
  Source_date_1: 'Source date 1',
  Source_sentence_1: 'Source sentence 1',
  Targetyear_s__1: 'Targetyear(s) 1',
  Source_link_2: 'Source link 2',
  Source_date_2: 'Source date 2',
  Source_sentence_2: 'Source sentence 2',
  Targetyear_s__2: 'Targetyear(s) 2',
  Source_link_3: 'Source link 3',
  Source_date_3: 'Source date 3',
  Source_sentence_3: 'Source sentence 3',
  Targetyear_s__3: 'Targetyear(s) 3',
  Source_link_4: 'Source link 4',
  Source_date_4: 'Source date 4',
  Source_sentence_4: 'Source sentence 4',
  Targetyear_s__4: 'Targetyear(s) 4',
  Source_link_5: 'Source link 5',
  Source_date_5: 'Source date 5',
  Source_sentence_5: 'Source sentence 5',
  Targetyear_s__5: 'Targetyear(s) 5',
  Source_link_6: 'Source link 6',
  Source_date_6: 'Source date 6',
  Source_sentence_6: 'Source sentence 6',
  Targetyear_s__6: 'Targetyear(s) 6',
  id: 'ID',
} as const


const SentenceAll = {
  release_date: 'release_date',
  Targetyear_s_: 'Targetyear(s)',
  pr_site: 'pr_site',
  ArticleTargetYear: 'ArticleTargetYear',
  sentence_carbon: 'sentence-carbon',
  full_text: 'full_text',
  PressReleaseMonth: 'PressReleaseMonth',
  PressReleaseFullClean: 'PressReleaseFullClean',
  sentence_renewables: 'sentence-renewables',
  sentence_suppliers: 'sentence-suppliers',
  sentence_gender: 'sentence-gender',
  Company: 'Company',
  Annual_Report_Date: 'Annual Report Date',
  title: 'title',
  emails: 'emails',
  sentence_other: 'sentence-other',
  Source_link: 'Source link',
  Source_Date: 'Source Date',
  PressReleaseFullCleanstep1: 'PressReleaseFullCleanstep1',
  sentence_waste: 'sentence-waste',
  source: 'source',
  sentence_water: 'sentence-water',
  PressReleaseYear: 'PressReleaseYear',
  ticker: 'ticker',
  SentenceTargetYear: 'SentenceTargetYear',
  Target_sentence: 'Target sentence',
  upload_date: 'upload_date',
  id: 'ID',
  PageURL: 'PageURL',
  DocURL: 'DocURL',
  DocTitle: 'DocTitle',
  DocName: 'DocName',
  Target_Sentence_Page: 'Target Sentence Page',
} as const

const CompanyData2 = {
  company: 'Company',
  Member_of_the_S_P500: 'Member of the S&P500',
  Member_of_the_Russell_1000_Index: 'Member of the Russell 1000 Index',
  Ticker_s_: 'Ticker(s)', 
  PR_Agency: 'PR Agency',
  Example_2020_company_PR_agency_press_release_URL: 'Example 2020 company PR agency press release URL',
  Company_Global___Main_Website_URL: 'Company Global / Main Website URL',
  Company_global_main_press___news_release_site_URL: 'Company global/main press - news release site URL',
  Company_annual_reports_page_URL: 'Company annual reports page URL',
  Company_annual___financial_report_2020_URL_of_pdf_document: 'Company annual / financial report 2020 URL of pdf document',
  Company_sustainability___ESG_reports_page_URL: 'Company sustainability / ESG reports page URL',
  Company_Sustainability___ESG_report_2020_URL_of_pdf_document: 'Company Sustainability / ESG report 2020 URL of pdf document',
  Country: 'Country',
  sector_code__1__NAICS_: 'sector code #1 (NAICS)',
  sector_name__1__NAICS_: 'sector name #1 (NAICS)',
  sector_code__2__NAICS_: 'sector code #2 (NAICS)',
  sector_name__2__NAICS_: 'sector name #2 (NAICS)',
  sector_code__3__NAICS_: 'sector code #3 (NAICS)',
  sector_name__3__NAICS_: 'sector name #3 (NAICS)',
  sector_code__4__NAICS_: 'sector code #4 (NAICS)',
  sector_name__4__NAICS_: 'sector name #4 (NAICS)',
  sector_code__5__NAICS_: 'sector code #5 (NAICS)',
  sector_name__5__NAICS_: 'sector name #5 (NAICS)',
  sector_codes_all__NAICS_: 'sector codes all (NAICS)',
  sector_name_all__NAICS_: 'sector name all (NAICS)',
  NAICS__1_GIG: 'NAICS #1 GIG',
  NAICS__1_GIG_name: 'NAICS #1 GIG name',
  id: 'ID',
} as const


const CompanyData = {
  company: 'Company',
  Member_of_the_S_P500: 'Member of the S&P500',
  Member_of_the_Russell_1000_Index: 'Member of the Russell 1000 Index',
  Ticker_s_: 'Ticker(s)',
  PR_Agency: 'PR Agency',
  Example_2020_company_PR_agency_press_release_URL:
    'Example 2020 company PR agency press release URL',
  Company_Global___Main_Website_URL: 'Company Global / Main Website URL',
  Company_global_main_press___news_release_site_URL:
    'Company global/main press - news release site URL',
  Company_annual_reports_page_URL: 'Company annual reports page URL',
  Company_annual___financial_report_2020_URL_of_pdf_document:
    'Company annual / financial report 2020 URL of pdf document',
  Company_sustainability___ESG_reports_page_URL:
    'Company sustainability / ESG reports page URL',
  Company_Sustainability___ESG_report_2020_URL_of_pdf_document:
    'Company Sustainability / ESG report 2020 URL of pdf document',
  Country: 'Country',
  sector_code__1__NAICS_: 'sector code #1 (NAICS)',
  sector_name__1__NAICS_: 'sector name #1 (NAICS)',
  sector_code__2__NAICS_: 'sector code #2 (NAICS)',
  sector_name__2__NAICS_: 'sector name #2 (NAICS)',
  sector_code__3__NAICS_: 'sector code #3 (NAICS)',
  sector_name__3__NAICS_: 'sector name #3 (NAICS)',
  sector_code__4__NAICS_: 'sector code #4 (NAICS)',
  sector_name__4__NAICS_: 'sector name #4 (NAICS)',
  sector_code__5__NAICS_: 'sector code #5 (NAICS)',
  sector_name__5__NAICS_: 'sector name #5 (NAICS)',
  sector_codes_all__NAICS_: 'sector codes all (NAICS)',
  sector_name_all__NAICS_: 'sector name all (NAICS)',
  id: 'ID',
} as const

const TargetSentence = {
  Company: 'Company',
  companylist: 'companylist',
  Ticker_s_: 'Ticker(s)',
  PR_Agency: 'PR Agency',
  Example_2020_company_PR_agency_press_release_URL:
    'Example 2020 company PR agency press release URL',
  Company_Main_Website_URL: 'Company Main Website URL',
  Company_press_release_site_URL: 'Company press release site URL',
  Country: 'Country',
  sector_code__1__NAICS_: 'sector code #1 (NAICS)',
  sector_name__1__NAICS_: 'sector name #1 (NAICS)',
  sector_code__2__NAICS_: 'sector code #2 (NAICS)',
  sector_name__2__NAICS_: 'sector name #2 (NAICS)',
  sector_code__3__NAICS_: 'sector code #3 (NAICS)',
  sector_name__3__NAICS_: 'sector name #3 (NAICS)',
  sector_code__4__NAICS_: 'sector code #4 (NAICS)',
  sector_name__4__NAICS_: 'sector name #4 (NAICS)',
  sector_code__5__NAICS_: 'sector code #5 (NAICS)',
  sector_name__5__NAICS_: 'sector name #5 (NAICS)',
  S_P500member: 'S&P500member',
  Russell_1000_member: 'Russell 1000 member',
  emails: 'emails',
  full_text: 'full_text',
  Source_link: 'Source link',
  pr_site: 'pr_site',
  release_date: 'release_date',
  source: 'source',
  ticker: 'ticker',
  title: 'title',
  ArticleTargetYear: 'ArticleTargetYear',
  PressReleaseFullCleanstep1: 'PressReleaseFullCleanstep1',
  PressReleaseFullClean: 'PressReleaseFullClean',
  Source_date: 'Source date',
  PressReleaseYear: 'PressReleaseYear',
  PressReleaseMonth: 'PressReleaseMonth',
  Target_sentence: 'Target sentence',
  SentenceTargetYear: 'SentenceTargetYear',
  Targetyear_s_: 'Targetyear(s)',
  sentence_carbon: 'sentence-carbon',
  sentence_gender: 'sentence-gender',
  sentence_renewables: 'sentence-renewables',
  sentence_suppliers: 'sentence-suppliers', 
  sentence_water: 'sentence-water',
  Primarysource: 'Primarysource',
  id: 'ID',
} as const


// id                                                String  @id @default("") @db.VarChar(11)
// Company                                           String? @db.MediumText
// emails                                            String? @db.MediumText
// full_text                                         String? @db.MediumText
// Source_link                                       String? @map("Source link") @db.MediumText
// pr_site                                           String? @db.MediumText
// release_date                                      String? @db.MediumText
// source                                            String? @db.MediumText
// ticker                                            String? @db.MediumText
// title                                             String? @db.MediumText
// ArticleTargetYear                                 String? @db.MediumText
// PressReleaseFullCleanstep1                        String? @db.MediumText
// PressReleaseFullClean                             String? @db.MediumText
// Source_Date                                       String? @map("Source Date") @db.MediumText
// Annual_Report_Date                                String? @map("Annual Report Date") @db.MediumText
// PressReleaseYear                                  String? @db.MediumText
// PressReleaseMonth                                 String? @db.MediumText
// Target_sentence                                   String? @map("Target sentence") @db.MediumText
// SentenceTargetYear                                String? @db.MediumText
// Targetyear_s_                                     String? @map("Targetyear(s)") @db.MediumText
// sentence_carbon                                   String? @map("sentence-carbon") @db.VarChar(20)
// sentence_gender                                   String? @map("sentence-gender") @db.VarChar(20)
// sentence_renewables                               String? @map("sentence-renewables") @db.VarChar(20)
// sentence_suppliers                                String? @map("sentence-suppliers") @db.VarChar(20)
// sentence_water                                    String? @map("sentence-water") @db.VarChar(20)
// sentence_waste                                    String? @map("sentence-waste") @db.VarChar(20)
// sentence_other                                    String? @map("sentence-other") @db.VarChar(20)
// Member_of_the_S_P500                              String? @map("Member of the S&P500") @db.VarChar(255)
// Member_of_the_Russell_1000_Index                  String? @map("Member of the Russell 1000 Index") @db.VarChar(255)
// Ticker_s_                                         String? @map("Ticker(s)") @db.VarChar(255)
// PR_Agency                                         String? @map("PR Agency") @db.VarChar(255)
// Company_global_main_press___news_release_site_URL String? @map("Company global/main press - news release site URL") @db.MediumText
// Company_annual_reports_page_URL                   String? @map("Company annual reports page URL") @db.MediumText
// Company_sustainability___ESG_reports_page_URL     String? @map("Company sustainability / ESG reports page URL") @db.MediumText
// Country                                           String? @db.VarChar(255)
// sector_code__1__NAICS_                            String? @map("sector code #1 (NAICS)") @db.VarChar(10)
// sector_name__1__NAICS_                            String? @map("sector name #1 (NAICS)") @db.VarChar(255)
// sector_code__2__NAICS_                            String? @map("sector code #2 (NAICS)") @db.VarChar(10)
// sector_name__2__NAICS_                            String? @map("sector name #2 (NAICS)") @db.VarChar(255)
// sector_code__3__NAICS_                            String? @map("sector code #3 (NAICS)") @db.VarChar(10)
// sector_name__3__NAICS_                            String? @map("sector name #3 (NAICS)") @db.VarChar(255)
// sector_code__4__NAICS_                            String? @map("sector code #4 (NAICS)") @db.VarChar(10)
// sector_name__4__NAICS_                            String? @map("sector name #4 (NAICS)") @db.VarChar(255)
// sector_code__5__NAICS_                            String? @map("sector code #5 (NAICS)") @db.VarChar(10)
// sector_name__5__NAICS_                            String? @map("sector name #5 (NAICS)") @db.VarChar(255)
// upload_date                                       String? @map("upload-date") @db.MediumText


const TargetSentenceView = {
  id: "ID",
  Company: "Company",
  Target_sentence: "Target Sentence",
  SentenceTargetYear: "Target Year(s)",
  DocURL: "DocURL",
  Country: "Country",
  sector_name__1__NAICS_: "sector name #1 (NAICS)",
  sector_code__1__NAICS_: "sector code #1 (NAICS)",
  upload_date: "Upload Date",
} as const


const columns = {
  CompanyUniverse,
  Percentage,
  UniqueFactor,
  RoadmapCarbon,
  SentenceAll,
  CompanyData2,
  CompanyData,
  TargetSentence,
  TargetSentenceView,
}

export default columns

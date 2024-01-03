import pandas
import pymysql
from sqlalchemy import create_engine
df=pd.read_csv("")
df['sentence-carbon'] = np.where(df.PressReleaseFullSentence.str.contains("climate|carbon|co2|emissions"), True, False)

df['sentence-gender'] = np.where(df.PressReleaseFullSentence.str.contains("gender|female"), True, False)

df['sentence-renewables'] = np.where(df.PressReleaseFullSentence.str.contains("renewables|wind|solar|renewable|energy"), True, False)

df['sentence-suppliers'] = np.where(df.PressReleaseFullSentence.str.contains("scope 3|supply chain|suppliers"), True, False)

df['sentence-water'] = np.where(df.PressReleaseFullSentence.str.contains("water|h20|freshwater"), True, False)

df['sentence-waste'] = np.where(df.PressReleaseFullSentence.str.contains("waste|landfill|recycling"), True, False)

#Captures any sustainability (or other forward looking) goal not captured in keyword categories above. ensure for any new category that it is added to the and condition

def other_theme (row):
    if row['sentence-carbon'] == False and row['sentence-gender'] == False and row['sentence-renewables'] == False and row['sentence-suppliers'] == False and row['sentence-water'] == False and row['sentence-waste'] == False:
        return 'True'
    return 'False'

df['sentence-other'] = df.apply (lambda row: other_theme(row), axis=1)
df['upload-date'] = pd.to_datetime('today').normalize()

bname="esgroadmap"
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

print("SQL COnnection")
query = "SELECT * FROM `sentence-all`;"
#query = "SELECT Source link FROM `sentence-all`;"
print("Here")
df_R = pd.read_sql_query(query, cnx)
print("Here")
print("SQL DB:")
print(df_R)
df_R.to_csv("oct-db-2023.csv")

df = pd.read_csv(f'testdb.csv')
print(len(df3))
df=df[~df['Target sentence'].isin(df_R['Target sentence'])]
#df = df.drop(['Page','Sentence-text-targetyear'], axis=1)
df=df.drop_duplicates(subset=['Target sentence'])

print(len(df))

engine = create_engine("mysql+pymysql://{user}:{pw}@{host}/{db}"
				.format(host=hostname, db=dbname, user=uname, pw=pwd))

# Current setting is to replace entire targetsentence table with data. Can consider in future to 'append' in the future

logging.info('Starting all sentence upload')
print('Starting all sentence upload')

df.to_sql('sentence-all', engine, index=False, if_exists='append')

# No more thematic tables (eg. with only carbon sentences). These all are now created as views from the main 'sentence-all' MySQL database. This saves disk space
# MySql code example: CREATE view sentencewaterview as SELECT * from `sentence-all` where `sentence-water`=1

logging.info("All done")

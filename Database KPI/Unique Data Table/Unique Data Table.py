import mysql.connector
import csv
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
import csv
from datetime import date


# Connect to the database
connection = mysql.connector.connect(
    host='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com',
    user='admin',
    password='hassanarshad1122',
    database='esgroadmap')
cursor = connection.cursor()

def get_column_totals():
    cursor = connection.cursor()
    columns = ['Company', 'Member of the S&P500', 'Member of the Russell 1000 Index', 'Ticker(s)', 'Country',
               'sector code #1 (NAICS)', 'sector code #2 (NAICS)', 'sector code #3 (NAICS)', 'sector code #4 (NAICS)', 'sector code #5 (NAICS)', 
               'sector codes all (NAICS)', 'ArticleTargetYear', 'Source Date', 'PressReleaseYear', 'Target sentence', 'Targetyear(s)', 
               'sentence-carbon', 'sentence-gender', 'sentence-renewables', 'sentence-suppliers', 
               'sentence-water', 'sentence-waste', 'sentence-other']


    # Create a dictionary to store the totals
    
    totals = {}

    for column_name in columns:

        # Check data type of the column
        cursor.execute(f"SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sentenceallview' AND COLUMN_NAME = '{column_name}'")
        data_type = cursor.fetchone()[0]

        if data_type == b'tinyint':
            # Calculate the total number of '1' values
            query_total_1 = f"SELECT COUNT(*) FROM `sentenceallview` WHERE `{column_name}` = 1"
            cursor.execute(query_total_1)
            total_1 = cursor.fetchone()[0]
            totals[f"{column_name} (1 Total)"] = total_1

            # Calculate the number of unique '1' values
            query_unique_1 = f"SELECT COUNT(DISTINCT `{column_name}`) FROM `sentenceallview` WHERE `{column_name}` = 1"
            cursor.execute(query_unique_1)
            unique_1 = cursor.fetchone()[0]
            totals[f"{column_name} (1 Unique)"] = unique_1
        elif column_name in ['Member of the S&P500', 'Member of the Russell 1000 Index']:
            # Calculate the total number of 'yes' values
            query_total_yes = f"SELECT COUNT(CASE WHEN `{column_name}` = 'yes' THEN 1 END) FROM `sentenceallview`"
            cursor.execute(query_total_yes)
            total_yes = cursor.fetchone()[0]
            totals[f"{column_name} (YES Total)"] = total_yes

            # Calculate the number of unique 'yes' values
            query_unique_yes = f"SELECT COUNT(DISTINCT `{column_name}`) FROM `sentenceallview` WHERE `{column_name}` = 'yes'"
            cursor.execute(query_unique_yes)
            unique_yes = cursor.fetchone()[0]
            totals[f"{column_name} (YES Unique)"] = unique_yes
        else:
            # Calculate the total number of non-null values
            query_total_non_null = f"SELECT COUNT(CASE WHEN `{column_name}` IS NOT NULL THEN 1 END) FROM `sentenceallview`"
            cursor.execute(query_total_non_null)
            total_non_null = cursor.fetchone()[0]
            totals[f"{column_name} (NON-NULL Total)"] = total_non_null

            # Calculate the number of unique non-null values
            query_unique_non_null = f"SELECT COUNT(DISTINCT `{column_name}`) FROM `sentenceallview` WHERE `{column_name}` IS NOT NULL"
            cursor.execute(query_unique_non_null)
            unique_non_null = cursor.fetchone()[0]
            totals[f"{column_name} (NON-NULL Unique)"] = unique_non_null

    return totals

    
totals = get_column_totals()

column_names = ['Company (NON-NULL Total)', 'Company (NON-NULL Unique)', 'Member of the S&P500 (YES Total)', 'Member of the Russell 1000 Index (YES Total)', 'Ticker(s) (NON-NULL Total)', 'Ticker(s) (NON-NULL Unique)', 'Country (NON-NULL Total)', 'Country (NON-NULL Unique)', 'sector code #1 (NAICS) (NON-NULL Unique)', 'sector code #2 (NAICS) (NON-NULL Unique)', 'sector code #3 (NAICS) (NON-NULL Unique)', 'sector code #4 (NAICS) (NON-NULL Unique)', 'sector code #5 (NAICS) (NON-NULL Unique)', 'sector codes all (NAICS) (NON-NULL Unique)', 'ArticleTargetYear (NON-NULL Unique)', 'Source Date (NON-NULL Unique)', 'PressReleaseYear (NON-NULL Unique)', 'Target sentence (NON-NULL Total)', 'Target sentence (NON-NULL Unique)', 'Targetyear(s) (NON-NULL Unique)', 'sentence-carbon (1 Total)', 'sentence-gender (1 Total)', 'sentence-renewables (1 Total)', 'sentence-suppliers (1 Total)', 'sentence-water (1 Total)', 'sentence-waste (1 Total)', 'sentence-other (1 Total)']
# The name of the CSV file to write to
# Example usage

now = datetime.now().strftime("%y-%m-%d %H:%M:%S")

# Write the totals to a CSV file
filename = 'Updated__Factors_Unique_&_Totals.csv'

# Open the CSV file in "append" mode
with open(filename, mode='a', newline='') as f:
    # Create a CSV writer object
    writer = csv.writer(f)
    
    # Write the header row if the file is empty
    if f.tell() == 0:
        writer.writerow(['KPI Report Date'] + column_names)
    
    # Write the data row
    data_row = [current_time.strftime('%Y-%m-%d %H:%M:%S')] + [totals.get(col, '') for col in column_names]
    writer.writerow(data_row)


connection = mysql.connector.connect(
    host='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com',
    user='admin',
    password='hassanarshad1122',
    database='esgroadmap'
)

# Get a cursor to execute SQL queries
cursor = connection.cursor()

# Read the CSV file and extract the required values
with open(filename, 'r') as file:
    reader = csv.reader(file)
    # Assuming the first row of the CSV file contains the column names
    column_names = next(reader)
    # Assuming the second row of the CSV file contains the values for the current date
    current_date_values = next(reader)
    # Set the current date to today's date
    current_date = date.today().strftime('%Y-%m-%d')
    # Assuming the KPI values start from the second column of the CSV file
    kpi_values = current_date_values[1:]

# Create the table if it does not exist
table_name = "Unique_Factors_Table"
create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} (`KPI Report Date` DATE NOT NULL"
for column_name in column_names[1:]:
    create_table_query += f", `{column_name}` VARCHAR(10)"
create_table_query += ")"
try:
    cursor.execute(create_table_query)
    while cursor.nextset():
        pass
except mysql.connector.Error as err:
    print(f"Error while creating table: {err}")

# Insert the totals into the table
insert_query = f"INSERT INTO {table_name} (`KPI Report Date`"
for column_name in column_names[1:]:
    insert_query += f", `{column_name}`"
insert_query += ") VALUES (%s"
for i in range(len(kpi_values)):
    insert_query += ", %s"
insert_query += ")"
values = [current_date] + kpi_values
try:
    cursor.execute(insert_query, values)
    connection.commit()
    while cursor.nextset():
        pass
    print("Data inserted successfully!")
except mysql.connector.Error as err:
    print(f"Error while inserting data: {err}")

# Close the database connection
connection.close()

# Send the email with the CSV file as attachment
msg = MIMEMultipart()
msg['From'] = 'ESGroadmaphosting@gmail.com'
msg['To'] = 'info@esgroadmap.com'
msg['Subject'] = 'KPI Data Table'
body = 'Please find attached the Unique KPI data table for today.'
msg.attach(MIMEText(body, 'plain'))

with open(filename, 'rb') as csvfile:
    attachment = MIMEApplication(csvfile.read(), _subtype='csv')
    attachment.add_header('Content-Disposition', 'attachment', filename=filename)
    msg.attach(attachment)

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('ESGroadmaphosting@gmail.com', 'bhvmcklhorbyvnbk')
text = msg.as_string()
server.sendmail('ESGroadmaphosting@gmail.com', 'info@esgroadmap.com', text)
server.quit()


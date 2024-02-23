import mysql.connector
import csv
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os

# Connect to the database
connection = mysql.connector.connect(
    host='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com',
    user='admin',
    password='hassanarshad1122',
    database='esgroadmap')

cursor = connection.cursor()
cursor.execute("DESCRIBE `sentenceallview`")
columns = [row[0] for row in cursor.fetchall()]

# Get a list of column names
def get_column_percentages():
    cursor = connection.cursor()
    cursor.execute("DESCRIBE `sentenceallview`")
    columns = [row[0] for row in cursor.fetchall()]

    # Create a dictionary to store the percentages
    percentages = {}

    for column_name in columns:
        
        # Check data type of the column
        cursor.execute(f"SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sentenceallview' AND COLUMN_NAME = '{column_name}'")
        data_type = cursor.fetchone()[0]

        if data_type == b'tinyint':
            # Calculate the percentage of '1' values
            query_percentage_1 = f"SELECT (COUNT(*) * 100) / (SELECT COUNT(*) FROM `sentenceallview` WHERE `{column_name}` IS NOT NULL) AS percentage FROM `sentenceallview` WHERE `{column_name}` = 1"
            cursor.execute(query_percentage_1)
            percentage_1 = cursor.fetchone()[0]
            percentages[f"{column_name} (1 %)"] = f"{percentage_1:.2f}%"
        elif column_name in ['Member of the S&P500', 'Member of the Russell 1000 Index']:
            # Calculate the percentage of 'yes' or 'true' values
            query_percentage_yes = f"SELECT (COUNT(CASE WHEN `{column_name}` = 'yes' THEN 1 END) * 100) / COUNT(CASE WHEN `{column_name}` IS NOT NULL THEN 1 END) AS percentage FROM `sentenceallview`"
            cursor.execute(query_percentage_yes)
            percentage_yes = cursor.fetchone()[0]
            percentages[f"{column_name} (YES %)"] = f"{percentage_yes:.2f}%"
        elif column_name in [ 'climateaction100']:
            # Calculate the percentage of 'yes' or 'true' values
            query_percentage_yes = f"SELECT (COUNT(CASE WHEN `{column_name}` = 'TRUE' THEN 1 END) * 100) / COUNT(CASE WHEN `{column_name}` IS NOT NULL THEN 1 END) AS percentage FROM `sentenceallview`"
            cursor.execute(query_percentage_yes)
            percentage_yes = cursor.fetchone()[0]
            percentages[f"{column_name} (TRUE %)"] = f"{percentage_yes:.2f}%"
        else:
            # Calculate the percentage of non-null values
            query_percentage_non_null = f"SELECT (COUNT(CASE WHEN `{column_name}` IS NOT NULL THEN 1 END) * 100) / COUNT(*) AS percentage FROM `sentenceallview`"
            cursor.execute(query_percentage_non_null)
            percentage_non_null = cursor.fetchone()[0]
            percentages[f"{column_name} (NON-NULL %)"] = f"{percentage_non_null:.2f}%"

   

    return percentages

# Example usage
percentages = get_column_percentages()
print(percentages)


now = datetime.now().strftime("%y-%m-%d %H:%M:%S")

# Write the percentages to a CSV file
filename = 'Updated__Factors_&_Percentage.csv'
if not os.path.exists(filename):
    # If the file does not exist, write the header row
    with open(filename, mode='w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['KPI Report Date'] + list(percentages.keys()))

with open(filename, mode='a', newline='') as csvfile:
    # Write the percentages row
    writer = csv.writer(csvfile)
    writer.writerow([now] + list(percentages.values()))


# Create the table if it does not exist
table_name = "percentage_table"
create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} (`KPI Report Date` DATE NOT NULL"
for column_name in columns:
    create_table_query += f", `{column_name}` VARCHAR(10)"
create_table_query += ")"
try:
    cursor.execute(create_table_query)
    while cursor.nextset():
        pass
except mysql.connector.Error as err:
    print(f"Error while creating table: {err}")

# Insert the percentages into the table
insert_query = f"INSERT INTO {table_name} (`KPI Report Date`"
for column_name in columns:
    insert_query += f", `{column_name}`"
insert_query += ") VALUES (%s"
for i in range(len(columns)):
    insert_query += ", %s"
insert_query += ")"
values = [now] + list(percentages.values())
try:
    cursor.execute(insert_query, values)
    connection.commit()
    while cursor.nextset():
        pass
except mysql.connector.Error as err:
    print(f"Error while inserting data: {err}")



# Close the cursor and connection
cursor.close()
connection.close()

# Send the email with the CSV file as attachment
msg = MIMEMultipart()
msg['From'] = 'ESGroadmaphosting@gmail.com'
msg['To'] = 'info@esgroadmap.com'
msg['Subject'] = 'KPI Data Table'
body = 'Please find attached the KPI data table for today.'
msg.attach(MIMEText(body, 'plain'))

with open(filename, 'rb') as csvfile:
    attachment = MIMEApplication(csvfile.read(), _subtype='csv')
    attachment.add_header('Content-Disposition', 'attachment', filename=filename)
    msg.attach(attachment)

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('ESGroadmaphosting@gmail.com', 'bhvmcklhorbyvnbk')
text = msg.as_string()
print(text)
server.sendmail('ESGroadmaphosting@gmail.com', 'info@esgroadmap.com', text)
server.quit()
print("here")

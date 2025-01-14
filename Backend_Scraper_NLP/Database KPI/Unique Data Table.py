import os
import csv
import smtplib
import logging
from datetime import date, datetime

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

import pymysql


def get_column_totals(cursor, log):
    """
    Function to add columns to sentencesall View for further processing
    @param cursor: PyMYSQL cursor object (Object)
    @param log: Logger Object (Object)

    @return totals: Totals associated with columns (dict)
    """
    try:
        columns = [
            "Company",
            "Member of the S&P500",
            "Member of the Russell 1000 Index",
            "Ticker(s)",
            "Country",
            "sector code #1 (NAICS)",
            "sector code #2 (NAICS)",
            "sector code #3 (NAICS)",
            "sector code #4 (NAICS)",
            "sector code #5 (NAICS)",
            "ArticleTargetYear",
            "Source Date",
            "PressReleaseYear",
            "Target sentence",
            "Targetyear(s)",
            "sentence-carbon",
            "sentence-gender",
            "sentence-renewables",
            "sentence-suppliers",
            "sentence-water",
            "sentence-waste",
            "sentence-other",
        ]
        totals = {}

        for column_name in columns:

            # Check data type of the column
            cursor.execute(
                "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sentenceallview' AND COLUMN_NAME = %s",
                (column_name,),
            )
            data_type = cursor.fetchone()[0]

            if data_type == "tinyint":
                # Calculate the total number of '1' values
                query_total_1 = (
                    f"SELECT COUNT(*) FROM `sentenceallview` WHERE `{column_name}` = 1"
                )
                cursor.execute(query_total_1)
                total_1 = cursor.fetchone()[0]
                totals[f"{column_name} (1 Total)"] = total_1

                # Calculate the number of unique '1' values
                query_unique_1 = f"SELECT COUNT(DISTINCT `{column_name}`) FROM `sentenceallview` WHERE `{column_name}` = 1"
                cursor.execute(query_unique_1)
                unique_1 = cursor.fetchone()[0]
                totals[f"{column_name} (1 Unique)"] = unique_1
            elif column_name in [
                "Member of the S&P500",
                "Member of the Russell 1000 Index",
            ]:
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
    except Exception as e:
        log.error(f"Error while processing columns: {e}")


def send_csv_email(log, filename):
    # Send the email with the CSV file as
    try:
        with smtplib.SMTP(os.getenv("SMTP_SERVER"), os.getenv("SMTP_PORT")) as server:
            msg = MIMEMultipart()
            msg["From"] = os.getenv("SMTP_FROM")
            msg["To"] = "info@esgroadmap.com"
            msg["Subject"] = "KPI Data Table"
            body = "Please find attached the KPI data table for today."
            msg.attach(MIMEText(body, "plain"))
            with open(filename, "rb") as csvfile:
                attachment = MIMEApplication(csvfile.read(), _subtype="csv")
                attachment.add_header(
                    "Content-Disposition", "attachment", filename=filename
                )
                msg.attach(attachment)

            server.starttls()
            server.login(os.getenv("SMTP_FROM"), os.getenv("SMTP_PASS"))
            text = msg.as_string()
            server.sendmail(os.getenv("SMTP_FROM"), "info@esgroadmap.com", text)
            server.quit()
            log.info("Email Sent Successfully")
    except Exception as e:
        log.error(f"Error while sending CSV emai: {e}")


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
    # Add the console handler to the logger
    log.addHandler(console_handler)
    return log


def main():
    """Main Process"""
    try:
        logger = set_logs("Unique_Data_Table_logs.log")
        # Connect to the database
        with pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            database=os.getenv("DB_NAME"),
        ) as connection:
            with connection.cursor() as cursor:
                totals = get_column_totals(cursor, logger)

                column_names = [
                    "Company (NON-NULL Total)",
                    "Company (NON-NULL Unique)",
                    "Member of the S&P500 (YES Total)",
                    "Member of the Russell 1000 Index (YES Total)",
                    "Ticker(s) (NON-NULL Total)",
                    "Ticker(s) (NON-NULL Unique)",
                    "Country (NON-NULL Total)",
                    "Country (NON-NULL Unique)",
                    "sector code #1 (NAICS) (NON-NULL Unique)",
                    "sector code #2 (NAICS) (NON-NULL Unique)",
                    "sector code #3 (NAICS) (NON-NULL Unique)",
                    "sector code #4 (NAICS) (NON-NULL Unique)",
                    "sector code #5 (NAICS) (NON-NULL Unique)",
                    "sector codes all (NAICS) (NON-NULL Unique)",
                    "ArticleTargetYear (NON-NULL Unique)",
                    "Source Date (NON-NULL Unique)",
                    "PressReleaseYear (NON-NULL Unique)",
                    "Target sentence (NON-NULL Total)",
                    "Target sentence (NON-NULL Unique)",
                    "Targetyear(s) (NON-NULL Unique)",
                    "sentence-carbon (1 Total)",
                    "sentence-gender (1 Total)",
                    "sentence-renewables (1 Total)",
                    "sentence-suppliers (1 Total)",
                    "sentence-water (1 Total)",
                    "sentence-waste (1 Total)",
                    "sentence-other (1 Total)",
                ]
                filename = "Updated__Factors_Unique_&_Totals.csv"

                # Open the CSV file in "append" mode
                with open(filename, mode="a", newline="") as f:
                    writer = csv.writer(f)
                    if f.tell() == 0:
                        writer.writerow(["KPI Report Date"] + column_names)
                    data_row = [datetime.now().strftime("%Y-%m-%d %H:%M:%S")] + [
                        totals.get(col, "") for col in column_names
                    ]
                    writer.writerow(data_row)

                # Read the CSV file and extract the required values
                with open(filename, "r") as file:
                    reader = csv.reader(file)
                    column_names = next(reader)
                    current_date_values = next(reader)
                    current_date = date.today().strftime("%Y-%m-%d")
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
                except Exception as err:
                    logger.error(f"Error while creating table: {err}")

                # Insert column if not exists
                try:
                    cursor.execute(
                        """
                            SELECT COLUMN_NAME 
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_NAME = %s
                        """,
                        (table_name,),
                    )

                    existing_columns = {row[0].lower() for row in cursor.fetchall()}
                    columns_to_add = []
                    for column_name in column_names:
                        if column_name.lower() not in existing_columns:
                            columns_to_add.append(
                                f"ADD COLUMN `{column_name}` VARCHAR(10)"
                            )

                    if columns_to_add:
                        alter_query = (
                            f"ALTER TABLE `{table_name}` {', '.join(columns_to_add)}"
                        )
                        cursor.execute(alter_query)
                except Exception as e:
                    logger.error(f"Error occured while adding column: {e}")

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
                    logger.info("Data inserted successfully!")
                except Exception as err:
                    logger.error(f"Error while inserting data: {err}")

                # Send the email with the CSV file as attachment
                send_csv_email(logger, filename)
    except Exception as e:
        logger.error(f"Unexpected Error: {e}")


if __name__ == "__main__":
    main()

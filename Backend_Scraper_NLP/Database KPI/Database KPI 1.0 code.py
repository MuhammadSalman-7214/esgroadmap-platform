import os
import csv
import smtplib
import logging
from datetime import datetime

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

import pymysql


def get_column_percentages(cursor, columns, log):
    """
    Function to calculate Percentages based on sentences_all table
    @param cursor: Pymysql cursor (Object)
    @param columns: Column names of sentences_all (list)
    @param log: Logger object (Object)

    @return percentage: Percentages (list)
    """
    try:
        # Create a dictionary to store the percentages
        cursor.execute("DESCRIBE `sentenceallview`")
        percentages = {}
        for column_name in columns:
            cursor.execute(
                "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sentenceallview' AND COLUMN_NAME = %s",
                (column_name,),
            )
            data_type = cursor.fetchone()[0]

            if data_type == "tinyint":
                # Calculate the percentage of '1' values
                query_percentage_1 = f"SELECT (COUNT(*) * 100) / (SELECT COUNT(*) FROM `sentenceallview` WHERE `{column_name}` IS NOT NULL) AS percentage FROM `sentenceallview` WHERE `{column_name}` = %s"
                cursor.execute(query_percentage_1, ("1",))
                percentage_1 = cursor.fetchone()[0]
                percentages[f"{column_name} (1 %)"] = f"{percentage_1:.2f}%"
            elif column_name in [
                "Member of the S&P500",
                "Member of the Russell 1000 Index",
            ]:
                # Calculate the percentage of 'yes' or 'true' values
                query_percentage_yes = f"SELECT (COUNT(CASE WHEN `{column_name}` = 'yes' THEN 1 END) * 100) / COUNT(CASE WHEN `{column_name}` IS NOT NULL THEN 1 END) AS percentage FROM `sentenceallview`"
                cursor.execute(query_percentage_yes)
                percentage_yes = cursor.fetchone()[0]
                percentages[f"{column_name} (YES %)"] = f"{percentage_yes:.2f}%"
            elif column_name in ["climateaction100"]:
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
                percentages[f"{column_name} (NON-NULL %)"] = (
                    f"{percentage_non_null:.2f}%"
                )

        return percentages
    except Exception as e:
        log.error(f"Error while updating percentages: {e}")


def send_csv_email(log, filename):
    """
    Function to send CSV as email to ESGRoadMap email address
    @param log: Logger object (Object)
    @param filename: Filename of csv to send (str)

    @return None
    """
    try:
        with smtplib.SMTP(host=os.getenv("SMTP_SERVER"), port=os.getenv("SMTP_PORT")) as server:
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
    log.addHandler(console_handler)
    return log


def main():
    """Main Process"""
    try:
        logger = set_logs("Database_KPI_logs.log")
        with pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            database=os.getenv("DB_NAME"),
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute("DESCRIBE `sentenceallview`")
                columns = [row[0] for row in cursor.fetchall()]
                columns.remove('id')

                percentages = get_column_percentages(cursor, columns, logger)
                now = datetime.now().strftime("%y-%m-%d %H:%M:%S")

                # Write the percentages to a CSV file
                filename = "Updated__Factors_&_Percentage.csv"
                if not os.path.exists(filename):
                    with open(filename, mode="w", newline="") as csvfile:
                        writer = csv.writer(csvfile)
                        writer.writerow(["KPI Report Date"] + list(percentages.keys()))

                with open(filename, mode="a", newline="") as csvfile:
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
                except Exception as err:
                    logger.error(f"Error while creating table: {err}")

                #Insert column if not exists
                try:
                    cursor.execute("""
                        SELECT COLUMN_NAME 
                        FROM INFORMATION_SCHEMA.COLUMNS 
                        WHERE TABLE_NAME = %s
                    """, (table_name,))
                    
                    existing_columns = {row[0].lower() for row in cursor.fetchall()}
                    columns_to_add = []
                    for column_name in columns:
                        if column_name.lower() not in existing_columns:
                            columns_to_add.append(
                                f"ADD COLUMN `{column_name}` VARCHAR(10)"
                            )
                        
                    if columns_to_add:
                        alter_query = f"ALTER TABLE `{table_name}` {', '.join(columns_to_add)}"
                        cursor.execute(alter_query)
                except Exception as e:
                    logger.error(f"Error occured while adding column: {e}")

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
                    logger.info(insert_query)
                    cursor.execute(insert_query, values)
                    connection.commit()
                    while cursor.nextset():
                        pass
                except Exception as err:
                    logger.error(f"Error while inserting data: {err}")
                # Close the cursor and connection
                send_csv_email(logger, filename)
    except Exception as e:
        logger.error(f"Unexpected Error: {e}")


if __name__ == "__main__":
    main()

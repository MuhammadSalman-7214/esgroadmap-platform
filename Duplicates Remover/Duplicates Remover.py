import mysql.connector

# connect to the database
conn = mysql.connector.connect(
    host='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com',
    user='admin',
    password='hassanarshad1122',
    database='esgroadmap',
    connect_timeout=600000
)

# create a cursor object
cursor = conn.cursor()

# check for duplicates in sentence-all table
cursor.execute('''
    SELECT `Company`, `Target sentence`, COUNT(*) as `cnt`
    FROM `sentence-all`
    GROUP BY `Company`, `Target sentence`
    HAVING `cnt` > 1
''')

duplicates = cursor.fetchall()

if not duplicates:
    print("No duplicates found. Doing nothing.")
else:
    # create a temporary table to hold the result of the subquery
    cursor.execute('''
        CREATE TEMPORARY TABLE temp_table AS
        SELECT MIN(`id`) as `id`
        FROM `sentence-all`
        GROUP BY `Company`, `Target sentence`
        HAVING COUNT(*) > 1
    ''')

    # execute the SQL query using the temporary table
    cursor.execute('''
        DELETE FROM `sentence-all`
        WHERE `id` NOT IN (
            SELECT `id` FROM `temp_table`
        )
    ''')

    # drop the temporary table
    cursor.execute('DROP TEMPORARY TABLE IF EXISTS temp_table')

    # commit the changes and close the connection
    conn.commit()
    print(f"Duplicate rows deleted")

cursor.close()
conn.close()

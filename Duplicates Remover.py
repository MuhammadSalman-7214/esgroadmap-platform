import mysql.connector

# connect to the database
conn =  mysql.connector.connect(
    host='esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com',
    user='admin',
    password='hassanarshad1122',
    database='esgroadmap'
)

# create a cursor object
cursor = conn.cursor()

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
        SELECT `id`
        FROM `temp_table`
    )
''')

# drop the temporary table
cursor.execute('DROP TEMPORARY TABLE IF EXISTS temp_table')

# commit the changes and close the connection
conn.commit()
cursor.close()
conn.close()

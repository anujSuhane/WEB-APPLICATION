 import mysql from 'mysql2';

 const pool = mysql.createPool({
    host : '127.0.0.1',
    user: 'root',
    password: 'sql1234',
    database: 'orders'
 }).promise()
 
const create_order_header = 'CREATE TABLE order_header(ORDER_ID VARCHAR(40) NOT NULL PRIMARY KEY, ORDER_NAME VARCHAR(255) DEFAULT NULL, PLACED_DATE datetime DEFAULT NULL, STATUS_ID varchar(40) DEFAULT NULL, CURRENCY_UOM_ID varchar(40) DEFAULT NULL, PRODUCT_STORE_ID varchar(40) DEFAULT NULL, SALES_CHANNEL_ENUM_ID varchar(40) DEFAULT NULL, GRAND_TOTAL decimal(24,4) DEFAULT NULL, COMPLETED_DATE datetime NULL) ';

pool.query(create_order_header);
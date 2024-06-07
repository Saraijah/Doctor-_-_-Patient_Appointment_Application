import mysql from 'mysql2';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();



// Call the test function


export default pool;
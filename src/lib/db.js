import mysql from 'mysql2/promise';
import { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } from '$env/static/private';

const pool = mysql.createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log({ DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME });

export default pool;
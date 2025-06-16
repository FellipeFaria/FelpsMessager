import mysql from "mysql2/promise"; // ✅ Use mysql2/promise
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

export default db;

import mysql from "mysql";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "isalipe79!",
  database: "felpsmessager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

export default db;

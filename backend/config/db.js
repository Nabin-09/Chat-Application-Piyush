import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function mysql_db() {
  try {
    // First, connect without specifying a database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database '${process.env.DB_NAME}' created or already exists`);
    
    // Close the initial connection
    await connection.end();

    // Now connect to the specific database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('Connected to MySQL database:', process.env.DB_NAME);
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export default mysql_db;


// Create a db

// await db.execute(`create database mysql_db`);
// console.log(await db.execute("show databases"));

// Create a table

// await db.execute(`
//   CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   username VARCHAR(50) NOT NULL,
//   email VARCHAR(100) NOT NULL UNIQUE,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `);

// Perform CRUD Operations
// 1. Insert
// Using Inline values(not recommended)

// await db.execute(`
//   insert into users(username, email, password) values('Piyush' , 'proy31339@gmail.com' , 'Piyush@roy1')
//   `);

//Using Prepared Statements

// await db.execute(`
//   insert into users(username, email, password) values(?,?,?)`,[
//     "Roy",
//     "piyush@gmail.com",
//     "Piyush@roy2"
//   ]);

// 2. Read
// const [rows] = await db.execute(`
//   select * from users
//   `); 
//   console.log(rows);

// 3. Update
/* Syntax
UPDATE table_name
SET column1 = value1, column2 = value2 ......
WHERE condition
*/

// try{
//   const [rows] = await db.execute(
//     "update users set username = 'Avinash' where email = 'piyush@gmail.com'"
//   )
//   console.log("All Users :",rows);
// }catch (error){
//   console.log(error);
// }

// 4. Delete
/* Syntax
DELETE FROM table_name
WHERE condition
*/

// try{
//   const [rows] = await db.execute(
//     "DELETE FROM users where email = 'piyush@gmail.com'"
//   )
//   console.log("All Users :",rows);
// }catch (error){
//   console.log(error);
// }

// export default mysql_db;


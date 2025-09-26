// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// async function mysql_db() {
//   try {
//     // First, connect without specifying a database to create it
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//     });

//     // Create database if it doesn't exist
//     await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
//     console.log(`Database '${process.env.DB_NAME}' created or already exists`);
    
//     // Close the initial connection
//     await connection.end();

//     // Now connect to the specific database
//     const db = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//     });

//     console.log('Connected to MySQL database:', process.env.DB_NAME);
//     return db;
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// }

// export default mysql_db;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function mysql_db() {
  try {
    // Enhanced connection configuration for production/Aiven
    const connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,

      // SSL Configuration for Aiven
      ssl: {
        rejectUnauthorized: false,
        // For Aiven, you might need to download ca.pem certificate
        // ca: fs.readFileSync('/path/to/ca.pem')
      },

      // Timeout configurations to prevent ETIMEDOUT
      connectTimeout: 120000,      // 2 minutes
      acquireTimeout: 120000,      // 2 minutes  
      timeout: 120000,             // 2 minutes

      // Additional connection settings
      charset: 'utf8mb4',
      timezone: 'Z',

      // Reconnection settings
      reconnect: true,
      maxReconnects: 3,

      // Keep alive to prevent connection drops
      keepAliveInitialDelay: 0,
      enableKeepAlive: true,
    };

    console.log('Attempting to connect to MySQL database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT || 3306);

    const db = await mysql.createConnection(connectionConfig);

    // Test the connection
    await db.execute('SELECT 1');
    console.log('✅ Successfully connected to MySQL database:', process.env.DB_NAME);

    return db;

  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.error('Connection details:');
    console.error('- Host:', process.env.DB_HOST);
    console.error('- User:', process.env.DB_USER);
    console.error('- Database:', process.env.DB_NAME);
    console.error('- Port:', process.env.DB_PORT || 3306);

    // More specific error logging
    if (error.code === 'ETIMEDOUT') {
      console.error('');
      console.error('🚨 CONNECTION TIMEOUT ERROR:');
      console.error('This usually means:');
      console.error('1. Database server is not accessible from this network');
      console.error('2. Incorrect host/port in environment variables');
      console.error('3. Firewall blocking the connection');
      console.error('4. SSL configuration issue');
      console.error('');
      console.error('💡 SOLUTIONS:');
      console.error('1. Verify your Aiven service is running and accessible');
      console.error('2. Check environment variables are correctly set');
      console.error('3. Ensure Aiven service allows connections from 0.0.0.0/0');
      console.error('4. Try connecting from your local machine first');
    }

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


const mysql = require('mysql2/promise');
const fs = require('fs');
const { db } = require('../Config/DbConfig');

async function executeSQLFile(filePath) {
  const connection = await mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
  });

  try {
    // Lire le contenu du fichier SQL
    const sql = fs.readFileSync(filePath, 'utf8');

    // Vérifier si la base de données existe, sinon la créer
    const databaseExists = await connection.query(`SHOW DATABASES LIKE 'QuaDev'`);
    if (databaseExists[0].length === 0) {
      await connection.query('CREATE DATABASE QuaDev');
      console.log('Database QuaDev created.');
      
      // Utiliser la base de données et exécuter le script SQL
      await connection.query('USE QuaDev');
      await connection.query(sql);
      console.log(`SQL script from '${filePath}' executed successfully.`);
    } else {
      console.log('Database QuaDev already exists, skipping creation and SQL execution.');
    }

  } catch (error) {
    console.error(`Error executing SQL script from '${filePath}':`, error);
  } finally {
    await connection.end();
  }
}


module.exports = { executeSQLFile };

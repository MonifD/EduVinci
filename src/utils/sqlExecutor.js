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
    }

    // Utiliser la base de données
    await connection.query('USE QuaDev');
    
    // Exécuter les requêtes SQL
    await connection.query(sql);
    console.log(`SQL script from '${filePath}' executed successfully.`);
  } catch (error) {
    console.error(`Error executing SQL script from '${filePath}':`, error);
  } finally {
    await connection.end();
  }
}

module.exports = { executeSQLFile };

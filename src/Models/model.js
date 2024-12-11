const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../Config/DbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = new Sequelize({
  username: db.user,
  password: db.password,
  host: db.host,
  database: db.database,
  dialect: 'mysql',
  logging: false,
});


// Table Professeur
const Professeur = sequelize.define('Professeur', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Table Annee
const Annee = sequelize.define('Annee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Classe = sequelize.define('Classe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fk_prof: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Table Eleve
const Eleve = sequelize.define('Eleve', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fk_classe: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  redouble: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  date_naissance: {  
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Table User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER
    ,autoIncrement: true
    ,primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING
    ,allowNull: false
    ,unique: true,
  },
  prenom: {
    type: DataTypes.STRING
    ,allowNull: false
    ,unique: true,
  },
  email: {
    type: DataTypes.STRING
    ,allowNull: false
    ,unique: true,
  },
  password: {
    type: DataTypes.STRING
    ,allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Maire'
                        ,'Directrice'
                        ,'Professeur'
                        ,'Administrateur')
    ,allowNull: false,
  },
});

// Table Archive
const Archive = sequelize.define('Archive', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_naissance: {  
    type: DataTypes.DATE,
    allowNull: false,
  },
  annee_cours: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  professeur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passe: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Associations
Classe.belongsTo(Professeur, { foreignKey: 'fk_prof' });
Eleve.belongsTo(Classe, { foreignKey: 'fk_classe' });
Eleve.belongsTo(Annee, { foreignKey: 'fk_annee' });


User.prototype.generateJWT = async function () {
  const expiresIn = '2h';
  const authToken = jwt.sign({ id: this.id, role: this.role,  }, process.env.JWT_SECRET, { expiresIn });
  return authToken;
};

module.exports = { sequelize, Professeur, Annee, Classe, Eleve, Archive, User };
const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../Config/DbConfig');

const sequelize = new Sequelize({
  username: db.user,
  password: db.password,
  host: db.host,
  database: db.database,
  dialect: 'mysql',
  logging: false,
});

// Table Salle
const Salle = sequelize.define('Salle', {
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
    type: DataTypes.ENUM(
      'Petite section',
      'Moyenne section',
      'Grande section',
      'CP',
      'CE1',
      'CE2',
      'CM1',
      'CM2'
    ),
    allowNull: false,
  },
  fk_prof: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_salle: {
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
  username: {
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
  annee_naissance: {
    type: DataTypes.INTEGER,
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
Classe.belongsTo(Salle, { foreignKey: 'fk_salle' });
Eleve.belongsTo(Classe, { foreignKey: 'fk_classe' });
Eleve.belongsTo(Annee, { foreignKey: 'fk_annee' });

module.exports = { sequelize, Salle, Professeur, Annee, Classe, Eleve, Archive };
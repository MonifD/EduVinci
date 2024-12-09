const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('QuaDav', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
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

// Table Classe
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

// Associations
Classe.belongsTo(Professeur, { foreignKey: 'fk_prof' });
Classe.belongsTo(Salle, { foreignKey: 'fk_salle' });
Eleve.belongsTo(Classe, { foreignKey: 'fk_classe' });
Eleve.belongsTo(Annee, { foreignKey: 'fk_annee' });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); // Warning: This will drop existing tables!
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const { sequelize, Salle, Professeur, Annee, Classe, Eleve, Archive } = require('../Models/model');

exports.registerEleve = async (req, res, next) => {

};


exports.listEleves = async (req, res, next) => {
  try {
    const eleves = await Eleve.findAll({
      include: [
        {
          model: Classe,
          attributes: ['libelle'],
          include: [
            {
              model: Professeur,
              attributes: ['nom', 'prenom'],
            },
            {
              model: Salle,
              attributes: ['libelle'],
            },
          ],
        },
        {
          model: Annee,
          attributes: ['libelle'],
        },
      ],
      attributes: ['id', 'nom', 'prenom', 'annee_naissance', 'redouble'],
    });

    res.status(200).json(eleves);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des élèves.' });
  }
};
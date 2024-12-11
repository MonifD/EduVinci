/// J'AI COMMENTÉ ÇA POUR LE MOMENT, ON PEUT DÉCOMMENTER SI BESOIN 
// const { sequelize, Salle, Professeur, Annee, Classe, Eleve, Archive } = require('../Models/model');

// exports.anneesuivante = async (req, res, next) => {

// };
  

const { Professeur, Classe, Eleve, Salle } = require('../Models/model');

/**
 * Récupérer la liste des classes dédiées à un professeur.
 */
exports.getClassesForProfesseur = async (req, res) => {
  try {
    const { profId } = req.params; // Récupère l'ID du professeur depuis les paramètres de l'URL

    // Vérifier si le professeur existe
    const professeur = await Professeur.findByPk(profId);
    if (!professeur) {
      return res.status(404).json({ message: "Professeur non trouvé." });
    }

    // Récupérer toutes les classes attribuées au professeur
    const classes = await Classe.findAll({
      where: { fk_prof: profId }, // Filtrer par l'ID du professeur
      include: [
        {
          model: Eleve, // Inclure les élèves associés à chaque classe
          attributes: ['id', 'nom', 'prenom', 'date_naissance', 'redouble'],
        },
        {
          model: Salle, // Inclure les informations de la salle associée
          attributes: ['id', 'libelle'],
        },
      ],
    });

    return res.status(200).json({
      message: `Liste des classes dédiées au professeur ${professeur.nom} ${professeur.prenom}.`,
      classes,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des classes.",
      error: error.message,
    });
  }
};

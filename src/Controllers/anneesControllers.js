const { sequelize, Annee} = require('../Models/model');

exports.getAllAnnees = async (req, res, next) => {
  try {
    // Récupérer toutes les années
    const annees = await Annee.findAll({
      attributes: ['id', 'libelle'], // Récupérer uniquement l'ID et le libellé
    });

    // Vérifier si des années existent
    if (!annees || annees.length === 0) {
      return res.status(404).json({
        message: "Aucune année trouvée.",
      });
    }

    // Retourner les années
    return res.status(200).json(annees);
  } catch (error) {
    console.error("Erreur lors de la récupération des années :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des années.",
      error: error.message,
    });
  }
};
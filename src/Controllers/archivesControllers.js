// Fonction pour récupérer toutes les entrées de la table Archive
const { Archive } = require('../Models/model');

exports.getAllArchives = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    // Récupérer toutes les données de la table Archive
    const archives = await Archive.findAll();

    // Vérifier si la table contient des données
    if (!archives || archives.length === 0) {
      return res.status(404).json({ message: 'Aucune archive trouvée.' });
    }

    // Répondre avec les données trouvées
    return res.status(200).json({ archives });
  } catch (error) {
    console.error('Erreur lors de la récupération des archives :', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des archives.',
      error: error.message,
    });
  }
};

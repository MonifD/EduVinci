const { Professeur, Classe } = require('../Models/model');
// const fs = require('fs');
// const readline = require('readline');

// Création d'un professeur
exports.registerProfesseur = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    const { nom, prenom } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !prenom ) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Création du professeur
    const professeur = await Professeur.create({ nom, prenom });

    return res.status(201).json({
      message: 'Professeur ajouté avec succès.',
      professeur,
    });
  } catch (error) {
    console.error('Erreur lors de la création du professeur :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

// cherchez les professeurs, la iste des professeurs
exports.listProfesseurs = async (req, res, next) => {
  try {
    const professeurs = await Professeur.findAll({

      attributes: ['id', 'nom', 'prenom'],
    });
    res.status(200).json(professeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

// Mise à jour d'un professeur (les modifier)
exports.updateProfesseur = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    const { id } = req.params;
    const { nom, prenom } = req.body;

    const professeur = await Professeur.findByPk(id);

    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé.' });
    }

    // Mise à jour des champs fournis
    if (nom) professeur.nom = nom;
    if (prenom) professeur.prenom = prenom;

    await professeur.save();

    res.status(200).json({ message: 'Professeur mis à jour avec succès.', professeur });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du professeur :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

// Suppression d'un professeur
exports.deleteProfesseur = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    const { id } = req.params;

    const professeur = await Professeur.findByPk(id);

    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé.' });
    }

    await professeur.destroy();

    res.status(200).json({ message: 'Professeur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du professeur :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

exports.assignProfToClass = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    const { profId, classId } = req.body;

    // Vérification des champs obligatoires
    if (!profId || !classId) {
      return res.status(400).json({ message: 'L\'ID du professeur et celui de la classe sont obligatoires.' });
    }

    // Récupération du professeur et de la classe
    const professeur = await Professeur.findByPk(profId);
    const classe = await Classe.findByPk(classId);

    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé.' });
    }

    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée.' });
    }

    // Assignation du professeur à la classe
    classe.fk_prof = professeur.id;
    await classe.save();

    res.redirect('/assignerProf');
  } catch (error) {
    console.error('Erreur lors de l\'assignation du professeur à la classe :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};


exports.findAllClasses = async (req, res, next) => {
  // if (!['Maire', 'Directrice', 'Administrateur', 'Professeur'].includes(req.user.role)) {
  //   return res.status(403).json({ message: "Accès interdit." });
  // }
  try {
    const classes = await Classe.findAll({
      attributes: ['id', 'libelle'], // Attributs de la classe
    });

    res.status(200).json(classes);
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

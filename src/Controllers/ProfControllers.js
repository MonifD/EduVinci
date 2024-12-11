const { Professeur } = require('../Models/model');
// const fs = require('fs');
// const readline = require('readline');

// Création d'un professeur
exports.registerProfesseur = async (req, res, next) => {
  try {
    const { nom, prenom, genre } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !prenom || !genre) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérification du genre
    const validGenres = ['M.', 'Mme.', 'Mlle.'];
    if (!validGenres.includes(genre)) {
      return res.status(400).json({ message: 'Le genre fourni est invalide.' });
    }

    // Création du professeur
    const professeur = await Professeur.create({ nom, prenom, genre });

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

      attributes: ['id', 'nom', 'prenom', 'genre'],
    });
    res.status(200).json(professeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

// Mise à jour d'un professeur (les modifier)
exports.updateProfesseur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, prenom, genre } = req.body;

    const professeur = await Professeur.findByPk(id);

    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé.' });
    }

    // Mise à jour des champs fournis
    if (nom) professeur.nom = nom;
    if (prenom) professeur.prenom = prenom;
    if (genre) professeur.genre = genre;

    await professeur.save();

    res.status(200).json({ message: 'Professeur mis à jour avec succès.', professeur });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du professeur :', error);
    res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
  }
};

// Suppression d'un professeur
exports.deleteProfesseur = async (req, res, next) => {
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
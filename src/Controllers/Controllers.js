const { sequelize, Salle, Professeur, Annee, Classe, Eleve, Archive } = require('../Models/model');
const { Op } = require('sequelize'); // Pour les opérations sur les dates

exports.registerEleve = async (req, res, next) => {
  try {
    const { nom, prenom, annee_naissance, annee_scolaire } = req.body; // Récupère les données envoyées dans la requête

    // Vérifie si l'élève a au moins 3 ans avant l'année scolaire en cours (4 septembre)
    const dateNaissance = new Date(annee_naissance, 0, 1); // Transforme l'année de naissance en date (1er janvier)
    const dateLimite = new Date(new Date().getFullYear() - 3, 8, 4); // 4 septembre de l'année en cours

    // Vérifie si l'élève a bien 3 ans ou plus avant la date limite
    if (dateNaissance > dateLimite) {
      return res.status(400).json({
        message: 'L\'élève doit avoir au moins 3 ans avant le 4 septembre de l\'année scolaire en cours.',
      });
    }

    // Si l'utilisateur n'a pas spécifié d'année scolaire, on calcule la par défaut
    let anneeScolaire = annee_scolaire || (new Date().getMonth() >= 8
      ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`  // Si on est après septembre
      : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`); // Si avant septembre

    // Recherche l'année scolaire correspondante dans la base de données
    const annee = await Annee.findOne({
      where: {
        libelle: anneeScolaire,
      },
    });

    if (!annee) {
      return res.status(404).json({
        message: 'L\'année scolaire n\'a pas été trouvée.',
      });
    }

    // Calcule l'âge de l'élève pour déterminer la classe
    const age = new Date().getFullYear() - dateNaissance.getFullYear();
    let classeLibelle;
    if (age === 3) {
      classeLibelle = 'Petite section';
    } else if (age === 4) {
      classeLibelle = 'Moyenne section';
    } else if (age === 5) {
      classeLibelle = 'Grande section';
    } else if (age === 6) {
      classeLibelle = 'CP';
    } else if (age === 7) {
      classeLibelle = 'CE1';
    } else if (age === 8) {
      classeLibelle = 'CE2';
    } else if (age === 9) {
      classeLibelle = 'CM1';
    } else if (age === 10) {
      classeLibelle = 'CM2';
    }

    // Recherche la classe correspondante
    const classe = await Classe.findOne({
      where: {
        libelle: classeLibelle,
      },
    });

    if (!classe) {
      return res.status(404).json({
        message: 'La classe correspondante n\'a pas été trouvée.',
      });
    }

    // Créer l'élève
    const eleve = await Eleve.create({
      nom,
      prenom,
      fk_classe: classe.id,
      fk_annee: annee.id,
      redouble: false, // Par défaut, l'élève ne redouble pas
    });

    // Si l'élève est en redoublement, on archive son inscription précédente
    if (req.body.redouble) {
      const archive = await Archive.create({
        nom: eleve.nom,
        prenom: eleve.prenom,
        annee_naissance: annee_naissance,
        annee_cours: anneeScolaire,
        classe: classeLibelle,
        professeur: 'Non attribué', // Professeur à définir
        passe: false, // Si l'élève redouble, il n'a pas passé l'année précédente
      });
    }

    return res.status(201).json({
      message: 'Élève créé avec succès.',
      eleve,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la création de l\'élève.',
      error: error.message,
    });
  }
};

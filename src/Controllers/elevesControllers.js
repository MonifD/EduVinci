const { sequelize, Professeur, Annee, Classe, Eleve, Archive } = require('../Models/model');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Op } = require('sequelize');
const multer = require("multer");

// Configuration de multer
const upload = multer({ dest: "uploads/" });
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const validClasses = [
    '1ère section maternelle',
    '2ème section maternelle',
    '3ème section maternelle',
    'CP',
    'CE1',
    'CE2',
    'CM1',
    'CM2',
  ];
  
exports.registerEleve = async (req, res, next) => {
  try {
    const { nom, prenom, date_naissance, annee_scolaire, redouble, nb_redoublement } = req.body; // Récupère les données envoyées dans la requête

    // Vérifie si l'élève a au moins 3 ans avant l'année scolaire en cours (4 septembre)
    const dateNaissance = new Date(date_naissance); // Transforme la date de naissance en objet Date
    const dateLimite = new Date(new Date().getFullYear() - 3, 8, 4); // 4 septembre de l'année en cours

    // Vérifie si l'élève a bien 3 ans ou plus avant la date limite
    let anneeScolaire;
    let classeLibelle;
    let age = new Date().getFullYear() - dateNaissance.getFullYear();
    if (age < 2){

    }

    // Si l'élève a moins de 3 ans, il est pré-inscrit dans l'année suivante
    if (dateNaissance > dateLimite) {
      // Pré-inscription dans l'année suivante
      anneeScolaire = (new Date().getMonth() >= 8)
        ? `${new Date().getFullYear() + 1}-${new Date().getFullYear() + 2}` // L'année scolaire suivante
        : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`; // L'année scolaire suivante
      classeLibelle = age === 2 ? 'Pré-inscription' : 'Classe non déterminée'; // Classe pour pré-inscription
    } else {
      // L'élève a 3 ans ou plus, il est inscrit dans l'année scolaire en cours
      anneeScolaire = annee_scolaire === 'Automatique' ? (new Date().getMonth() >= 8
        ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` // Si on est après septembre
        : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`)  // Si avant septembre
        : annee_scolaire;

      // Déterminer la classe en fonction de l'âge
      if (redouble === 'true') {
        age = Math.max(age - nb_redoublement, 3); // Décale d'une classe en-dessous si redouble
      }

      if (age === 3) {
        classeLibelle = '1ère section maternelle';
      } else if (age === 4) {
        classeLibelle = '2ème section maternelle';
      } else if (age === 5) {
        classeLibelle = '3ème section maternelle';
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
    }

    // Recherche ou crée l'année scolaire
    let annee = await Annee.findOne({
      where: {
        libelle: anneeScolaire,
      },
    });

    if (!annee) {
      // Si l'année scolaire n'existe pas, on la crée
      annee = await Annee.create({
        libelle: anneeScolaire,
      });
    }

    // Recherche ou crée un professeur par défaut
    let professeur = await Professeur.findOne({
      where: { nom: 'Professeur Défaut', prenom: 'Default' },
    });

    if (!professeur) {
      professeur = await Professeur.create({
        nom: 'Professeur Défaut',
        prenom: 'Default',
      });
    }

    // Recherche ou crée la classe avec son libellé
    let classe = await Classe.findOne({
      where: {
        libelle: classeLibelle,
      },
    });

    if (!classe) {
      // Si la classe n'existe pas, on la crée
      classe = await Classe.create({
        libelle: classeLibelle,
        fk_prof: professeur.id,
      });
    }

    // Créer l'élève
    const eleve = await Eleve.create({
      nom,
      prenom,
      date_naissance: dateNaissance,
      fk_classe: classe.id,
      fk_annee: annee.id,
      redouble: redouble ,
    });

    res.render('confirmation_inscription', {
      success: true,
      message: 'Élève créé avec succès.',
      eleve,
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error);
    res.render('confirmation_inscription', {
      success: false,
      message: 'Une erreur est survenue lors de la création de l\'élève.',
      error: error.message,
    });
  }
};


exports.listEleves = async (req, res, next) => {
  if (!['Maire', 'Directrice', 'Administrateur', 'Professeur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
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
          ],
        },
        {
          model: Annee,
          attributes: ['libelle'],
        },
      ],
      attributes: ['id', 'nom', 'prenom', 'date_naissance', 'redouble'],
    });

    res.status(200).json(eleves);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des élèves.' });
  }
};

exports.anneeSuivante = async (req, res, next) => {
  if (!['Maire', 'Directrice'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const newYearLabel = `${currentYear}-${nextYear}`;

    // 1. Vérification et création de l'année scolaire suivante
    let newYear = await Annee.findOne({ where: { libelle: newYearLabel } });
    if (!newYear) {
      newYear = await Annee.create({ libelle: newYearLabel });
    }

    // 2. Récupérer la classe CM2 et les autres classes
    const cm2Class = await Classe.findOne({ where: { libelle: 'CM2' } });
    if (!cm2Class) {
      throw new Error("La classe CM2 n'existe pas.");
    }

    // 3. Début de la transaction pour archiver et mettre à jour les élèves
    await sequelize.transaction(async (transaction) => {
      // Archiver les élèves de CM2 (qui passent au collège)
      const elevesToArchive = await Eleve.findAll({
        where: { fk_classe: cm2Class.id, redouble: false },
        include: [{ model: Classe }, { model: Annee }],
        transaction,
      });

      for (const eleve of elevesToArchive) {
        // Archiver les élèves passant au collège
        await Archive.create({
          nom: eleve.nom,
          prenom: eleve.prenom,
          date_naissance: eleve.date_naissance,
          annee_cours: eleve.Annee.libelle,
          classe: eleve.Classe.libelle,
          professeur: "Affectation inconnue (passé au collège)",
          passe: true,
        }, { transaction });

        // Supprimer l'élève de la table Eleve
        await eleve.destroy({ transaction });
      }

      // 4. Gérer les élèves non en CM2 mais sans redoublement (avancer d'une classe)
      const elevesToAdvance = await Eleve.findAll({
        where: { redouble: false, fk_classe: { [Op.ne]: cm2Class.id } },
        transaction,
      });

      for (const eleve of elevesToAdvance) {
        const nextClasse = await Classe.findOne({
          where: { id: eleve.fk_classe + 1 }, // Passer à la classe suivante
          transaction,
        });

        if (!nextClasse) {
          throw new Error(`La classe suivante pour l'élève ${eleve.nom} ${eleve.prenom} n'existe pas.`);
        }

        // Mise à jour de l'élève (classe et année scolaire)
        await eleve.update({
          fk_classe: nextClasse.id,
          fk_annee: newYear.id,
        }, { transaction });
      }

      // 5. Gérer les élèves en redoublement (mettre à jour l'année et réinitialiser le redoublement)
      const elevesToRetain = await Eleve.findAll({
        where: { redouble: true },
        transaction,
      });

      for (const eleve of elevesToRetain) {
        // Réinitialiser le redoublement et mettre à jour l'année
        await eleve.update({
          redouble: false,
          fk_annee: newYear.id,
        }, { transaction });
      }
    });

    return res.render('annee_suivante', {
      message: "Le renouvellement de l'année scolaire a été effectué avec succès."
    });
  } catch (error) {
    console.error('Erreur lors du renouvellement de l\'année scolaire:', error);
    return res.render('annee_suivante', {
      message: 'Une erreur est survenue lors du renouvellement de l\'année scolaire.',
      error: error.message,
    });
  }
};


exports.setRedoublement = async (req, res, next) => {
  if (!['Maire', 'Directrice', 'Administrateur', 'Professeur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {
    // Récupération de l'ID de l'élève depuis les paramètres de la requête
    const { id } = req.params;

    // Vérification de l'existence de l'élève
    const eleve = await Eleve.findByPk(id);

    if (!eleve) {
      return res.status(404).json({
        message: "Élève non trouvé.",
      });
    }

    // Mise à jour de l'état de redoublement de l'élève
    eleve.redouble = !eleve.redouble;
    await eleve.save();

    return res.status(200).json({
      message: `L'élève ${eleve.nom} ${eleve.prenom} a été marqué en redoublement.`,
      eleve,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état de redoublement :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour de l'état de redoublement.",
      error: error.message,
    });
  }
};

exports.updateEleve = async (req, res, next) => {
  if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {
    const { id } = req.params; // Récupérer l'ID de l'élève depuis les paramètres
    const { nom, prenom, date_naissance } = req.body; // Récupérer les données à mettre à jour

    // Trouver l'élève par son ID
    const eleve = await Eleve.findByPk(id);

    if (!eleve) {
      return res.status(404).json({
        message: "Élève non trouvé.",
      });
    }

    // Mettre à jour les champs spécifiés
    if (nom) eleve.nom = nom;
    if (prenom) eleve.prenom = prenom;
    if (date_naissance) eleve.date_naissance = date_naissance;

    // Sauvegarder les modifications
    await eleve.save();

    return res.status(200).json({
      message: "Élève mis à jour avec succès.",
      eleve,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'élève :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour de l'élève.",
      error: error.message,
    });
  }
};

exports.deleteEleve = async (req, res, next) => {
  if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {
    const { id } = req.params; // Récupérer l'ID de l'élève depuis les paramètres

    // Trouver l'élève par son ID
    const eleve = await Eleve.findByPk(id);

    if (!eleve) {
      return res.status(404).json({
        message: "Élève non trouvé.",
      });
    }

    // Supprimer l'élève
    await eleve.destroy();

    return res.status(200).json({
      message: "Élève supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élève :", error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de l'élève.",
      error: error.message,
    });
  }
};


exports.importEleves = async (filePath) => {
  if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isHeader = true;

    for await (const line of rl) {
      const row = line.split(',');

      if (isHeader) {
        isHeader = false; // Ignorer la ligne d'en-tête
        continue;
      }

      const [niveau, nomEleve, prenomEleve, dateNaissance, nomProfesseur] = row.map((col) => col.trim());

      // Calculer l'année d'inscription basée sur l'âge de l'élève (3 ans avant le 4 septembre)
      const naissanceDate = new Date(dateNaissance);
      const yearWhenThree = naissanceDate.getFullYear() + 3;
      const ageCutoffDate = new Date(yearWhenThree, 8, 4); // 4 septembre de l'année où il a 3 ans
      const inscriptionYear = ageCutoffDate > new Date() ? yearWhenThree : new Date().getFullYear();

      const anneeScolaireLabel = `${inscriptionYear}-${inscriptionYear + 1}`;

      // Vérifier ou créer l'année scolaire
      const [anneeScolaire] = await Annee.findOrCreate({
        where: { libelle: anneeScolaireLabel },
      });

      // Vérifier ou créer le professeur
      const [nomProf, prenomProf] = nomProfesseur.split(' ');
      const [professeur] = await Professeur.findOrCreate({
        where: { nom: nomProf, prenom: prenomProf },
      });


      // Vérifier ou créer la classe
      const [classe] = await Classe.findOrCreate({
        where: { libelle: niveau },
        defaults: { fk_prof: professeur.id},
      });

      // Si la classe existe mais n'a pas encore de professeur ou de salle, les assigner
      if (!classe.fk_prof) {
        classe.fk_prof = professeur.id;
        await classe.save();
      }

      // Créer l'élève avec les clés étrangères associées
      await Eleve.create({
        nom: nomEleve,
        prenom: prenomEleve,
        date_naissance: naissanceDate,
        fk_classe: classe.id,
        fk_annee: anneeScolaire.id,
        redouble: false, // Par défaut
      });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier temporaire:', err);
      } else {
        console.log('Fichier temporaire supprimé avec succès.');
      }
    });
    
    console.log('Importation réussie.');
  } catch (error) {
    console.error('Erreur lors de l\'importation des élèves :', error);
  }
};


exports.exportEleves = async () => {
  if (!['Maire', 'Directrice', 'Administrateur'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès interdit." });
  }
  try {

    const exportsDir = path.resolve(__dirname, '../exports');
    const filePath = path.join(exportsDir, 'eleves_export.csv');
    console.log('Chemin du fichier exporté :', filePath);
    console.log('export du fichier exporté :', exportsDir);

    // Vérifier si le dossier `exports` existe, sinon le créer
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
      console.log("dans la condition fsdir")
    }

    // 1. Récupérer tous les élèves avec leurs relations
    const eleves = await Eleve.findAll({
      include: [
        {
          model: Classe,
          include: [{ model: Professeur, attributes: ['nom', 'prenom'] }],
          attributes: ['libelle'],
        },
        { model: Annee, attributes: ['libelle'] },
      ],
      attributes: ['id', 'nom', 'prenom', 'date_naissance', 'redouble'],
    });


    if (eleves.length === 0) {
      throw new Error('Aucun élève trouvé à exporter.');
    }

    // 2. Créer le CSV Writer
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'nom', title: 'Nom' },
        { id: 'prenom', title: 'Prénom' },
        { id: 'date_naissance', title: 'Date de Naissance' },
        { id: 'classe', title: 'Classe' },
        { id: 'annee', title: 'Année Scolaire' },
        { id: 'professeur', title: 'Professeur' },
        { id: 'redouble', title: 'Redouble' },
      ],
    });

    // 3. Formater les données pour le CSV
    const records = eleves.map((eleve) => ({
      id: eleve.id,
      nom: eleve.nom,
      prenom: eleve.prenom,
      date_naissance: eleve.date_naissance
        ? eleve.date_naissance.toISOString().split('T')[0]
        : 'Non défini',
      classe: eleve.Classe ? eleve.Classe.libelle : 'Non défini',
      annee: eleve.Annee ? eleve.Annee.libelle : 'Non définie',
      professeur: eleve.Classe?.Professeur
        ? `${eleve.Classe.Professeur.nom} ${eleve.Classe.Professeur.prenom}`
        : 'Non défini',
      redouble: eleve.redouble ? 'Oui' : 'Non',
    }));
    // 4. Écrire les données dans le fichier CSV
    await csvWriter.writeRecords(records);
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Exportation des élèves réussie.');
  } catch (error) {
    console.error('Erreur lors de l\'exportation des élèves :', error);
    throw error; // Propager l'erreur pour qu'elle soit gérée dans le routeur
  }
};

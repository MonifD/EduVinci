const { sequelize, Salle, Professeur, Annee, Classe, Eleve, Archive } = require('../Models/model');

const validClasses = [
    'Petite section',
    'Moyenne section',
    'Grande section',
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
    if (dateNaissance > dateLimite) {
      console.error('Erreur : L\'élève a moins de 3 ans.');
      return res.render('confirmation_inscription', {
        success: false,
        message: 'Erreur lors de l\'inscription de l\'élève.',
        error: 'L\'âge minimum requis est de 3 ans avant le 4 septembre.',
      });
    }

    // Si l'utilisateur n'a pas spécifié d'année scolaire, on calcule l'année scolaire par défaut
    let anneeScolaire = annee_scolaire || (new Date().getMonth() >= 8
      ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`  // Si on est après septembre
      : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`); // Si avant septembre

    // Recherche ou crée l'année scolaire
    let annee = await Annee.findOne({
      where: {
        id: anneeScolaire,
      },
    });

    if (!annee) {
      // Si l'année scolaire n'existe pas, on la crée
      annee = await Annee.create({
        libelle: anneeScolaire,
      });
    }

    // Calcule l'âge de l'élève pour déterminer la classe
    let age = new Date().getFullYear() - dateNaissance.getFullYear();

    if (redouble === 'true') {
    age = Math.max(age - nb_redoublement, 3); // Décale d'une classe en-dessous si redouble
  }
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

    // Vérification que la classe est valide
    if (!validClasses.includes(classeLibelle)) {
      return res.status(400).json({
        message: `La classe ${classeLibelle} n'est pas valide.`,
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

    // Recherche ou crée une salle par défaut
    let salle = await Salle.findOne({
      where: { libelle: 'Salle 101' },
    });

    if (!salle) {
      salle = await Salle.create({
        libelle: 'Salle 101',
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
        fk_salle: salle.id, 
      });
    }

    // Créer l'élève
    const eleve = await Eleve.create({
      nom,
      prenom,
      date_naissance: dateNaissance,
      fk_classe: classe.id,
      fk_annee: annee.id,
      redouble: redouble === 'false' ? 0 : 1,
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
      attributes: ['id', 'nom', 'prenom', 'date_naissance', 'redouble'],
    });

    res.status(200).json(eleves);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des élèves.' });
  }
};

exports.anneesuivante = async (req, res, next) => {
  try {
    // 1. Générer le libellé de la nouvelle année scolaire
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const newYearLabel = `${currentYear}-${nextYear}`;

    // 2. Vérifier si l'année existe déjà, sinon la créer
    let newYear = await Annee.findOne({ where: { libelle: newYearLabel } });

    if (!newYear) {
      newYear = await Annee.create({ libelle: newYearLabel });
    }

    // 3. Récupérer les classes et gérer les élèves
    await sequelize.transaction(async (transaction) => {
      // Récupérer l'ID de la classe CM2
      const cm2Class = await Classe.findOne({ where: { libelle: 'CM2' }, transaction });

      if (!cm2Class) {
        throw new Error("La classe CM2 n'existe pas dans la base de données.");
      }

      // Identifier les élèves passant au collège
      const elevesToArchive = await Eleve.findAll({
        where: { fk_classe: cm2Class.id, Redoublement: false},
        include: [{ model: Classe }, { model: Annee }],
        transaction,
      });

      for (const eleve of elevesToArchive) {
        // Archiver les données de l'élève
        await Archive.create(
          {
            nom: eleve.nom,
            prenom: eleve.prenom,
            date_naissance: eleve.date_naissance,
            annee_cours: eleve.Annee.libelle,
            classe: eleve.Classe.libelle,
            professeur: "Affectation inconnue (passé au collège)", // Pas de classe collège définie
            passe: true,
          },
          { transaction }
        );

        // Supprimer l'élève de la table Eleve
        await eleve.destroy({ transaction });
      }

      // Élèves non en CM2 avec redoublement = false -> avancer leur classe
      const elevesToAdvance = await Eleve.findAll({
        where: { redouble: false, fk_classe: { [Op.ne]: cm2Class.id } },
        transaction,
      });

      for (const eleve of elevesToAdvance) {
        await eleve.update(
          { fk_classe: eleve.fk_classe + 1, fk_annee: newYear.id },
          { transaction }
        );
      }

      // Élèves ayant "redouble" à true -> remettre à false
      await Eleve.update(
        { redouble: false },
        { where: { redouble: true }, transaction }
      );
    });

    return res.status(200).json({
      message: "Renouvellement de l'année scolaire effectué avec succès.",
    });
  } catch (error) {
    console.error('Erreur lors du renouvellement de l\'année scolaire:', error);
    return res.status(500).json({
      message: 'Une erreur est survenue lors du renouvellement de l\'année scolaire.',
      error: error.message,
    });
  }
};

exports.setRedoublement = async (req, res, next) => {
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
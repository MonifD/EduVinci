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
      const { nom, prenom, date_naissance, annee_scolaire } = req.body; // Récupère les données envoyées dans la requête
  
      // Vérifie si l'élève a au moins 3 ans avant l'année scolaire en cours (4 septembre)
      const dateNaissance = new Date(date_naissance); // Transforme la date de naissance en objet Date
      const dateLimite = new Date(new Date().getFullYear() - 3, 8, 4); // 4 septembre de l'année en cours
  
      // Vérifie si l'élève a bien 3 ans ou plus avant la date limite
      if (dateNaissance > dateLimite) {
        return res.status(400).json({
          message: 'L\'élève doit avoir au moins 3 ans avant le 4 septembre de l\'année scolaire en cours.',
        });
      }
  
      // Si l'utilisateur n'a pas spécifié d'année scolaire, on calcule l'année scolaire par défaut
      let anneeScolaire = annee_scolaire || (new Date().getMonth() >= 8
        ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`  // Si on est après septembre
        : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`); // Si avant septembre
  
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
        redouble: false, // Par défaut, l'élève ne redouble pas
      });
  
      // Si l'élève est en redoublement, on archive son inscription précédente
      if (req.body.redouble) {
        const archive = await Archive.create({
          nom: eleve.nom,
          prenom: eleve.prenom,
          date_naissance: dateNaissance,
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

    // 3. Mettre à jour les élèves avec une transaction
    await sequelize.transaction(async (transaction) => {
      // Élèves ayant "redouble" à false -> avancer leur fk_classe
      const elevesToAdvance = await Eleve.findAll({
        where: { redouble: false },
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

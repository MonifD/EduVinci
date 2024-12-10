const { sequelize, Professeur, Salle, Classe, Eleve, Annee } = require('../Models/model'); // Import des modèles nécessaires

// Fonction de test des relations et insertion de données
async function testRelations() {
  try {
    // Synchroniser la base de données (à ne faire que si nécessaire)
    await sequelize.sync({ force: true }); // Attention : cela supprime et recrée les tables

    // Insérer un professeur
    const professeur = await Professeur.create({ nom: 'Doe', prenom: 'John' });

    // Insérer une salle
    const salle = await Salle.create({ libelle: 'Salle 101' });

    // Insérer une année
    const annee = await Annee.create({ libelle: '2023-2024' });

    // Insérer une classe (en respectant les valeurs possibles de l'énumération)
    const classe = await Classe.create({
      libelle: 'CP', // Exemple d'une valeur valide
      fk_prof: professeur.id,
      fk_salle: salle.id
    });

    // Insérer un élève avec des relations à la classe et à l'année
    const eleve = await Eleve.create({
      nom: 'Dupont',
      prenom: 'Marie',
      fk_classe: classe.id,
      fk_annee: annee.id,
      redouble: false
    });

    // Vérifier si les relations sont correctement établies
    const eleveDetails = await Eleve.findOne({
      where: { id: eleve.id },
      include: [
        {
          model: Classe,
          include: [Professeur, Salle] // Inclure Professeur et Salle liés à la Classe
        },
        {
          model: Annee // Inclure l'Année
        }
      ]
    });

    console.log('Élève inséré avec relations :', eleveDetails.toJSON());
  } catch (error) {
    console.error('Erreur lors du test des relations :', error);
    throw error; // Relancer l'erreur si nécessaire
  }
}

module.exports = { testRelations };

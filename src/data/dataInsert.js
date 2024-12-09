const { Professeur, Salle, Classe, Eleve, Annee } = require('../Models/model'); // Import des modèles nécessaires

// Fonction de test des relations et insertion de données
async function testRelations() {
  try {
    // Insérer un professeur et une salle
    const professeur = await Professeur.create({ nom: 'Doe', prenom: 'John' });
    const salle = await Salle.create({ libelle: 'Salle 101' });

    // Insérer une classe avec des références au professeur et à la salle
    const classe = await Classe.create({
      libelle: 'Mathématiques',
      fk_prof: professeur.id,
      fk_salle: salle.id
    });

    // Insérer une année
    const annee = await Annee.create({ libelle: '2023-2024' });

    // Insérer un élève et associer à une classe et à une année
    const eleve = await Eleve.create({
      nom: 'Dupont',
      prenom: 'Marie',
      fk_classe: classe.id,
      fk_annee: annee.id,
      redouble: false
    });

    // Vérifier si l'élève et la classe sont correctement liés
    const eleveDetails = await Eleve.findOne({
      where: { id: eleve.id },
      include: [
        { model: Classe, include: [Professeur, Salle] },
        { model: Annee }
      ]
    });

    console.log(eleveDetails.toJSON());  // Afficher les détails de l'élève avec les relations

  } catch (error) {
    console.error('Error during relation test:', error);
  }
}

module.exports = { testRelations };

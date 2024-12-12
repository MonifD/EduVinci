document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('authToken');

    // Vérifier si un token est présent
    if (token) {
      try {
        // Décodez le token pour obtenir les informations utilisateur
        const decoded = jwt_decode(token);

        // Vérifier le rôle de l'utilisateur (admin ou non)
        if (decoded.role === 'admin') {
          // Afficher les liens réservés à l'admin
          document.getElementById('inscription').style.display = 'block';
          document.getElementById('fin-annee').style.display = 'block';
        }

        // Afficher le lien de déconnexion et masquer les liens de connexion
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('signup-link').style.display = 'none';
        document.getElementById('logout').style.display = 'block';

        // Ajouter un écouteur d'événements pour la déconnexion
        document.getElementById('logout-link')?.addEventListener('click', () => {
          localStorage.removeItem('authToken');  // Supprimer le token du localStorage
          window.location.href = '/';  // Rediriger vers la page d'accueil
        });
        
      } catch (error) {
        console.error("Erreur lors du décodage du token", error);
      }
    } else {
      // Si pas de token, masquer les liens réservés aux utilisateurs connectés
      document.getElementById('inscription').style.display = 'none';
      document.getElementById('fin-annee').style.display = 'none';
      document.getElementById('login-link').style.display = 'block';
      document.getElementById('signup-link').style.display = 'none';
      document.getElementById('logout').style.display = 'none';
    }
});

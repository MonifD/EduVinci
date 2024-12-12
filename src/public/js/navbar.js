document.addEventListener('DOMContentLoaded', () => {
  // Récupérer le token du localStorage
  const token = localStorage.getItem('authToken');

  // Rendre tous les éléments cachés par défaut sauf les liens accessibles à tous
  const hideElement = (id) => {
      const element = document.getElementById(id);
      if (element) element.style.display = 'none';
  };

  hideElement('liste-eleves');
  hideElement('inscription');
  hideElement('fin-annee');
  hideElement('signup-link');
  hideElement('logout');

  // Afficher les liens accessibles à tous
  document.getElementById('login-link').style.display = 'block';

  // Vérifier si un token est présent
  if (token) {
      try {
          // Décodez le token pour obtenir les informations utilisateur
          const decoded = jwt_decode(token);
          const role = decoded.role;

          // Gérer la visibilité en fonction du rôle
          switch (role) {
              case 'Administrateur':
                  // Admin peut tout voir
                  document.getElementById('inscription').style.display = 'block';
                  document.getElementById('fin-annee').style.display = 'block';
                  document.getElementById('signup-link').style.display = 'block';
                  break;

              case 'Maire':
                  document.getElementById('inscription').style.display = 'block';
                  break;

              case 'Professeur':
                  document.querySelector('a[href="/liste_eleves"]').parentElement.style.display = 'block';
                  document.getElementById('fin-annee').style.display = 'block';
                  document.querySelector('a[href="/liste_redoublants"]').parentElement.style.display = 'block';
                  document.querySelector('a[href="/annee_suivante"]').parentElement.style.display = 'none';
                  break;

              case 'Directrice':
                  document.getElementById('fin-annee').style.display = 'block';
                  document.querySelector('a[href="/liste_redoublants"]').parentElement.style.display = 'none';
                  document.querySelector('a[href="/annee_suivante"]').parentElement.style.display = 'block';
                  break;

              default:
                  console.warn('Rôle inconnu :', role);
                  break;
          }

          // Afficher les éléments pour un utilisateur connecté
          document.getElementById('login-link').style.display = 'none';
          document.getElementById('logout').style.display = 'block';

          // Ajouter un écouteur d'événements pour la déconnexion
          document.getElementById('logout-link')?.addEventListener('click', () => {
              localStorage.removeItem('authToken');
              window.location.href = '/';
          });
      } catch (error) {
          console.error('Erreur lors du décodage du token', error);
      }
  } else {
      // Si pas de token, afficher uniquement les liens publics
      document.getElementById('logout').style.display = 'none';
      document.querySelector('a[href="/liste_eleves"]').parentElement.style.display = 'none';
      document.getElementById('login-link').style.display = 'block';
  }
});

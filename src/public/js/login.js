const form = document.getElementById('login-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(email);
  console.log(password);
  
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Si la connexion réussit, on stocke le token dans le localStorage
    localStorage.setItem('authToken', data.token);
    window.location.href = '/'; // Rediriger l'utilisateur vers la page d'accueil
  } else {
    alert(data.message); // Afficher un message d'erreur
  }
});


async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken');
  console.log('Token récupéré dans fetchWithAuth:', token);
  const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
}

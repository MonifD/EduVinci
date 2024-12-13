const form = document.querySelector(".register-form form");
const passwordInput = form.querySelector("input[name='password']");
const confirmPasswordInput = form.querySelector("input[name='confirm_password']");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Vérifier si les mots de passe correspondent
    if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Les mots de passe ne correspondent pas. Veuillez les vérifier.");
    }
    else {
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        const response = await fetch('/registration', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom, prenom, email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/'; // Rediriger l'utilisateur vers la page d'accueil
        } else {
            alert(data.message); // Afficher un message d'erreur
        }
    }
});

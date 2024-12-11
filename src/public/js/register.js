document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".register-form form");
    const passwordInput = form.querySelector("input[name='password']");
    const confirmPasswordInput = form.querySelector("input[name='confirm_password']");

    form.addEventListener("submit", (event) => {
        // Vérifier si les mots de passe correspondent
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault(); // Empêche la soumission du formulaire
            alert("Les mots de passe ne correspondent pas. Veuillez les vérifier.");
        }
    });
});
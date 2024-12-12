document.getElementById('importForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page
    const formData = new FormData(this);

    try {
        const response = await fetch('/import', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        const resultDiv = document.getElementById('result');

        if (response.ok) {
            resultDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-danger">${result.message}<br>${result.error || ''}</div>`;
        }
    } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        document.getElementById('result').innerHTML = `<div class="alert alert-danger">Une erreur inattendue est survenue.</div>`;
    }
});
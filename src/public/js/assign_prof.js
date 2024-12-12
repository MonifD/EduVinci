document.getElementById('assign-prof-form').addEventListener('submit', function (event) {
  const confirmation = confirm("Êtes-vous sûr de vouloir assigner ce professeur à cette classe ?");
  if (!confirmation) {
      event.preventDefault();
  }
});

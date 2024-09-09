//Récupération  des catégories de l'API
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    // contient la liste des projets provenant du back-end
    console.log(works); // Affiche les projets dans la console (facultatif)
    afficherGalerie(works); // Appel d'une fonction pour ajouter les travaux à la galerie
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des travaux :", error);
  });

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
function afficherGalerie(works) {
  const galerieElement = document.querySelector(".gallery");

  // Vider le contenu existant de la galerie pour éviter les doublons
  galerieElement.innerHTML = "";

  // Parcourir chaque projet récupéré depuis l'API
  works.forEach((work) => {
    // Créer un élément figure pour chaque projet
    const figure = document.createElement("figure");

    // Créer un élément img pour l'image du projet
    const img = document.createElement("img");
    img.src = work.imageUrl; // URL de l'image provenant de l'API
    img.alt = work.title;
    // Créer un figcaption pour le titre du projet
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title; // Le titre du projet

    // Ajouter l'image et le titre à la figure
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajouter la figure à la galerie
    galerieElement.appendChild(figure);
  });
}

window.onload = async function () {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works);
    afficherGalerie(works); // Appel d'une fonction pour afficher tous les travaux
    genererMenuCategories(works); // Appel de la fonction pour générer les filtres par catégories
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
};

// Fonction pour afficher les projets dans la galerie
function afficherGalerie(works) {
  const galerieElement = document.querySelector(".gallery");

  // Vider la galerie avant d'afficher de nouveaux éléments
  galerieElement.innerHTML = "";

  // Parcourir les travaux et créer des éléments pour chaque projet
  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    galerieElement.appendChild(figure);
  });
}

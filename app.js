window.onload = async function () {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets");
    }
    const works = await response.json();
    console.log("Données récupérées de l'API:", works);
    afficherGalerie(works);
    genererMenuCategories(works);
    cacherBoutonsSiConnecte(); // Appel de la fonction pour cacher les boutons
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
};

// Fonction pour afficher les projets dans la galerie
function afficherGalerie(works) {
  const galerieElement = document.querySelector(".gallery");
  galerieElement.innerHTML = "";

  works.forEach((work) => {
    console.log("Affichage du projet:", work);

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

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

// Fonction pour générer le menu des catégories
function genererMenuCategories(works) {
  const menuCategoriesElement = document.querySelector(".menu-categories");

  if (!menuCategoriesElement) {
    console.error("L'élément .menu-categories n'a pas été trouvé dans le DOM.");
    return;
  }

  const categoriesSet = new Set(works.map((work) => work.category.name));

  const boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";
  boutonTous.classList.add("boutonTous");
  boutonTous.addEventListener("click", () => afficherGalerie(works));
  menuCategoriesElement.appendChild(boutonTous);

  categoriesSet.forEach((categorie) => {
    const boutonCategorie = document.createElement("button");
    boutonCategorie.innerText = categorie;
    boutonCategorie.classList.add("boutonsFiltres");
    boutonCategorie.addEventListener("click", () => {
      const travauxFiltres = works.filter(
        (work) => work.category.name === categorie
      );
      afficherGalerie(travauxFiltres);
    });

    menuCategoriesElement.appendChild(boutonCategorie);
  });
}

// Fonction pour cacher les boutons "Tous", "Objets", "Appartements", et "Hôtel & Restaurants" si l'utilisateur est connecté
function cacherBoutonsSiConnecte() {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    const boutonsCategories = document.querySelectorAll(
      ".menu-categories button"
    );
    boutonsCategories.forEach((bouton) => {
      bouton.style.display = "none";
    });
  }
}

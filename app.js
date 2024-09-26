window.onload = async function () {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets");
    }
    const works = await response.json();
    console.log("Données récupérées de l'API:", works); // Log des données récupérées
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
    console.log("Affichage du projet:", work); // Vérification des données du projet

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl; // URL de l'image récupérée depuis l'API
    img.alt = work.title; // Titre de l'image pour l'attribut alt

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title; // Ajout du titre sous l'image

    figure.appendChild(img); // Ajout de l'image dans la figure
    figure.appendChild(figcaption); // Ajout du titre dans la figure
    galerieElement.appendChild(figure); // Ajout de la figure dans la galerie
  });
}

// Fonction pour générer le menu des catégories
function genererMenuCategories(works) {
  console.log("Génération du menu de catégories...");

  // Sélectionne l'élément menu-categories
  const menuCategoriesElement = document.querySelector(".menu-categories");
  console.log(menuCategoriesElement); // Vérifie si l'élément est trouvé

  if (!menuCategoriesElement) {
    console.error("L'élément .menu-categories n'a pas été trouvé dans le DOM.");
    return;
  }

  // Crée le Set pour les catégories uniques
  const categoriesSet = new Set(works.map((work) => work.category.name));

  // Ajouter un bouton pour "Tous"
  const boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";
  boutonTous.classList.add("boutonTous"); // CSS pour le bouton
  boutonTous.addEventListener("click", () => afficherGalerie(works));
  menuCategoriesElement.appendChild(boutonTous);

  // Créer les boutons pour chaque catégorie unique
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

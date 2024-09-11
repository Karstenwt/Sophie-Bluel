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
  boutonTous.classList.add("boutonTous"); //css pour le bouton
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

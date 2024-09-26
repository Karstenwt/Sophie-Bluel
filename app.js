// Gestion de l'affichage du bouton Modifier et de la barre Mode édition
function afficherModeEdition() {
  const authToken = localStorage.getItem("authToken"); // Récupérer le token d'authentification
  const lienModifier = document.querySelector(".link-modifier");
  const blackBar = document.querySelector(".black-bar");

  if (authToken) {
    // Si l'utilisateur est connecté (authToken existe)
    if (lienModifier) {
      lienModifier.style.display = "inline-flex"; // Afficher le bouton "Modifier"
    }

    if (!blackBar) {
      // Si la barre noire n'existe pas encore, on la crée
      const blackBarElement = document.createElement("div");
      blackBarElement.classList.add("black-bar");
      blackBarElement.innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i> Mode édition';
      document.body.prepend(blackBarElement); // Ajouter la barre noire en haut du body
    } else {
      blackBar.style.display = "flex"; // Si elle existe, s'assurer qu'elle soit visible
    }
  } else {
    // Si l'utilisateur n'est pas connecté (authToken n'existe pas)
    if (lienModifier) {
      lienModifier.style.display = "none"; // Masquer le bouton "Modifier"
    }

    if (blackBar) {
      blackBar.style.display = "none"; // Masquer la barre "Mode édition"
    }
  }
}

// Gestion de la déconnexion
function gererDeconnexion() {
  const loginLink = document.querySelector('nav a[href="login.html"]');
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    // Si l'utilisateur est connecté, afficher "Logout"
    loginLink.innerText = "Logout";
    loginLink.addEventListener("click", function (e) {
      e.preventDefault(); // Empêche l'action par défaut
      localStorage.removeItem("authToken"); // Supprime le token pour déconnecter l'utilisateur
      window.location.href = "index.html"; // Redirige vers la page d'accueil
    });
  } else {
    // Si l'utilisateur n'est pas connecté, afficher "Login"
    loginLink.innerText = "Login";
  }
}

// Appel de la gestion de la déconnexion et du mode édition au chargement de la page
window.addEventListener("load", () => {
  afficherModeEdition();
  gererDeconnexion();
});

// Chargement de la galerie et génération du menu des catégories
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

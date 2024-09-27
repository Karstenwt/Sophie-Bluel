// Sélection de l'overlay et des modales
const overlay = document.querySelector(".modales");
const modale1 = document.getElementById("modale1");
const modale2 = document.getElementById("modale2");

// Sélection des boutons nécessaires
const boutonRetour = document.getElementById("retour");
const boutonFermerModale1 = document.getElementById("fermer-modale1");
const boutonFermerModale2 = document.getElementById("fermer-modale2");
const boutonAjouterPhotoGallery = document.getElementById(
  "bouton-ajouter-photo-gallery"
);
const boutonAjouterPhotoModale1 = document.getElementById("validation");
const validerBtn = document.getElementById("valider-modale2");
const inputImage = document.getElementById("selectionner");
const imagePreview = document.getElementById("image-prev");
const iconeImage = document.getElementById("icone-image");
const boutonAjouterPhoto = document.getElementById("bouton-ajouter-photo");
const infoFormats = document.querySelector("#section-ajout p");

// Fonction pour afficher la modale 1 (Galerie photo)
function ouvrirModale1() {
  modale1.style.display = "block";
  modale1.removeAttribute("aria-hidden");
  modale1.setAttribute("aria-modal", "true");
  overlay.style.display = "block";
}

// Fonction pour fermer la modale 1
function fermerModale1() {
  modale1.style.display = "none";
  modale1.removeAttribute("aria-modal");
  modale1.setAttribute("aria-hidden", "true");
  overlay.style.display = "none";
}

// Fonction pour afficher la modale 2 (Ajout de photo)
function ouvrirModale2() {
  modale2.style.display = "block";
  modale2.removeAttribute("aria-hidden");
  modale2.setAttribute("aria-modal", "true");
  overlay.style.display = "block";
}

// Fonction pour fermer la modale 2
function fermerModale2() {
  modale2.style.display = "none";
  modale2.removeAttribute("aria-modal");
  modale2.setAttribute("aria-hidden", "true");
  overlay.style.display = "none";
}

// Gestion du bouton "Retour" dans la modale 2
boutonRetour.addEventListener("click", (e) => {
  e.preventDefault();
  fermerModale2();
  ouvrirModale1();
});

// Gestion de l'ouverture de la modale au clic sur "Modifier"
function modificationProjets() {
  const modifierProjets = document.querySelector(".link-modifier");
  if (modifierProjets) {
    modifierProjets.addEventListener("click", (e) => {
      e.preventDefault();
      ouvrirModale1();
    });
  }
}

// Gestion de la fermeture de la modale au clic sur la croix de modale1
if (boutonFermerModale1) {
  boutonFermerModale1.addEventListener("click", (e) => {
    e.preventDefault();
    fermerModale1();
  });
}

// Gestion de la fermeture de la modale au clic sur la croix de modale2
if (boutonFermerModale2) {
  boutonFermerModale2.addEventListener("click", (e) => {
    e.preventDefault();
    fermerModale2();
    resetPrevisualisation(); // Réinitialiser la modale après fermeture
  });
}

// Fermeture de la modale en cliquant en dehors (overlay)
if (overlay) {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      fermerModale1();
      fermerModale2();
      resetPrevisualisation(); // Réinitialiser la modale après fermeture
    }
  });
}

// Le bouton "Ajouter une photo" dans la modale 1 ouvre la modale 2
function ajouterPhoto() {
  if (boutonAjouterPhotoModale1) {
    boutonAjouterPhotoModale1.addEventListener("click", (e) => {
      e.preventDefault();
      fermerModale1();
      ouvrirModale2();
    });
  }
}

// Fonction pour afficher les miniatures dans la modale 1
function affichageDesMiniature() {
  const miniatures = document.getElementById("affichage-miniature");
  miniatures.innerHTML = "";

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projets) => {
      projets.forEach((elements) => {
        if (elements !== null) {
          const ficheMiniature = document.createElement("div");
          ficheMiniature.classList.add("fiche-miniature");
          ficheMiniature.setAttribute("id", `projet-${elements.id}`);

          const icones = document.createElement("div");
          icones.classList.add("icones-fiche-miniature");

          const boutonDeplacer = document.createElement("button");
          boutonDeplacer.setAttribute("id", "bouton-deplacer");
          const iconeDeplacer = document.createElement("i");
          iconeDeplacer.classList = "fa-solid fa-arrows-up-down-left-right";
          iconeDeplacer.setAttribute("id", "icone-deplacer");

          const boutonSupprimer = document.createElement("button");
          boutonSupprimer.classList.add("bouton-delete");
          boutonSupprimer.setAttribute("id", elements.id);

          const iconeEffacer = document.createElement("i");
          iconeEffacer.classList = "fa-solid fa-trash-can";

          const image = document.createElement("img");
          image.src = elements.imageUrl;
          image.classList.add("image-miniature");

          const editer = document.createElement("a");
          editer.innerText = "éditer";
          editer.classList.add("editer");

          icones.appendChild(boutonDeplacer);
          boutonDeplacer.appendChild(iconeDeplacer);
          icones.appendChild(boutonSupprimer);
          boutonSupprimer.appendChild(iconeEffacer);
          ficheMiniature.appendChild(icones);
          ficheMiniature.appendChild(image);
          ficheMiniature.appendChild(editer);
          miniatures.appendChild(ficheMiniature);
        }
      });

      document.querySelectorAll(".bouton-delete").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const projetId = button.getAttribute("id");
          supprimerProjet(projetId);
        });
      });
    });
}

// Fonction pour supprimer un projet
function supprimerProjet(projetId) {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${projetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.ok) {
      const projetElement = document.getElementById(`projet-${projetId}`);
      if (projetElement) {
        projetElement.remove();
      } else {
        console.error("Projet non trouvé dans le DOM : " + projetId);
      }
      retirerProjetDeGalerie(projetId);
    } else {
      alert("Erreur lors de la suppression du projet");
    }
  });
}

// Fonction pour retirer le projet de la galerie principale
function retirerProjetDeGalerie(projetId) {
  const figure = document.querySelector(`figure[data-id='${projetId}']`);
  if (figure) {
    figure.remove();
  }
}

// Fonction pour vérifier le formulaire d'ajout de projet
function verifierFormulaireAjout() {
  const inputImage = document.getElementById("selectionner");
  const inputTitre = document.getElementById("titre");
  const inputCategorie = document.getElementById("liste-categories");

  if (!inputImage.files[0] || !inputTitre.value || !inputCategorie.value) {
    alert("Veuillez remplir tous les champs et sélectionner une image.");
    return false;
  }
  return true;
}

// Fonction pour envoyer le nouveau projet au backend
async function envoyerNouveauProjet() {
  if (!verifierFormulaireAjout()) return;

  const formData = new FormData();
  formData.append("image", document.getElementById("selectionner").files[0]);
  formData.append("title", document.getElementById("titre").value);
  formData.append(
    "category",
    document.getElementById("liste-categories").value
  );

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du projet");
    }

    const nouveauProjet = await response.json();
    console.log("Projet ajouté avec succès : ", nouveauProjet);

    ajouterProjetDOM(nouveauProjet);

    document.querySelector(".formulaire-ajout").reset();
    resetPrevisualisation();
    validerBtn.classList.remove("active"); // Réinitialiser le bouton "Valider" à l'état gris
    fermerModale2();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de l'ajout du projet.");
  }
}

// Fonction pour ajouter le projet au DOM
function ajouterProjetDOM(projet) {
  const galerieElement = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.setAttribute("data-id", projet.id);

  const img = document.createElement("img");
  img.src = projet.imageUrl;
  img.alt = projet.title;

  const figcaption = document.createElement("figcaption");
  figcaption.innerText = projet.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  galerieElement.appendChild(figure);

  const miniatures = document.getElementById("affichage-miniature");
  const ficheMiniature = document.createElement("div");
  ficheMiniature.classList.add("fiche-miniature");
  ficheMiniature.setAttribute("id", `projet-${projet.id}`);

  const icones = document.createElement("div");
  icones.classList.add("icones-fiche-miniature");

  const boutonDeplacer = document.createElement("button");
  boutonDeplacer.setAttribute("id", "bouton-deplacer");
  const iconeDeplacer = document.createElement("i");
  iconeDeplacer.classList = "fa-solid fa-arrows-up-down-left-right";
  iconeDeplacer.setAttribute("id", "icone-deplacer");

  const boutonSupprimer = document.createElement("button");
  boutonSupprimer.classList.add("bouton-delete");
  boutonSupprimer.setAttribute("id", projet.id);

  const iconeEffacer = document.createElement("i");
  iconeEffacer.classList = "fa-solid fa-trash-can";

  const image = document.createElement("img");
  image.src = projet.imageUrl;
  image.classList.add("image-miniature");

  const editer = document.createElement("a");
  editer.innerText = "éditer";
  editer.classList.add("editer");

  icones.appendChild(boutonDeplacer);
  boutonDeplacer.appendChild(iconeDeplacer);
  icones.appendChild(boutonSupprimer);
  boutonSupprimer.appendChild(iconeEffacer);
  ficheMiniature.appendChild(icones);
  ficheMiniature.appendChild(image);
  ficheMiniature.appendChild(editer);
  miniatures.appendChild(ficheMiniature);

  boutonSupprimer.addEventListener("click", (e) => {
    e.preventDefault();
    supprimerProjet(projet.id);
  });
}

// Fonction pour prévisualiser l'image sélectionnée
function previsualiserImage() {
  inputImage.addEventListener("change", function () {
    const file = inputImage.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        // Affiche l'image sélectionnée dans la zone de prévisualisation
        imagePreview.style.backgroundImage = `url(${reader.result})`;
        imagePreview.style.backgroundSize = "cover";
        imagePreview.style.backgroundPosition = "center";
        imagePreview.style.height = "169px";

        // Masque les éléments inutiles après sélection
        iconeImage.style.display = "none";
        boutonAjouterPhoto.style.display = "none";
        infoFormats.style.display = "none";
      });

      reader.readAsDataURL(file);
    } else {
      // Si aucun fichier n'est sélectionné, réinitialiser le bouton "Valider"
      if (validerBtn) {
        validerBtn.classList.remove("active");
      }
    }
  });
}

// Fonction pour réinitialiser la prévisualisation de l'image
function resetPrevisualisation() {
  const imagePreview = document.getElementById("image-prev");
  const iconeImage = document.getElementById("icone-image");
  const boutonAjouterPhoto = document.getElementById("bouton-ajouter-photo");
  const infoFormats = document.querySelector("#section-ajout p");

  // Réinitialiser l'image de prévisualisation
  imagePreview.style.backgroundImage = "";
  imagePreview.style.height = "auto";

  // Réafficher les éléments
  iconeImage.style.display = "block";
  boutonAjouterPhoto.style.display = "block";
  infoFormats.style.display = "block";

  // Réinitialiser le bouton "Valider" à l'état gris
  if (validerBtn) {
    validerBtn.classList.remove("active");
  }
}

// Sélection du formulaire
const formulaireAjout = document.querySelector(".formulaire-ajout");

// Ajout d'un écouteur d'événements pour la soumission du formulaire
if (formulaireAjout) {
  formulaireAjout.addEventListener("submit", function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    envoyerNouveauProjet(); // Appelle la fonction pour envoyer le nouveau projet
  });
}

// Fonction pour afficher ou masquer le lien "Modifier" en fonction du mode édition
function afficherLienModifier() {
  const lienModifier = document.querySelector(".link-modifier");

  if (!lienModifier) {
    console.warn("L'élément .link-modifier n'a pas été trouvé dans le DOM.");
    return; // Si l'élément n'existe pas, arrêter l'exécution
  }

  const authToken = localStorage.getItem("authToken"); // Vérifier si l'utilisateur est connecté

  if (authToken) {
    lienModifier.style.display = "inline-flex"; // Affiche le lien si l'utilisateur est connecté
  } else {
    lienModifier.style.display = "none"; // Masque le lien si l'utilisateur n'est pas connecté
  }
}

// Fonction pour afficher la barre noire de mode édition uniquement si l'utilisateur est connecté
function afficherBlackBar() {
  const authToken = localStorage.getItem("authToken"); // Vérifier si l'utilisateur est connecté

  if (authToken) {
    // Si l'utilisateur est connecté, afficher la barre noire
    const blackBar = document.createElement("div");
    blackBar.classList.add("black-bar");

    // Créer l'icône
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-pen-to-square");
    icon.style.marginRight = "10px"; // Ajouter un espacement entre l'icône et le texte

    // Ajouter l'icône et le texte à la barre
    blackBar.appendChild(icon);
    blackBar.appendChild(document.createTextNode("Mode édition"));

    // Ajouter la barre noire en haut du body
    document.body.prepend(blackBar);

    // Ajouter la classe 'edit-mode' pour ajouter une marge en haut du body
    document.body.classList.add("edit-mode");
  }
}

// Fonction pour mettre à jour le bouton "Login" ou "Logout" en fonction de l'état de connexion
function updateLoginLogoutButton() {
  const authToken = localStorage.getItem("authToken");
  const loginLink = document.querySelector('nav a[href="login.html"]');

  // Appliquer la classe appropriée pour le style des boutons
  if (loginLink) {
    loginLink.classList.add("nav-button");
  }

  if (authToken) {
    // Si l'utilisateur est connecté, afficher "Logout"
    loginLink.innerText = "Logout";

    // Afficher la black bar de mode édition et le lien "Modifier"
    afficherBlackBar();
    afficherLienModifier();

    // Gestion de la déconnexion
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Supprimer le token du localStorage pour déconnecter l'utilisateur
      localStorage.removeItem("authToken");
      // Supprimer la classe 'edit-mode' du body
      document.body.classList.remove("edit-mode");
      // Rediriger vers la page de login après déconnexion
      window.location.href = "index.html";
    });
  } else {
    // Si l'utilisateur n'est pas connecté, afficher "Login"
    loginLink.innerText = "Login";
    afficherLienModifier(); // Masquer le lien "Modifier"
  }
}

// Appel des fonctions pour gérer les interactions
affichageDesMiniature();
modificationProjets();
ajouterPhoto();
previsualiserImage();

// Appel de la fonction de mise à jour au chargement de la page principale
window.addEventListener("load", function () {
  updateLoginLogoutButton();
});

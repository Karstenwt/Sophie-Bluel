// Sélection de l'overlay et des modales
const overlay = document.querySelector(".modales");
const modale1 = document.getElementById("modale1");
const modale2 = document.getElementById("modale2");

// Fonction pour afficher la modale 1 (Galerie photo)
function ouvrirModale1() {
  modale1.style.display = "block";
  modale1.removeAttribute("aria-hidden"); // rend la modale visible
  modale1.setAttribute("aria-modal", "true");
  overlay.style.display = "block"; // Affiche l'overlay
}

// Fonction pour fermer la modale 1
function fermerModale1() {
  modale1.style.display = "none";
  modale1.removeAttribute("aria-modal"); // pour indiquer que la modale est cachée
  modale1.setAttribute("aria-hidden", "true");
  overlay.style.display = "none"; // Masque l'overlay si aucune autre modale n'est ouverte
}

// Fonction pour afficher la modale 2 (Ajout de photo)
function ouvrirModale2() {
  modale2.style.display = "block";
  modale2.removeAttribute("aria-hidden");
  modale2.setAttribute("aria-modal", "true");
  overlay.style.display = "block"; // Affiche l'overlay (réaffiché ici au cas où il serait caché)
}

// Fonction pour fermer la modale 2
function fermerModale2() {
  modale2.style.display = "none";
  modale2.removeAttribute("aria-modal");
  modale2.setAttribute("aria-hidden", "true");
  overlay.style.display = "none"; // Masque l'overlay
}

// Gestion de l'ouverture de la modale au clic sur "Modifier"
function modificationProjets() {
  const modifierProjets = document.querySelector(".link-modifier");
  modifierProjets.addEventListener("click", (e) => {
    e.preventDefault();
    ouvrirModale1();
  });
}

// Gestion de la fermeture de la modale au clic sur la croix
function boutonFermerModale1() {
  const boutonFermer = document.getElementById("fermer-modale1");
  boutonFermer.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche l'action par défaut
    fermerModale1();
  });
}

// Gestion de la fermeture de la modale au clic sur la croix de modale2
function boutonFermerModale2() {
  const boutonFermer = document.getElementById("fermer-modale2");
  boutonFermer.addEventListener("click", (e) => {
    e.preventDefault();
    fermerModale2();
  });
}

// Fermeture de la modale en cliquant en dehors (overlay)
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    fermerModale1();
    fermerModale2();
  }
});

// Le bouton "Ajouter une photo" dans la modale 1 ouvre la modale 2
function ajouterPhoto() {
  const boutonAjouterPhotoModale1 = document.getElementById("validation");
  boutonAjouterPhotoModale1.addEventListener("click", (e) => {
    e.preventDefault();
    fermerModale1();
    ouvrirModale2();
  });
}

// Fonction pour afficher les miniatures dans la modale 1
function affichageDesMiniature() {
  const miniatures = document.getElementById("affichage-miniature");
  miniatures.innerHTML = ""; // Réinitialise le contenu avant d'ajouter de nouvelles miniatures

  // Récupération des éléments depuis l'API
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projets) => {
      // Boucle pour chaque projet récupéré
      projets.forEach((elements) => {
        if (elements !== null) {
          // Création des miniatures
          const ficheMiniature = document.createElement("div");
          ficheMiniature.classList.add("fiche-miniature");
          ficheMiniature.setAttribute("id", `projet-${elements.id}`); // Assigner l'ID du projet à la miniature

          const icones = document.createElement("div");
          icones.classList.add("icones-fiche-miniature");

          // Ajout des icônes de déplacement
          const boutonDeplacer = document.createElement("button");
          boutonDeplacer.setAttribute("id", "bouton-deplacer");
          const iconeDeplacer = document.createElement("i");
          iconeDeplacer.classList = "fa-solid fa-arrows-up-down-left-right";
          iconeDeplacer.setAttribute("id", "icone-deplacer");

          // Ajout du bouton de suppression
          const boutonSupprimer = document.createElement("button");
          boutonSupprimer.classList.add("bouton-delete");
          boutonSupprimer.setAttribute("id", elements.id); // Assigner l'ID de chaque projet

          // Ajout de l'icône trash can
          const iconeEffacer = document.createElement("i");
          iconeEffacer.classList = "fa-solid fa-trash-can";

          // Création et ajout de l'image miniature
          const image = document.createElement("img");
          image.src = elements.imageUrl;
          image.classList.add("image-miniature");

          // Ajout de l'option éditer
          const editer = document.createElement("a");
          editer.innerText = "éditer";
          editer.classList.add("editer");

          // Ajout des éléments dans le DOM
          icones.appendChild(boutonDeplacer);
          boutonDeplacer.appendChild(iconeDeplacer);
          icones.appendChild(boutonSupprimer);
          boutonSupprimer.appendChild(iconeEffacer);
          ficheMiniature.appendChild(icones);
          ficheMiniature.appendChild(image);
          ficheMiniature.appendChild(editer);
          miniatures.appendChild(ficheMiniature); // Ajoute la miniature à la modale
        }
      });

      // Gestion du clic pour supprimer un projet
      document.querySelectorAll(".bouton-delete").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const projetId = button.getAttribute("id"); // Récupérer l'ID du bouton de suppression
          supprimerProjet(projetId);
        });
      });
    });
}

// Fonction pour supprimer un projet
function supprimerProjet(projetId) {
  const authToken = localStorage.getItem("authToken"); // Récupérer le token depuis localStorage

  if (!authToken) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${projetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`, // Inclure le token dans l'en-tête
    },
  }).then((response) => {
    if (response.ok) {
      // Vérifie si l'élément existe avant de le supprimer
      const projetElement = document.getElementById(`projet-${projetId}`);
      if (projetElement) {
        projetElement.remove(); // Supprime l'élément du DOM
      } else {
        console.error("Projet non trouvé dans le DOM : " + projetId);
      }
      // Mise à jour de la galerie principale
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

    // Mise à jour dynamique de la galerie et de la modale
    ajouterProjetDOM(nouveauProjet);

    // Réinitialiser le formulaire
    document.querySelector(".formulaire-ajout").reset();
    // Réinitialiser la prévisualisation
    resetPrevisualisation();

    // Fermer la modale d'ajout
    fermerModale2();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de l'ajout du projet.");
  }
}

// Fonction pour ajouter le projet au DOM (galerie et modale)
function ajouterProjetDOM(projet) {
  // Ajout dans la galerie principale
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

  // Ajout dans la modale (miniature)
  const miniatures = document.getElementById("affichage-miniature");
  const ficheMiniature = document.createElement("div");
  ficheMiniature.classList.add("fiche-miniature");
  ficheMiniature.setAttribute("id", `projet-${projet.id}`);

  const icones = document.createElement("div");
  icones.classList.add("icones-fiche-miniature");

  // Bouton déplacer (optionnel)
  const boutonDeplacer = document.createElement("button");
  boutonDeplacer.setAttribute("id", "bouton-deplacer");
  const iconeDeplacer = document.createElement("i");
  iconeDeplacer.classList = "fa-solid fa-arrows-up-down-left-right";
  iconeDeplacer.setAttribute("id", "icone-deplacer");

  // Bouton supprimer
  const boutonSupprimer = document.createElement("button");
  boutonSupprimer.classList.add("bouton-delete");
  boutonSupprimer.setAttribute("id", projet.id);

  const iconeEffacer = document.createElement("i");
  iconeEffacer.classList = "fa-solid fa-trash-can";

  // Image miniature
  const image = document.createElement("img");
  image.src = projet.imageUrl;
  image.classList.add("image-miniature");

  // Option éditer
  const editer = document.createElement("a");
  editer.innerText = "éditer";
  editer.classList.add("editer");

  // Ajout des éléments
  icones.appendChild(boutonDeplacer);
  boutonDeplacer.appendChild(iconeDeplacer);
  icones.appendChild(boutonSupprimer);
  boutonSupprimer.appendChild(iconeEffacer);
  ficheMiniature.appendChild(icones);
  ficheMiniature.appendChild(image);
  ficheMiniature.appendChild(editer);
  miniatures.appendChild(ficheMiniature);

  // Ajouter l'événement de suppression sur le nouveau bouton
  boutonSupprimer.addEventListener("click", (e) => {
    e.preventDefault();
    supprimerProjet(projet.id);
  });
}

// Fonction pour prévisualiser l'image sélectionnée
function previsualiserImage() {
  const inputImage = document.getElementById("selectionner");
  const zonePrevisu = document.getElementById("section-ajout");
  const iconeImage = document.getElementById("icone-image");
  const boutonAjouterPhoto = document.getElementById("bouton-ajouter-photo");
  const texteFormats = document.getElementById("texte-formats");

  inputImage.addEventListener("change", () => {
    const fichier = inputImage.files[0];
    if (fichier) {
      const reader = new FileReader();
      reader.onload = function (e) {
        zonePrevisu.style.backgroundImage = `url(${e.target.result})`;
        zonePrevisu.style.backgroundSize = "cover";
        zonePrevisu.style.backgroundPosition = "center";
        // Masquer les éléments
        iconeImage.style.display = "none";
        boutonAjouterPhoto.style.display = "none";
        texteFormats.style.display = "none";
      };
      reader.readAsDataURL(fichier);
    }
  });
}

// Fonction pour réinitialiser la prévisualisation
function resetPrevisualisation() {
  const zonePrevisu = document.getElementById("section-ajout");
  const iconeImage = document.getElementById("icone-image");
  const boutonAjouterPhoto = document.getElementById("bouton-ajouter-photo");
  const texteFormats = document.getElementById("texte-formats");

  zonePrevisu.style.backgroundImage = "none";
  iconeImage.style.display = "block";
  boutonAjouterPhoto.style.display = "block";
  texteFormats.style.display = "block";
}

// Événement sur le bouton "Valider" du formulaire d'ajout
function activerEnvoiFormulaire() {
  const formulaireAjout = document.querySelector(".formulaire-ajout");
  formulaireAjout.addEventListener("submit", (e) => {
    e.preventDefault();
    envoyerNouveauProjet();
  });
}

// Appels des fonctions
affichageDesMiniature();
modificationProjets();
boutonFermerModale1();
boutonFermerModale2();
ajouterPhoto();
activerEnvoiFormulaire();
previsualiserImage();

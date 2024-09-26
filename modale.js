// Sélection de l'overlay et des modales
const overlay = document.querySelector(".modales");
const modale1 = document.getElementById("modale1");
const modale2 = document.getElementById("modale2");

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
const boutonRetour = document.getElementById("retour");
boutonRetour.addEventListener("click", (e) => {
  e.preventDefault();
  fermerModale2();
  ouvrirModale1();
});

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
    e.preventDefault();
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

// Appel des fonctions pour gérer l'ajout de projet
affichageDesMiniature();
modificationProjets();
ajouterPhoto();

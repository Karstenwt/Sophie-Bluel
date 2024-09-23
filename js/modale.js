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
document.onclick = (event) => {
  if (event.target === overlay) {
    fermerModale1();
    fermerModale2();
  }
};

// Le bouton "Ajouter une photo" dans la modale 1 doit ouvrir la modale 2
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
      for (let i = 0; i < projets.length; i++) {
        const elements = projets[i];

        if (elements !== null) {
          // Création des miniatures
          const ficheMiniature = document.createElement("div");
          ficheMiniature.classList.add("fiche-miniature");

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
          boutonSupprimer.setAttribute("id", elements.id);

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
      }
    });
}

// Affiche les miniatures dans la modale 1
affichageDesMiniature();

// Activation du clic pour ouvrir et fermer les modales
modificationProjets();
boutonFermerModale1();
boutonFermerModale2();
ajouterPhoto(); // Activation du bouton "Ajouter une photo"

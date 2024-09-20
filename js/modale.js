// Sélection de l'overlay et de la modale
const overlay = document.querySelector(".modales");
const modale1 = document.getElementById("modale1");

// Fonction pour afficher la modale 1 (Galerie photo)
function ouvrirModale1() {
  modale1.style.display = "block";
  modale1.removeAttribute("aria-hidden"); // rend la modale est visible
  modale1.setAttribute("aria-modal", "true");
  overlay.style.display = "block"; // Affiche l'overlay
}

// Fonction pour fermer la modale 1
function fermerModale1() {
  modale1.style.display = "none";
  modale1.removeAttribute("aria-modal"); // pour indiquer que la modale est cachée
  modale1.setAttribute("aria-hidden", "true");
  overlay.style.display = "none"; // Masque l'overlay
}

// Gestion de l'ouverture de la modale au clic sur "Modifier"
function modifcationProjets() {
  const modifierProjets = document.querySelector(".link-modifier");
  modifierProjets.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche l'action par défaut
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

// Fermeture de la modale en cliquant en dehors
document.onclick = (event) => {
  if (event.target === overlay) {
    fermerModale1();
  }
};

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
          image.classList.add = "image-miniature";

          // Ajout de l'option éditer
          const editer = document.createElement("a");
          editer.innerText = "éditer";
          editer.classList.add = "editer";

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

affichageDesMiniature();

// Activation du  clic pour ouvrir et fermer la modale
modifcationProjets();
boutonFermerModale1();
console.log("Script modale.js chargé");

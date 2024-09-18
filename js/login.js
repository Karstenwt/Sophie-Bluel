// URL de l'API pour l'authentification
const apiLoginUrl = "http://localhost:5678/api/users/login";

// Sélection des éléments du DOM
const inputMail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const loginForm = document.getElementById("loginform");

// Fonction pour afficher la barre noire de mode édition
function afficherBlackBar() {
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
}

// Fonction pour mettre à jour le bouton "Login" ou "Logout" en fonction de l'état de connexion
function updateLoginLogoutButton() {
  const authToken = localStorage.getItem("authToken");
  const loginLink = document.querySelector('nav a[href="login.html"]');

  // Appliquer la classe appropriée pour le style des boutons
  if (loginLink) {
    loginLink.classList.add("nav-button");
  }

  if (authToken && window.location.pathname.includes("index.html")) {
    // Si l'utilisateur est connecté, afficher "Logout"
    loginLink.innerText = "Logout";

    // Afficher la black bar de mode édition
    afficherBlackBar();

    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Supprimer le token du localStorage pour déconnecter l'utilisateur
      localStorage.removeItem("authToken");
      // Rediriger vers la page de login après déconnexion
      window.location.href = "index.html";
    });
  } else {
    // Si l'utilisateur n'est pas connecté, afficher "Login"
    loginLink.innerText = "Login";
  }
}

// Appel de la fonction de mise à jour au chargement de la page principale
window.addEventListener("load", function () {
  updateLoginLogoutButton();
});

// Gestion de l'envoi du formulaire sur la page de login
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const email = inputMail.value;
    const password = inputPassword.value;

    try {
      // Envoyer la requête POST à l'API
      const response = await fetch(apiLoginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Envoi des informations du formulaire
      });

      // Vérifier si la réponse est correcte
      if (response.ok) {
        const data = await response.json();

        // Stocker le token pour les futures requêtes
        localStorage.setItem("authToken", data.token);

        // Rediriger vers la page d'accueil après connexion
        window.location.href = "index.html"; // Redirection vers la page principale
      } else {
        // Log en cas d'échec de l'authentification
        alert("Erreur : Email ou mot de passe incorrect.");
      }
    } catch (error) {
      // Log pour capturer des détails sur l'erreur
      console.error("Erreur lors de la tentative de connexion :", error);
      alert("Une erreur est survenue, veuillez réessayer plus tard.");
    }
  });
}

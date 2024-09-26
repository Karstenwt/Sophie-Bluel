document.addEventListener("DOMContentLoaded", function () {
  // URL de l'API pour l'authentification
  const apiLoginUrl = "http://localhost:5678/api/users/login";

  // Sélection des éléments du DOM
  const inputMail = document.getElementById("email");
  const inputPassword = document.getElementById("password");
  const loginForm = document.getElementById("loginform");

  // Fonction pour afficher ou masquer le lien "Modifier" en fonction du mode édition
  function afficherLienModifier() {
    const lienModifier = document.querySelector(".link-modifier");

    if (!lienModifier) {
      console.warn("L'élément .link-modifier n'a pas été trouvé dans le DOM.");
      return; // Si l'élément n'existe pas, arrêter l'exécution
    }

    const authToken = localStorage.getItem("authToken"); // Vérifier si l'utilisateur est connecté

    if (authToken) {
      lienModifier.style.display = "inline-flex";
    } else {
      lienModifier.style.display = "none";
    }
  }

  // Fonction pour afficher la barre noire de mode édition uniquement si l'utilisateur est connecté
  function afficherBlackBar() {
    const authToken = localStorage.getItem("authToken"); // Vérifier si l'utilisateur est connecté

    if (authToken) {
      const existingBlackBar = document.querySelector(".black-bar");

      // Vérifier si la barre noire existe déjà
      if (!existingBlackBar) {
        // Si elle n'existe pas, créer et afficher la barre noire
        const blackBar = document.createElement("div");
        blackBar.classList.add("black-bar");

        // Créer l'icône
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-pen-to-square");
        icon.style.marginRight = "10px";

        // Ajouter l'icône et le texte à la barre
        blackBar.appendChild(icon);
        blackBar.appendChild(document.createTextNode("Mode édition"));

        // Ajouter la barre noire en haut du body
        document.body.prepend(blackBar);
      }
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

        window.location.href = "index.html";
      });
    } else {
      // Si l'utilisateur n'est pas connecté, afficher "Login"
      loginLink.innerText = "Login";
      afficherLienModifier(); // Masquer le lien "Modifier"
    }
  }

  // Gestion de l'envoi du formulaire sur la page de login
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Empêche le rechargement de la page

      // Récupérer les valeurs du formulaire
      const email = inputMail.value;
      const password = inputPassword.value;

      try {
        // Envoyer la requête POST à l'API pour l'authentification
        const response = await fetch(apiLoginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        // Vérifier si la réponse est correcte
        if (response.ok) {
          const data = await response.json();
          console.log("token reçu : ", data.token);

          // Stocker le token pour indiquer que l'utilisateur est en mode édition
          localStorage.setItem("authToken", data.token);

          window.location.href = "index.html";

          afficherLienModifier();
        } else {
          alert("Erreur : Email ou mot de passe incorrect.");
        }
      } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);

        alert("Une erreur est survenue, veuillez réessayer plus tard.");
      }
    });
  } else {
    console.error("Formulaire de connexion introuvable.");
  }

  // Appel de la fonction de mise à jour au chargement de la page principale
  window.addEventListener("load", function () {
    updateLoginLogoutButton();
  });
});

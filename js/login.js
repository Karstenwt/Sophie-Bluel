// URL de l'API pour l'authentification
const apiLoginUrl = "http://localhost:5678/api/users/login";

// Sélection des éléments du DOM
const inputMail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const loginForm = document.getElementById("loginform");

// Gestion de l'envoi du formulaire
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // Empêche le rechargement de la page

  // Récupérer les valeurs du formulaire
  const email = inputMail.value;
  const password = inputPassword.value;

  console.log("Email:", email, "Password:", password);

  try {
    // Envoyer la requête POST à l'API
    const response = await fetch(apiLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Envoi des informations du formulaire
    });

    console.log("Response status:", response.status);

    // Vérifier si la réponse est correcte
    if (response.ok) {
      const data = await response.json();
      console.log("Données reçues:", data);
      console.log("Token reçu:", data.token);

      // Stocker le token pour les futures requêtes
      localStorage.setItem("authToken", data.token);

      // Rediriger vers la page d'accueil
      window.location.href = "index.html";
    } else {
      // Log en cas d'échec de l'authentification
      console.log("Erreur d'authentification. Statut:", response.status);
      alert("Erreur : Email ou mot de passe incorrect.");
    }
  } catch (error) {
    // Log pour capturer des détails sur l'erreur
    console.error("Erreur lors de la tentative de connexion :", error);
    alert("Une erreur est survenue, veuillez réessayer plus tard.");
  }
});

// URL endpointu logowania
const LOGIN_API_URL = "http://localhost:5180/api/AuthControler/login";

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value; // Pobranie wartości UserName
  const password = document.getElementById("password").value; // Pobranie hasła

  try {
    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ UserName: username, Password: password }) // Zmiana pola "email" na "UserName"
    });

    if (!response.ok) {
      const errorText = await response.text(); // Pobierz szczegóły błędu
      throw new Error(`Błąd logowania: ${errorText}`);
    }

    const data = await response.json();
    console.log("Zalogowano pomyślnie:", data);

    // Zapisanie tokenów i stanu logowania w localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("isLoggedIn", "true");

    // Przekierowanie na stronę główną po zalogowaniu
    window.location.href = "products.html";
  } catch (error) {
    console.error("Błąd logowania:", error);
    alert("Nieprawidłowa nazwa użytkownika lub hasło. Szczegóły: " + error.message);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.querySelector(".login");

  // Sprawdzanie, czy użytkownik jest zalogowany
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // Jeśli użytkownik jest zalogowany
    authButton.textContent = "Wyloguj się";
    authButton.href = "#"; // Zablokowanie przekierowania na stronę logowania
    authButton.addEventListener("click", (event) => {
      event.preventDefault(); // Zablokowanie domyślnego działania linku
      logoutUser();
    });
  } else {
    // Jeśli użytkownik nie jest zalogowany
    authButton.textContent = "Zaloguj się";
    authButton.href = "loginPage.html"; // Przekierowanie na stronę logowania
  }
});

// Funkcja do wylogowania użytkownika
function logoutUser() {
  // Usunięcie danych logowania z localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.setItem("isLoggedIn", "false");

  // Poinformowanie użytkownika o wylogowaniu
  alert("Wylogowano pomyślnie!");

  // Przekierowanie na stronę główną lub odświeżenie
  window.location.href = "index.html";
}

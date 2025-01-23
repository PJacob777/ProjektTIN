document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.querySelector(".login");

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    authButton.textContent = "Wyloguj się";
    authButton.href = "#";
    authButton.addEventListener("click", (event) => {
      event.preventDefault();
      logoutUser();
    });
  } else {
    authButton.textContent = "Zaloguj się";
    authButton.href = "loginPage.html";
  }
});

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.setItem("isLoggedIn", "false");

  alert("Wylogowano pomyślnie!");

  window.location.href = "index.html";
}

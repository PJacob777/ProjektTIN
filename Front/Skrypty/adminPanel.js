async function checkPermissions() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Brak tokena w localStorage. Użytkownik niezalogowany.");
    displayUnauthorizedMessage();
    return;
  }

  const url = "http://localhost:5180/auth";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ token });

  try {
    const response = await fetch(`http://localhost:5180/auth?token=${token}`);
    console.log(response);
    if (response.ok) {
      console.log("Dostęp przyznany. Kontynuowanie ładowania strony...");
      return;
    } else if (response.status === 401) {
      console.warn("Brak uprawnień. Użytkownik nieautoryzowany.");
      displayUnauthorizedMessage();
    } else {
      console.error(`Niespodziewany status serwera: ${response.status}`);
      displayUnexpectedErrorMessage();
    }
  } catch (error) {
    console.error("Wystąpił błąd połączenia z serwerem:", error);
    displayConnectionErrorMessage();
  }
}

function displayUnauthorizedMessage() {
  document.body.innerHTML = `
    <div style="text-align: center; margin-top: 20vh; font-family: Arial, sans-serif;">
      <h1 style="color: red;">401 Unauthorized</h1>
      <p>Nie masz uprawnień do wyświetlenia tej strony.</p>
      <p>Zaloguj się na konto z odpowiednimi uprawnieniami.</p>
      <a href="login.html" style="color: blue; text-decoration: underline;">Przejdź do strony logowania</a>
    </div>
  `;
}

function displayUnexpectedErrorMessage() {
  document.body.innerHTML = `
    <div style="text-align: center; margin-top: 20vh; font-family: Arial, sans-serif;">
      <h1 style="color: orange;">Błąd</h1>
      <p>Wystąpił niespodziewany problem. Skontaktuj się z administratorem.</p>
    </div>
  `;
}

function displayConnectionErrorMessage() {
  document.body.innerHTML = `
    <div style="text-align: center; margin-top: 20vh; font-family: Arial, sans-serif;">
      <h1 style="color: orange;">Błąd połączenia</h1>
      <p>Nie udało się połączyć z serwerem. Spróbuj ponownie później.</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  checkPermissions();
});

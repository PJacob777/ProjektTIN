// URL Twojego API
const API_URL = "http://localhost:5180/api/Product?page=1&pageSize=3"; // Zmień na właściwy adres, jeśli Twój back-end działa pod innym URL-em

// Funkcja do pobrania produktów z API
async function fetchProducts() {
  try {
    console.log("Ładowanie danych z API...");
    const response = await fetch(API_URL);
    console.log("Status odpowiedzi:", response.status);

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych: " + response.status);
    }

    const page = await response.json();
    console.log("Pobrany page:", page);
    displayProducts(page.products);
  } catch (error) {
    console.error("Błąd:", error);
    const productContainer = document.querySelector(".products");
    productContainer.innerHTML = "<p>Nie udało się załadować produktów.</p>";
  }
}

// Funkcja do wyświetlania produktów na stronie
function displayProducts(products) {
  const productContainer = document.querySelector(".products");
  productContainer.innerHTML = ""; // Wyczyść istniejącą zawartość

  products.forEach(product => {
    console.log("Renderowanie produktu:", product);
    const productElement = document.createElement("div");
    productElement.className = "product";
    console.log(product.pictLink);
    productElement.innerHTML = `
            <img src="${product.pictLink}" alt="${product.name}" style="width: 200px; height: auto;">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>Cena:</strong> ${product.csst.toFixed(2)} PLN</p>
            <button onclick="addToCart(${product.id})">Dodaj do koszyka</button>
        `;
    productContainer.appendChild(productElement);
  });
}

// Funkcja dodająca produkt do koszyka
function addToCart(productId) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // Pobierz istniejące produkty w koszyku
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Dodaj nowy produkt do koszyka
    if (!cart.includes(productId)) {
      cart.push(productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Produkt został dodany do koszyka!");
      console.log("Aktualny koszyk:", cart);
    } else {
      alert("Ten produkt już znajduje się w koszyku.");
    }
  } else {
    alert("Musisz być zalogowany, aby dodać produkty do koszyka.");
  }
}

// Obsługa logowania/wylogowania
document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("auth-button");
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
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.setItem("isLoggedIn", "false");
  alert("Wylogowano pomyślnie!");
  window.location.href = "index.html";
}

// Wywołaj pobranie produktów po załadowaniu strony
document.addEventListener("DOMContentLoaded", fetchProducts);

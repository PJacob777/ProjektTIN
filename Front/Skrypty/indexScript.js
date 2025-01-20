// URL Twojego API
const API_URL = "http://localhost:5000/api/Product/product"; // Zmień na właściwy adres, jeśli Twój back-end działa pod innym URL-em

// Funkcja do pobrania produktów z API
async function fetchProducts() {
  try {
    console.log("Ładowanie danych z API...");
    const response = await fetch(API_URL);
    console.log("Status odpowiedzi:", response.status);

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych: " + response.status);
    }

    const products = await response.json();
    console.log("Pobrane produkty:", products);
    displayProducts(products);
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

// Funkcja dodająca produkt do koszyka (prosta implementacja)
function addToCart(productId) {
  console.log("Dodano produkt do koszyka, ID:", productId);
}

// Wywołaj pobranie produktów po załadowaniu strony
document.addEventListener("DOMContentLoaded", fetchProducts);

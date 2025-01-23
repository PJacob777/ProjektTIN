const API_URL = "http://localhost:5180/api/Product?page=1&pageSize=3"; // Zmień na właściwy adres, jeśli Twój back-end działa pod innym URL-em

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

function displayProducts(products) {
  const productContainer = document.querySelector(".products");
  productContainer.innerHTML = "";

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

function addToCart(productId) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("auth-button");
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

document.addEventListener("DOMContentLoaded", fetchProducts);

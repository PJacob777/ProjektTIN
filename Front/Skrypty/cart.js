// URL Twojego API
const API_URL = "http://localhost:5180/api/Product";

// Funkcja do pobrania szczegółów produktu na podstawie ID
async function fetchProductDetails(productId) {
  try {
    console.log(`Pobieranie szczegółów produktu o ID: ${productId}`);
    const response = await fetch(`${API_URL}/product/${productId}`);
    console.log(`Status odpowiedzi dla ID ${productId}:`, response.status);

    if (!response.ok) {
      throw new Error(`Błąd podczas pobierania szczegółów produktu o ID ${productId}: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Dane produktu o ID ${productId}:`, data);
    return data;
  } catch (error) {
    console.error(`Błąd podczas pobierania produktu o ID ${productId}:`, error);
    return null;
  }
}

// Funkcja do pobrania produktów z koszyka
async function fetchCartProducts() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Pobrany koszyk z localStorage:", cart);

  const products = [];
  for (const productId of cart) {
    const product = await fetchProductDetails(productId);
    if (product) {
      products.push(product);
    }
  }

  console.log("Produkty w koszyku:", products);
  displayCartProducts(products);
}

// Funkcja do wyświetlania produktów w koszyku
function displayCartProducts(products) {
  const cartContainer = document.querySelector(".cart");
  cartContainer.innerHTML = ""; // Wyczyść zawartość koszyka

  if (products.length === 0) {
    cartContainer.innerHTML = "<p>Twój koszyk jest pusty.</p>";
    return;
  }

  let total = 0;

  products.forEach((product) => {
    console.log("Renderowanie produktu:", product);
    const productElement = document.createElement("div");
    productElement.className = "cart-item";
    productElement.innerHTML = `
      <img src="${product.pictLink}" alt="${product.name}" style="width: 100px; height: auto;">
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Cena:</strong> ${product.csst.toFixed(2)} PLN</p>
        <button class="remove-btn" data-id="${product.id}">Usuń</button>
      </div>
    `;
    cartContainer.appendChild(productElement);
    total += product.csst;
  });

  const totalElement = document.createElement("div");
  totalElement.className = "cart-total";
  totalElement.innerHTML = `<p><strong>Łączna suma: ${total.toFixed(2)} PLN</strong></p>`;
  cartContainer.appendChild(totalElement);

  // Dodaj obsługę przycisków "Usuń"
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

// Funkcja do usuwania produktu z koszyka
function removeFromCart(event) {
  const productId = parseInt(event.target.getAttribute("data-id"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((id) => id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  fetchCartProducts();
}

// Funkcja do składania zamówienia
async function submitOrder() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Musisz być zalogowany, aby złożyć zamówienie.");
    return;
  }

  const idResponse = await fetch(`http://localhost:5180/id?token=${token}`);
  if (!idResponse.ok) {
    alert("Błąd podczas generowania ID zamówienia.");
    console.error("Błąd ID:", idResponse.status);
    return;
  }

  const id = await idResponse.json();
  console.log("Wygenerowane ID zamówienia:", id);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const products = await Promise.all(cart.map((productId) => fetchProductDetails(productId)));

  const productNames = products.map((product) => product.name);

  const miasto = document.getElementById("city").value;
  const ulica = document.getElementById("street").value;
  const numer = document.getElementById("number").value;

  const orderDetails = {
    ID: id,
    Products: productNames,
    Miasto: miasto,
    Ulica: ulica,
    Numer: numer,
  };

  console.log("Dane wysyłane do API (zamówienie):", orderDetails);

  const orderResponse = await fetch("http://localhost:5180/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderDetails),
  });

  if (!orderResponse.ok) {
    alert("Błąd podczas składania zamówienia.");
    console.error("Błąd zamówienia:", orderResponse.status);
    return;
  }

  alert("Zamówienie zostało złożone pomyślnie!");
  localStorage.removeItem("cart");
  fetchCartProducts();
}

// Wywołaj pobranie produktów po załadowaniu strony
document.addEventListener("DOMContentLoaded", fetchCartProducts);

// Obsługa przycisku "Złóż zamówienie"
document.getElementById("submit-order").addEventListener("click", submitOrder);

// Obsługa przycisku "Wyczyść koszyk"
document.getElementById("clear-cart").addEventListener("click", () => {
  localStorage.removeItem("cart");
  fetchCartProducts();
});

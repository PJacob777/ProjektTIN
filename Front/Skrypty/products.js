// URL Twojego API
const API_URL = "http://localhost:5180/api/Product";

// Funkcja do pobrania produktów z API
async function fetchProducts(page = 1, pageSize = 3) {
  try {
    console.log(`Ładowanie danych z API dla strony ${page}...`);
    const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
    console.log("Status odpowiedzi:", response.status);

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych: " + response.status);
    }

    const data = await response.json();
    console.log("Otrzymane dane:", data);

    displayProducts(data.products);
    setupPagination(data.totalPages, page);
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

  if (products.length === 0) {
    productContainer.innerHTML = "<p>Brak produktów do wyświetlenia.</p>";
    return;
  }

  products.forEach(product => {
    console.log("Renderowanie produktu:", product);
    const productElement = document.createElement("div");
    productElement.className = "product";
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

// Funkcja do ustawienia paginacji
function setupPagination(totalPages, currentPage) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // Wyczyść istniejącą zawartość

  // Przyciski "Poprzednia"
  const prevButton = document.createElement("a");
  prevButton.textContent = "« Poprzednia";
  prevButton.href = "#";
  prevButton.className = currentPage === 1 ? "disabled" : "";
  prevButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) fetchProducts(currentPage - 1);
  };
  paginationContainer.appendChild(prevButton);

  // Numerki stron
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("a");
    pageButton.textContent = i;
    pageButton.href = "#";
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.onclick = (e) => {
      e.preventDefault();
      fetchProducts(i);
    };
    paginationContainer.appendChild(pageButton);
  }

  // Przyciski "Następna"
  const nextButton = document.createElement("a");
  nextButton.textContent = "Następna »";
  nextButton.href = "#";
  nextButton.className = currentPage === totalPages ? "disabled" : "";
  nextButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) fetchProducts(currentPage + 1);
  };
  paginationContainer.appendChild(nextButton);
}

// Funkcja dodająca produkt do koszyka (prosta implementacja)
function addToCart(productId) {
  console.log("Dodano produkt do koszyka, ID:", productId);
}

// Wywołaj pobranie produktów po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  // Obsługa zmiany przycisku logowania/wylogowania
  const authButton = document.querySelector(".login");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // Jeśli użytkownik jest zalogowany, zmień przycisk na "Wyloguj się"
    authButton.textContent = "Wyloguj się";
    authButton.href = "#"; // Zablokowanie przekierowania na stronę logowania
    authButton.addEventListener("click", () => {
      // Obsługa wylogowania
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.setItem("isLoggedIn", "false");
      alert("Wylogowano pomyślnie!");
      window.location.reload(); // Odśwież stronę po wylogowaniu
    });
  }
});

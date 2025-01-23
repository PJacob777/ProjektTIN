const API_URL = "http://localhost:5180/api/Product";

let currentPage = 1;

async function fetchProducts(page = 1) {
  try {
    console.log(`Ładowanie danych z API dla strony ${page}...`);
    const response = await fetch(`${API_URL}?page=${page}&pageSize=3`);
    console.log("Status odpowiedzi:", response.status);

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych: " + response.status);
    }

    const pageData = await response.json();
    console.log("Pobrane dane:", pageData);
    displayProducts(pageData.products);
    setupPagination(pageData.totalPages);
  } catch (error) {
    console.error("Błąd:", error);
    const productContainer = document.querySelector(".products");
    productContainer.innerHTML = "<p>Nie udało się załadować produktów.</p>";
  }
}

function displayProducts(products) {
  const productContainer = document.querySelector(".products");
  productContainer.innerHTML = "";

  if (!products || products.length === 0) {
    productContainer.innerHTML = "<p>Brak produktów do wyświetlenia.</p>";
    return;
  }

  products.forEach(product => {
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

function setupPagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("a");
  prevButton.href = "#";
  prevButton.textContent = "« Poprzednia";
  prevButton.className = currentPage > 1 ? "" : "disabled";
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchProducts(currentPage);
    }
  };
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("a");
    pageButton.href = "#";
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? "active" : "";
    pageButton.onclick = () => {
      currentPage = i;
      fetchProducts(currentPage);
    };
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("a");
  nextButton.href = "#";
  nextButton.textContent = "Następna »";
  nextButton.className = currentPage < totalPages ? "" : "disabled";
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProducts(currentPage);
    }
  };
  paginationContainer.appendChild(nextButton);
}

function addToCart(productId) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    alert("Zaloguj się, aby dodać produkt do koszyka.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produkt został dodany do koszyka!");
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  const authButton = document.querySelector(".login");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    authButton.textContent = "Wyloguj się";
    authButton.href = "#";
    authButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.setItem("isLoggedIn", "false");
      alert("Wylogowano pomyślnie!");
      window.location.reload();
    });
  }
});

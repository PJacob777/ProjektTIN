async function checkPermissions() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Brak tokena w localStorage. Użytkownik niezalogowany.");
    displayUnauthorizedMessage();
    return;
  }

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
async function addProduct(){
 var name = document.getElementById("product-name").value;
 var price = document.getElementById("product-price").value;
 var description = document.getElementById("product-description").value;
 const productDetailts = {
   name: name,
   description: description,
   price: price,
 };
  const productResponse = await fetch("http://localhost:5180/api/Product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productDetailts),
  });

  if (!productResponse.ok) {
    alert("Błąd podczas dodawania produktu.");
    return;
  }

  alert("Produkt został dodany pomyślnie!");
}


async function updateProduct() {
  const name = document.getElementById("current-product-name").value.trim();
  const newName = document.getElementById("new-product-name").value.trim();
  const newPrice = document.getElementById("new-product-cost").value.trim();
  const newDescription = document.getElementById("new-product-description").value.trim();

  if (!name) {
    alert("Podaj nazwę produktu, który chcesz zaktualizować!");
    return;
  }

  let updatesMade = false;

  try {
    if (newName) {
      const url = `http://localhost:5180/name?name=${name}&newName=${newName}`;
      console.log("Wysyłanie aktualizacji nazwy:", url);
      await sendPatchRequest(url, "Nazwa została zaktualizowana.");
      updatesMade = true;
    }

    if (newDescription) {
      const url = `http://localhost:5180/description?name=${name}&newDescription=${newDescription}`;
      console.log("Wysyłanie aktualizacji opisu:", url);
      await sendPatchRequest(url, "Opis został zaktualizowany.");
      updatesMade = true;
    }

    if (newPrice) {
      const url = `http://localhost:5180/price?name=${name}&newPrice=${newPrice}`;
      console.log("Wysyłanie aktualizacji ceny:", url);
      await sendPatchRequest(url, "Cena została zaktualizowana.");
      updatesMade = true;
    }

    if (!updatesMade) {
      alert("Nie podano danych do aktualizacji.");
      return;
    }

    alert("Produkt został zaktualizowany pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas aktualizacji produktu:", error);
  }
}


async function sendPatchRequest(url, successMessage) {
  try {
    console.log(`Rozpoczęcie żądania PATCH: ${url}`);
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Błąd podczas wysyłania PATCH. Status: ${response.status}`);
      throw new Error(`Błąd serwera: ${response.statusText}`);
    }

    console.log(successMessage);
    return response;
  } catch (error) {
    console.error("Błąd w sendPatchRequest:", error);
    throw error;
  }
}


async function removeProduct() {
  const nameToRemove = document.getElementById("delete-product-name").value;

  if (!nameToRemove) {
    alert("Wprowadź nazwę produktu do usunięcia.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5180/product?name=${nameToRemove}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Błąd podczas usuwania produktu:", response.status);
      alert("Błąd podczas usuwania produktu.");
      return;
    }

    alert("Produkt został usunięty pomyślnie!");
  } catch (error) {
    console.error("Błąd podczas usuwania produktu:", error);
    alert("Wystąpił błąd podczas usuwania produktu.");
  }
}

document.getElementById("addbut").addEventListener("click", addProduct);
document.getElementById("updatebut").addEventListener("click", updateProduct);
document.getElementById("removebut").addEventListener("click", removeProduct);

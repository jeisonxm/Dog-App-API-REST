//! La API se verifica con el api_key de ultimo y se mete con un &.
const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=6";
const API_URL_FAVORITE = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITE_DELETE = (id) =>
  `https://api.thecatapi.com/v1/favourites/${id}`;

const errorSpan = document.getElementById("error");
const notHaveFavoriteError = document.getElementById("favoriteError");
const section = document.getElementById("favoriteMichis");

async function loadRandomCat() {
  const res = await fetch(API_URL_RANDOM);
  const obj = await res.json();

  if (res.status != 200) {
    errorSpan.innerHTML = "hubo un error: <br>" + res.status;
  } else {
    const buttonsNode = document.querySelectorAll(".favoriteButton");
    const buttons = Array.from(buttonsNode);

    for (let i = 0; i < buttons.length; i++) {
      const element = buttons[i];
      element.onclick = () => makeFavorite(obj[i].id);
    }

    for (let i = 0; i < obj.length; i++) {
      const element = obj[i];
      let imgSelect = document.getElementById(`img${i + 1}`);
      imgSelect.src = element.url;
    }
  }
}

function domDynamic(object) {
  object.map((element) => {
    if (!document.getElementById(element.id)) {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Delete Cat");
      article.id = element.id;
      article.className = "FavoritePhotos img-container";
      btn.className = "deleteFavorite";
      btn.appendChild(btnText);
      img.src = element.image.url;
      img.width = 250;
      img.height = 250;
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    }
  });
}

async function UpdateFavoriteCat() {
  const res = await fetch(API_URL_FAVORITE, {
    method: "GET",
    headers: {
      "X-API-KEY": "adadc38e-9bb2-4d49-b690-b4d2f03ed5b8",
    },
  });
  const obj = await res.json();
  const photosArray = Array.from(document.querySelectorAll(".FavoritePhotos"));
  console.log(obj);
  if (res.status != 200) {
    errorSpan.innerHTML = "hubo un error: " + res.status;
  } else if (photosArray.length > 0) {
    if (obj.length === photosArray.length) {
      domDynamic(obj);
    } else {
      section.innerHTML = "";
      domDynamic(obj);
    }
  } else {
    domDynamic(obj);
  }

  console.log("array de fotos", photosArray);

  const buttonsNode = document.querySelectorAll(".deleteFavorite");
  const buttons = Array.from(buttonsNode);
  buttons.map((element) => {
    element.onclick = () => deleteFavorite(obj[buttons.indexOf(element)].id);
  });
}

async function makeFavorite(id) {
  const res = await fetch(API_URL_FAVORITE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "adadc38e-9bb2-4d49-b690-b4d2f03ed5b8",
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  UpdateFavoriteCat();
  const obj = await res.json();
  console.log(obj.message);
  console.log("prueba", res);
}

async function deleteFavorite(id) {
  const res = await fetch(API_URL_FAVORITE_DELETE(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY": "adadc38e-9bb2-4d49-b690-b4d2f03ed5b8",
    },
  });
  const obj = await res.json();

  if (res.status != 200) {
    console.log(obj.message);
    errorSpan.innerHTML = `You have an error ${obj.message}`;
  } else {
    console.log("The cat was delete");
    UpdateFavoriteCat();
  }
  console.log("prueba", res);
}

loadRandomCat();
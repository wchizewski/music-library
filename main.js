// Music Library

// elements
// let menu1El = document.getElementById("menu1");
let menu2El = document.getElementById("menu2");
let outputEl = document.getElementById("output");
let albumOutputEl = document.getElementById("album-output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");
let selection = searchMenuEl.value;

// Array
let library = [];

let token =
  "BQA9bvM66gH33RUmf4d26KBCs0ImEw7a66pMiw_Ume5xAoIj5KRxFwDitnRJH-6bMblJ4xtDDMZyRX3ZdWD6VSXHswEd-o2b7A9HvKRTbjZ3xErmBprPv_40DpIeYt7VVh5uZ-jyUvU_9q1PUxQe0ktHNN7Lq9Io4IWtDpcFTKA9SYVLI6rx5WIIvFISkhw9ydyozDpjFXyXLVGe";
let albumNum = 300;
processData();

function processData() {
  let totalData = [];
  for (let offset = 0; offset < albumNum; offset += 50) {
    fetch(`https://api.spotify.com/v1/me/albums?limit=50&offset=${offset}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        totalData.push(data.items);

        if (totalData.length === albumNum / 50) {
          let albums = totalData.flat();
          library = albums;
          sortAlbumsAlphabetically();
        }
      });
  }
}

// Sorting Albums
document.getElementById("menu2-btn").addEventListener("click", goBtn2Handler);

function goBtn2Handler() {
  // Get Menu Selection
  let selection = menu2El.value;
  if (selection === "sort-alphabetically") {
    sortAlbumsAlphabetically();
  } else if (selection === "sort-by-oldest") {
    sortAlbumsOld();
  } else if (selection === "sort-by-newest") {
    sortAlbumsNew();
  } else if (selection === "sort-by-artist") {
    sortAlbumsArtist();
  }
}

function sortAlbumsAlphabetically() {
  albumOutputEl.innerHTML = "";
  library.sort((a, b) => {
    return a.album.name.toLowerCase() > b.album.name.toLowerCase() ? 1 : -1;
  });
  displayAlbums();
}

function sortAlbumsOld() {
  albumOutputEl.innerHTML = "";
  library.sort((a, b) => {
    return a.album.release_date > b.album.release_date ? 1 : -1;
  });
  displayAlbums();
}

function sortAlbumsNew() {
  albumOutputEl.innerHTML = "";
  library.sort((a, b) => {
    return a.album.release_date < b.album.release_date ? 1 : -1;
  });
  displayAlbums();
}

function sortAlbumsArtist() {
  albumOutputEl.innerHTML = "";
  library.sort((a, b) => {
    return a.album.artists[0].name.toLowerCase() >
      b.album.artists[0].name.toLowerCase()
      ? 1
      : -1;
  });
  displayAlbums();
}

function displayAlbums() {
  outputEl.innerHTML = "";
  for (let i = 0; i < library.length; i++) {
    let artists = library[i].album.artists;
    let artistString = "";
    artists.forEach((artist, index) => {
      if (index + 1 == artists.length) {
        artistString += artist.name;
      } else {
        artistString += artist.name + ", ";
      }
    });

    let album = library[i].album;
    outputEl.innerHTML += `
      <div id=album${i} data-id=${i}>
        <p>
        <img src="${album.images[1].url}">
        <h2>${album.name}</h2>
        <h3>${artistString}</h3>
        <h4>${album.release_date}</h4>
        </p>
      </div>
      `;
  }
  for (let i = 0; i < library.length; i++) {
    document.getElementById(`album${i}`).addEventListener("click", openAlbum);
  }
}

searchBarEl.addEventListener("keyup", searchBarHandler);

function searchBarHandler(event) {
  albumOutputEl.innerHTML = "";
  let divStr = "";
  for (let i = 0; i < library.length; i++) {
    let album = library[i].album;
    let artists = library[i].album.artists;
    let artistString = "";
    artists.forEach((artist, index) => {
      if (index + 1 == artists.length) {
        artistString += artist.name;
      } else {
        artistString += artist.name + ", ";
      }
    });
    if (
      library[i].album.name
        .toLowerCase()
        .includes(searchBarEl.value.toLowerCase()) ||
      artistString.toLowerCase().includes(searchBarEl.value.toLowerCase())
    ) {
      divStr += `
      <div id=album${i} data-id=${i}>
        <p>
        <img src="${album.images[1].url}">
        <h2>${album.name}</h2>
        <h3>${artistString}</h3>
        <h4>${album.release_date}</h4>
        </p>
      </div>
      `;
    }
  }

  outputEl.innerHTML = divStr;
}

function openAlbum(e) {
  let albumIndex = +e.currentTarget.dataset.id;
  let trackItems = library[albumIndex].album.tracks.items;
  let album = library[albumIndex].album;
  outputEl.innerHTML = "";
  let artists = library[albumIndex].album.artists;
  let artistString = "";
  artists.forEach((artist, index) => {
    if (index + 1 == artists.length) {
      artistString += artist.name;
    } else {
      artistString += artist.name + ", ";
    }
  });
  albumOutputEl.innerHTML = `
    <div>
      <p>
      <img src="${album.images[1].url}">
      <h1>${album.name}</h1>
      <h3>${artistString} • ${album.release_date}</h3>
      </p>
    </div>
    `;
  for (let i = 0; i < trackItems.length; i++) {
    albumOutputEl.innerHTML += `
    <p id="tracks" data-id="${i}">${trackItems[i].name}<span>${
      trackItems[i].duration_ms / 60000
    }</span><input type="checkbox" id="like-btn${i}" data-id="${i}"></p>
    `;
  }
  for (let i = 0; i < trackItems.length; i++) {
    document.getElementById(`like-btn${i}`).addEventListener("input", likeSong);
  }
}

function likeSong(e) {
  let albumIndex = +e.currentTarget.dataset.id;
  let trackItems = library[albumIndex].album.tracks.items;
  console.log("hi");
  localStorage.setItem("album-output", JSON.stringify(trackItems));
}

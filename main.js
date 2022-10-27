// Music Library

// elements
// let menu1El = document.getElementById("menu1");
let menu2El = document.getElementById("menu2");
let outputEl = document.getElementById("output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");
let selection = searchMenuEl.value;

// Array
let library = [];

let token =
  "BQDVBS6I33S99cXvWAeovgg8MfjEbxUUZ1YMsN81LjF2xpuYKiy7qYwggy2GT-gI9NC8xoTWGot2IKXgfxS36hA2o0wajLkI1-B1OfsA16655Ewn-2tfMAMYO9uwp6DVO3z4tCCWchbtNakFkmMFXe_kzCFwQhg3CUb7xGB6x1eygSWUfoZu3hIUXVihox56iUmUYAMY7fgEj4Z0";
let albumNum = 300;

fetch("music.txt").then(convertData).then(processData);

function convertData(rawData) {
  return rawData.text();
}

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
        if (data.error) return console.log(data.error.message);

        totalData.push(data.items);

        if (totalData.length === albumNum / 50) {
          let albums = totalData.flat();
          library = albums;
          displayAlbums();
        }
      });
  }
}

document.getElementById("menu2-btn").addEventListener("click", goBtn2Handler);

function goBtn2Handler() {
  // Get Menu Selection
  let selection = menu2El.value;

  if (selection === "display-alphabetically") {
    sortAlbumsAlphabetically();
  } else if (selection === "display-by-year") {
    sortAlbumsYear();
  } else if (selection === "display-by-artist") {
    sortAlbumsArtist();
  }
}

function sortAlbumsAlphabetically() {
  library.sort((a, b) => {
    return a.album.name > b.album.name ? 1 : -1;
  });
  outputEl.innerHTML = library;
  displayAlbums();
}

// function sortAlbumsYear() {
//   library.sort((0, albumNum) => {
//     return
//   })
// }

function sortAlbumsArtist() {
  library.sort((a, b) => {
    return a.album.artists[0].name > b.album.artists[0].name ? 1 : -1;
  });
  outputEl.innerHTML = library;
  displayAlbums();
}

function displayAlbums() {
  // sortAlbumsAlphabetically();
  let divStr = "";
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
      <div id=album${i}>
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
      <div>
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

function openAlbum() {
  console.log("hi");
  // let albumTracks = "";
  // for (let i = 0; i < library.length; i++) {
  //   let tracks = library[i].album.tracks;
  //   console.log(tracks.items[i].name);
  //   albumTracks = tracks.items[i].name;
  // }
  // outputEl.innerHTML = albumTracks;
}

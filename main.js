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

// Token
let token =
  "BQBtFUsvq10CZCBzHZmgdUeBvuVDba004rF4DGCwTAQk1t3q5xMtrQqcKy4YecDUAOqbMkHM4Tlr1mgH8q4WTyD3ZYp1VGe7M0bbJAA5wlhU60H3HUhMDab9ffzP8H6y0S1kSN1TcmDUZ4uipJKT3iUSzWoKScXFVf42ISVt8kP0NQMwpruCLImEuTmevYDNUI6aMaVrVO6twN8l";
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

// // genres
// let genres = [];
// // Token
// let token2 =
//   "BQDkjEvB8unqtSs1JGjtDt9iYRBWeXfXxGJCTULxZPgGVMyZr9x5aL2xU7lCKsZ5uQ61sPvvYxCEb_i7dlLs9T3yq7li3DQpQ1K7E5VozvTETqU_Knwhi07QcifnYSnZAh3CfpfYe81FjWpv_KG8QdcUpKFx6_uVNyogu8nAk9BpVKmBQI7C5UzfuX-sUfy8-IONYMQ-F2ia60eR";
// processData2();

// function processData2() {
//   let totalData = [];
//   fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
//     headers: new Headers({
//       Authorization: `Bearer ${token2}`,
//       ContentType: `application/json`,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       totalData.push(data.items);
//       let genre = totalData.flat();
//       genres = genre;
//     });
// }

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

// Display albums
function displayAlbums() {
  outputEl.innerHTML = "";
  for (let i = 0; i < library.length; i++) {
    let album = library[i].album;
    let artistStr = getArtistStr(album);
    outputEl.appendChild(getAlbumDiv(album, artistStr, i));
  }
}

// Search
searchBarEl.addEventListener("keyup", searchBarHandler);

function searchBarHandler(event) {
  albumOutputEl.innerHTML = "";
  outputEl.innerHTML = "";
  let divStr;
  for (let i = 0; i < library.length; i++) {
    let album = library[i].album;
    let artistStr = getArtistStr(album);
    if (
      library[i].album.name
        .toLowerCase()
        .includes(searchBarEl.value.toLowerCase()) ||
      artistStr.toLowerCase().includes(searchBarEl.value.toLowerCase())
    ) {
      divStr = getAlbumDiv(album, artistStr, i);
      outputEl.appendChild(divStr);
    }
  }
}

function getArtistStr(album) {
  let artistStr = "";
  let artists = album.artists;
  artists.forEach((artist, index) => {
    if (index + 1 == artists.length) {
      artistStr += artist.name;
    } else {
      artistStr += artist.name + ", ";
    }
  });
  return artistStr;
}

function getAlbumDiv(album, artistStr, i) {
  // img
  let imgEl = document.createElement("img");
  imgEl.src = album.images[1].url;

  // h2
  let h2El = document.createElement("h2");
  h2El.innerHTML = album.name;

  // h3
  let h3El = document.createElement("h3");
  h3El.innerHTML = artistStr;

  // h4
  let h4El = document.createElement("h4");
  h4El.innerHTML = album.release_date;

  // div
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.addEventListener("click", openAlbum);
  divEl.appendChild(imgEl);
  divEl.appendChild(h2El);
  divEl.appendChild(h3El);
  divEl.appendChild(h4El);

  return divEl;
}

function openAlbum(e) {
  let albumIndex = +e.currentTarget.dataset.index;
  let trackItems = library[albumIndex].album.tracks.items;
  let album = library[albumIndex].album;
  outputEl.innerHTML = "";
  let artists = library[albumIndex].album.artists;
  let artistStr = "";
  artists.forEach((artist, index) => {
    if (index + 1 == artists.length) {
      artistStr += artist.name;
    } else {
      artistStr += artist.name + ", ";
    }
  });

  albumOutputEl.innerHTML = `
    <div>
      <p>
      <img src="${album.images[1].url}">
      <h1>${album.name}</h1>
      <h3>${artistStr} • ${album.release_date}</h3>
      </p>
    </div>
    `;
  for (let i = 0; i < trackItems.length; i++) {
    let songArtists = trackItems[i].artists;
    let songArtistsStr = "";
    songArtists.forEach((songArtists, index) => {
      if (index + 1 == songArtists.length) {
        songArtistsStr += songArtists.name;
      } else {
        songArtistsStr += songArtists.name + ", ";
      }
    });
    let min = Math.floor(trackItems[i].duration_ms / 60000);
    let sec = Math.floor((trackItems[i].duration_ms % 60000) / 1000);
    if (sec.toString().length === 1) {
      sec = "0" + sec;
    }
    let duration = min + ":" + sec;
    // outputEl.appendChild(
    //   getAlbumDiv(album, artistStr, i, songArtistsStr, trackItems, duration)
    // );
    albumOutputEl.innerHTML += `
    <p id="tracks" data-id="${i}">
    ${trackItems[i].name}
    <span>
    ${duration}
    </span>
    <input type="checkbox" id="like-btn${i}" data-id="${i}">
    <br>
    ${songArtistsStr}
    </p>
    `;
  }
  // for (let i = 0; i < trackItems.length; i++) {
  //   document.getElementById(`like-btn${i}`).addEventListener("input", likeSong);
  // }
}

function getTracklistDiv(
  album,
  artistStr,
  i,
  songArtistsStr,
  trackItems,
  duration
) {
  // img
  let imgEl = document.createElement("img");
  imgEl.src = album.images[1].url;

  // h1
  let h1El = document.createElement("h1");
  h1El.innerHTML = album.name;

  // h3
  let h3El = document.createElement("h3");
  h3El.innerHTML = artistStr + "•" + album.release_date;

  // p (tracklist)
  let tracklistEl = document.createElement("p");
  tracklistEl.innerHTML = trackItems[i].name + duration + songArtistsStr;

  // like btn
  let checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.dataset.index = index;
  checkboxEl.checked = task.completed;
  checkboxEl.addEventListener("input", likeSong);

  // div
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.addEventListener("click", openAlbum);
  divEl.appendChild(imgEl);
  divEl.appendChild(h1El);
  divEl.appendChild(h3El);
  divEl.appendChild(tracklistEl);

  return divEl;
}

function likeSong(e) {
  let albumIndex = +e.currentTarget.dataset.id;
  let trackItems = library[albumIndex].album.tracks.items;
  console.log("hi");
  localStorage.setItem("album-output", JSON.stringify(trackItems));
}

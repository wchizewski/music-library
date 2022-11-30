// Music Library

// Elements
let sortReverseBtn = document.getElementById("sort-reverse");
let playlistBtn = document.getElementById("playlist");
let menu1El = document.getElementById("menu1");
let outputEl = document.getElementById("output");
let albumOutputEl = document.getElementById("album-output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");

// Array
let library = [];
let likedSongs = loadLikedSongs();

// Token
let token =
  "BQA_tU1Y0XK8fjslk-oO5s3zQTdFrsR5mG-GMKwtj9hSukTqGDMHAUUxgMFrAtd7bkYNybjGxfUOwsSmURfPfe9wX-XHF-nN84eXNYfVpfWAD0XCQxoeIvU3TXNbFWKKRw15GDVhmbJmJ_y8HL_5_RWJOgH_zvDk__h1kF7iuDo-3a8HbvsQNpAmxAJU8ARid0gI8Q1XVqWc7TH5";
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
menu1El.addEventListener("click", menuHandler);
sortReverseBtn.addEventListener("click", sortReverseBtnHandler);

function menuHandler() {
  // Get Menu Selection
  let selection = menu1El.value;
  if (selection === "sort-alphabetically") {
    sortAlbumsAlphabetically();
  } else if (selection === "sort-by-date") {
    sortAlbumsDate();
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

function sortAlbumsDate() {
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

function sortReverseBtnHandler() {
  let selection = menu1El.value;
  if (selection === "sort-alphabetically") {
    albumOutputEl.innerHTML = "";
    library.sort((b, a) => {
      return a.album.name.toLowerCase() > b.album.name.toLowerCase() ? 1 : -1;
    });
    displayAlbums();
  } else if (selection === "sort-by-date") {
    albumOutputEl.innerHTML = "";
    library.sort((b, a) => {
      return a.album.release_date < b.album.release_date ? 1 : -1;
    });
    displayAlbums();
  } else if (selection === "sort-by-artist") {
    albumOutputEl.innerHTML = "";
    library.sort((b, a) => {
      return a.album.artists[0].name.toLowerCase() >
        b.album.artists[0].name.toLowerCase()
        ? 1
        : -1;
    });
    displayAlbums();
  }
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

function searchBarHandler() {
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

// Helper Functions for Artists
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

function getSongArtistsStr(trackItems) {
  let songArtists = trackItems.artists;
  let songArtistsStr = "";
  songArtists.forEach((songArtists, index) => {
    if (index + 1 == songArtists.length) {
      songArtistsStr += songArtists.name;
    } else {
      songArtistsStr += songArtists.name + ", ";
    }
  });
  return songArtistsStr;
}

// Get Div
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

// Open Album Function: Cover + Name + Artist(s) + Date
function openAlbumDiv(album, artistStr) {
  // img
  let imgEl = document.createElement("img");
  imgEl.src = album.images[1].url;

  // h1
  let h1El = document.createElement("h1");
  h1El.innerHTML = album.name;

  // h3
  let h3El = document.createElement("h3");
  h3El.innerHTML = artistStr + " • " + album.release_date;

  let divEl = document.createElement("div");
  divEl.appendChild(imgEl);
  divEl.appendChild(h1El);
  divEl.appendChild(h3El);

  return divEl;
}

// Open Album Function: Tracklist + Like Btn
function getTracklistDiv(i, songArtistsStr, trackItems, duration) {
  // p (tracklistEl)
  let tracklistEl = document.createElement("p");
  tracklistEl.id = "tracks";
  tracklistEl.innerHTML =
    trackItems[i].name + " " + duration + "<br>" + songArtistsStr;

  // like btn
  let checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.dataset.index = i;
  // checkboxEl.checked = trackItems.completed;
  checkboxEl.addEventListener("input", likeSong);

  // div
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.appendChild(tracklistEl);
  tracklistEl.appendChild(checkboxEl);

  return divEl;
}

// Open Album
function openAlbum(e) {
  let albumIndex = +e.currentTarget.dataset.index;
  let trackItems = library[albumIndex].album.tracks.items;
  let album = library[albumIndex].album;
  outputEl.innerHTML = "";
  outputEl.setAttribute("albumIndex", albumIndex);
  let artistStr = getArtistStr(album);
  albumOutputEl.appendChild(openAlbumDiv(album, artistStr));
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
    // let songArtistsStr = getSongArtistsStr(trackItems);
    let min = Math.floor(trackItems[i].duration_ms / 60000);
    let sec = Math.floor((trackItems[i].duration_ms % 60000) / 1000);
    if (sec.toString().length === 1) {
      sec = "0" + sec;
    }
    let duration = min + ":" + sec;
    albumOutputEl.appendChild(
      getTracklistDiv(i, songArtistsStr, trackItems, duration)
    );
  }
}

// Playlists
playlistBtn.addEventListener("click", showLikedSongs);

function showLikedSongs() {}

function likeSong(e) {
  let trackIndex = +e.currentTarget.dataset.index;
  let albumIndex = outputEl.getAttribute("albumIndex");
  console.log(trackIndex);
  console.log(albumIndex);
  let trackItems = library[albumIndex].album.tracks.items[trackIndex];
  localStorage.setItem("trackItems", JSON.stringify(trackItems));
  // localStorage.setItem("trackItems", "hi");
  // saveLikedSongs();
  console.log(localStorage);
  console.log(trackItems);
}

// Local Storage
// function saveLikedSongs() {
//   localStorage.setItem("track", JSON.stringify(trackItems));
//   console.log(localStorage);
// }

function loadLikedSongs() {
  let likedSongsStr = localStorage.getItem("trackItems");
  return JSON.parse(likedSongsStr) ?? [];
}

// Music Library

// Elements
let sortReverseBtn = document.getElementById("sort-reverse");
let playlistBtn = document.getElementById("playlist");
let menu1El = document.getElementById("menu1");
let outputEl = document.getElementById("output");
let albumOutputEl = document.getElementById("album-output");
let playlistsOutputEl = document.getElementById("playlists");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");

// Array
let library = [];
let likedSongs = loadLikedSongs();

// Token
let token =
  "BQAeWlrO_QFauMwkyo05dQiqez5nhCVOtl0R_V9yYodhsf22bldC_0SaWn3noTxN_wzqFWm-GdgMYDyMcVs2YQ6B_qYjc1B5zZt47cfHknE8Bxxk9j7zccUAwft-BrW57HUFNL8IAbBo3ST6XHalcEJp5L-a3VsvYMzV8xpO85PHzsfCZ0Fdh5e5fVU7mAWYn_FkuonaVR0m4LXG";
let albumNum = 5000;
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
  playlistsOutputEl.innerHTML = "";
  library.sort((a, b) => {
    return a.album.name.toLowerCase() > b.album.name.toLowerCase() ? 1 : -1;
  });
  displayAlbums();
}

function sortAlbumsDate() {
  albumOutputEl.innerHTML = "";
  playlistsOutputEl.innerHTML = "";

  library.sort((a, b) => {
    return a.album.release_date < b.album.release_date ? 1 : -1;
  });
  displayAlbums();
}

function sortAlbumsArtist() {
  albumOutputEl.innerHTML = "";
  playlistsOutputEl.innerHTML = "";

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
    playlistsOutputEl.innerHTML = "";

    library.sort((b, a) => {
      return a.album.name.toLowerCase() > b.album.name.toLowerCase() ? 1 : -1;
    });
    displayAlbums();
  } else if (selection === "sort-by-date") {
    albumOutputEl.innerHTML = "";
    playlistsOutputEl.innerHTML = "";

    library.sort((b, a) => {
      return a.album.release_date < b.album.release_date ? 1 : -1;
    });
    displayAlbums();
  } else if (selection === "sort-by-artist") {
    albumOutputEl.innerHTML = "";
    playlistsOutputEl.innerHTML = "";

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
  let selection = searchMenuEl.value;
  if ((selection.value = "album")) {
    albumOutputEl.innerHTML = "";
    outputEl.innerHTML = "";
    playlistsOutputEl.innerHTML = "";
    let divStr;
    for (let i = 0; i < library.length; i++) {
      let album = library[i].album;
      let artistStr = getArtistStr(album);
      if (
        album.name.toLowerCase().includes(searchBarEl.value.toLowerCase()) ||
        artistStr.toLowerCase().includes(searchBarEl.value.toLowerCase())
      ) {
        divStr = getAlbumDiv(album, artistStr, i);
        outputEl.appendChild(divStr);
      }
    }
  }
}

function songSearchDiv(i) {
  // img
  let imgEl = document.createElement("img");
  imgEl.src = likedSongs[i].trackAlbumImg;
  imgEl.dataset.index = likedSongs[i].albumIndex;
  imgEl.addEventListener("click", openAlbum);

  // p
  let pEl = document.createElement("p");
  pEl.className = "songs";
  pEl.innerHTML =
    likedSongs[i].name + " by " + " • " + likedSongs[i].trackAlbumName + "<br>";
  pEl.appendChild(imgEl);

  // divEl
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.appendChild(pEl);

  return divEl;
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

// Get Album Div
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
  divEl.className = "albumDiv";
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
  tracklistEl.className = "albumTracks";
  tracklistEl.innerHTML =
    trackItems[i].name + " • " + duration + "<br>" + songArtistsStr;

  // like btn
  let checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.dataset.index = i;
  for (let n = 0; n < likedSongs.length; n++) {
    if (
      likedSongs[n].name === trackItems[i].name &&
      likedSongs[n].duration_ms === trackItems[i].duration_ms
    ) {
      checkboxEl.checked = true;
      break;
    }
    // else if (checkboxEl.checked === false) {
    //   likedSongs.pop(likedSongs[n]);
    // }
  }

  checkboxEl.addEventListener("input", likeSong);

  // div
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.appendChild(tracklistEl);
  tracklistEl.appendChild(checkboxEl);

  return divEl;
}

// Get Duration
function getDuration(duration_ms) {
  let min = Math.floor(duration_ms / 60000);
  let sec = Math.floor((duration_ms % 60000) / 1000);
  if (sec.toString().length === 1) {
    sec = "0" + sec;
  }
  let duration = min + ":" + sec;
  return duration;
}

// Open Album
function openAlbum(e) {
  playlistsOutputEl.innerHTML = "";
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
    let duration_ms = trackItems[i].duration_ms;
    albumOutputEl.appendChild(
      getTracklistDiv(i, songArtistsStr, trackItems, getDuration(duration_ms))
    );
  }
}

// Liked Songs
playlistBtn.addEventListener("click", showLikedSongs);

function getLikedSongsDiv(i) {
  // img
  let imgEl = document.createElement("img");
  imgEl.src = likedSongs[i].trackAlbumImg;
  imgEl.dataset.index = likedSongs[i].albumIndex;
  imgEl.addEventListener("click", openAlbum);

  // p
  let pEl = document.createElement("p");
  pEl.className = "songs";
  pEl.innerHTML =
    likedSongs[i].name +
    " by " +
    "[artist(s)] • " +
    likedSongs[i].trackAlbumName +
    "<br>";
  pEl.appendChild(imgEl);

  // divEl
  let divEl = document.createElement("div");
  divEl.dataset.index = i;
  divEl.appendChild(pEl);

  return divEl;
}

function likeSong(e) {
  // Process Checkbox Clicked (liking or unliking)

  let albumIndex = outputEl.getAttribute("albumIndex");
  let trackAlbumImg = library[albumIndex].album.images[2].url;
  let trackAlbumName = library[albumIndex].album.name;
  let trackIndex = +e.currentTarget.dataset.index;
  let trackItems = library[albumIndex].album.tracks.items[trackIndex];
  // for (let n = 0; n < likedSongs.length; n++) {
  //   if (
  //     likedSongs[n].name === trackItems[trackIndex].name &&
  //     likedSongs[n].duration_ms === trackItems[trackIndex].duration_ms &&
  //     e.target.checked === false
  //   ) {
  //     console.log("hi");
  //     likedSongs.pop(likedSongs[n]);
  //     console.log(likedSongs[n]);
  //   }
  // }

  saveLikedSongs(albumIndex, trackAlbumName, trackAlbumImg, trackItems);
}

function showLikedSongs() {
  outputEl.innerHTML = "";
  albumOutputEl.innerHTML = "";
  playlistsOutputEl.innerHTML = "Liked Songs:<br>";
  for (let i = 0; i < library.length; i++) {
    playlistsOutputEl.appendChild(getLikedSongsDiv(i));
  }
}

// Local Storage
function saveLikedSongs(albumIndex, trackAlbumName, trackAlbumImg, trackItems) {
  trackItems.trackAlbumImg = trackAlbumImg;
  trackItems.trackAlbumName = trackAlbumName;
  trackItems.albumIndex = albumIndex;

  // if
  likedSongs.push(trackItems);
  localStorage.setItem("trackItems", JSON.stringify(likedSongs));
}

function loadLikedSongs() {
  let likedSongsStr = localStorage.getItem("trackItems");
  return JSON.parse(likedSongsStr) ?? [];
}

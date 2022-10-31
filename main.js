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
  "BQDZ3r5JrLkBg5SQlkcZvXSPgEB20UXi1NmwEWD-DtFW6fCdybxUhmXpZjEMHB7rRfXKpeorz8TLuIkMTIpsF4HVb1ui2e1ZugGZ9W-68qmo37MBBeNP_f1x7CSFRk9w30pUeu_0pnl_WswNQelsiZhp8i42GPZrrkhEToluq3zQoyIu_L7YRrCpTJHfTDEuGYbAUNdnG4bAAC6j";
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
    return a.album.name.toLowerCase() > b.album.name.toLowerCase() ? 1 : -1;
  });
  displayAlbums();
}

// function sortAlbumsYear() {
//   library.sort((0, albumNum) => {
//     return
//   })
// }

function sortAlbumsArtist() {
  library.sort((a, b) => {
    return a.album.artists[0].name.toLowerCase() > b.album.artists[0].name.toLowerCase() ? 1 : -1;
  });
  displayAlbums();
}

function displayAlbums() {
  outputEl.innerHTML = ""
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

function openAlbum(e) {
  let albumIndex = +e.currentTarget.dataset.id;
  let trackItems = library[albumIndex].album.tracks.items;
  for (let i = 0; i < trackItems.length; i++) {
    // outputEl.innerHTML = trackItems[i].name;
    console.log(trackItems[i].name);
  }

  // let albumTracks = "";
  // for (let i = 0; i < library.length; i++) {
  //   let tracks = library[i].album.tracks;
  //   console.log(tracks.items[i].name);
  // }
}

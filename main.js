// Music Library

// elements
let menu1El = document.getElementById("menu1");
let menu2El = document.getElementById("menu2");
let outputEl = document.getElementById("output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");
let selection = searchMenuEl.value;

// Array
let library = [];

let token =
  "BQCdYsfN_hI45lq7NX7YirGUEFECal-HvRoaIFiftq0q2D9No8YuhOBfYfonEBQoCPitaDmigY2QB55AGnRlLKxMODsQSV886auusl9p87kL33pnR92A3zTi--Bq3iLtgLGODCwrfS9YbJPXDJ7WVt_05UsEJLQMCQDTOKu_J-O70Zg2Wx1fEOeX5NhjgGYJMlGewR_CZfC2RBE3";
let albumNum = 250;

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

  function sortAlbumsAlphabetically() {
    library.sort((a, b) => {
      return a.album.name > b.album.name ? 1 : -1;
    });
  }

  function displayAlbums() {
    sortAlbumsAlphabetically();
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

      document.getElementById(`album${i}`).addEventListener("click", openAlbum);
    }
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
      library[i].album.name.toLowerCase().includes(searchBarEl.value.toLowerCase()) ||
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
  console.log("hi")
  // let albumTracks = "";
  // for (let i = 0; i < library.length; i++) {
  //   console.log(library[i].album.tracks.items[i].name);
  // }
  // outputEl.innerHTML = albumTracks;
}

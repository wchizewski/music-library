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
  "BQBM6PMiWfCtdLKKE6wNSStOuHCyzs8L-SOfv3_7kQ6wGnk5SfFFW__p3K5SIa4FDW_a_Afev-VvkV2vR8z4zy8e4wzwoIufcz3w8sAxY5ykP60IMAvPGU3HjKT9h8lmJ6HaUMQvl3EAGbB5g7-6W-ddbtRYQqNUKc8QKMtODPCfua2n5yAzhliNvxWTSL1Z47CxykIO8ZrChTJ7";
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

  function displayAlbums() {
    let divStr = "";
    for (let i = 0; i < library.length; i++) {
      let artists = library[i].album.artists;
      let artistString = '';
        artists.forEach((artist, index) => {
          if (index + 1 == artists.length) {
            artistString += artist.name
          } else {
            artistString += artist.name + ', '
            console.log(artistString)
          }
        })

      divStr += `
      <div>
        <p>
        <img src="${library[i].album.images[1].url}">
        <h2>${library[i].album.name}</h2>
        <h3>${artistString}</h3>
        <h4>${library[i].album.release_date}</h4>
        </p>
      </div>
      `;
    }
    outputEl.innerHTML = divStr;
    sortAlbumsAlphabetically()
  }
}

function sortAlbumsAlphabetically() {

}

searchBarEl.addEventListener("keyup", searchBarHandler);

function searchBarHandler(event) {
  let divStr = "";
  for (let i = 0; i < library.length; i++) {
    if (library[i].album.name.toLowerCase().includes(searchBarEl.value.toLowerCase())) {
      divStr += `
      <div>
        <p>
        <img src="${library[i].album.images[1].url}">
        <h2>${library[i].album.name}</h2>
        <h3>${library[i].album.artists[0].name}</h3>
        <h4>${library[i].album.release_date}</h4>
        </p>
      </div>
      `;
    }
  }
  outputEl.innerHTML = divStr;
}

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
  "BQDdFj1GUIS7q0P72q2qojpXqsgqWkuMv9lJnwGvOh4JZdLSS8Qns9fR6WuZAyewn4sW9KCq8NAwH2uf4pF7cjdsiA9ewutLrH_vi3azxUcdquCqqNMk5CMoAcjDJqhfaWg6T-5ht_zOzgBCMugWwF005mx25SDpT7T5aqP5ZZ4cR2OQVMlsGjabJXvYXOpqrSaEbUxDmWVRUgIB";
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
          displayAlbums(albums);
        }
      });
  }

  function displayAlbums(albums) {
    // console.log(data.items[i].album.name);\
    let divStr = "";
    for (let i = 0; i < library.length; i++) {
      // for (let i2 = 0; i2 < library[i].album.artists.length; i++) {
      divStr += `
      <div>
        <p><img src="${library[i].album.images[1].url}"><h2>${library[i].album.name}</h2><h3>${library[i].album.artists[0].name}</h3><h4>${library[i].album.release_date}</h4></p>
      </div>
      `;
      // }
    }
    outputEl.innerHTML = divStr;
  }

  //   let albums = stringData.replace(/(?:\r\n|\r|\n)/g, "\n").split(/\r?\n\n/);

  //   albums.forEach((element) => {
  //     let props = element.split("\n");

  //     let obj = {
  //       name: props[0],
  //       release: props[1],
  //       genre: props[2],
  //       subgenre: props[3],
  //       duration: props[4],
  //       artist: props[5],
  //       songs: [],
  //     };

  //     let songs = props.slice(6);

  //     for (let i = 0; i < songs.length; i += 2) {
  //       obj.songs.push({ name: songs[i], duration: songs[i + 1] });
  //     }

  //     library.push(obj);
  //   });
}

searchBarEl.addEventListener("keydown", searchBarHandler);

function searchBarHandler(e) {
  if (e.code === "Enter" && selection === "album") {
    searchAlbums();
  } else if (e.code === "Enter" && selection === "song") {
    searchSongs();
  }
  //   let query = searchBarEl.value;
  //   searchBarEl.value = "";
}

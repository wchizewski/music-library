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

fetch("music.txt").then(convertData).then(processData);

function convertData(rawData) {
  return rawData.text();
}

function processData() {
  fetch("https://api.spotify.com/v1/me/albums", {
    headers: new Headers({
      Authorization:
        "Bearer BQAHgPsRiYS1-QwouAr4MuKtgpgqUI08XEh2whmf1gvS-JbioZMQedYYqLL5wscGxjW3tYn3-zcga7eQxjEg83XIPHw2eWHW8IL-hFHv2soNEMFxDotxQvad5SsPOAVpF3N9ixT5E42iTlWlAlMVqM3yzdxSRMM_AzwkJ9ICL-SmqicRTJacsZcg8etqwEqVzCwG8ZPYOkhjjWeX0PeGb0Vy",
    }),
  })
    .then((response) => response.json())
    .then((data) => displayAlbums(data));

  function displayAlbums(data) {
    library = JSON.stringify(data);
    // console.log(data.items[i].album.name);
    console.log(data);
    for (let i = 0; i < library.length; i++) {
      outputEl.innerHTML +=
        data.items[i].album.name +
        " - " +
        " 1." +
        data.items[i].album.tracks.items[0].name +
        " 2." +
        data.items[i].album.tracks.items[1].name +
        " 3." +
        data.items[i].album.tracks.items[2].name;
    }
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

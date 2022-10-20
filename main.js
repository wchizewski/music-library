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
  let totalData = [];
  for (let offset = 0; offset < 300; offset += 50) {
    fetch(`https://api.spotify.com/v1/me/albums?limit=50&offset=${offset}`, {
      headers: new Headers({
        Authorization:
          "Bearer BQAD6hv2aeMfMTDlICH4WV3mOUsaJwh0_8U_YpU_-GNl15waZQXBVDv3VCLCwIXyC3mCS-b8vEyOP9Af4ppGwVu_RyNBVLhBf5gBFkKG7ngTwy3rSH3qA_Zig8ELr0s10tSe6v-YZ52Q9GUBNGqBjzMvmQQALH-8dlTKMZMpMiR598ZfOOZqiVLeYJV7rRMzHFXFvqqM0JTi18nW",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        totalData.push(data);
        if (offset === 250) {
          console.log(
            totalData[0].items.concat(totalData[1].items, totalData[2].items)
          );
          displayAlbums(totalData);
        }
      });
  }

  function displayAlbums(data) {
    library = totalData;
    // console.log(data.items[i].album.name);
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

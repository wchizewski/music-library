// Music Library

// elements
let menu1El = document.getElementById("menu1");
let menu2El = document.getElementById("menu2");
let outputEl = document.getElementById("output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");
let selection = searchMenuEl.value;

// Array
let library = []

fetch("music.txt").then(convertData).then(processData);

function convertData(rawData) {
  return rawData.text();
}

function processData(stringData) {
  let albums = stringData.replace(/(?:\r\n|\r|\n)/g, '\n').split(/\r?\n\n/);
  
  albums.forEach((element) => {
     let props = element.split('\n');
     
     let obj = {
        name: props[0],
        release: props[1],
        genre: props[2],
        subgenre: props[3],
        duration: props[4],
        artist: props[5],
        songs: [],
     }
     
     let songs = props.slice(6);
     
     for (let i = 0; i < songs.length; i += 2) {
        obj.songs.push({name: songs[i], duration: songs[i + 1]});
     }
     
     library.push(obj)
  })
};


// function createArray() {
//   library = [
//     (album = {
//       name: albumName,
//       year: albumYear,
//       genre: albumGenre,
//       subgenre: albumSubgenre,
//       duration: albumDuration,
//       artist: albumArtist,
//       songs: [
//         (song1 = {
//           duration: songDuration,
//         }),
//         (song2 = {
//           duration: songDuration,
//         }),
//         (song3 = {
//           duration: songDuration,
//         }),
//         (song4 = {
//           duration: songDuration,
//         }),
//         (song5 = {
//           duration: songDuration,
//         }),
//         (song6 = {
//           duration: songDuration,
//         }),
//         (song7 = {
//           duration: songDuration,
//         }),
//         (song8 = {
//           duration: songDuration,
//         }),
//         (song9 = {
//           duration: songDuration,
//         }),
//         (song10 = {
//           duration: songDuration,
//         }),
//         (song11 = {
//           duration: songDuration,
//         }),
//         (song12 = {
//           duration: songDuration,
//         }),
//         (song13 = {
//           duration: songDuration,
//         }),
//         (song14 = {
//           duration: songDuration,
//         }),
//         (song15 = {
//           duration: songDuration,
//         }),
//         (song16 = {
//           duration: songDuration,
//         }),
//       ],
//     }),
//   ];
// }

// search
// function search() {
//   if (selection === "album") {
//     searchAlbums();
//   } else if (selection === "song") {
//     searchSongs();
//   }
// }

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

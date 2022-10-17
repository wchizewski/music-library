// Music Library

// elements
let menu1El = document.getElementById("menu1");
let menu2El = document.getElementById("menu2");
let outputEl = document.getElementById("output");
let searchMenuEl = document.getElementById("search-menu");
let searchBarEl = document.getElementById("search-bar");
let selection = searchMenuEl.value;

// Array

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

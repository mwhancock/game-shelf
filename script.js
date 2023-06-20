// Global variables

const library = document.getElementById("library-body");
const gallery = document.getElementById("gallery");
const galleryImg  = document.getElementsByClassName("gallery-img");
const searchResults = document.getElementById("search_results");
const search = document.getElementById("search_button");
const addGameBtn = document.getElementsByClassName("new-game-btn");
const navList = document.getElementById("nav-list");
const navItem = document.getElementsByClassName("nav-item");
const search_input = document.getElementById("search_bar");
const clientID = '9RQI1WBCZA';
let usrLibrary = [];
let recGames = [];
let searchArr = [];
let hotList = [];
let hotListIds = [];
let slideArr;
let lastSlide;

// Sets entire library object into LocalStorage (only needed on first fetch // if LocalStorage doesn't exist)
const setUserLibrary = (lib) => {
  localStorage.setItem("user_library", JSON.stringify(lib));
};

const getUserLibrary = () => {
  // array of JSONified Game data or undefined
  const possible_library = localStorage.getItem("user_library");
  if (possible_library === undefined){
    return JSON.parse(possible_library);
  }
  return console.log("No user Library found");
};

// const setHotList = (hot) => {
//   localStorage.setItem("hot_list", hot)
// }























    // geekXMLToJSON(gameList);

// window.addEventListener('hot-list', e => {
//     const gameList = (e.detail.games);
//     const gameIds = gameList.getElementsByTagName("item");
//     for(let  id in gameIds){
//         if(gameIds[id] == undefined){
//             continue
//         }
//         hotListIds.push(gameIds[id].id)
//     }

//     for(let id in hotListIds){
//       fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`)
//         .then(res => {return res.text()})
//         .then(data => {
//           let game = new DOMParser().parseFromString(data, "text/xml")
//           hotList.push(game)
//         })
//     }
//     console.log(hotList)

// })

// // Boardgamegeek API

// fetch("https://boardgamegeek.com/xmlapi2/hot?type=boardgame")    
//     .then(res => {return res.text()})
//     .then(data => {
//         // console.log('Hot Games with Custom Parser', parseHotGamesXml(data));
//         // console.log('Hot Games with generic Parser', parseXmlFromGeek(data));
//         const hotGames = new CustomEvent("hot-list", {
//             detail:{
//                 games: new DOMParser().parseFromString(data, "text/xml")
//             }
//         })
//         window.dispatchEvent(hotGames)   
//     })
//     .catch(err => {
//         console.log(`ERROR: ${err}`)
//     })





























// Generic method for retrieving data from BGA API. defualts to top 100 ranked games
const getAtlasData = (params = "order_by=rank&limit=100") => {
  return fetch(
    `https://api.boardgameatlas.com/api/search?${params}&client_id=${clientID}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data.games;
    })
    .catch((err) => console.log("ERROR: ", err));
};

// Fetches top 100 games on BGA and creates array of game objects
getAtlasData("order_by=rank&limit=15").then((games_list) => {
  games_list.forEach((game) => {
    const gameObj = {};
    gameObj.id = game.id;
    gameObj.image = game?.images?.large;
    gameObj.name = game.name;
    gameObj.description = game.description_preview;
    recGames.push(gameObj);
  });

  featureConstructor();
  let slideCards = document.getElementsByClassName("feature-card");
  slideArr = Array.from(slideCards);
  slideArr.forEach((slide) => {
    slide.style.display = "none";
  });
  slideArr[0].style.display = "block";
  lastSlide = slideArr.length - 1;
});


const searchAtlasByName = (e) => {
  e.preventDefault();

  const search_term = search_input.value ?? undefined;

  if (!search_term) return console.warn("please provide a Search Value");

  try {
    getAtlasData(`name=${search_term}&fuzzy_match=true&order_by=name&limit=100`)
      .then((res) => {
        res.forEach((game) => {
          const gameObj = {};
          gameObj.id = game.id;
          gameObj.image = game.images.medium;
          gameObj.name = game.name;
          searchArr.push(gameObj);
        });
      })
      .then(() => {
        searchResultsConstructor();
      });
  } catch (error) {
    console.log("Error retrieving User Games by ID", error);
  }
};

// retrieve user data and BGA data for single game
// From the 'card-click' event, retrieve the game's ID, use that to map data from storage
const getGameData = (id) => {
  // Checks our global library for the game first
  const cached_game = usrLibrary.find((game) => game.id === id);
  // return the cached data if it exists, else retrieve it from API
  if (cached_game !== undefined) {
    console.log("Retreived game from users cache");
    return cached_game;
  } else {
    console.log("Fetching game with id: ", id);
    let api_game = getAtlasData(`ids=${[id]}&limit=100`)
      .then((game_data) => {
        console.log("Retrieved single game from BGA API");
        // returns an array, we want the first index
        console.log(game_data[0]);
      })
      .then(() => {
        return game_data[0];
      })
      .catch((error) =>
        console.log("Error retrieving game with id: ", id, error)
      );

    return api_game;
  }
};

// Sample LocalStorage API
// Create / Read / Update / Delete

// add to library // modify existing entry
const addGameToLibrary = (game_to_add) => {
  const current_library = getUserLibrary() ?? [];
  console.log(current_library);

  // If no user library present, add the game to the user's library
  if (current_library.length === 0) {
    current_library.push(game_to_add);
  } else {
    // If there is a library, Check if the game exists already and retrieve index
    const game_index = current_library.findIndex(
      (game) => game.id === game_to_add.id
    );

    // Modify the library_before array accordingly
    if (game_index) current_library[game_index] = game_to_add;
  }

  // overwrite LocalStorage data
  setUserLibrary(current_library);

  // overwrite global cache data
  usrLibrary = current_library;
};

// TODO: REVIEW THIS METHOD TO SEE HOW IT FITS WITH YOUR PLANS
// Sample call to get Game Data for a single game... Use this for populating your Modal from a click handler
// getGameData('EJe7IlhwX2').then(
//     game_data => {
//         addGameToLibrary(game_data)
//         console.log('Retrieved a single game based on ID', game_data)
//     }
// );

// TODO: FINISH THE METHOD
// add to library // modify existing entry
const removeGameFromLibrary = (game_to_remove) => {
  const current_library = getUserLibrary();

  // Check if a version of the game exists already and retrieve index
  const game_index = current_library.findIndex(
    (game) => game.id === game_to_remove.id
  );

  // I'll leave this method for you to fill out
  // it is similar to add but we need to remove the index of an array if it exists

  // overwrite LocalStorage data
  setUserLibrary(current_library);

  // overwrite global cache data
  usrLibrary = current_library;
};

// Method for retrieving the users library data based on LocalStorage IDs
const fetchUserLibrary = () => {
  // Retrieve stored library data from LocalStorage
  const user_library = getUserLibrary();
  const ids = [];

  if (!user_library)
    return console.log("No User Library Found in LocalStorage");

  // generate an array of ids from our library array
  user_library.forEach((game_obj) => ids.push(game_obj.id));

};


//Card Constructors


function featureConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, gameDes, desItem;
  temp = document.getElementById("feature-card-template");

  for (i = 0; i < 14; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    imgPath = recGames[i].image;
    imgItem.setAttribute("src", imgPath);
    desItem = itemDiv.querySelector("p").cloneNode(true);
    nameItem = itemDiv.querySelector("h2").cloneNode(true);
    gameName = recGames[i].name;
    gameDes = recGames[i].description;
    if(gameDes === ""){
      gameDes = "No description currently available"
     } else{
      gameDes = `${shortenParagraph(gameDes, textLimit(screenWidth))}.`
    }
    desItem.innerText = `${gameDes}`;
    nameItem.classList.add("feature-name");
    nameItem.innerText = `${gameName}`
    desItem.classList.add("feature-des");
    itemDiv.setAttribute("id", "desBox")
    itemDiv.classList.add("feature-card");
    imgItem.classList.add("gallery-img");
    itemDiv.append(imgItem);
    itemDiv.append(nameItem);
    itemDiv.append(desItem);
    gallery.append(itemDiv);
  }
}


function libraryConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, gameDes, desItem;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < usrLibrary.length; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    itemDiv.classList.add("game-card");
    imgPath = usrLibrary[i].images.medium;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.classList.add("game-img");
    desItem = itemDiv.querySelector("p").cloneNode(true);
    nameItem = itemDiv.querySelector("h5").cloneNode(true);
    gameName = usrLibrary[i].name;
    gameDes = usrLibrary[i].description_preview;
    if(gameDes === ""){
      gameDes = "No description currently available";
    } 
    desItem.innerText = `${gameDes}`
    nameItem.classList.add("game-info");
    nameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(nameItem);
    nameItem.append(desItem);
    library.append(itemDiv);
  }
}

function searchResultsConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, addBtn;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < searchArr.length; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    itemDiv.classList.add("game-card");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    addBtn = itemDiv.querySelector("button").cloneNode(true);
    addBtn.classList.add("add-btn");
    addBtn.innerText = "Add"
    imgPath = searchArr[i].image;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "Game image");
    imgItem.classList.add("preview-img");
    nameItem = itemDiv.querySelector("h4").cloneNode(true);
    nameItem.classList.add("game-name");
    gameName = searchArr[i].name;
    nameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(nameItem);
    itemDiv.append(addBtn)
    itemDiv.setAttribute("id", searchArr[i].id)
    searchResults.append(itemDiv);
    document.getElementById("result_content").style.display = "block";
  }
  searchArr = [];
}

function clearSearch() {
  document.getElementById("result_content").style.display = "none";
  searchResults.innerHTML = "";
}


//Shortens game description to fit on game card
let screenWidth = window.innerWidth;

const textLimit = (width) => {
  if(width >= 992){
    return 713;
  } else if(width >= 710){
    return 694;
  } else if(width >= 576){
    return 562;
  } else if(width >= 400){
    return 425
  }
}

const shortenParagraph = (text, limit) => {

  if(text.length <= limit){
    return text; //If description already fits on card, returns
  }

  //Find the nearest period within the character limit
  let periodIndex = text.lastIndexOf(".", limit);

  if(periodIndex != -1){
    //Slices description at the nearest period to character limit
    text = text.slice(0, periodIndex + 1);
  }else {
    //If no period, slices at character limit
    text = text.slice(0, limit);
  }

  //Remove trailing spaces
  text = text.replace(/[.\s]+$/, "");

  return text;
}


// SLIDESHOW AUTOMATION



let slideIndex = 0;


// Manual controls for slide show

// Add event listener to the next button that calls the next slide when clicked
const nextSlide = document.querySelector(".next-btn");
nextSlide.addEventListener("click", () => {
  fwdSlide();
});

// Add event listener to the previous button that calls the previous slide when clicked
const prevSlide = document.querySelector(".prev-btn");
prevSlide.addEventListener("click", () => {
  bwdSlide();
});

// Gets the index of the last item in the slide array

// Function to move to next slide
function fwdSlide() {
  slideArr.forEach((slide) => {
    slide.style.display = "none";

  });
  slideIndex++;
  if (slideIndex >= slideArr.length) {
    slideIndex = 0;
  }
  slideArr[slideIndex].style.display = "block";
}

// Function to move to previous slide
function bwdSlide() {
  slideArr.forEach((slide) => {
    slide.style.display = "none";
  });
  slideIndex--;
  if (slideIndex < 0) {
    slideIndex = lastSlide;
  }
  slideArr[slideIndex].style.display = "block";
}

// const gameModal = () => {
  
// }

const searchGame = (e) => {
  clearSearch();
  if(e.type === "click"){
    searchAtlasByName(e);
  }
  if(e.key === "Enter"){
    searchAtlasByName(e);
  }
}





const welcomeDialog = () => {

  // Check if the modal has been shown before
  if (!localStorage.getItem('modalShown')) {
    
  //   // Get a reference to the modal and the close button
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-btn');
    // Show the modal
    modal.showModal();
    
    // Add an event listener to the close button
    closeButton.addEventListener('click', () => {
      // Close the modal

      modal.close();
      
      // Set the flag in localStorage to indicate the modal has been shown
      localStorage.setItem('modalShown', true);
    });
  }
}

welcomeDialog()  
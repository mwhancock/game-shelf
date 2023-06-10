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
let slideArr;
let lastSlide;

// Sets entire library object into LocalStorage (only needed on first fetch // if LocalStorage doesn't exist)
const setUserLibrary = (lib) => {
  localStorage.setItem("user_library", JSON.stringify(lib));
};

const getUserLibrary = () => {
  // array of JSONified Game data or undefined
  const possible_library = localStorage.getItem("user_library");
  if (possible_library === undefined) {
    return JSON.parse(possible_library);
  }
  return console.log("No user Library found");
};


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
  // console.log(games_list)
  games_list.forEach((game) => {
    const gameObj = {};
    gameObj.id = game.id;
    gameObj.image = game?.images?.medium;
    recGames.push(gameObj);
  });
  // cardConstructor(featureConstructor, 10, gallery);
  featureConstructor();
  let slideCards = document.getElementsByClassName("gallery-img");
  slideArr = Array.from(slideCards);
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
        // cardConstructor(searchResultsConstructor, 8, searchResults);
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


// Takes function as parameter and constructs cards based on use case requirements

let itemDiv, imgItem, imgPath, i, temp, gameTemp, featureTemp, tempDiv, gameItem, gameName, gameDes;

function cardConstructor(constructorType, numOfCards, cardType){
    gameTemp = document.getElementById("game-card-template");
    featureTemp = document.getElementById("feature-card-template");

    if(cardType === gallery){
        temp = featureTemp;
    } else{
        temp = gameTemp;
    }

    for(i = 0; i < numOfCards; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        if(cardType != searchResults){
            gameName = getUserLibrary()[i].name;
        } else{
            gameName = searchArr[i].name;
        }
        constructorType();

        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        cardType.append(itemDiv);
    }
}

function featureConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv;
  temp = document.getElementById("feature-card-template");

  for (i = 0; i < 14; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    imgPath = recGames[i].image;
    imgItem.setAttribute("src", imgPath);
    if(i === 0){
      itemDiv.setAttribute("class", "active")
    }
    itemDiv.setAttribute("class", "feature-card");
    imgItem.setAttribute("class", "gallery-img");
    itemDiv.append(imgItem);
    gallery.append(itemDiv);
  }
}

function recentConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < 8; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    itemDiv.setAttribute("class", "grid-box game-card");
    imgPath = usrLibrary[i] .images.medium;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.setAttribute("class", "preview-img");
    gameName = usrLibrary[i].name;
    gameItem = itemDiv.querySelector("p").cloneNode(true);
    gameItem.setAttribute("class", "preview-info");
    gameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(gameItem);
    recentGames.append(itemDiv);
  }
}

function libraryConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName, gameDes, desItem;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < usrLibrary.length; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    itemDiv.setAttribute("class", "game-card");
    imgPath = usrLibrary[i].images.medium;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.setAttribute("class", "game-img");
    desItem = itemDiv.querySelector("p").cloneNode(true);
    gameItem = itemDiv.querySelector("h5").cloneNode(true);
    gameName = usrLibrary[i].name;
    gameDes = usrLibrary[i].description_preview;
    if(gameDes === ""){
      gameDes = "No description currently available";
    }
    desItem.innerText = `${gameDes}`
    gameItem.setAttribute("class", "game-info");
    desItem.setAttribute("class", "game-des");
    gameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(gameItem);
    gameItem.append(desItem);
    library.append(itemDiv);
  }
}

function searchResultsConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < searchArr.length; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    itemDiv.setAttribute("class", "grid-box game-card");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    imgPath = searchArr[i].image;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "Game image");
    imgItem.setAttribute("class", "preview-img");
    gameItem = itemDiv.querySelector("p").cloneNode(true);
    gameItem.setAttribute("class", "preview-info");
    gameName = searchArr[i].name;
    gameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(gameItem);
    searchResults.append(itemDiv);
    document.getElementById("result_content").style.display = "block";
  }
  searchArr = [];
}

function clearSearch() {
  document.getElementById("result_content").style.display = "none";
  searchResults.innerHTML = "";
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


  
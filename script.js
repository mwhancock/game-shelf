// Global variables

const library = document.getElementById("library-body");
const gallery = document.getElementById("gallery");
const galleryImg  = document.getElementsByClassName("gallery-img");
const searchResults = document.getElementById("search_results");
const search = document.getElementById("search_button");
const navList = document.getElementById("nav-list");
const navItem = document.getElementsByClassName("nav-item");
const search_input = document.getElementById("search_bar");
const addGameBtn = document.getElementsByClassName("add-btn");
const removeGameBtn = document.getElementsByClassName("remove-btn");
const clientID = '9RQI1WBCZA';
let usrLibrary = [];
let recGames = [];
let searchArr = [];
let hotList = [];
let hotListIds = [];
let slideArr;
let lastSlide;


// Sets entire library object into LocalStorage (only needed on first fetch // if LocalStorage doesn't exist)
const setUserLibrary = (game) => {
  const current_library = getUserLibrary() ?? [];
  const newLibrary = [...current_library, game];
  localStorage.setItem("user_library", JSON.stringify(newLibrary));
};

const getUserLibrary = () => {
  // array of JSONified Game data or undefined
  let possible_library = localStorage.getItem("user_library");
  if (possible_library === null || possible_library === undefined){
    return [];
  }
  
  return JSON.parse(possible_library);
};


window.addEventListener("load", () => {
  const emptyText = document.getElementById("empty-text");
  
  if(getUserLibrary().length === 0){
    emptyText.style.display = 'block';
  } else {
    emptyText.style.display = 'none';
  }
});

libraryConstructor();
















//TEST CODE

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






//return a game object from the board game geek api for game by name
// const searchBGG = (e) => {
//   e.preventDefault();
//   const search_term = search_input.value ?? undefined;
//   if (!search_term) return console.warn("please provide a Search Value");
//   try {
//     fetch(`https://boardgamegeek.com/xmlapi2/search?query=${search_term}`)
//       .then((res) => {
//         return res.text();
//       })
//       .then((data) => {
//         const game = parseXmlFromGeek(data);
//         return game
//       });
//   } catch (error) {
//     console.log("Error retrieving User Games by ID", error);
//   }
// };


// //convert xml data from board game geek api to json
// const parseXmlFromGeek = (xml) => {
//   const parser = new DOMParser();
//   const xmlData = parser.parseFromString(xml, "text/xml");
//   const game = xmlData.getElementsByTagName("item")[0];
//   const gameObj = {};
//   gameObj.id = game.getAttribute("id");
//   gameObj.name = game.getElementsByTagName("name")[0].getAttribute("value");
//   gameObj.image = game.getElementsByTagName("image")[0].innerHTML;
//   gameObj.description = game.getElementsByTagName("description")[0].innerHTML;
//   return gameObj;
// };



























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

  if (!search_term) return console.warn("Please provide a Search Value");

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


// Fetch game data from BGA API based on id
const fetchGame = async (gameID) => {
  const game = await fetch(`https://api.boardgameatlas.com/api/search?ids=${gameID}&client_id=${clientID}`)
    .then((res) => res.json())
    .then((data) => {
      return data.games[0];
    })
    return game;
  }

  // add to library // modify existing entry
  const addGameToLibrary = async (game_to_add) => {
    const current_library = getUserLibrary() ?? [];
    const fetchedGame = await fetchGame(game_to_add);
    const existingGame = current_library.some(game => game.id === fetchedGame.id);

    if(existingGame){
      inLibrary()
      return;
    } else {
      setUserLibrary(fetchedGame);
      libraryConstructor();
      window.location.reload();
    }

  }


// remove from library
const removeGameFromLibrary = (game_to_remove) => {
  const current_library = getUserLibrary();
  const index = current_library.findIndex(game => game.id === game_to_remove);
  const gameCard = document.getElementById(game_to_remove);
  
  if(index !== -1){
    current_library.splice(index, 1);
    gameCard.remove();
    localStorage.setItem("user_library", JSON.stringify(current_library));
  } else {
    console.log("Game not found in library");
  }
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
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, removeBtn;
  temp = document.getElementById("game-card-template");

  for (i = 0; i < getUserLibrary().length; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    itemDiv.setAttribute("id", getUserLibrary()[i].id);
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    removeBtn = itemDiv.querySelector("button").cloneNode(true);
    removeBtn.classList.add("remove-btn");
    removeBtn.setAttribute("id", getUserLibrary()[i].id);
    removeBtn.innerText = "X";
    itemDiv.classList.add("game-card");
    imgPath = getUserLibrary()[i]?.images?.medium;
    console.log(imgPath);
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.classList.add("game-img");
    nameItem = itemDiv.querySelector("h4").cloneNode(true);
    gameName = getUserLibrary()[i].name;
    nameItem.classList.add("library-game-name");
    nameItem.innerText = `${gameName}`;
    itemDiv.append(imgItem);
    itemDiv.append(nameItem);
    itemDiv.append(removeBtn);
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
    itemDiv.classList.add("search-card");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    addBtn = itemDiv.querySelector("button").cloneNode(true);
    addBtn.classList.add("add-btn");
    addBtn.setAttribute("id", searchArr[i].id);
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

  
  for(let i = 0; i < addGameBtn.length; i++){
    addGameBtn[i].addEventListener("click", (e) => {
      e.preventDefault();
      const gameID = e.target.id;
      addGameToLibrary(gameID);
    })
    searchArr = [];
  }}

  for(let i = 0; i < removeGameBtn.length; i++){
    removeGameBtn[i].addEventListener("click", (e) => {
      e.preventDefault();
      const gameID = e.target.id;
      removeGameFromLibrary(gameID);
    })
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

document.getElementById("close-search").addEventListener("click", () => {
  clearSearch();
})

const inLibrary = () => {
  const dialog = document.getElementById("dialog");
  const closeButton = document.getElementById("close-dialog-btn");

  dialog.show();

  closeButton.addEventListener('click', () => {
    dialog.close();
})
}

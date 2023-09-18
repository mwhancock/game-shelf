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
const featureBtn = document.getElementsByClassName("feature-add-btn");
const clientID = '9RQI1WBCZA';
let usrLibrary = [];
let recGames = [];
let searchArr = [];
let slideIndex;
let slideArr;
let lastSlide;


const setIndex = () => {
  if (localStorage.getItem("index") === null) {
    localStorage.setItem("index", 0);
  }
}

setIndex(slideIndex);
slideIndex = localStorage.getItem("index");

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

// libraryConstructor();












const getHotIds = async () => {
   const hotlist = await fetch("https://boardgamegeek.com/xmlapi2/hot?type=boardgame")
    .then((res) =>  res.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlData = parser.parseFromString(data, "text/xml");
      const gameList = Array.from(xmlData.getElementsByTagName("item"));
      const idList = gameList.map((game) => {
        return game.getAttribute("id");
      });
      return idList
    })
    .catch((err) => console.log("ERROR: ", err));
    return hotlist;

}



  const getGameDetails = async (gameID) => { 
    const game = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${gameID}`)
      .then((res) => res.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(data, "text/xml");
        const gameData = Array.from(xmlData.getElementsByTagName("item"));
        const gameObj = gameData.map((game) => {
          return {
            id: gameID,
            name: game.querySelector("name").getAttribute("value"),
            image: game.querySelector("image").textContent.trim(),
            description: game.querySelector("description").textContent.trim(),
          }
        })
        return gameObj;
      })
      .catch((err) => console.log("ERROR: ", err));
      return game;
    };

    getHotIds().then((hotlist) => {
      const promises = hotlist.map((id) => getGameDetails(id));
      Promise.all(promises).then((games) => {
        recGames = games;
        featureConstructor();
      });
    });





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


  
// Add event listener to the next button that calls the next slide when clicked
//   const nextSlide = document.querySelector(".next-btn");
//   nextSlide.addEventListener("click", () => {
//     fwdSlide();
//   });

// // Add event listener to the previous button that calls the previous slide when clicked
//   const prevSlide = document.querySelector(".prev-btn");
//   prevSlide.addEventListener("click", () => {
//   bwdSlide();
//   });
//   let slideCards = document.getElementsByClassName("feature-card");
//   slideArr = Array.from(slideCards);
//   slideArr.forEach((slide) => {
//     slide.style.display = "none";
//   });
//   slideArr[localStorage.getItem("index")].style.display = "block";
//   lastSlide = slideArr.length - 1;




// const searchAtlasByName = (e) => {
//   e.preventDefault();

//   const search_term = search_input.value ?? undefined;

//   if (!search_term) return console.warn("Please provide a Search Value");

//   try {
//     getAtlasData(`name=${search_term}&fuzzy_match=true&order_by=name&limit=100`)
//       .then((res) => {
//         res.forEach((game) => {
//           const gameObj = {};
//           gameObj.id = game.id;
//           gameObj.image = game.images.medium;
//           gameObj.name = game.name;
//           searchArr.push(gameObj);
//         });
//       })
//       .then(() => {
//         searchResultsConstructor();
//         window.location.href = "#search_results";
//       });
//   } catch (error) {
//     console.log("Error retrieving User Games by ID", error);
//   }
// };


  //sorts user library by name
  const sortLibrary = () => {
    const library = getUserLibrary();
    library.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if(nameA < nameB){
        return -1;
      }
      if(nameA > nameB){
        return 1;
      }
      return 0;
    })
    return library;
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
      localStorage.setItem("user_library", JSON.stringify(sortLibrary()));
      pageReload();
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
    pageReload();
  } else {
    console.log("Game not found in library");
  }
};


//Card Constructors


function featureConstructor() {
  let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, gameDes, desItem, addBtn;
  temp = document.getElementById("feature-card-template");

  for (i = 0; i < 14; i++) {
    tempDiv = temp.content.cloneNode(true);
    itemDiv = tempDiv.querySelector("div");
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    desItem = itemDiv.querySelector("p").cloneNode(true);
    nameItem = itemDiv.querySelector("h2").cloneNode(true);
    addBtn = itemDiv.querySelector("button").cloneNode(true);
    imgPath = recGames[i][0].image;
    console.log(imgPath);
    imgItem.setAttribute("src", imgPath);
    addBtn.classList.add("feature-add-btn");
    addBtn.setAttribute("id", recGames[i][0].id);
    addBtn.innerText = "+"
    gameName = recGames[i][0].name;
    gameDes = recGames[i][0].description;
    if(gameDes === ""){
      gameDes = "No description currently available"
    }//  } else{
      // gameDes = `${shortenParagraph(gameDes, textLimit(screenWidth))}.`
    // }
    desItem.innerText = `${gameDes}`;
    nameItem.classList.add("feature-name");
    nameItem.innerText = `${gameName}`
    desItem.classList.add("feature-des");
    itemDiv.setAttribute("id", "desBox")
    itemDiv.classList.add("feature-card");
    imgItem.classList.add("gallery-img");
    itemDiv.append(addBtn);
    itemDiv.append(imgItem);
    itemDiv.append(nameItem);
    itemDiv.append(desItem);
    gallery.append(itemDiv);
  }
  // addFeaturedGame();
}


// function libraryConstructor() {
//   let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, removeBtn;
//   temp = document.getElementById("game-card-template");

//   for (i = 0; i < getUserLibrary().length; i++) {
//     tempDiv = temp.content.cloneNode(true);
//     itemDiv = tempDiv.querySelector("div");
//     itemDiv.setAttribute("id", getUserLibrary()[i].id);
//     imgItem = itemDiv.querySelector("img").cloneNode(true);
//     removeBtn = itemDiv.querySelector("button").cloneNode(true);
//     removeBtn.classList.add("remove-btn");
//     removeBtn.setAttribute("id", getUserLibrary()[i].id);
//     removeBtn.innerText = "X";
//     itemDiv.classList.add("game-card");
//     imgPath = getUserLibrary()[i]?.images?.medium;
//     imgItem.setAttribute("src", imgPath);
//     imgItem.setAttribute("alt", "a picture of a game");
//     imgItem.classList.add("game-img");
//     nameItem = itemDiv.querySelector("h4").cloneNode(true);
//     gameName = getUserLibrary()[i].name;
//     nameItem.classList.add("library-game-name");
//     nameItem.innerText = `${gameName}`;
//     itemDiv.append(imgItem);
//     itemDiv.append(nameItem);
//     itemDiv.append(removeBtn);
//     library.append(itemDiv);
//   }
// }

// function searchResultsConstructor() {
//   let itemDiv, imgItem, imgPath, i, temp, tempDiv, nameItem, gameName, addBtn;
//   temp = document.getElementById("game-card-template");

//   for (i = 0; i < searchArr.length; i++) {
//     tempDiv = temp.content.cloneNode(true);
//     itemDiv = tempDiv.querySelector("div");
//     imgItem = itemDiv.querySelector("img").cloneNode(true);
//     itemDiv.classList.add("search-card");
//     imgItem = itemDiv.querySelector("img").cloneNode(true);
//     addBtn = itemDiv.querySelector("button").cloneNode(true);
//     addBtn.classList.add("add-btn");
//     addBtn.setAttribute("id", searchArr[i].id);
//     addBtn.innerText = "Add"
//     imgPath = searchArr[i].image;
//     imgItem.setAttribute("src", imgPath);
//     imgItem.setAttribute("alt", "Game image");
//     imgItem.classList.add("preview-img");
//     nameItem = itemDiv.querySelector("h4").cloneNode(true);
//     nameItem.classList.add("game-name");
//     gameName = searchArr[i].name;
//     nameItem.innerText = `${gameName}`;
//     itemDiv.append(imgItem);
//     itemDiv.append(nameItem);
//     itemDiv.append(addBtn)
//     itemDiv.setAttribute("id", searchArr[i].id)
//     searchResults.append(itemDiv);
//     document.getElementById("result_content").style.display = "block";

//   }

  
//   for(let i = 0; i < addGameBtn.length; i++){
//     addGameBtn[i].addEventListener("click", (e) => {
//       e.preventDefault();
//       const gameID = e.target.id;
//       addGameToLibrary(gameID);
//     })
//     searchArr = [];
//   }}

//   for(let i = 0; i < removeGameBtn.length; i++){
//     removeGameBtn[i].addEventListener("click", (e) => {
//       e.preventDefault();
//       const gameID = e.target.id;
//       removeGameFromLibrary(gameID);
//     })
//   }

//   const addFeaturedGame = () => {
//   for(let i = 0; i < featureBtn.length; i++){
//     featureBtn[i].addEventListener("click", (e) => {
//       e.preventDefault();
//       const gameID = e.target.id;
//       addGameToLibrary(gameID);
//     })
//   }
// }



function clearSearch() {
  document.getElementById("result_content").style.display = "none";
  searchResults.innerHTML = "";
}


//Shortens game description to fit on game card
// let screenWidth = window.innerWidth;

// const textLimit = (width) => {
//   if(width >= 992){
//     return 713;
//   } else if(width >= 710){
//     return 694;
//   } else if(width >= 576){
//     return 562;
//   } else if(width >= 400){
//     return 425
//   }
// }

// const shortenParagraph = (text, limit) => {

//   if(text.length <= limit){
//     return text; //If description already fits on card, returns
//   }

//   //Find the nearest period within the character limit
//   let periodIndex = text.lastIndexOf(".", limit);

//   if(periodIndex != -1){
//     //Slices description at the nearest period to character limit
//     text = text.slice(0, periodIndex + 1);
//   }else {
//     //If no period, slices at character limit
//     text = text.slice(0, limit);
//   }

//   //Remove trailing spaces
//   text = text.replace(/[.\s]+$/, "");

//   return text;
// }


// SLIDESHOW AUTOMATION






// Manual controls for slide show



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
    
  // Get a reference to the modal and the close button
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


const pageReload = () => {
  localStorage.setItem("index", slideIndex);
  location.reload();
}

// Global variables

const library = document.getElementById("library-body");
const libraryPreview = document.getElementById("recent-games");
const gallery = document.getElementById("gallery");
const addGameBtn = document.getElementsByClassName("new-game-btn")
let slideArr;
let lastSlide;
let images = [];
let names = [];
let descriptions = [];
let gameIds = [];


// Add event listener to window that will populate library once api is fetched
window.addEventListener('games-retrieved', (e) => {
    const gameList = e.detail.games;
    const gamePics = gameList.getElementsByTagName("image");
    const gameNames = gameList.getElementsByTagName("name");

    for(let img in gamePics){
        if(gamePics[img].childNodes == undefined){
            continue
        }
        images.push(gamePics[img].childNodes[0].nodeValue);
    }
    for(let name in gameNames){
        if(gameNames[name].childNodes == undefined){
            continue
        }
        names.push(gameNames[name].childNodes[0].nodeValue);
    }

    for(let game in gameList){
        // console.log(gameList[game])
    }

    getFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
    getLibrary();
    getRecentGames();
})

// Boardgamegeek API

fetch("https://boardgamegeek.com/xmlapi2/collection?username=mwhancock&own=1")
    .then(res => {return res.text()})
    .then((data) => {
        const gameDataRetrieved = new CustomEvent("games-retrieved",{
            detail:{
                games: new DOMParser().parseFromString(data, "text/xml")
    }
        })
        window.dispatchEvent(gameDataRetrieved)
    })
    .catch(err => {
        console.log(`ERROR: ${err}`)
    })















/// Clarks BS





// Sample Data Models

    const user_game_data_obj = {
        "game_id": {
            id: 'number',
            name: 'string',
            description: 'string',
            in_library: 'boolean',
            play_count: 'number'
        }
    }

    // THIS IS THE PREFERRED DATA MODEL
    const user_game_data_arr = [
        {
            id: 1,
            name: 'Settlers of Catan',
            description: 'get tiles get paid',
            in_library: 'boolean',
            play_count: 'number'
        },
        {
            id: 2,
            name: 'Carcasonne',
            description: 'build castles',
            in_library: 'boolean',
            play_count: 'number'
        }
    ]

    const local_storage_game_obj =
    {
        id: 'number',
        in_library: 'boolean',
        play_count: 'number',
        play_time: 'number'
    }

    const library_obj = {}


    // Sample LocalStorage API
    // Create / Read / Update / Delete 
    // based on requirements in the Whimsical board
    // determine which methods are needed

    // Set full library
    const setUserLibrary = (library_obj) =>
    {
        localStorage.setItem('user_library', library_obj);
    }

    // Get user's library
    const getUserLibrary = () =>
    {
        // Warning, will need to parse JSON here
        return localStorage.setItem('user_library', library_obj)
    }

    // add to library
    const addGameToLibrary = (game_to_add) =>
    {
        localStorage.getItem('user_library').then(res => res.push(game_to_add)).then(res => localStorage.setItem('user_library', res))
        localStorage.setItem('user_library', library_obj);
    }
    

    // retrieve user data for single game
    // From the 'card-click' event, retrieve the game's ID, use that to map data from storage
    const getGameData = (id) => 
    {
        // Finds the first instance of a game's ID in the global game library
        const api_game_data = bgg_games.find(game => game.id === id);

        // Finds the first instance of a game's ID in the localstorage library
        const library = getUserLibrary()
        const user_game_data = library.find(game => game.id === id);

        const user_game = Object.assign(api_game_data, user_game_data)

        return user_game
    }



































// TEMPLATE MANIPULATION

// Clones feature card template 7 times, adds classes and src to card,
//  then appends to featured section of page(randomly selected from usr library for now)


function getFeatureCards() {
    let itemDiv, imgItem, imgPath, i, temp, tempDiv;
    temp = document.getElementById("feature-card-template");

    for (i = 0; i < 10; i++) {
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "feature-card")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[Math.floor(Math.random() * 100)];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("class", "gallery-img");
        imgItem.setAttribute("alt", "a picture of a game")
        itemDiv.append(imgItem);
        gallery.append(itemDiv);

    }
}

// Clones game card template 8 times, adds classes and src to each,
// then appends to library preview section
function getRecentGames(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName;
    temp  = document.getElementById("game-card-template");

    for(i = 0; i < 8; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "game-card grid-box");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "preview-img");
        gameItem = itemDiv.querySelector("p").cloneNode(true);
        gameName = names[i];
        gameItem.setAttribute("class", "preview-info");
        gameItem.innerText = `${gameName}`;
        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        libraryPreview.append(itemDiv);
    }
}

function getLibrary(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName, gameDes;
    temp = document.getElementById("game-card-template");

    for(i = 0; i < images.length; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "game-card");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "game-img");
        gameItem = itemDiv.querySelector("h5").cloneNode(true);
        gameName = names[i];
        // desItem = itemDiv.querySelector("p").cloneNode(true);
        gameDes = descriptions[i];
        gameItem.setAttribute("class", "game-info game-des");
        gameItem.innerText = `${gameName} \n ${gameDes}`;
        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        library.append(itemDiv);
        // console.log(itemDiv)
    }
}



// SLIDESHOW AUTOMATION

// Declare variables needed for slideshow

let slideIndex = 0;
let timer;



function startSlideShow() {
  timer = setInterval(slideShow, 4000);
}

function stopSlideShow() {
  timer = clearInterval(timer);
}

// Automatically moves through images
function slideShow() {
  slideArr.forEach((slide) => {
    slide.style.display = "none";
  });
  slideIndex++;
  if (slideIndex >= slideArr.length) {
    slideIndex = 0;
  }

  slideArr[slideIndex].style.display = "block";
}

// Manual controls for slide show

// Add event listener to the next button that calls the next slide when clicked
const nextSlide = document.querySelector(".next-btn");
nextSlide.addEventListener("click", () => {
  fwdSlide();
});

// Add event listener to the previous button that calls the previous slide when clicked
const prevSlide = document.querySelector(".prev-btn");
prevSlide.addEventListener("click", () => bwdSlide());

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



// Tab Selector
function pickTab(tabName){
    let tabs;
    tabs = Array.from(document.getElementsByClassName("page"));
    tabs.forEach((tab) => {
        tab.classList.remove('active');
    })
    document.getElementById(tabName).classList.add('active');
}

function getGame(){
    
}

function addGame(game){

}
// Global variables

const library = document.getElementById("library-body");
const libraryPreview = document.getElementById("recent-games");
const gallery = document.getElementById("gallery");
const addGameBtn = document.getElementsByClassName("new-game-btn")
const clientID = `9RQI1WBCZA`;
let usrLibrary = [];
let slideArr;
let lastSlide;


// Add event listener to window that will populate library once api is fetched
window.addEventListener('games-retrieved', e => {
    const gameList = e.detail.games;
    // seperate forEach out into callback function 
    gameList.forEach((game) => {
        const gameObj = {};
        gameObj.id = game.id;
        gameObj.in_library = true;
        gameObj.image = game.images.medium;
        gameObj.name = game.name;
        gameObj.description = game.description_preview;
        usrLibrary.push(gameObj);
    })
    
    console.log(localStorage)
    getFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
    getLibrary();
    getRecentGames();
})



fetch(`https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&order_by=name_a_z&client_id=${clientID}`)
    .then( res => res.json() )
    .then( data =>
        {
            // Define the event emitter for our new custom event
            const gameDataRetrieved = new CustomEvent(
                'games-retrieved',
                {
                    // set our API's data into custom properties of the event's detail object
                    detail:
                    {
                        games: data.games
                    }
                }
            )
            // dispatch our event using the HTML object it is attached to
            window.dispatchEvent(gameDataRetrieved)
    }
)
.catch( err =>
    {
        console.log('ERROR: ', err);
})



















/// Clarks BS


// const sample_bga_ids = [
//     'yqR4PtpO8X',
//     '5H5JS0KLzK',
//     'TAAifFP590',
//     'fDn9rQjH9O',
//     'RLlDWHh7hR',
//     '6FmFeux5xH',
//     'kPDxpJZ8PD',
//     '7NYbgH2Z2I',
//     'OF145SrX44',
//     'j8LdPFmePE',
//     'i5Oqu5VZgP',
//     'VNBC6yq1WO',
//     'oGVgRSAKwX',
//     'GP7Y2xOUzj'
// ];

// Generic method for retrieving data from BGA API. defualts to top 100 ranked games
const getAtlasData = (params = 'order_by=rank&limit=100') => 
{
    // We can pass the params as needed to modify this generic call, refer to this API Docs here:
    // https://www.boardgameatlas.com/api/docs/search

    return fetch(`https://api.boardgameatlas.com/api/search?${params}&fuzzy_match&client_id=${clientID}`)
    .then( res => res.json() )
    .then( data => {return data.games} )
    .catch( err => console.log('ERROR: ', err))
}


// Retrieve a list of up to 100 games based on their BGA Ids from LocalStorage
const getUserGamesByID = (user_game_ids) =>
{
    if (!user_game_ids) return console.error('Please provide a valid array of Game IDs')

    if (user_game_ids.length > 100) {
        console.log('Cannot retrieve more than 100 games at a time, returning the first 100 ids from the list')
        user_game_ids = user_game_ids.slice(0, 99);
    }

    console.log(`Retrieving ${user_game_ids.length} games from User's Library`)
    try{
        return getAtlasData(`ids=${user_game_ids}&limit=100`);
    }
    catch (error) {
        console.log('Error retrieving User Games by ID', error)
    }
}

const search_input = document.getElementById('search_bar');

const searchAtlasByName = (e) => {
    e.preventDefault();

    const search_term = search_input.value ?? undefined

    if (!search_term) return console.warn('please provide a Search Value')

    try{
        getAtlasData(`name=${search_term}&fuzzy_match=true&order_by=name&limit=100`)
        .then(
            res => console.log(res)
        );
    }
    catch (error) {
        console.log('Error retrieving User Games by ID', error)
    }
}

// Test retrieval of games list based on stored IDs
// getUserGamesByID(sample_bga_ids).then(res => console.log(res));









    // Sample LocalStorage API
    // Create / Read / Update / Delete 
    // based on requirements in the Whimsical board
    // determine which methods are needed

    // Set full library
    const setUserLibrary = (library_obj) => {
        localStorage.setItem('user_library', library_obj);
    }

    // Get user's library
    const getUserLibrary = () => {
        // Warning, will need to parse JSON here
        return localStorage.setItem('user_library', library_obj)
    }

    // add to library
    const addGameToLibrary = (game_to_add) => {
        localStorage.getItem('user_library').then(res => res.push(game_to_add)).then(res => localStorage.setItem('user_library', res))
        localStorage.setItem('user_library', library_obj);
    }
    

    // retrieve user data for single game
    // From the 'card-click' event, retrieve the game's ID, use that to map data from storage
    const getGameData = (id) => {
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
        imgPath = usrLibrary[i].image;
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
        imgPath = usrLibrary[i].image;
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "preview-img");
        gameItem = itemDiv.querySelector("p").cloneNode(true);
        gameName = usrLibrary[i].name;
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

    for(i = 0; i < usrLibrary.length; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "game-card");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = usrLibrary[i].image;
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "game-img");
        gameItem = itemDiv.querySelector("h5").cloneNode(true);
        gameName = usrLibrary[i].name;
        // desItem = itemDiv.querySelector("p").cloneNode(true);
        gameDes = usrLibrary[i].description;
        gameItem.setAttribute("class", "game-info game-des");
        gameItem.innerText = `${gameName} \n ${gameDes}`;
        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        library.append(itemDiv);
        // console.log(itemDiv)
    }
}

function addToLibrary(game){

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

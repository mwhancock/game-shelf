// Global variables

const library = document.getElementById("library-body");
const recentGames = document.getElementById("recent-games");
const gallery = document.getElementById("gallery");
const searchResults = document.getElementById("search_results");
const search = document.getElementById("search_button");
const addGameBtn = document.getElementsByClassName("new-game-btn");
const clientID = `9RQI1WBCZA`;
const defaultUser = "mwhancock"
let userName = localStorage.getItem("userName");
let usrLibrary = [];
let recGames = [];
let localLibrary;
let searchArr = [];
let slideArr;
let lastSlide;


// Sets entire library object into LocalStorage (only needed on first fetch // if LocalStorage doesn't exist)
const setUserLibrary = (lib) => {
    localStorage.setItem("user_library", JSON.stringify(lib));
}

const getUserLibrary = () => {
  return JSON.parse(localStorage.getItem("user_library"))
}


// Add event listener to window that will construct game objects and push to user library once games are fetched
window.addEventListener('games-retrieved', e => {
    const gameList = e.detail.games;

    gameList.forEach((game) => {
        const gameObj = {};
        gameObj.id = game.id;
        gameObj.in_library = true;
        gameObj.image = game.images.medium;
        gameObj.name = game.name;
        gameObj.description = game.description_preview;
        usrLibrary.push(gameObj);
    })
    if(localStorage.getItem("user_library") === null){
        setUserLibrary(usrLibrary);
    }
    // cardConstructor(recentConstrucor, 8, recentGames);
    // cardConstructor(libraryConstructor, getUserLibrary().length, library);
    recentConstrucor();
    libraryConstructor();
    // console.log(usrLibrary)
})






// Generic method for retrieving data from BGA API. defualts to top 100 ranked games
const getAtlasData = (params = 'order_by=rank&limit=100') => {
    
    return fetch(`https://api.boardgameatlas.com/api/search?${params}&client_id=${clientID}`)
    .then( res => res.json() )
    .then( data => {return data.games} )
    .catch( err => console.log('ERROR: ', err))
}


// Fetches top 100 games on BGA and creates array of game objects
getAtlasData().then(
    games_list => {
        games_list.forEach((game) => {
            const gameObj = {};
            gameObj.id = game.id;
            gameObj.image = game.images.medium;
            recGames.push(gameObj);
    })
    cardConstructor(featureConstructor, 10, gallery);
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
})







window.addEventListener('library-retrieved', e => {
    const library = e.detail.library

    console.log('Retrieved the user\s library and merged with BGA data', library)
})











// If username does not exist in localStorage, prompt user to supply one.
// Provides default user if none provided

function getUserName(){
    if(userName === null){
        userName = prompt(`Please enter your Board Game Arena username. Leave blank for sample library: `);
        if(userName === ""){
            userName = defaultUser
        }
    } else if (userName){
        return localStorage.getItem("userName");
    } 
    localStorage.setItem("userName", userName);
    return localStorage.getItem("userName");
}

// Asks user to input their BGA username, 
const user = getUserName();


//Create API call to fetch users owned game list ID 
fetch(`https://api.boardgameatlas.com/api/lists?username=${user}&client_id=${clientID}`)
    .then(res => res.json())
    .then(data => {
        const user = new CustomEvent('get-user-id', {

             detail: {
               userID: data.lists[1].id
            }
        })
        dispatchEvent(user) 
    }) .catch( err => {
             console.log(`ERROR: ${err }`)
    })



// Fetches user library
window.addEventListener("get-user-id", e => {
   const userID = e.detail.userID;

   fetch(`https://api.boardgameatlas.com/api/search?list_id=${userID}&order_by=name_a_z&client_id=${clientID}`)
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
.catch( err => {
        console.log(`ERROR: ${err}`);
})
})

























/// Clarks BS

// Sample BGA API methods





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
            res => {
                res.forEach(game => {
                    const gameObj = {};
                    gameObj.id = game.id;
                    gameObj.image = game.images.medium;
                    gameObj.name = game.name;
                    searchArr.push(gameObj);
                })
            })      
            .then(() => {
                console.log(searchArr); 
                searchResultsConstructor();
            })
        // cardConstructor(searchResultsConstructor, 8, searchResults);

            } 
    catch (error) {
        console.log('Error retrieving User Games by ID', error)
    }
}

// retrieve user data and BGA data for single game
// From the 'card-click' event, retrieve the game's ID, use that to map data from storage
const getGameData = (id) =>
{
    // Checks our global library for the game first
    const cached_game = usrLibrary.find(game => game.id === id);
    // return the cached data if it exists, else retrieve it from API
    if (cached_game !== undefined) {
        console.log('Retreived game from user\s cache')
        return cached_game
    }

    else {
        console.log('Fetching game with id: ', id)
        let api_game = getAtlasData(`ids=${[id]}&limit=100`)
            .then(
                game_data => {
                    console.log('Retrieved single game from BGA API')
                    // returns an array, we want the first index
                    return game_data[0]
                }
            )
            .catch(
                error => console.log('Error retrieving game with id: ', id, error)
            )

        return api_game
    }
}









// Sample LocalStorage API
// Create / Read / Update / Delete 


// add to library // modify existing entry
const addGameToLibrary = (game_to_add) =>
{
    const current_library = getUserLibrary() ?? [];
    console.log(current_library)

    // If no user library present, add the game to the user's library
    if (current_library.length === 0) {
        current_library.push(game_to_add)
    }

    else {
        // If there is a library, Check if the game exists already and retrieve index
        const game_index = current_library.findIndex(game => game.id === game_to_add.id)
        
        // Modify the library_before array accordingly
        if (game_index) current_library[game_index] = game_to_add
    }

    // overwrite LocalStorage data
    setUserLibrary(current_library)
    
    // overwrite global cache data
    usrLibrary = current_library
}


// TODO: REVIEW THIS METHOD TO SEE HOW IT FITS WITH YOUR PLANS
// Sample call to get Game Data for a single game... Use this for populating your Modal from a click handler
// getGameData(game).then(
//     game_data => {
//         addGameToLibrary(game_data)
//         console.log('Retrieved a single game based on ID', game_data)
//     }
// );





// TODO: FINISH THE METHOD
// add to library // modify existing entry
const removeGameFromLibrary = (game_to_remove) =>
{
    const current_library = getUserLibrary();

    // Check if a version of the game exists already and retrieve index
    const game_index = current_library.findIndex(game => game.id === game_to_remove.id);
    
    // I'll leave this method for you to fill out
    // it is similar to add but we need to remove the index of an array if it exists

    // overwrite LocalStorage data
    setUserLibrary(current_library)
    
    // overwrite global cache data
    usrLibrary = current_library
}





// Sample methods for working between data sources

// Handler method for merging api with user data
const mergeUserLibrary = (api_games, user_library) =>
{
    let merged_library = []

    // merge our stored user data with the latest API data 
    for(let api_game of api_games) {
        const user_game = user_library.find(game => game.id === api_game.id)

        merged_library.push(Object.assign(api_game, user_game))
    }

    return merged_library
}


// Method for retrieving the users library data based on LocalStorage IDs
const fetchUserLibrary = () =>
{
    // Retrieve stored library data from LocalStorage
    const user_library = getUserLibrary();
    const ids = [];

    if (!user_library) return console.log('No User Library Found in LocalStorage');

    // generate an array of ids from our library array
    user_library.forEach(
        game_obj => ids.push(game_obj.id)
    )

    // fetch those games from BGA API
    getUserGamesByID(ids)
        .then( api_games =>
            {
                const merged_library = mergeUserLibrary(api_games, user_library);

                // Store in global 'cache'
                usrLibrary = merged_library
                console.log(merged_library)

                // Define the event emitter for our new custom event
                const userLibraryRetrieved = new CustomEvent(
                    'library-retrieved',
                    {
                        // set our merged library data into custom properties of the event's detail object
                        detail: { library: merged_library }
                    }
                )
                // dispatch our event using the HTML object it is attached to
                window.dispatchEvent(userLibraryRetrieved)
        }
    )
    .catch( err =>
        {
            console.log('ERROR: ', err);
    })
}

fetchUserLibrary()





































// TEMPLATE MANIPULATION

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


function featureConstructor(){
    imgPath = recGames[i].image;
    imgItem.setAttribute("src", imgPath);
    itemDiv.setAttribute("class", "feature-card");
    imgItem.setAttribute("class", "gallery-img");
}

function recentConstrucor(){
    itemDiv.setAttribute("class", "grid-box game-card"); 
    imgItem = itemDiv.querySelector("img").cloneNode(true);
    imgPath = getUserLibrary()[i].image;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.setAttribute("class", "preview-img");
    gameItem = itemDiv.querySelector("p").cloneNode(true);
    gameItem.setAttribute("class", "preview-info");
    gameItem.innerText = `${gameName}`;
}


function libraryConstructor(){
    itemDiv.setAttribute("class", "game-card");
    imgPath = getUserLibrary()[i].image;
    imgItem.setAttribute("src", imgPath);
    imgItem.setAttribute("alt", "a picture of a game");
    imgItem.setAttribute("class", "game-img");
    // desItem = itemDiv.querySelector("p").cloneNode(true);
    gameItem = itemDiv.querySelector("h5").cloneNode(true);
    gameDes = getUserLibrary()[i].description;
    gameItem.setAttribute("class", "game-info game-des");
    gameItem.innerText = `${gameName} \n ${gameDes}`;    
}



function searchResultsConstructor(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName;
    temp = document.getElementById("game-card-template");

    for(i = 0; i < 8; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        itemDiv.setAttribute("class", "grid-box game-card");setUserLib
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
    
}

function clearSearch(){
    searchArr = [];
    document.getElementById("result_content").style.display = "none";
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


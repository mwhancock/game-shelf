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
let hotList = [];
let hotIds = [];



// XMLParser specifically for our XML Data from ChatGPT
// Returns a proper JSON structure for us to use from the Geek API
function parseMarksGamesXml(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");
    const result = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const name = item.getElementsByTagName("name")[0].textContent.trim();
        const yearpublished = item.getElementsByTagName("yearpublished")[0].textContent.trim();
        const image = item.getElementsByTagName("image")[0].textContent.trim();
        const thumbnail = item.getElementsByTagName("thumbnail")[0].textContent.trim();
        const status = item.getElementsByTagName("status")[0].attributes;
        const numplays = item.getElementsByTagName("numplays")[0].textContent.trim();
        const jsonItem = {
            name,
            yearpublished,
            image,
            thumbnail,
            status: {
                own: status.own.value,
                prevowned: status.prevowned.value,
                fortrade: status.fortrade.value,
                want: status.want.value,
                wanttoplay: status.wanttoplay.value,
                wanttobuy: status.wanttobuy.value,
                wishlist: status.wishlist.value,
                preordered: status.preordered.value,
                lastmodified: status.lastmodified.value
            },
            numplays
        };
        result.push(jsonItem);
    }
    return result;
}


function parseHotGamesXml(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");
    const result = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const id = item?.getAttribute("id");
        const rank = item?.getAttribute("rank");
        const thumbnail = item?.getElementsByTagName("thumbnail")[0]?.getAttribute("value");
        const name = item.getElementsByTagName("name")[0]?.getAttribute("value");
        const yearpublished = item.getElementsByTagName("yearpublished")[0]?.getAttribute("value");
        result.push({ id, rank, thumbnail, name, yearpublished });
    }
    return result;
}



function parseXmlFromGeek(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml")
    const items = xml.getElementsByTagName("item");
    const result = [];

    for (let i = 0; i < items.length; i++) 
    {
        const item = items[i];
        const fields = [];
        const childNodes = item.childNodes;
        const topLevelAttributes = item.attributes;

        for (let j = 0; j < topLevelAttributes.length; j++)
        {
            const topLevelAttribute = topLevelAttributes[j];
            const fieldValue = topLevelAttribute.value;

            const field = {
                [topLevelAttribute.name]: fieldValue,
            };

            fields.push(field);
        }

        for (let j = 0; j < childNodes.length; j++)
        {
            const childNode = childNodes[j];
        
            if (childNode.nodeType !== Node.ELEMENT_NODE) {
            continue;
            }
        
            const attributes = childNode.attributes;

            for (let k = 0; k < attributes.length; k++)
            {
                const attribute = attributes[k];
                const fieldValue = attribute.value;

                const field = {
                    [childNode.tagName]: fieldValue,
                };

                fields.push(field);
            }
        }

    const itemObject = Object.assign({}, ...fields)

    result.push(itemObject);
    }

    return result;
}






// Add event listener to window that will populate library once api is fetched
window.addEventListener('games-retrieved', e => {
    const gameList = e.detail.games;
    const gamePics = gameList.getElementsByTagName("image");
    const gameNames = gameList.getElementsByTagName("name");
    const gameDes = gameList
    
    // If image exists, push it to "images" array
    for(let img in gamePics){
        if(gamePics[img].childNodes == undefined){
            continue
        }
        images.push(gamePics[img].childNodes[0].nodeValue);
    }

    // If name exists, push it to "names" array
    for(let name in gameNames){
        if(gameNames[name].childNodes == undefined){
            continue
        }
        names.push(gameNames[name].childNodes[0].nodeValue);
    }   

    for(let des in gameDes)  {

    }


    getFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
    getLibrary();
    getRecentGames();

    // geekXMLToJSON(gameList);
})

window.addEventListener('hot-list', e => {
    const gameList = (e.detail.games);
    const gameIds = gameList.getElementsByTagName("item");
    const gamePics = (gameList.getElementsByTagName("thumbnail"));
    for(let  id in gameIds){
        if(gameIds[id] == undefined){
            continue
        }
        hotIds.push(gameIds[id].id)
    }

    for(let img in gamePics){
        if(gamePics[img].childNodes == undefined){
            continue;
        }
        hotList.push(gamePics[img].attributes[0].nodeValue)
    }

})

// Boardgamegeek API

fetch("https://boardgamegeek.com/xmlapi2/collection?username=mwhancock&own=1")
    .then(res => {return res.text()})
    .then(data => {
        console.log('Mark\'s Games with Custom Parser', parseMarksGamesXml(data));
        console.log('Mark\'s Games with Generic Parser', parseXmlFromGeek(data));
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

fetch("https://boardgamegeek.com/xmlapi2/hot?type=boardgame")    
    .then(res => {return res.text()})
    .then(data => {
        // console.log('Hot Games with Custom Parser', parseHotGamesXml(data));
        // console.log('Hot Games with generic Parser', parseXmlFromGeek(data));
        const hotGames = new CustomEvent("hot-list", {
            detail:{
                games: new DOMParser().parseFromString(data, "text/xml")
            }
        })
        window.dispatchEvent(hotGames)   
    })
    .catch(err => {
        console.log(`ERROR: ${err}`)
    })














/// Clarks BS


const sample_bga_ids = [
    'yqR4PtpO8X',
    '5H5JS0KLzK',
    'TAAifFP590',
    'fDn9rQjH9O',
    'RLlDWHh7hR',
    '6FmFeux5xH',
    'kPDxpJZ8PD',
    '7NYbgH2Z2I',
    'OF145SrX44',
    'j8LdPFmePE',
    'i5Oqu5VZgP',
    'VNBC6yq1WO',
    'oGVgRSAKwX',
    'GP7Y2xOUzj'
];

// Generic method for retrieving data from BGA API. defualts to top 100 ranked games
const getAtlasData = (params = 'order_by=rank&limit=100') => 
{
    // We can pass the params as needed to modify this generic call, refer to this API Docs here:
    // https://www.boardgameatlas.com/api/docs/search

    return fetch(`https://api.boardgameatlas.com/api/search?${params}&client_id=9RQI1WBCZA`)
    .then( res => res.json() )
    .then( data =>
        {
            return data.games
        }
    )
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

const searchAtlasByName = (event) =>
{
    event.preventDefault();

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

    for (i = 0; i < 15; i++) {
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "feature-card")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = hotList[i];
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
import { showFeatureCards, getLibPrev, images } from './modules/templateFunctions.js'
import { startSlideShow, stopSlideShow } from './modules/slideshowFunctions.js';

// Global variables

let libraryPreview = document.getElementById("library-preview");
window.libraryPreview = libraryPreview;

const gallery = document.getElementById("gallery");
let slideArr;
window.slideArr = slideArr;

let lastSlide;
window.lastSlide = lastSlide;

window.startSlideShow = startSlideShow;
window.stopSlideShow = stopSlideShow;

// const library = document.getElementById("library");

// Grab our HTML Element that is going to display APi data once available
// const count_display = document.getElementById("count-display");


// // Add an event listener to our HTML element that needs the API data
// count_display.addEventListener('games_retrieved', (e) => {
//     console.log(e)
//     // Set the element's value to our API data
//     count_display.innerHTML = `Game Data Retrieved for ${e.detail?.games?.length} Games`
// })

// Add event listener to gallery element, then populate with images from game list
gallery.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium)
    })
    showFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    window.slideArr = Array.from(slideCards);
    window.lastSlide = window.slideArr.length - 1;
    startSlideShow();
})

// Add event listener to library preview element, then populate with images from users game list
libraryPreview.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium);
    })
    getLibPrev();
})

// Boardgamegeek API

fetch("https://boardgamegeek.com/xmlapi2/collection?username=mwhancock&own=1")
    .then(res => {return res.text()})
    .then((data) => {
        const gameData = new DOMParser().parseFromString(data, "text/xml")
        const gameList = gameData.querySelector("items")["children"]
        console.log(gameList)
        for(let game in gameList){
            console.log(game[0])
        }
    })

fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&order_by=name_a_z&client_id=9RQI1WBCZA")
    .then( res => res.json() )
    .then( data =>
        {
            // Define the event emitter for our new custom event
            const gameDataRetrieved = new CustomEvent(
                'games_retrieved',
                {
                    // set our API's data into custom properties of the event's detail object
                    detail:
                    {
// we can pass anything we want as a key-value pair here, neat!
            count: data.count,
            games: data.games
        }
    }
)

// dispatch our event using the HTML object it is attached to
// we could also use the window object for this as well
        // count_display.dispatchEvent(gameDataRetrieved);
        gallery.dispatchEvent(gameDataRetrieved);
        libraryPreview.dispatchEvent(gameDataRetrieved);
    }
)
.catch( err =>
    {
        console.log('ERROR: ', err);
    }
);


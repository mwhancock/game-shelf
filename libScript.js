//import functions
import { getLibrary, images } from "./templateFrunctions.js"

// global variables
let library = document.getElementById("library");
window.library = library;


//  retrieve game collection from board game atlas, then store data in 'gamesRetrieved' variable
 fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&order_by=name_a_z&client_id=9RQI1WBCZA")
    .then(res => res.json())
    .then(data => {
        const gamesRetrieved = new CustomEvent('gamesRetrieved', {
            games: data.games
        })

        // dispatch event with the library element
        library.dispatchEvent(gamesRetrieved);
    })
    .catch( err =>
        {
            console.log('ERROR: ', err);
        }
    );

    // add event listen to library element to fire off once game collection is retrieved
    library.addEventListener('gamesRetrived', (e) => {
        const gameList = e.gamesRetrieved.games;
        gameList.forEach(games, () =>{
            images.push(game.images.medium)
        })
        getLibrary()
    })

import { getLibrary, images } from "./templateFrunctions.js"


let library = document.getElementById("library");
window.library = library;

library.addEventListener('gameRetrieved', () => {
    getLibrary();
 })

 fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&order_by=name_a_z&client_id=9RQI1WBCZA")
    .then(res => res.json())
    .then(data => {
        const gamesRetrieved = new CustomEvent('gamesRetrieved', {
            games: data.games
        })
        library.dispatchEvent(gamesRetrieved);
    })
    .catch( err =>
        {
            console.log('ERROR: ', err);
        }
    );

    library.addEventListener('gamesRetrived', (e) => {
        const gameList = e.gamesRetrieved.games;
        gameList.forEach(games, () =>{
            images.push(game.images.medium)
        })
        getLibrary()
    })

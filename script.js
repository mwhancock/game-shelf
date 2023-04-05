// Global Variables


// Grab HTML element that will display users libre=ary preview when available
const libraryPreview = document.getElementById("library-preview")

// Grab our HTML Element that is going to display APi data once available
const count_display = document.getElementById('count-display');


// Add an event listener to our HTML element that needs the API data
count_display.addEventListener('games_retrieved', (event) => {
    console.log(event)
    // Set the element's value to our API data
    count_display.innerHTML = `Game Data Retrieved for ${event.detail?.games?.length} Games`
})


fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
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
            count_display.dispatchEvent(gameDataRetrieved);
        }
    )
    .catch( err =>
        {
            console.log('ERROR: ', err);
        }
    );


// Fetch game collection, returns array of game objects

// async function getGameData(){
//     const response = await fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA");
//     return response.json()
// }

// async function gameArt(){
//     try{
//         const data = await getGameData();
//         let imgArr = [];

//         for(let i = 0; i < 20; i++){
//             imgArr.push(data["games"][i]["images"]["medium"])
//         }
//             console.log(imgArr);
//     }catch(error){
//         console.log(error)
//     }
// }

// const libPreview = gameArt();

async function populateLibraryPreview() {
    for(let i = 0; i <20; i++){
        let newDiv = document.createElement("div");
        let newAnchor = document.createElement("a");
        let newImg = document.createElement("img");
        newDiv.setAttribute("class", "game-card");
        newAnchor.setAttribute("href", "game-page");
        newImg.setAttribute("src", gameArt.then(data => {data[i]})); 
        libraryPreview.appendChild(newDiv.appendChild(newAnchor.appendChild(newImg)));
        // console.log(gameArt.then(data => {data[2]}))
    }
}

// // Console log our API values after an arbitrary delay
// setTimeout( 
//     () => {console.log({game_list, game_count})},
//     5000
// );

// if (!is_loading) console.log({game_list, game_count})

// fetch game collection, log image url for each game in list
async function getGameArt(){
    const response = await fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA");
    const data = await response.json();
    const artList = data.games;
    for(let gameIndex = 0; gameIndex <= artList.length; gameIndex++){
        // console.log(artList[gameIndex]["images"]["medium"]);
    }
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "library.html");
    anchor.setAttribute("class", "lib-btn");
    anchor.innerText = "Full Library";
    libraryPreview.appendChild(anchor);
}

// populateLibraryPreview();
// console.log(gameArt.then(data => {data[1][1]}));
let slideCollection = document.getElementsByClassName("feature-card");
let slideIndex = 0;
let slideArr = Array.from(slideCollection)

slideArr.forEach((slide) => {
    slide.style.display = "none"
})// Slideshow automation


function slideShow(){

    // Hiding all slideshow items
    // Iterating to next index in slides array
    // Displaying cusrrent index of array
  
    }
    
    // set a timer variable (setTimeout( callback, interval ))
    
    // Clear time interval based on element focus
    // current_slide.addEventListener('mouseenter', callback) clearTimeout
    // current_slide.addEventListener('mouseleave', callback) setTimeout
// }

// Manual controls for slide show
function nextSlide(){
    slideArr.forEach((slide) => {
        slide.style.display = "none";
    })

    slideIndex++;

    if(slideIndex >= slideArr.length){slideIndex = 0};
    slideArr[slideIndex].style.display = "block";
    console.log(slideIndex)
}

function prevSlide(){
    slideArr.forEach((slide) => {
        slide.style.display = "none";
    })
    slideIndex--;

    if(slideIndex < 0){slideIndex = 5;}
    slideArr[slideIndex].style.display = "block"
    console.log(slideIndex)
}

slideShow();
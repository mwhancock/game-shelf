

// Define a custom event for retrieving API data so we avoid async callbacks

const count_display = document.getElementById('count-display');

count_display.addEventListener('games_retrieved', (event) => {
    console.log(event)
    count_display.innerHTML = `Game Data Retrieved for ${event.detail?.games?.length} Games`
})


const libraryPreview = document.getElementById("library-preview")

// fetch game collection, returns array of game objects

async function getGameData(){
    const response = await fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA");
    return response.json()
}

async function gameArt(){
    try{
        const data = await getGameData();
        let imgArr = [];

        for(let i = 0; i < 20; i++){
            imgArr.push(data["games"][i]["images"]["medium"])
        }
            console.log(imgArr);
    }catch(error){
        console.log(error)
    }
}

const libPreview = gameArt();

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

let game_list = []
let game_count = 0
let is_loading = true


let test = "val" // variable we want to listen for

fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
    .then( res => res.json() )
    .then( data =>
        {
            const gameDataRetrieved = new CustomEvent(
                'games_retrieved', 
                {
                    detail: 
                    {
                        count: data.count, 
                        games: data.games
                    } 
                }
            )
            is_loading = false
            game_list = data.games
            game_count = data.count
            count_display.dispatchEvent(gameDataRetrieved);
        }
    )
    .catch( err =>
        {
            console.log('ERROR: ', err);
        }
    );


// Console log our API values after an arbitrary delay
setTimeout( 
    () => {console.log({game_list, game_count})},
    5000
);

if (!is_loading) console.log({game_list, game_count})

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

getGameArt();

 // Targets the "Feature Card" and initializes the carousel index at 0
let slides = document.getElementsByClassName("feature-card");
let slideIndex = 0;
const navItem = document.getElementsByClassName("nav-item")
slideShow();
// let slider = setInterval(slideShow, 4000);

// Slideshow automation
function slideShow(){

    // Hiding all slideshow items
    // Iterating to next index in slides array
    // Displaying cusrrent index of array

    // set a timer variable (setTimeout( callback, interval ))

    // Clear time interval based on element focus
        // current_slide.addEventListener('mouseenter', callback) clearTimeout
        // current_slide.addEventListener('mouseleave', callback) setTimeout


    let i;
    for(i = 0;  i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > slides.length){slideIndex = 1};
    slides[slideIndex-1].style.display = "block";
    // pauseSlideShow(slider);
}

// Manual controls for slide show
function nextSlide(){
    let i;
    for(i = 0;  i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > slides.length){slideIndex = 1};
    slides[slideIndex-1].style.display = "block";
}

function prevSlide(){
    let i;
    for(i = 0;  i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex--;
    if(slideIndex < 0){slideIndex = 6;}
    slides[slideIndex].style.display = "block"
}

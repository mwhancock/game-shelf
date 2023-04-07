// Grab HTML element that will display users libre=ary preview when available
const libraryPreview = document.getElementById("library-preview");

const gallery = document.getElementById("gallery");

// Grab our HTML Element that is going to display APi data once available
const count_display = document.getElementById("count-display");

// // Add an event listener to our HTML element that needs the API data
// count_display.addEventListener('games_retrieved', (event) => {
//     console.log(event)
//     // Set the element's value to our API data
//     count_display.innerHTML = `Game Data Retrieved for ${event.detail?.games?.length} Games`
// })

// fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
//     .then( res => res.json() )
//     .then( data =>
//         {
//             // Define the event emitter for our new custom event
//             const gameDataRetrieved = new CustomEvent(
//                 'games_retrieved',
//                 {
//                     // set our API's data into custom properties of the event's detail object
//                     detail:
//                     {
// we can pass anything we want as a key-value pair here, neat!
//             count: data.count,
//             games: data.games
//         }
//     }
// )

// dispatch our event using the HTML object it is attached to
// we could also use the window object for this as well
//         count_display.dispatchEvent(gameDataRetrieved);
//     }
// )
// .catch( err =>
//     {
//         console.log('ERROR: ', err);
//     }
// );

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

// async function populateLibraryPreview() {
//     for(let i = 0; i <20; i++){
//         let newDiv = document.createElement("div");
//         let newAnchor = document.createElement("a");
//         let newImg = document.createElement("img");
//         newDiv.setAttribute("class", "game-card");
//         newAnchor.setAttribute("href", "game-page");
//         newImg.setAttribute("src", gameArt.then(data => {data[i]}));
//         libraryPreview.appendChild(newDiv.appendChild(newAnchor.appendChild(newImg)));
//         // console.log(gameArt.then(data => {data[2]}))
//     }
// }

// // Console log our API values after an arbitrary delay
// setTimeout(
//     () => {console.log({game_list, game_count})},
//     5000
// );

// if (!is_loading) console.log({game_list, game_count})

// fetch game collection, log image url for each game in list
// async function getGameArt(){
//     const response = await fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA");
//     const data = await response.json();
//     const artList = data.games;
//     for(let gameIndex = 0; gameIndex <= artList.length; gameIndex++){
//         // console.log(artList[gameIndex]["images"]["medium"]);
//     }
//     const anchor = document.createElement("a");
//     anchor.setAttribute("href", "library.html");
//     anchor.setAttribute("class", "lib-btn");
//     anchor.innerText = "Full Library";
//     libraryPreview.appendChild(anchor);
// }

// populateLibraryPreview();
// console.log(gameArt.then(data => {data[1][1]}));


// SLIDESHOW AUTOMATION

// Declare variables needed for slideshow

let slideIndex = 0;
let lastSlide;
let slideArr;
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

// TEMPLATE MANIPULATION

// Clones feature card template 7 times, adding img source to each card,
//  then appends to featured section of page
function showFeatureCards() {
    let itemDiv, imgItem, imgPath, i;
    temp = document.getElementById("feature-card-template");
    itemDiv = temp.content.cloneNode(true);

    for (i = 0; i < 7; i++) {
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = `img/game${[i + 1]}.jpg`;
        imgItem.setAttribute("src", imgPath);
        gallery.append(imgItem);
    }
}

// Adds feature cards into the DOM
showFeatureCards();

// Once the DOM is loaded, grabs feature cards and adds them into an array,
// get the index of the last card, then starts slide show
document.addEventListener("DOMContentLoaded", () => {
    let slideCards = document.getElementsByClassName("feature-card");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();

})


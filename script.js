// Global variables

const library = document.getElementById("library-body");
const libraryPreview = document.getElementById("library-preview");
const gallery = document.getElementById("gallery");
let slideArr;
let lastSlide;
let images = [];
let names = [];


// Add event listener to gallery element, then populate with images from game list
gallery.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium);
    })
    getFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
})

// Add event listen to library element to fire off once game collection is retrieved
library.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium);
        names.push(game.name);
    })
    getLibrary();
})

// Add event listener to library preview element, then populate with images from users game list
libraryPreview.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium);
        names.push(game.name);
    })
    getLibPrev();
})

// Boardgamegeek API

// fetch("https://boardgamegeek.com/xmlapi2/collection?username=mwhancock&own=1")
//     .then(res => {return res.text()})
//     .then((data) => {
//         const gameData = new DOMParser().parseFromString(data, "text/xml")
//         const gameList = gameData.querySelector("items")["children"]
//         console.log(gameList)
//         for(let game in gameList){
//             console.log(game[0])
//         }
//     })

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
        // count_display.dispatchEvent(gameDataRetrieved);
        gallery.dispatchEvent(gameDataRetrieved);
        libraryPreview.dispatchEvent(gameDataRetrieved);
        library.dispatchEvent(gameDataRetrieved);
    }
)
.catch( err =>
    {
        console.log('ERROR: ', err);
    }
);



// TEMPLATE MANIPULATION

// Clones feature card template 7 times, adds classes and src to card,
//  then appends to featured section of page


function getFeatureCards() {
    let itemDiv, imgItem, imgPath, i, temp, tempDiv;
    temp = document.getElementById("feature-card-template");

    for (i = 0; i < 10; i++) {
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "feature-card")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("class", "gallery-img");
        imgItem.setAttribute("alt", "a picture of a game")
        itemDiv.append(imgItem);
        gallery.append(itemDiv);

    }
}

// Clones game card template 16 times, adds classes and src to each,
// then appends to library preview section
function getLibPrev(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, libBtn, gameItem, gameName;
    temp  = document.getElementById("game-card-template");
    libBtn = document.getElementById("lib-btn-template").content.cloneNode(true);
    addGameBtn = document.getElementById("new-game-template").content.cloneNode(true);

    for(i = 0; i < 16; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "game-card grid-box");
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "game-img");
        gameItem = itemDiv.querySelector("p").cloneNode(true);
        gameName = names[i];
        gameItem.setAttribute("class", "game-info");
        gameItem.innerText = `${gameName}`;
        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        libraryPreview.append(itemDiv);
    }
    libraryPreview.append(libBtn);
    libraryPreview.append(addGameBtn);
}

function getLibrary(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, gameItem, gameName;
    temp = document.getElementById("game-card-template");

    for(i = 0; i < images.length; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "game-card")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game");
        imgItem.setAttribute("class", "game-img");
        gameItem = itemDiv.querySelector("p").cloneNode(true);
        gameName = names[i];
        gameItem.setAttribute("class", "game-info");
        gameItem.innerText = `${gameName}`;
        itemDiv.append(imgItem);
        itemDiv.append(gameItem);
        library.append(itemDiv);
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
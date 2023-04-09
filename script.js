// Grab HTML element that will display users libre=ary preview when available
const libraryPreview = document.getElementById("library-preview");

const gallery = document.getElementById("gallery");

// Grab our HTML Element that is going to display APi data once available
const count_display = document.getElementById("count-display");

let images = [];

// // Add an event listener to our HTML element that needs the API data
count_display.addEventListener('games_retrieved', (e) => {
    console.log(e)
    // Set the element's value to our API data
    count_display.innerHTML = `Game Data Retrieved for ${e.detail?.games?.length} Games`
})

// Add event listener to gallery element, then populate with images from game list
gallery.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.forEach((game) => {
        images.push(game.images.medium)
    })
    showFeatureCards();
    let slideCards = document.getElementsByClassName("gallery-img");
    slideArr = Array.from(slideCards);
    lastSlide = slideArr.length - 1;
    startSlideShow();
})

// Add event listener to library preview element, then populate with images from users game list
libraryPreview.addEventListener('games_retrieved', (e) => {
    const gameList = e.detail.games;
    gameList.sort();
    gameList.forEach((game) => {
        images.push(game.images.medium);
    })
    getLibPrev();
})

// Boardgamegeek API
// const parser = new DOMParser();
// fetch("https://boardgamegeek.com/xmlapi2/collection?username=mwhancock&own=1")
//     .then(res => parser.parseFromString(res, "text/xml"))
//     .then(data => {console.log(data)})

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
        count_display.dispatchEvent(gameDataRetrieved);
        gallery.dispatchEvent(gameDataRetrieved);
        libraryPreview.dispatchEvent(gameDataRetrieved);
    }
)
.catch( err =>
    {
        console.log('ERROR: ', err);
    }
);

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

// Clones feature card template 7 times, adds classes and src to card,
//  then appends to featured section of page
function showFeatureCards() {
    let itemDiv, imgItem, imgPath, i, temp, tempDiv;
    temp = document.getElementById("feature-card-template");

    for (i = 0; i < 10; i++) {
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div");
        itemDiv.setAttribute("class", "feature-card fade")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("class", "gallery-img");
        imgItem.setAttribute("alt", "a picture of a game")
        itemDiv.append(imgItem);
        gallery.append(itemDiv);
    }
}

// Clones game card template 20 times, adds classes and src to each,
// then appends to library preview section
function getLibPrev(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv;
    temp  = document.getElementById("game-card-template");
    libBtn = document.getElementById("lib-btn-template").content.cloneNode(true);

    for(i = 0; i < 16; i++){
        tempDiv = temp.content.cloneNode(true);
        itemDiv = tempDiv.querySelector("div")
        itemDiv.setAttribute("class", "game-card")
        imgItem = itemDiv.querySelector("img").cloneNode(true);
        imgPath = images[i];
        imgItem.setAttribute("src", imgPath);
        imgItem.setAttribute("alt", "a picture of a game")
        imgItem.setAttribute("class", "game-img")
        itemDiv.append(imgItem)
        libraryPreview.append(itemDiv)
    }
    libraryPreview.append(libBtn);
}


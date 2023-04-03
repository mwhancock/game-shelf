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

async function populateLibraryPreview(){
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
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "library.html");
    anchor.setAttribute("class", "lib-btn");
    anchor.innerText = "Full Library";
    libraryPreview.appendChild(anchor);
}

// populateLibraryPreview();
// console.log(gameArt.then(data => {data[1][1]}));


 // Targets the "Feature Card" and initializes the carousel index at 0
let slides = document.getElementsByClassName("feature-card");
let slideIndex = 0;
const navItem = document.getElementsByClassName("nav-item")
slideShow();
let slider = setInterval(slideShow, 4000);

// Slideshow automation
function slideShow(){
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


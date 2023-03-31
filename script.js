
// Import api and console log game data to console
fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
    .then((response) => response.json())
    .then((data) => console.log(data.games))

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


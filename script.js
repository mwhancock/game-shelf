

fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
    .then((response) => response.json())
    .then((data) => console.log(data.games))

let slideIndex = 0;
slideShow();

function slideShow(){
    let i;
    let slides = document.getElementsByClassName("feature-card");
    for(i = 0;  i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > slides.length){slideIndex = 1};
    slides[slideIndex-1].style.display = "block";
    let slider = setInterval(slideShow, 4000);
    slides.addEventListener("mouseover", (e) => {clearInterval(slider)});

}

function currentSlide(n){

}

function nextSlide(n){

}

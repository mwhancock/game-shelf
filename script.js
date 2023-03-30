fetch ("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
    .then((response) => response.json())
    .then((data) => console.log(data.games))

    let picIndex = 0;
    slideShow();

    function slideShow(){
        let i;
        let slides = document.getElementsByClassName("feature-card");
        for(i = 0;  i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        picIndex++;
        if(picIndex > slides.length){picIndex = 1}
        slides[picIndex-1].style.display = "block";
        setTimeout(slideShow, 5000);

    }

    function galleryNav(){
        
    }


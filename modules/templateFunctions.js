// TEMPLATE MANIPULATION

// Clones feature card template 7 times, adds classes and src to card,
//  then appends to featured section of page

let images = []

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

// Clones game card template 16 times, adds classes and src to each,
// then appends to library preview section
function getLibPrev(){
    let itemDiv, imgItem, imgPath, i, temp, tempDiv, libBtn;
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

export { showFeatureCards, getLibPrev, images }
fetch("https://api.boardgameatlas.com/api/search?list_id=ydVBm1JJUr&client_id=9RQI1WBCZA")
    .then(res => res.json())
    .then(data => console.log(data))
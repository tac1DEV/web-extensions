(function() {
    // script executé une seule fois
    if (window.hasRun){
        return;
    }
    window.hasRun = true;

    function insertBeast(beastURL){
        // retirer les images précédentes
        removeExistingBeasts();
        let beastImage = document.createElement("img");
        // img.src = beastURL;
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        // class = "beastify-image"
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }

    function removeExistingBeasts(){
        let existingBeasts = document.querySelectorAll(".beastify-image");
        for (let beast of existingBeasts){
            // vider le noeud
            beast.remove();
        }
    }
    // ecouter les commandes (beastify ou reset) envoyées par le popup (choose_beast.js)
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "beastify"){
            insertBeast(message.beastURL);
        } else if (message.command === "reset"){
            removeExistingBeasts();
        }
    });
})();
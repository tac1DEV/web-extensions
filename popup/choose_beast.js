const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

//si beast = beastify, sinon reset
function listenForClicks() {
    document.addEventListener("click", (e)=>{
        

        function beastNameToURL(beastName) {
            switch (beastName){
                case "Grenouille":
                    return browser.runtime.getURL("beasts/frog.jpg");
                case "Serpent":
                    return browser.runtime.getURL("beasts/snake.jpg");
                case "Tortue":
                    return browser.runtime.getURL("beasts/turtle.jpg");
            }
        }


        function beastify(tabs){
            browser.tabs.insertCSS({code: hidePage}).then(()=>{
                // recuperer image associé au bouton cliqué
                let url = beastNameToURL(e.target.textContent);
                // remonter l'url au script
                browser.tabs.sendMessage(tabs[0].id,{
                    command: "beastify",
                    beastURL: url,
                });
            });
        }

        function reset(tabs){
            browser.tabs.removeCSS({code: hidePage}).then(()=>{
                browser.tabs.sendMessage(tabs[0].id,{
                    command: "reset",
                });
            });
        }

        function reportError(error){
            console.error(error);
        }

        if (e.target.classList.contains('beast')) {
            browser.tabs
            .query({active: true, currentWindow: true})
            .then(beastify)
            .catch(reportError);
        } else if (e.target.classList.contains('reset')) {
            browser.tabs
            .query({active: true, currentWindow: true})
            .then(reset)
            .catch(reportError);
        }
    });
}
// changer le contenu du popup en cas d'erreur
function reportExecuteScriptError(error){
    document.querySelector('#popup-content')
    .classList.add('hidden');
    document.querySelector('#error-content')
    .classList.remove('hidden');
    console.error(`Erreur d'exécution du script de contenu beastify : ${error.message}`,
  );
}

// Succes ou console.error
browser.tabs
.executeScript({file: "/content_scripts/beastify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
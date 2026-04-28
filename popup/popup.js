function connect() {

const connect = document.getElementById("connect");

connect.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("summonerName").value ?? "e2r tacosougrec-777";
  const summonerName = inputValue.split("-")[0];
  const tagline = inputValue.split("-")[1];
  console.log("Summoner Name:", summonerName);
  console.log("Tagline:", tagline);
  //
  const data =  await browser.runtime.sendMessage({ type: "GET_PLAYER", summonerName, tagline });
  document.getElementById("historique").textContent = JSON.stringify(data, null, 2);
});
}

// changer le contenu du popup en cas d'erreur
function reportExecuteScriptError(error){
    document.querySelector('#popup-content')
    .classList.add('hidden');
    document.querySelector('#error-content')
    .classList.remove('hidden');
    console.error(`Erreur d'exécution du script de contenu background.js : ${error.message}`,
  );
}

// Succes ou console.error
browser.tabs
.executeScript({file: "/content_scripts/popup.js"})
.then(connect)
.catch(reportExecuteScriptError);
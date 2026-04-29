function connect() {

const connect = document.getElementById("connect");

connect.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("summonerName").value ?? "e2r tacosougrec-777";
  const summonerName = inputValue.split("-")[0];
  const tagline = inputValue.split("-")[1];
  const data =  await browser.runtime.sendMessage({ type: "GET_PLAYER", summonerName, tagline });
  console.log("data", data);
  if(data) {
    connect.classList.add("hidden");
    for(let i = 0; i < 5; i++) {
      const champIcon = document.createElement("img");
      champIcon.src = data.champIcon;
      const score = document.createElement("p");
      score.style.color = "#ffffff";
      score.textContent = data.score;
      const result = document.createElement("p");
      result.textContent = data.win ? "WIN" : "LOSS";
      result.style.color = data.win ? "#00c7bd" : "#ff7070";
      const grid = document.getElementById("grid");
      const historiqueDiv = document.createElement("div");
      historiqueDiv.classList.add("historique");
      historiqueDiv.style.backgroundColor = data.win ? "#4767ac" : "#974545";
      historiqueDiv.style.border = data.win ? "5px solid #252c55" : "5px solid #722929";
      historiqueDiv.appendChild(champIcon);
      historiqueDiv.appendChild(result);
      historiqueDiv.appendChild(score);
      grid.appendChild(historiqueDiv);    
    }
  }
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
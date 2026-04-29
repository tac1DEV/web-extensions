
document.addEventListener("DOMContentLoaded", async () => {
  const summoner = await loadSummoner();
  if (summoner) {
    document.getElementById("summonerName").value = `${summoner.summonerName}-${summoner.tagline}`;
  }
  connection();
});

function connection() {

const connect = document.getElementById("connect");

connect.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("summonerName").value;
  const summonerName = inputValue.split("-")[0];
  const tagline = inputValue.split("-")[1];
  await saveSummoner(summonerName, tagline);
  const data =  await browser.runtime.sendMessage({ type: "GET_PLAYER", summonerName, tagline });
  if(data) {
    const grid = document.getElementById("grid");
    grid.style.display = "grid";
    grid.style.height = "100%";
    grid.style.overflowX = "scroll";
    data.forEach((match) => {
      const champIcon = document.createElement("img");
      const score = document.createElement("p");
      const result = document.createElement("p");
      const historiqueDiv = document.createElement("div");

      champIcon.src = match.champIcon;
      champIcon.style.border = match.win ? "1px solid blue" : "1px solid red";
      historiqueDiv.appendChild(champIcon);

      result.textContent = match.win ? "WIN" : "LOSS";
      result.style.color = match.win ? "#00c7bd" : "#ff7070";
      historiqueDiv.appendChild(result);

      score.style.color = "#ffffff";
      score.textContent = match.score;
      historiqueDiv.appendChild(score);

      historiqueDiv.classList.add("historique");
      historiqueDiv.style.backgroundColor = match.win ? "#4767ac" : "#974545";
      historiqueDiv.style.border = match.win ? "5px solid #252c55" : "5px solid #722929";
      grid.appendChild(historiqueDiv);  
    });
  }else{
    return reportExecuteScriptError(new Error("Aucun résultat trouvé pour ce joueur."));
  }
});
}

async function saveSummoner(summonerName, tagline) {
    await browser.storage.local.set({ summoner: { summonerName, tagline } });
}

async function loadSummoner() {
    const stored = await browser.storage.local.get("summoner");
    return stored.summoner ?? null;
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


document.addEventListener("DOMContentLoaded", connection);
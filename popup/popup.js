
document.addEventListener("DOMContentLoaded", async () => {
  const summoner = await loadSummoner();
  console.log("Popup chargé", summoner);
  if (summoner) {
    document.getElementById("summonerName").value = `${summoner.summonerName}-${summoner.tagline}`;
    const stored = await browser.storage.local.get("matchHistory");
    displayData(stored.matchHistory); 
  };
});

function displayData(data) {
  const grid = document.getElementById("grid");

  //reset le contenu de grid
  grid.innerHTML = "";
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

    result.textContent = match.win ? "WIN" : "LOSS";
    result.style.color = match.win ? "#00c7bd" : "#ff7070";

    score.textContent = match.score;
    score.style.color = "#ffffff";

    historiqueDiv.classList.add("historique");
    historiqueDiv.style.backgroundColor = match.win ? "#4767ac" : "#974545";
    historiqueDiv.style.border = match.win
      ? "5px solid #252c55"
      : "5px solid #722929";

    historiqueDiv.appendChild(champIcon);
    historiqueDiv.appendChild(result);
    historiqueDiv.appendChild(score);

    grid.appendChild(historiqueDiv);
  });
}

async function getData(summonerName, tagline) {
  const data = await browser.runtime.sendMessage({
    type: "GET_PLAYER",
    summonerName,
    tagline
  });

  if (data) {
    displayData(data);

    await browser.storage.local.set({
      matchHistory: data
    });

  } else {
    return reportExecuteScriptError(
      new Error("Aucun résultat trouvé pour ce joueur.")
    );
  }
}

function connection() {
const connect = document.getElementById("connect");

connect.addEventListener("submit", async (e) => {
  e.preventDefault();
console.log(loadSummoner());
  const inputValue = document.getElementById("summonerName").value;
  const summonerName = inputValue.split("-")[0];
  const tagline = inputValue.split("-")[1];
  await saveSummoner(summonerName, tagline);
  await getData(summonerName, tagline );
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
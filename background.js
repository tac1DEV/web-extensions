const API_URL = "https://europe.api.riotgames.com";
const CHAMPIONS_URL = "https://ddragon.leagueoflegends.com/cdn/16.9.1/data/en_US/champion.json";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "GET_PLAYER") {
    const { API_KEY } = await import("./config.js");
    //get PUUID
    const getPUUID = await fetch(API_URL + "/riot/account/v1/accounts/by-riot-id/" + msg.summonerName + "/" + msg.tagline+ "?api_key=" + API_KEY);
    const data = await getPUUID.json();
    //get matchIDs
    const getmatchIDs = await fetch(API_URL + "/lol/match/v5/matches/by-puuid/" + data.puuid + "/ids?api_key=" + API_KEY);
    const matchIDsData = await getmatchIDs.json();
    // getAllChampionId
    const getChampionsName = await fetch(CHAMPIONS_URL);
    const ChampionsNameData = await getChampionsName.json();
    // conversion en tableau
    const champions = Object.values(ChampionsNameData.data);
    const matchDataArray = [];

    // allSettled a la place de all pour gerer les possibles erreurs lors de la recuperation de match
    const results = await Promise.allSettled(
      // recupere les id des 10 derniers matchs
      matchIDsData.slice(0, 10).map(async (matchID) => {
        // recupere les infos d'un match
        const match = await fetch(API_URL +"/lol/match/v5/matches/" +matchID +"?api_key=" +API_KEY);
        // pas de match => erreur
        if (!match.ok) {
          throw new Error("Erreur API Riot");
        }
        // recupere les données d'un match
        const matchData = await match.json();
        // recuperere les participants du match
        const participants = matchData.info.participants;
        //find l'id du joueur avec le meme riotIdGameName-riotIdTagline que renseigné dans l'input
        const index = participants.findIndex(participant => participant.riotIdGameName?.replace(/\s/g, '').toLowerCase() === msg.summonerName.replace(/\s/g, '').toLowerCase() && participant.riotIdTagline?.replace(/\s/g, '').toLowerCase() === msg.tagline.replace(/\s/g, '').toLowerCase());
        // recupere le nom exact utilisé pour les icons de champion (RekSai, Fiddlesticks!==FiddleSticks, VelKoz)
        const foundChampion = champions.find((champion) => champion.id.toLowerCase() === participants[index].championName.toLowerCase());
        const dataGame = {
          champIcon: "https://ddragon.leagueoflegends.com/cdn/16.8.1/img/champion/"+foundChampion.id+".png",
          score: participants[index].kills+"/"+participants[index].deaths+"/"+participants[index].assists,
          win: participants[index].win // win ou loose
        };
        return dataGame;
      })
    );
    return validMatches = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  }
});

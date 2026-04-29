const API_URL = "https://europe.api.riotgames.com";

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "GET_PLAYER") {
    const { API_KEY } = await import("./config.js");
    const getPUUID = await fetch(API_URL + "/riot/account/v1/accounts/by-riot-id/" + msg.summonerName + "/" + msg.tagline+ "?api_key=" + API_KEY);
    const data = await getPUUID.json();
    const matchIDs = await fetch(API_URL + "/lol/match/v5/matches/by-puuid/" + data.puuid + "/ids?api_key=" + API_KEY);
    const matchIDsData = await matchIDs.json();
    const match = await fetch(API_URL + "/lol/match/v5/matches/" + matchIDsData[0] + "?api_key=" + API_KEY);
    const matchData = await match.json();
    const participants = matchData.info.participants;
    const index = participants.findIndex(participant => participant.riotIdGameName?.toLowerCase() === msg.summonerName.toLowerCase() && participant.riotIdTagline?.toLowerCase() === msg.tagline.toLowerCase());
    const dataGame = {
      champIcon: "https://ddragon.leagueoflegends.com/cdn/16.8.1/img/champion/"+participants[index].championName+".png",
      score: participants[index].kills+"/"+participants[index].deaths+"/"+participants[index].assists,
      win: participants[index].win // win ou loose
    };
    return dataGame;
  }
});
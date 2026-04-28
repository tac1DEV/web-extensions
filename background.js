const API_URL = "https://europe.api.riotgames.com";

browser.runtime.onMessage.addListener(async (msg) => {
    //getUUID
  if (msg.type === "GET_PLAYER") {
    import("./config.js").then(async ({ API_KEY }) => {
    const getPUUID = await fetch(API_URL + "/riot/account/v1/accounts/by-riot-id/" + msg.summonerName + "/" + msg.tagline+ "?api_key=" + API_KEY);
    const data = await getPUUID.json();/lol/match/v5/matches/by-puuid/{puuid}/ids
    const matchIDs = await fetch(API_URL + "/lol/match/v5/matches/by-puuid/" + data.puuid + "/ids?api_key=" + API_KEY);
    console.log("res", await matchIDs.json());
    // return await res.json();
    }).catch((error) => {
        console.error("Erreur lors de l'importation du module config.js :", error);
        throw error; // Propager l'erreur pour qu'elle puisse être gérée par le code appelant
    });
    // return true;
  }
});
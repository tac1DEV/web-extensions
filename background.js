const API_URL = "https://esports.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";

browser.runtime.onMessage.addListener(async (msg) => {
    //getUUID
  if (msg.type === "GET_PLAYER") {
    const res = await fetch(API_URL + msg.summonerName + "/" + msg.tagline);
    return await res.json();
  }
});
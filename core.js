//++ ======================================== core ======================================= ++//
//++                                                                                       ++//
//-- This script is fired on all pages. It currently only receives messages for debugging  --//
//-- the notification system.                                                              --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("core.js");

//=Listen to incoming messages
// #clicked_browser_action currently creates a fake notification
// #notification_created serves for debugging notifications
// #creating_alarm serves for debugging notifications
// #alarm_created serves for debugging notifications
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message)
    {
    case "clicked_browser_action":
      var delay = Date.now()+5000; // 5 seconds from now
      //#DEBUG# console.log("5 seconds...");
      chrome.runtime.sendMessage({message:"new_fleet_notification", fleetId:"43",fleetName:"S.H.I.E.L.D. 43",fleetLocation:"Earth(L00:11:22:33)",fleetSize:"43,000",notificationDate:delay,notificationDelay:"0"});
      break;
    case "notification_created":
      console.log("Notification created. Id: " + request.id);
      break;
    case "creating_alarm":
      console.log("Creating alarm. Id: " + request.id);
      break;
    case "alarm_created":
      console.log("Alarm created. Id: " + request.id);
      break;
    }
  }
);

/*// Replace rank by rank tier
function changeRank(totalPlayers) {
  var rankObject = $("#top-header_menu .button-normal a").eq(0);
  // Find current rank
  var rankString = $("span", rankObject).text().replace(/[()]/g, ''); // Remove parenthesis
  var rankInt = parseInt(rankString);
  //#DEBUG# console.log(rankString + ", " + rankInt);
  // Find rank tier
  var rankTier = Math.ceil(rankInt/totalPlayers*100);
  // Set rank text and color
  rankObject.text("Top " + rankTier + "%");
  $("span", rankObject).text("");
}

function getTotalPlayers () {
  var rankPageDOM = this.response;
  //#DEBUG#console.log("getTotalPlayers");
  var lastTableEntry = $("table.tbllisting1 tr", rankPageDOM).eq(-1);
  var lastTableRank = $("td", lastTableEntry).eq(0).text();
  //#DEBUG#console.log("lastTableRank: " + lastTableRank);
  changeRank(lastTableRank);
}

// log xmlHttpRequest for debugging
function getToLastRankPage () {
  var rankPageDOM = this.response;
  //#DEBUG#console.log("getToLastRankPage");
  var lastRankPageUrl = $("#background-content center b a", rankPageDOM).eq(-1).attr('href');

  var lastRankReq = new XMLHttpRequest();
  lastRankReq.responseType = 'document';
  lastRankReq.addEventListener("load", getTotalPlayers);
  lastRankReq.open("GET", lastRankPageUrl);
  lastRankReq.send();
}

// Do stuff
var rankReq = new XMLHttpRequest();
rankReq.responseType = 'document';
rankReq.addEventListener("load", getToLastRankPage);
rankReq.open("GET", "http://lyra.astroempires.com/ranks.aspx");
rankReq.send();
*/

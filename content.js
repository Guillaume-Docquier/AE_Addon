// =================================== READ =================================== //
// https://developer.chrome.com/extensions/content_scripts
// ============================================================================ //

// Say hi
console.log("content.js");

// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);

      // This line is new!
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);

// Replace rank by rank tier
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

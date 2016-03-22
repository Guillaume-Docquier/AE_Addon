// Say hi
console.log("fleetListUpdate.js");
// Find all the fleets and store them
var fleets = $(".sorttable tbody").children();
var fleetArray = [];
for (var i = 0; i < fleets.length; i++)
{
  var fleetUrl = $("a", fleets.eq(i)).attr('href'); //#DEBUG# console.log("fleetUrl: " + fleetUrl);
  // Url is like: fleet.aspx?fleet=10174002, we only want the number
  var fleetId = fleetUrl.substring(fleetUrl.search(/[\d]/), fleetUrl.length); //#DEBUG# console.log("fleetId: " + fleetId);
  fleetArray.push(fleetId);
}
chrome.storage.local.set({fleetList: fleetArray}, function()
{
  //console.log("Stringify: " + JSON.stringify(fleetArray));
  //console.log("Saved: " + fleetArray);
});

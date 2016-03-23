//++ ================================== fleetListUpdate ================================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx. It gathers all fleets   --//
//-- and stores them in storage.local.fleetList. This is useful when determining if a new  --//
//-- fleet was created upon launching one.                                                 --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("fleetListUpdate.js");
// Find all the fleets and store them
var fleets = $(".sorttable tbody").children();
var fleetArray = [];
for (var i = 0; i < fleets.length; i++)
{
  // Url is like: fleet.aspx?fleet=10174002, we only want the number
  var fleetId = $("a", fleets.eq(i)).attr('href').match(/\d+/).pop(); //#DEBUG#
  console.log("fleetId: " + fleetId + ", " + typeof fleetId);
  fleetArray.push(fleetId);
}
chrome.storage.local.set({fleetList: fleetArray});
//  , function(){console.log("Saved: " + fleetArray);});

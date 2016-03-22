//++ ============================= notificationFleetDeparted ============================= ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*&view=move_start* --//
//-- This means a fleet has just departed. The user might want to be notified before the   --//
//-- fleet lands, in which case the url will contain &notificationDelay=XX. In both cases, --//
//-- we have to add the fleet Id to the storage.local.fleetList if it's a new one. If the  --//
//-- whole fleet is moving, it will keep its Id, which we can find in the url.             --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

//=This function gathers all the information needed to create a notification.
// @Id is the Id of the fleet we're tracking.
// @notificationDelayMs is how long before the fleet lands we want to be notified.
// @fleetRow is a jquery object containing all info on our fleetRow.
// @date is the time snapshotted when the page loaded. Necessary for precision.
function createNotification(Id, notificationDelayMs, fleetRow, date)
{
  // Gather fleet info
  var name = $("td", fleetRow).eq(0).text(); //#DEBUG# console.log("name: " + name);
  var destination = $("td", fleetRow).eq(2).text(); //#DEBUG# console.log("destination: " + destination);
  var durationMs = parseInt($("td", fleetRow).eq(3).attr('title')) * 1000; //#DEBUG# console.log("durationMs: " + durationMs);
  date += (durationMs - notificationDelayMs); //#DEBUG# console.log("date: " + date);
  var size = $("td", fleetRow).eq(4).text(); //#DEBUG# console.log("size: " + size);
  var delay = notificationDelayMs/1000;
  // Tell the background to create the notification
  chrome.runtime.sendMessage({message:"new_fleet_notification", fleetId:Id,fleetName:name,fleetDestination:destination,fleetSize:size,notificationDate:date,notificationDelay:delay});
}

// Say hi
console.log("notificationFleetDeparted.js");
var date = Date.now();
// Get page url
chrome.runtime.sendMessage({message: "get_url"}, function(url)
{
  // Url is like: fleet.aspx?fleet=8834620&view=move_start&notificationDelay=5, we want the notification part
  var urlArray = url.split("="); //#DEBUG# console.log("urlArray: " + urlArray);
  // Last element contains the value of notificationDelay
  var notificationDelayMs = parseInt(urlArray.pop()) * 1000;
  // urlArray[1] is like: 8834620&view, we want the first part
  var currentFleetId = urlArray[1].split("&")[0]; //#DEBUG# console.log("currentFleetId: " + currentFleetId);
  // Find the new fleet
  chrome.storage.local.get("fleetList", function(result)
  {
    var currentFleetRow;
    // Find all the fleet Ids on the page
    var fleets = $(".sorttable tbody").children();
    for (var i = 0; i < fleets.length; i++)
    {
      var fleetRow = fleets.eq(i);
      var fleetUrl = $("a", fleetRow).attr('href'); //#DEBUG# console.log("fleetUrl: " + fleetUrl);
      // Url is like: fleet.aspx?fleet=10174002, we only want the number
      var Id = fleetUrl.substring(fleetUrl.search(/[\d]/), fleetUrl.length); //#DEBUG# console.log("fleetId: " + fleetId);
      // This will be usefull if a notification is set for a fleet that is not new
      if (Id == currentFleetId) currentFleetRow = fleetRow;
      // Search the fleetList
      var indexOfFleetId = result.fleetList.indexOf(Id); //#DEBUG# console.log("FleetId: " + Id + ", indexOfFleetId: " + indexOfFleetId);
      // Not found: this is a new fleet
      if (indexOfFleetId < 0)
      {
        // Create a notification if notificationDelay was set
        if (notificationDelayMs > -1) createNotification(Id, notificationDelayMs, fleetRow, date);
        // Add the new fleet to the fleetList
        result.fleetList.push(Id);
        chrome.storage.local.set({fleetList: result.fleetList});
        return;
      };
    }
    //#DEBUG# console.log("No new fleet.");
    // No new fleet, create a notification if notificationDelay was set
    if (notificationDelayMs > -1) createNotification(currentFleetId, notificationDelayMs, currentFleetRow, date);
  });
});

// Say hi
console.log("notificationFleetDeparted.js");
var date = Date.now();
// Get url
chrome.runtime.sendMessage({message: "get_url"}, function(url)
{
  // Url is like: fleet.aspx?fleet=8834620&view=move_start&notificationDelay=5, we want the notification part
  var urlArray = url.split("="); // Last element contains the value of notificationDelay
  //#DEBUG# console.log("urlArray: " + urlArray);
  if (urlArray.length == 4)
  {
     var notificationDelayMs = parseInt(urlArray.pop()) * 1000;
  }
  // Find the new fleet
  chrome.storage.local.get("fleetList", function(result)
  {
    //#DEBUG# console.log("First fleet: " + result.fleetList[0]);
    // Find all the fleet Ids on the page
    var fleets = $(".sorttable tbody").children();
    var currentFleetsArray = [];
    for (var i = 0; i < fleets.length; i++)
    {
      var fleetRow = fleets.eq(i);
      var fleetUrl = $("a", fleetRow).attr('href'); //#DEBUG# console.log("fleetUrl: " + fleetUrl);
      // Url is like: fleet.aspx?fleet=10174002, we only want the number
      var Id = fleetUrl.substring(fleetUrl.search(/[\d]/), fleetUrl.length); //#DEBUG# console.log("fleetId: " + fleetId);
      // Find it in the fleetList
      var indexOfFleetId = result.fleetList.indexOf(Id); //#DEBUG# console.log("FleetId: " + Id + ", indexOfFleetId: " + indexOfFleetId);
      // Not found: this is a new fleet
      if (indexOfFleetId < 0)
      {
        // Gather fleet info
        var name = $("td", fleetRow).eq(0).text(); //#DEBUG# console.log("name: " + name);
        var destination = $("td", fleetRow).eq(2).text(); //#DEBUG# console.log("destination: " + destination);
        var durationMs = parseInt($("td", fleetRow).eq(3).attr('title')) * 1000; //#DEBUG# console.log("durationMs: " + durationMs);
        date += (durationMs - notificationDelayMs); //#DEBUG# console.log("date: " + date);
        var size = $("td", fleetRow).eq(4).text(); //#DEBUG# console.log("size: " + size);
        // Store it
        // Tell the background to create the notification
        chrome.runtime.sendMessage({message:"new_fleet_notification", fleetId:Id,fleetName:name,fleetDestination:destination,fleetSize:size,notificationDate:date});
        return;
      };
      //
    }
  });
});
// If notification is set in the url, start a notification
// Add the new fleet to the fleetList

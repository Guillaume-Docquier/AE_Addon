//++ ============================= notificationUpdateRecall ============================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*&action=recall*   --//
//-- This is the screen after a fleet has recalled. This script updates the                --//
//-- chrome.storage.local.notificationList                                                 --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("notificationUpdateRecall.js");
var date = Date.now();
// Get page url
chrome.runtime.sendMessage({type: "get_url"}, function(url)
{
  // Url is like: fleet.aspx?fleet=8834620&view=move_start&notificationDelay=5, we want the id and notification
  var urlNumbers = url.match(/-?\d+/g); //#DEBUG# console.log("urlNumbers: " + urlNumbers);
  var notificationDelay = urlNumbers.pop(); //#DEBUG#  console.log("notificationDelayMs: " + notificationDelayMs);
  var notificationDelayMs = parseInt(notificationDelay) * 1000;
  var currentFleetId = urlNumbers.pop();//#DEBUG#  console.log("currentFleetId: " + currentFleetId);
  var travelTimeMs = parseInt($("#timer1").attr("title")) * 1000;//#DEBUG#  console.log("travelTimeMs: " + travelTimeMs);
  var domDestinationCell = $("#local-header_content tr").eq(1).children().eq(2);
  var destination = $("a", domDestinationCell).text().replace(" ", "");//#DEBUG#  console.log("destination: " + destination);
  // If the fleet already had a notification set, modify it. Else create one.
  chrome.storage.local.get("notificationList", function(result)
  {
    var i = 0;
    for(; i < result.notificationList.length; i++)
    {
      if(result.notificationList[i].fleetId == currentFleetId)
      {
        updateNotification = result.notificationList[i]
        // Change some values
        updateNotification.type = "update_fleet_notification";
        updateNotification.notificationDelay = notificationDelay;
        updateNotification.fleetDestination = destination;
        updateNotification.notificationDate = date + travelTimeMs - notificationDelayMs;
        updateNotification.alarmName = i.toString();
        // Update the notifications
        chrome.runtime.sendMessage(updateNotification);
        break;
      }
    }
    // Create a notification if it didn't exist
    if(i == result.notificationList.length)
    {
      var fleetName = $( "option:selected" ).text().match(/\s(.+)\s-/).pop();//#DEBUG#      console.log("fleetName: " + fleetName);
      var fleetSize = $(".box3_content center").text().match(/\d+/).pop();//#DEBUG#      console.log("fleetSize: " + fleetSize);
      chrome.runtime.sendMessage({type:"new_fleet_notification", fleetId:currentFleetId, fleetName:fleetName, fleetDestination:destination, fleetSize:fleetSize, notificationDate:(date + travelTimeMs - notificationDelayMs), notificationDelay:notificationDelay});
    }
  });
});

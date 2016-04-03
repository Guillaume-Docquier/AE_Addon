//++ ==================================== arrivalTimes =================================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*&view=move*       --//
//-- This is the fleet launching page. The script adds an interface to allow the user to   --//
//-- see the expected arrival time of its fleet before launching them. Settings are saved  --//
//-- in storage.local.arrivalTime. The default values (false) can be modified at any time  --//
//-- in the display settings under the AE_Addon section.                                   --//
//++                                                                                       ++//
//++ ===================================================================================== ++//


//=Performs travelTime+serverTime and travelTime+LocalTime
// @travelTime is the flight duration (format: xh ym zs)
// @serverTime is the serverTime retrieved from the page (format: 2016/03/22 23:17:48)
// These parameter have different formats, we must convert them to
// milliseconds to add them and convert them into a display format.
function addTimeStrings(travelTime, serverTime){
  var localTimeMS = Date.now();
  var serverTimeMS = new Date(serverTime).getTime();
  // Only keep numbers
  var travelTimeArray = travelTime.match(/\d+/g);//#DEBUG#  console.log("travelTimeArray: " + travelTimeArray);
  travelTimeArray.reverse(); // New format [s,m,h]
  //#DEBUG#  console.log("travelTimeArrayReversed: " + travelTimeArray);
  // Convert [s,m,h] to ms
  var travelTimeMS = 0;
  //#DEBUG# console.log("travelTimeArray.length: " + travelTimeArray.length);
  switch(travelTimeArray.length)
  {
    case 3:
      travelTimeMS += parseInt(travelTimeArray.pop()) * 60 * 60 * 1000;
    case 2:
      travelTimeMS += parseInt(travelTimeArray.pop()) * 60 * 1000;
    case 1:
      travelTimeMS += parseInt(travelTimeArray.pop()) * 1000;
  }//#DEBUG#  console.log("travelTimeMS : " + travelTimeMS);
  // Add milliseconds
  var serverArrivalDate = new Date(serverTimeMS + travelTimeMS);
  var localArrivalDate = new Date(localTimeMS + travelTimeMS);
  // Return in the proper format
  var properFormat = { hour12: false, month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return {server:serverArrivalDate.toLocaleString('en-US', properFormat), local:localArrivalDate.toLocaleString('en-US', properFormat)};
}

// Say hi
console.log("arrivalTimes.js");
// Retrieve settings
var arrival_server_time = false;
var arrival_local_time = false;
var defaultSettings = {server:arrival_server_time, local:arrival_local_time};
chrome.storage.local.get({arrivalTime:defaultSettings}, function (result)
{
  arrival_server_time = result.arrivalTime.server;
  arrival_local_time = result.arrivalTime.local;
  // Update time every second if the settings allow it
  if (arrival_server_time || arrival_local_time)
  {
    // Add fields for arrival date
    $("#move_fleet_form tr").eq(0).append("<th width='20%'>Expected Arrival</th>");
    $("#move_fleet_form tr").eq(1).append("<td id='arrivalDate' align='center'><span id='serverDate'></span><span id='localDate'></span></td>");
    setInterval(function()
    {
      var duration = $("#duration").text();//#DEBUG# console.log("duration: " + duration);
      // Convert date/time to proper format only if a travel time was issued
      if (duration.search(/[\w]/) > -1)
      {
        var arrivalDate = addTimeStrings(duration, $("#server-time").text()); //#DEBUG# console.log("arrivalDate: " + arrivalDate);
        // Show date as arrival time if the settings allow it
        if (arrival_server_time) $("#serverDate").text("Server: " + arrivalDate.server);
        if (arrival_local_time) $("#localDate").html("&nbsp&nbspLocal: " + arrivalDate.local);
      }
      else
      {
        $("#serverDate").text("");
        $("#localDate").text("");
      }
    }, 1000);
  }
});

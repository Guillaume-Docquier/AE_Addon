// Returns an object containing the serverTime + travelTime and localTime + travelTime in a proper format
// serverTime requires no manipulation because its format is handled by Date()
// travelTime needs to be converted to ms...
// ...in order to calculate arrival time by adding milliseconds
function addTimeStrings(travelTime, serverTime){
  var serverTimeMS = new Date(serverTime).getTime();
  var localTimeMS = Date.now();
  // Remove spaces && Split between characters
  var travelTimeArray = travelTime.replace(/[\s]/g, '').split(/[\D]/g);  //#DEBUG#  console.log(travelTimeArray);
  // Convert h:m:s to ms
  var travelTimeMS = ((((parseInt(travelTimeArray[0]) * 60) + parseInt(travelTimeArray[1])) * 60) + parseInt(travelTimeArray[2])) * 1000;  //#DEBUG#  console.log(travelTimeMS);
  // Add milliseconds
  var serverArrivalDate = new Date(serverTimeMS + travelTimeMS);
  var localArrivalDate = new Date(localTimeMS + travelTimeMS);

  var properFormat = { hour12: false, month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return {server:serverArrivalDate.toLocaleString('en-US', properFormat), local:localArrivalDate.toLocaleString('en-US', properFormat)};
}

//test
var array = ["hi"];
array[1] = "hello";
console.log(array);

// Say hi
console.log("moveFleet.js");
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

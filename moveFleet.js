// Returns the serverTime + travelTime in a proper format
// serverTime requires no manipulation because its format is handled by Date()
// travelTime needs to be converted to ms...
// ...in order to calculate arrival time by adding milliseconds
function addTimeStrings(travelTime, serverTime){
  var serverTimeMS = new Date(serverTime).getTime();
  // Remove spaces && Split between characters
  var travelTimeArray = travelTime.replace(/[\s]/g, '').split(/[\D]/g);  //#DEBUG#  console.log(travelTimeArray);
  // Convert h:m:s to ms
  var travelTimeMS = ((((parseInt(travelTimeArray[0]) * 60) + parseInt(travelTimeArray[1])) * 60) + parseInt(travelTimeArray[2])) * 1000;  //#DEBUG#  console.log(travelTimeMS);
  // Add milliseconds
  var arrivalDate = new Date(serverTimeMS + travelTimeMS);

  var properFormat = { hour12: false, month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return arrivalDate.toLocaleString('en-US', properFormat);
}

// Say hi
console.log("moveFleet.js");
// Add fields for arrival date
$("#move_fleet_form tr").eq(0).append("<th width='20%'>Expected Arrival</th>");
$("#move_fleet_form tr").eq(1).append("<td id='arrivalDate' align='center'></td>");
// Update time every second
setInterval(function()
{
  //#DEBUG# console.log("Time changed");
  var duration = $("#duration").text();
  //#DEBUG# console.log("duration: " + duration);
  // Convert date/time to proper format only if a travel time was issued
  if (duration.search(/[\w]/) > -1)
  {
    var arrivalDate = addTimeStrings(duration, $("#server-time").text());
    // Show date as arrival time
    //#DEBUG# console.log("arrivalDate: " + arrivalDate);
    $("#arrivalDate").text(arrivalDate);
  }
}, 1000);

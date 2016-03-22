//++ =============================== notificationFleetMove =============================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*&view=move*       --//
//-- This is the fleet launching page. The script adds an interface to allow the user to   --//
//-- be notified x seconds before the fleet lands. It doesn't create a notification        --//
//-- because it is impossible to know the new fleet id or name here. Instead,it adds       --//
//-- &notificationDelay=XX to the next page url to allow notification creation. -1 means   --//
//-- no notification.                                                                      --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

//=Converts time as xh ym zs to milliseconds.
// @durationString duration as xh ym zs to be converted
function convertToMs(durationString) {
  // Remove spaces && Split between characters
  var durationArray = durationString.replace(/[\s]/g, '').split(/[\D]/g);  //#DEBUG#  console.log(travelTimeArray);
  durationArray.pop(); // Array ends with an empty cell [h,m,s,'']
  durationArray.reverse(); // New format [s,m,h]
  //#DEBUG# console.log(durationArray);
  // Convert [s,m,h] to ms
  var durationMs = 0;
  switch(durationArray.length)
  {
    case 3:
      durationMs += parseInt(durationArray.pop()) * 360000;
    case 2:
      durationMs += parseInt(durationArray.pop()) * 60000;
    case 1:
      durationMs += parseInt(durationArray.pop()) * 1000;
  }
  //#DEBUG#  console.log("durationMs: " + durationMs);
  return durationMs;
}

//=If checked, append the url with the delay
// If unchecked, append the url with delay = -1
function changeFormAction()
{
  var delay = $("#notificationOffSet").val();
  var checked = $("#notificationFleetMove").prop('checked');
  // Change urls
  if(checked) var newUrl = defaultUrl + "&notificationDelay=" + delay;
  else var newUrl = defaultUrl + "&notificationDelay=-1";
  $("#move_fleet_form").attr('action', newUrl);
}

// Say hi
console.log("notificationFleetMove.js");
// Add &notificationDelay
var defaultUrl = $("#move_fleet_form").attr('action');
changeFormAction();
// Add a checkbox to enable notifications
$("#move_fleet_form center").prepend("<div id='notify'><input type='checkbox' name='be_notified' id='notificationFleetMove' class='notification'><label for='notificationFleetMove'>Be notified <input type='text' id='notificationOffSet' class='input-numeric notification' value='0'> seconds before landing</label></div>");
// Change &notificationDelay when ticking the checkbox or when the delay value is changed
$(".notification").change(function() {
  changeFormAction();
});

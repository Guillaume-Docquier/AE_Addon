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
// If checked, append the url with the delay
// If unchecked, put back the default url
function changeFormAction(checked, defaultUrl, delay)
{
  if(checked)
  {
    var newUrl = defaultUrl + "&notificationDelay=" + delay;
    $("#move_fleet_form").attr('action', newUrl);
  }
  else $("#move_fleet_form").attr('action', defaultUrl);;
}
// Say hi
console.log("notificationFleetMove.js");
// Add a checkbox to enable notifications
$("#move_fleet_form center").prepend("<div id='notify'><input type='checkbox' name='be_notified' id='notificationFleetMove'><label for='notificationFleetMove'>Be notified <input type='text' id='notificationOffSet' class='input-numeric' value='0'> seconds before landing</label></div>");
// Useful objects
var moveButton = $("#move_fleet_form center input").eq(-1);
var notificationCheckbox = $("#notificationFleetMove");
var notificationDelay = $("#notificationOffSet");
var moveStartUrl = $("#move_fleet_form").attr('action');

// Change url when ticking the box
notificationCheckbox.change(function() {
  var delaySecString = notificationDelay.val();
  changeFormAction(notificationCheckbox.prop('checked'), moveStartUrl, delaySecString);
});
// Change url when the time value is changed
notificationDelay.change(function() {
  var delaySecString = notificationDelay.val();
  changeFormAction(notificationCheckbox.prop('checked'), moveStartUrl, delaySecString);
});

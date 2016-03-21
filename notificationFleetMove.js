// Say hi
console.log("notificationFleetMove.js");
// Add a checkbox to enable notifications
$("#move_fleet_form center").prepend("<div id='notify'><input type='checkbox' name='be_notified' id='notificationFleetMove'><label for='notificationFleetMove'>Be notified <input type='text' id='notificationOffSet' class='input-numeric' value='0'> seconds before landing</label></div>");
// Save all info regarding the fleet
// Unable to get here: fleetId and fleetName
var duration = $("#duration").text();
var totalSize = $("#totalsize").text();
var destination = $("#destination").val();
// Start a notification when user clicks on Move
//chrome.runtime.sendMessage({message: "new_fleet_notification", fleetId:"43",fleetName:"S.H.I.E.L.D. 43",fleetLocation:"Earth(L00:11:22:33)",fleetSize:"43,000",notificationDelay:delay});

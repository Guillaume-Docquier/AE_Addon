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
  if (notificationCheckbox.prop('checked'))
  {
    var newUrl = moveStartUrl + "&notificationDelay=" + delaySecString;
    $("#move_fleet_form").attr('action', newUrl);
  }
  else
  {
    $("#move_fleet_form").attr('action', moveStartUrl);
  }
});
// Upon clicking move, prevent leaving the page before the notification is created
/*moveButton.click(function(event){
    /*event.preventDefault(); //#DEBUG# console.log("Prevented!");*//*

    // Nothing to do if notification not enabled
    if (!notificationCheckbox.prop('checked')) return;
    // Save all info regarding the fleet except fleetId and fleetName
    var delayMS = convertToMs($("#duration").text()) - parseInt(notificationDelay.val()) * 1000;
    var totalSize = $("#totalsize").text();
    var destination = $("#destination").val();
    chrome.storage.local.get("pendingNotifications", function (result)
    {
      if (result[0] === undefined) result = [];
      result.push({fleetId:"", fleetName:"", fleetLocation:destination, fleetSize:totalSize, notificationDate:delayMS}); //#DEBUG# console.log("result: " + result[0].fleetSize);
      /*chrome.storage.local.set({"pendingNotifications": result}, function()
      {
        console.log('Settings saved');
        // The page can now proceed normally
        // The notification will be created on the next page
      });*//*
    });
    // Tell the background to create the notification
    //chrome.runtime.sendMessage({message: "new_fleet_notification", fleetId:"43",fleetName:"S.H.I.E.L.D. 43",fleetLocation:"Earth(L00:11:22:33)",fleetSize:"43,000",notificationDelay:delay});
  });*/

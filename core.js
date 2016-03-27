//++ ======================================== core ======================================= ++//
//++                                                                                       ++//
//-- This script is fired on all pages. It receives messages for debugging and also does   --//
//-- some initializations if the user just logged in.                                      --//                                                            --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("core.js");
// Verify if we just logged in
chrome.storage.local.get("justLoggedIn", function(result)
{
  if (result.justLoggedIn == false) return;
  console.log("Just logged in.");
  chrome.storage.local.set({justLoggedIn:false});
  // Do any init you need
  chrome.runtime.sendMessage({type:"init"});
});

//=Listen to incoming messages
// #clicked_browser_action currently creates a fake notification
// #notification_created serves for debugging notifications
// #creating_alarm serves for debugging notifications
// #alarm_created serves for debugging notifications
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.message)
    {
    case "clicked_browser_action":
      var date = Date.now()+5000; // 5 seconds from now
      //#DEBUG# console.log("5 seconds...");
      chrome.runtime.sendMessage({type:"new_fleet_notification", fleetId:"43",fleetName:"S.H.I.E.L.D. 43",fleetLocation:"Earth(L00:11:22:33)",fleetSize:"43,000",notificationDate:date,notificationDelay:"0"});
      break;
    case "notification_created":
      console.log("Notification created. Id: " + request.id);
      break;
    case "creating_alarm":
      console.log("Creating alarm. Id: " + request.id);
      break;
    case "alarm_created":
      console.log("Alarm created. Id: " + request.id);
      break;
    }
  }
);

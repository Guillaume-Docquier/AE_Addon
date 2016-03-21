// background.js
var notificationList = [];
function sendMessage(message)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  });
}
// Alarm listener
chrome.alarms.onAlarm.addListener(function(alarm) {
  var notification = notificationList[parseInt(alarm.name)];
  chrome.notifications.create(notification.notificationId, notification.notificationOptions, function(Id){
    sendMessage({message: "notification_created", id:Id});
  });
  notificationList[alarm.name] = "";
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action"});
  });
});

// Create a notification
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "new_fleet_notification" ) {
      // Create all we need for setting up the notification in the future
      requestTitle = "A fleet has landed";
      requestMessage = request.fleetName + " has landed at " + request.fleetLocation + ". \nFleet size: " + request.fleetSize + ".";
      var notification = {notificationId:request.fleetId, notificationOptions:{type:'basic', iconUrl:'logo-white.png', title:requestTitle, message:requestMessage}};
      // Find first empty spot in array (might be the end)
      var i;
      for(i = 0; i < notificationList.length; i++)
      {
        if (notificationList[i] == "") break;
      }
      notificationList[i] = notification;
      sendMessage({message: "creating_alarm", id:i});
      // Set up an alarm with name being its notificationList index
      chrome.alarms.create(i.toString(), {delayInMinutes:request.notificationDelay});
      sendMessage({message: "alarm_created", id:i});
    }
  }
);

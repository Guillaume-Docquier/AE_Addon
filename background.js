//++ ==================================== background ===================================== ++//
//++                                                                                       ++//
//-- The background script is an event page that receives messages from content scripts.   --//
//-- It can create fleet notifications.                                                    --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

//=Sends a message
// @message is the message to be sent
function sendMessage(message)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  });
}
// Alarm listener
// Currently only used for fleet notifications
chrome.alarms.onAlarm.addListener(function(alarm)
{
  // Alarm fired, get the notification options
  chrome.storage.local.get("notificationList", function(result)
  {
    var notification = result.notificationList[parseInt(alarm.name)];
    // Create the notification
    chrome.notifications.create(notification.notificationId, notification.notificationOptions, function(Id)
    {
      sendMessage({message: "notification_created", id:Id}); //#DEBUG#
    });
    // Remove this notification from the list
    result.notificationList[alarm.name] = "";
    chrome.storage.local.set({notificationList:result.notificationList});
  });
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab)
{
    sendMessage({message: "clicked_browser_action"});
});

// Message listener
// #new_fleet_notification creates a new fleet notification
// #get_url sends back the page url
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    switch(request.message)
    {
      case "new_fleet_notification":
        // Object as {message, fleetId,fleetName,fleetDestination,fleetSize,notificationDate,notificationDelay}
        // Create all we need for setting up the notification in the future
        var requestTitle = "New fleet notification";
        var requestMessage = request.fleetName + " has just landed.";
        if (request.notificationDelay > 0) requestMessage = request.fleetName + " will land in " + request.notificationDelay + " seconds.";
        var requestContextMessage = "Fleet size: " + request.fleetSize;
        // NotificationOptions object
        var notification = {notificationId:request.fleetId, notificationOptions:{type:'basic', iconUrl:'logo-white.png', title:requestTitle, message:requestMessage, contextMessage:requestContextMessage}};
        // Retrieve the list of notifications
        chrome.storage.local.get("notificationList", function(result){
          // Find first empty spot in the notificationList (might be the end)
          var i = 0;
          if (result.notificationList != undefined)
          {
            for(; i < result.notificationList.length; i++)
            {
              if (result.notificationList[i] == "") break;
            }
          }
          else result.notificationList = [];
          // Fill it with the new notification. We will use the index as alarm name
          result.notificationList[i] = notification;
          // Set up an alarm for the notification
          sendMessage({message: "creating_alarm", id:i}); //#DEBUG#
          var timeUp = request.notificationDate - 2000; // Remove some time to compensate for script response time
          console.log("timeUp: " + timeUp);
          chrome.alarms.create(i.toString(), {when:timeUp});
          sendMessage({message: "alarm_created", id:i}); //#DEBUG#
          // Save the notificationList
          chrome.storage.local.set({notificationList:result.notificationList})
        });
        break;
      case "get_url":
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
          var url = tabs[0].url;
          sendResponse(url);
        });
        return true;
    }
  }
);

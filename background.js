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

//=Finds all fleets in the DOM and saves them in strage.local.fleetList
// Called upon receiving xmlHTTPrequest response
// @no-arguments
function fleetListUpdate ()
{
  console.log("init - Updating fleetList")
  var fleetPageDOM = this.response;
  // Find all the fleets and store them
  var fleets = $(".sorttable tbody", fleetPageDOM).children();
  var fleetArray = [];
  for (var i = 0; i < fleets.length; i++)
  {
    // Url is like: fleet.aspx?fleet=10174002, we only want the number
    var fleetId = $("a", fleets.eq(i)).attr('href').match(/\d+/).pop(); //#DEBUG#  console.log("fleetId: " + fleetId + ", " + typeof fleetId);
    fleetArray.push(fleetId);
  }
  chrome.storage.local.set({fleetList: fleetArray}, function(){console.log("init - fleetList updated");});
}

//=Prints an array to the console
// @array the array to be printed
function printArray(array)
{
  if(array.length == 0) console.log("empty");
  for(var i = 0; i < array.length; i++)
  {
    console.log(array[i]);
  }
}

// Say hi
console.log("background.js");

// Alarm listener
// Currently only used for fleet notifications
chrome.alarms.onAlarm.addListener(function(alarm)
{
  console.log("Alarm fired!");
  // Alarm fired, get the notification options
  chrome.storage.local.get("notificationList", function(result)
  {
    // Name of the alarm was used as index
    var notification = result.notificationList[parseInt(alarm.name)];
    // Create the notification
    chrome.notifications.create(notification.notificationId, notification.notificationOptions);
    // Remove this notification from the list
    result.notificationList[parseInt(alarm.name)] = "";
    chrome.storage.local.set({notificationList:result.notificationList});
  });
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab)
{
  // Display content of all variables stored
  console.log("===== AE_Addon status ======")
  chrome.storage.local.get("notificationList", function(result)
  {
    console.log("## notificationList: ");
    printArray(result.notificationList);
    // Next one
    chrome.storage.local.get("fleetList", function(result)
    {
      console.log("## fleetList: ");
      printArray(result.fleetList);
      // Next one
      chrome.storage.local.get("arrivalTime", function(result)
      {
        console.log("## arrivalTime: ");
        console.log("server = " + result.arrivalTime.server);
        console.log("local = " + result.arrivalTime.local);
        // Done
        console.log("===== AE_Addon status done ======");
      });
    });
  });
});

// Message listener
// #new_fleet_notification creates a new fleet notification
// #get_url sends back the page url
// #init proceeds with initializations
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    switch(request.message)
    {
      case "new_fleet_notification":
        // Object as {message, fleetId,fleetName,fleetDestination,fleetSize,notificationDate,notificationDelay}
        // Create all we need for setting up the notification in the future
        var requestTitle = "New fleet notification";
        var requestMessage = request.fleetName + " will land in " + request.notificationDelay + " seconds.";
        if (request.notificationDelay == 1) requestMessage = request.fleetName + " will land in 1 second.";
        else if (request.notificationDelay == 0) requestMessage = request.fleetName + " has just landed.";
        var requestContextMessage = "Fleet size: " + request.fleetSize;
        var date = request.notificationDate - 2000; // Remove some time to compensate for script response time
        // NotificationOptions object
        var notification = {notificationId:request.fleetId, notificationDate:date, notificationOptions:{type:'basic', iconUrl:'logo-white.png', title:requestTitle, message:requestMessage, contextMessage:requestContextMessage}};
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
          console.log("timeUp: " + date);
          chrome.alarms.create(i.toString(), {when:date}); //#DEBUG#
          console.log("Alarm set.")
          // Save the notificationList
          chrome.storage.local.set({notificationList:result.notificationList})
        });
        break;
      case "get_url":
        chrome.tabs.get(sender.tab.id, function (tab) {
          var url = tab.url;
          sendResponse(url);
        });
        return true;
      case "init": // Reset alarms and check fleets?
        console.log("init - Updating notificationList");
        chrome.alarms.clear(); // Clear alarms
        chrome.storage.local.get("notificationList", function(result){
          // We'll clean up the notification list
          var newNotificationList = [];
          var now = Date.now();
          var alarmName = 0;
          if (result.notificationList != undefined)
          {
            for(var i = 0; i < result.notificationList.length; i++)
            {
              // If the notification exists and is not expired
              if (result.notificationList[i] != "" && result.notificationList[i].notificationDate > now)
              {
                newNotificationList.push(result.notificationList[i]);
                // Set up an alarm for the notification
                chrome.alarms.create(alarmName.toString(), {when:newNotificationList[alarmName].notificationDate}); //Last element of newNotificationList
                console.log("init - Alarm re-set.")
                alarmName++;
              }
            }
          }
          // Save the newNotificationList
          chrome.storage.local.set({notificationList:newNotificationList}, function(){console.log("init - notificationList updated");});
        });
        // Update fleet list
        var fleetReq = new XMLHttpRequest();
        fleetReq.responseType = 'document';
        fleetReq.addEventListener("load", fleetListUpdate); // Can I use fleetListUpdate.js here?
        fleetReq.open("GET", "http://lyra.astroempires.com/fleet.aspx");
        fleetReq.send();
        console.log("init - Done.");
        return true;
    }
  }
);

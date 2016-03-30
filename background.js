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
function fleetListUpdate()
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

//=Creates a fleet notification
// @notification object as {type, fleetId,fleetName,fleetDestination,fleetSize,notificationDate,notificationDelay}
function createFleetNotification(notification)
{
  // Create all we need for setting up the notification in the future
  var title = "New fleet notification";
  console.log(title);
  // Message depends on the delay
  var message = notification.fleetName + " will land in " + notification.notificationDelay + " seconds.";
  if (notification.notificationDelay == 1) message = notification.fleetName + " will land in 1 second.";
  else if (notification.notificationDelay == 0) message = notification.fleetName + " has just landed.";
  var contextMessage = "Fleet size: " + notification.fleetSize;
  var notificationOptions = {type:'basic', iconUrl:'logo-white.png', title:title, message:message, contextMessage:contextMessage}
  chrome.notifications.create(notification.fleetId, notificationOptions);
}

//=Updates the storage
// @storageKey is a string used to retrieve the right storage
// @storageIndex is an int used to retrieve the right element
// @updatedElement is the element to put in the storage
function updateStorage(storageKey, storageIndex, updatedElement)
{
  chrome.storage.local.get(storageKey, function(result)
  {
    result[storageKey][storageIndex] = updatedElement;
    chrome.storage.local.set(result, function(){console.log("Storage updated: " + storageKey);});
  });
}

//=Looks if there are any new messages or board posts
// Also updates the fleetList
function autoUpdate()
{
  var pageDOM = this.response;
  var messagesButtonHtml = $("#main-header-infobox_content .row1 .menu-item", pageDOM).eq(2).html();
  var messagesFieldHtml = $("#main-header-infobox_content .row1 .menu-item", pageDOM).eq(3).html();
  var boardButtonHtml = $("#main-header-infobox_content .row2 .menu-item", pageDOM).eq(2).html();
  var boardFieldHtml = $("#main-header-infobox_content .row2 .menu-item", pageDOM).eq(3).html();
  // Send to all tabs
  chrome.tabs.query({}, function(tabs) {
    var message = {type:"auto-update", messages:{button:messagesButtonHtml, field:messagesFieldHtml}, board:{button:boardButtonHtml, field:boardFieldHtml}};
    for (var i=0; i<tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, message);
    }
  });
  // Update fleet list
  domRequest("http://lyra.astroempires.com/fleet.aspx", fleetListUpdate);
}

//=Acesses another web page and does something
// @url a link to the webpage to visit
// @callback a function to execute on the page
function domRequest(url, callback)
{
  var req = new XMLHttpRequest();
  req.responseType = 'document';
  req.addEventListener("load", callback);
  req.open("GET", url);
  req.send();
}

// Say hi
console.log("background.js");

// Alarm listener
chrome.alarms.onAlarm.addListener(function(alarm)
{
  console.log("Alarm fired!");
  // Triggers every minute
  if(alarm.name == "auto-update")
  {
    console.log(Date.now());
    domRequest("http://lyra.astroempires.com/account.aspx", autoUpdate);
  }
  else
  {
    // Notification alarm fired, get the notificationList
    chrome.storage.local.get("notificationList", function(result)
    {
      // Name of the alarm was used as index
      var notification = result.notificationList[parseInt(alarm.name)];
      // Determine the type of notification
      switch(notification.type)
      {
        case "new_fleet_notification":
          createFleetNotification(notification);
          // Remove this notification from the list
          result.notificationList[parseInt(alarm.name)] = "";
          chrome.storage.local.set({notificationList:result.notificationList});
          break;
      }
    });
  }
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
// #update_fleet_notification updates an ongoing alarm
// #get_url sends back the page url
// #init proceeds with initializations
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {switch(request.type)
    {
      case "new_fleet_notification":
        // Object as {type, fleetId,fleetName,fleetDestination,fleetSize,notificationDate,notificationDelay}
        request.notificationDate -= 2000; // Remove some time to compensate for script response time
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
          result.notificationList[i] = request;
          // Set up an alarm for the notification
          chrome.alarms.create(i.toString(), {when:request.notificationDate}); //#DEBUG#
          console.log("Alarm set.")
          // Save the notificationList
          chrome.storage.local.set({notificationList:result.notificationList})
        });
        break;
      case "update_fleet_notification":
        // Overwrite existing alarm
        request.notificationDate -= 2000; // Remove some time to compensate for script response time
        chrome.alarms.create(request.alarmName, {when:request.notificationDate});
        // Change some values
        var alarmName = parseInt(request.alarmName);
        delete request.alarmName;
        request.type = "new_fleet_notification";
        // Update notificationList
        updateStorage("notificationList", alarmName, request)
        break;
      case "delete_fleet_notification":
        chrome.alarms.clear(request.alarmName);
        updateStorage("notificationList", parseInt(request.alarmName), "");
        break;
      case "get_url":
        chrome.tabs.get(sender.tab.id, function (tab) {
          var url = tab.url;
          sendResponse(url);
        });
        return true;
      case "init":
        console.log("init - Updating notificationList");
        chrome.alarms.clearAll(); // Clear alarms
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
        domRequest("http://lyra.astroempires.com/fleet.aspx", fleetListUpdate);
        // Auto-update messages/board status every minute
        chrome.alarms.create("auto-update", {when:Date.now(), periodInMinutes:1});
        console.log("init - Done.");
        return true;
    }
  }
);

//=Testing
/*chrome.runtime.onSuspend.addListener(function()
{
  console.log("Suspended...");
  chrome.alarms.clearAll();
})*/

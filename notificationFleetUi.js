//++ =============================== notificationUiRecall ================================ ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*                  --//
//-- This a the standard fleet screen. This script aim to update the notification if the   --//
//-- present fleet has been tracked and is recalled. The user can also choose to be        --//
//-- notified whenever a fleet a recalled.                                                 --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

//=If checked, append the url with the delay
// If unchecked, append the url with delay = -1
function changeFormAction()
{
  var delay = $("#notificationOffSetRecall").val();
  var checked = $("#notificationFleetRecall").prop('checked');
  // Change urls
  if(checked) var newUrl = defaultUrl + "&notificationDelay=" + delay;
  else var newUrl = defaultUrl + "&notificationDelay=-1";
  $("center form").attr('action', newUrl);
}

// Say hi
console.log("notificationUiRecall.js");
// Nothing to do if the fleet is not moving
if($("#timer1").length)
{
  console.log("Fleet is moving");
  // Add UI for notification on recall
  if ($("center form").length)
  {
    var form = $("center form");
    var defaultUrl = form.attr("action"); //#DEBUG#    console.log("defaultUrl: " + defaultUrl);
    changeFormAction();
    // Add the actual UI
    form.append("<div id='recallNotification' class='notify' style='display:none;'><input type='checkbox' name='be_notified' id='notificationFleetRecall' class='notificationCheckbox notification'><label for='notificationFleetRecall'>Upon recalling, be notified <input type='text' id='notificationOffSetRecall' class='input-numeric notificationInput notification' value='5'> seconds before landing</label></div>");
    // Show the notification on recall UI
    $(".input-checkbox", form).change(function()
    {
      $("#recallNotification").toggle();
    });
    // Change action url
    $(".notification", form).change(function()
    {
      changeFormAction();
    });
  }
  // Add UI to inform of current notification status
  chrome.runtime.sendMessage({type: "get_url"}, function(url)
  {
    // Default notificationStatus
    $("center").eq(1).append("<div id='currentNotification' class='notify'>You will not be notified when this fleet lands</div>");
    // Url is like: fleet.aspx?fleet=10258182&action=recall&notificationDelay=2, we want the id and notification if it's there
    var urlNumbers = url.match(/-?\d+/g);
    // Means notificationDelay was set
    if(urlNumbers.length == 2)
    {
      var notificationDelay = urlNumbers.pop(); //#DEBUG#      console.log("notificationDelay: " + notificationDelay);
      if(notificationDelay > -1) $("#currentNotification").text("You will be notified " + notificationDelay + " seconds before this fleet lands");
    }
    var currentFleetId = urlNumbers.pop();//#DEBUG#    console.log("currentFleetId: " + currentFleetId);

    // If notificationDelay wasn't found, search the chrome.storage.notificationList
    if(notificationDelay == undefined)
    {
      chrome.storage.local.get("notificationList", function(result)
      {
        for(var i = 0; i < result.notificationList.length; i++)
        {
          if(result.notificationList[i].fleetId == currentFleetId)
          {
            $("#currentNotification").text("You will be notified " + result.notificationList[i].notificationDelay + " seconds before this fleet lands");
            break;
          }
        }
      });
    }
  });
}

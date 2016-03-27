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
if ($("center form").length)
{
  console.log("Fleet is moving");
  var form = $("center form");
  var defaultUrl = form.attr("action"); //#DEBUG#    console.log("defaultUrl: " + defaultUrl);
  changeFormAction();
  // Add UI for notification on recall
  form.append("<div id='recallNotification' class='notify' style='display:none;'><input type='checkbox' name='be_notified' id='notificationFleetRecall' class='notificationCheckbox notification'><label for='notificationFleetRecall'>Upon recalling, be notified <input type='text' id='notificationOffSetRecall' class='input-numeric notificationInput notification' value='5'> seconds before landing</label></div>");
  // Show the notification on recall UI
  $(".input-checkbox", form).change(function()
  {
    $("#recallNotification").toggle();
  });
  // Change action url
  $(".notification", form).change(function()
  {
    console.log("Changed");
    changeFormAction();
  });
  // Add UI to inform of current notification status
  chrome.storage.local.get("notificationList", function(result)
  {
    var fleetId = defaultUrl.match(/\d+/).pop(); //#DEBUG#
    console.log("fleetId: " + fleetId);
    var notificationStatus = "<div class='notify'>You will not be notified when this fleet lands</div>";
    for(var i = 0; i < result.notificationList.length; i++)
    {//#DEBUG#
      console.log("result.notificationList["+ i + "].fleetId: " + result.notificationList[i].fleetId);
      if(result.notificationList[i].fleetId == fleetId)
      {
        console.log("Found!");
        notificationStatus = "<div class='notify'>You will be notified " + result.notificationList[i].notificationDelay + " seconds before this fleet lands</div>";
        break;
      }
    }
    $("center").eq(1).append(notificationStatus);
  });
}

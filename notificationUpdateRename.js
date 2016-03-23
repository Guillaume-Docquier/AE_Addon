//++ ==================================== background ===================================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/fleet.aspx?fleet=*&action=rename    --//
//-- This is the fleet renaming page. When renaming a fleet, if it is tracked for          --//
//-- notification, we must update the fleet name in storage.local.notificationList.        --//
//-- Note: submitting the form redirects to the same link, hence is the form is not        --//
//-- present nothing has to be done.                                                       --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("notificationUpdateRename.js");
var renameForm = $(".box1_content form"); //#DEBUG# console.log("renameForm: " + renameForm);
if (renameForm.attr('action') != undefined)
{
  // Find this fleet Id
  var fleetId = renameForm.attr('action').match(/\d+/).pop();//#DEBUG#
  console.log("fleetId: " + fleetId + ", " + typeof fleetId);
  // Submit button listener
  $(".input-button", renameForm).click(function()
  {
    // Find if needs to be notified
    chrome.storage.local.get('notificationList', function(result)
    {
      // Search the list for fleetId
      var indexOfFleetId = -1;
      for (var i = 0; i < result.notificationList.length; i++)
      {
        if (result.notificationList[i].notificationId == fleetId)
        {
          indexOfFleetId = i;
          break;
        }
      }
      // Nothing to do if fleetId not in the list
      if (indexOfFleetId == -1) return;

      // Gather new fleet name
      var fleetName = $(".input-text", renameForm).eq(0).val() + " " + $(".input-text", renameForm).eq(1).val(); //#DEBUG#
      console.log("fleetName: " + fleetName);
      //var notification = {notificationId:request.fleetId, notificationOptions:{type:'basic', iconUrl:'logo-white.png', title:requestTitle, message:requestMessage, contextMessage:requestContextMessage}};
      var message = result.notificationList[indexOfFleetId].notificationOptions.message; //#DEBUG#
      console.log("message: " + message);
      var newMessage = fleetName + " " + message.match(/^(has.+|will.+)/);//#DEBUG#
      console.log("newMessage: " + newMessage);
      //chrome.storage.local.set({notificationList:result.notificationList});
    });
  });
}

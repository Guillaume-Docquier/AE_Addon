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
  $(".input-button", renameForm).click(function(event)
  {
    //event.preventDefault();
    // Find if needs to be notified
    chrome.storage.local.get('notificationList', function(result)
    {
      // Search the list for fleetId
      var indexOfFleetId = -1;
      for (var i = 0; i < result.notificationList.length; i++)
      {
        if (result.notificationList[i].fleetId == fleetId)
        {
          indexOfFleetId = i;
          break;
        }
      }
      // Nothing to do if fleetId not in the list
      if (indexOfFleetId == -1) return;

      console.log("Proceed.");
      // Gather new fleet name. For the number, discard leading 0s
      var fleetNumber = $(".input-text", renameForm).eq(1).val().match(/0*(\d+)?/).pop();
      if (fleetNumber == undefined) fleetNumber = '';
      var fleetName = $(".input-text", renameForm).eq(0).val() + " " + fleetNumber; //#DEBUG#      console.log("fleetName: " + fleetName);
      // Edit the notification message
      var message = result.notificationList[indexOfFleetId].notificationOptions.message; //#DEBUG#      console.log("message: " + message);
      result.notificationList[indexOfFleetId].notificationOptions.message = fleetName + " " + message.match(/has.+|will.+/);//#DEBUG# console.log("newMessage: " + result.notificationList[indexOfFleetId].notificationOptions.message);
      // Save the modifications
      chrome.storage.local.set({notificationList:result.notificationList}, function(){
        console.log("Fleet name modified.");
      });
    });
  });
}

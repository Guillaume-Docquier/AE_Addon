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
  $("form").eq(-1).attr('action', newUrl);
}

// Say hi
console.log("notificationUiRecall.js");
// Nothing to do if the fleet is not moving
if($("#timer1").length)
{
  console.log("Fleet is moving");
  // Add UI to inform of current notification status
  var travelTimeText = $("center").eq(1).text();
  var sections = $("#background-content").children();
  sections.eq(5).remove();sections.eq(6).remove();
  $("#background-content").append("<table class='box-complex box box-compact box3 notificationWrap'> <tbody> <tr> <td> <table class='box3_box-header box-header'> <tbody> <tr> <td class='box3_box-header-left box-header-left'>&nbsp;</td><td class='box3_box-header-center box-header-center'>&nbsp;</td><td class='box3_box-header-right box-header-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box3_box-content box-content'> <tbody> <tr> <td class='box3_box-content-left box-content-left'>&nbsp;</td><td class='box3_box-content-center box-content-center'> <div class='box3_content'> <b>" + travelTimeText + "</b> <br><div id='currentNotification' class='notify'>You will not be notified when this fleet lands</div></div></td><td class='box3_box-content-right box-content-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box3_box-footer box-footer'> <tbody> <tr> <td class='box3_box-footer-left box-footer-left'>&nbsp;</td><td class='box3_box-footer-center box-footer-center'>&nbsp;</td><td class='box3_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody> </table> </td></tr></tbody></table>");
  // Update the notificationStatus inside the new UI
  chrome.runtime.sendMessage({type: "get_url"}, function(url)
  {
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
  // Add UI for notification on recall
  if ($("center form").length)
  {
    // Save the form HTML and remove it. We will place it somewhere else
    var formHtml = sections.eq(8).html();
    sections.eq(7).remove();sections.eq(8).remove();
    // Add the actual UI
    $("#background-content").append("<table class='box-complex box box-compact box3 notificationWrap'> <tbody> <tr> <td> <table class='box3_box-header box-header'> <tbody> <tr> <td class='box3_box-header-left box-header-left'>&nbsp;</td><td class='box3_box-header-center box-header-center'>&nbsp;</td><td class='box3_box-header-right box-header-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box3_box-content box-content'> <tbody> <tr> <td class='box3_box-content-left box-content-left'>&nbsp;</td><td class='box3_box-content-center box-content-center'> <div class='box3_content'> <div id='recallNotification' class='notify'><input type='checkbox' name='be_notified' id='notificationFleetRecall' class='notificationCheckbox notification'><label for='notificationFleetRecall'>Upon recalling, be notified <input type='text' id='notificationOffSetRecall' class='input-numeric notificationInput notification' value='5'> seconds before landing</label></div>" + formHtml + " </div></td><td class='box3_box-content-right box-content-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box3_box-footer box-footer'> <tbody> <tr> <td class='box3_box-footer-left box-footer-left'>&nbsp;</td><td class='box3_box-footer-center box-footer-center'>&nbsp;</td><td class='box3_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody> </table> </td></tr></tbody></table>");
    // Update the form
    var form = $("form").eq(-1);
    var defaultUrl = form.attr("action"); //#DEBUG#    console.log("defaultUrl: " + defaultUrl);
    changeFormAction();
    // Change action url when user changes notification values
    $("#recallNotification .notification").change(function()
    {
      changeFormAction();
    });
  }
}

/*
<table class='box-complex box box-compact box3 notificationWrap'>
    <tbody>
        <tr>
            <td>
                <table class='box3_box-header box-header'>
                    <tbody>
                        <tr>
                            <td class='box3_box-header-left box-header-left'>&nbsp;</td>
                            <td class='box3_box-header-center box-header-center'>&nbsp;</td>
                            <td class='box3_box-header-right box-header-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class='box3_box-content box-content'>
                    <tbody>
                        <tr>
                            <td class='box3_box-content-left box-content-left'>&nbsp;</td>
                            <td class='box3_box-content-center box-content-center'>
                                <div class='box3_content'>
                                    <div id='recallNotification' class='notify'><input type='checkbox' name='be_notified' id='notificationFleetRecall' class='notificationCheckbox notification'><label for='notificationFleetRecall'>Upon recalling, be notified <input type='text' id='notificationOffSetRecall' class='input-numeric notificationInput notification' value='5'> seconds before landing</label></div>
                                    " + formHtml + "
                                </div>
                            </td>
                            <td class='box3_box-content-right box-content-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class='box3_box-footer box-footer'>
                    <tbody>
                        <tr>
                            <td class='box3_box-footer-left box-footer-left'>&nbsp;</td>
                            <td class='box3_box-footer-center box-footer-center'>&nbsp;</td>
                            <td class='box3_box-footer-right box-footer-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
*/

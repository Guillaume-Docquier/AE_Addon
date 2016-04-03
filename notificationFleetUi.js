//++ =============================== notificationFleetUi ================================= ++//
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
console.log("notificationFleetUi.js");

// Gather information before removing html elements
var isMoving = $("#timer1").length;
var canRecall = $("center form").length;
var mustRepair = false;

// If the fleet is moving, we need the travel time and the notificationText
if(isMoving)
{
  var travelTimeText = $("#background-content").children().eq(6).text();
  var currentNotificationText = "You will not be notified when this fleet lands";
  // Gather notification delay
  chrome.runtime.sendMessage({type: "get_url"}, function(url)
  {
    // Url is like: fleet.aspx?fleet=10258182&action=recall&notificationDelay=2, we want the id and notification if it's there
    var urlNumbers = url.match(/-?\d+/g);
    // Means notificationDelay was set
    if(urlNumbers.length == 2)
    {
      var notificationDelay = urlNumbers.pop();
      if(notificationDelay > -1)
      {
        currentNotificationText = "You will be notified " + notificationDelay.toString() + " seconds before this fleet lands";
        // The asyc call might finish after the rest of the script.
        $("#currentNotification").text(currentNotificationText);
      }
    }
    var currentFleetId = urlNumbers.pop();
    // If notificationDelay wasn't found, search the chrome.storage.notificationList
    if(notificationDelay == undefined)
    {
      chrome.storage.local.get("notificationList", function(result)
      {
        for(var i = 0; i < result.notificationList.length; i++)
        {
          if(result.notificationList[i].fleetId == currentFleetId)
          {
             currentNotificationText = "You will be notified " + result.notificationList[i].notificationDelay + " seconds before this fleet lands";
             // The asyc call might finish after the rest of the script.
             $("#currentNotification").text(currentNotificationText);
            break;
          }
        }
      });
    }
  });
}

// If the fleet can be recalled, look for the recall form
if(canRecall)
{
  // Update the form action url
  var form = $("form").eq(-1);
  form.attr('id', 'recallForm');
  var defaultUrl = form.attr("action"); //#DEBUG#  console.log("defaultUrl: " + defaultUrl);
  changeFormAction();
  // Fix the recall form and save it for later
  $("#background-content").children().eq(8).children().children().eq(1).addClass('notificationCheckbox');
  $("#background-content").children().eq(8).children().children().eq(2).replaceWith("<label>Confirm recall</label>");
  $("#background-content").children().eq(8).children().children().wrapAll("<div class='notify'></div>");
  var recallForm = $("#background-content").children().eq(8).html();
}

// Information about the unit list
var fleetOverviewTable = $("#fleet_overview .box3_content").children();
var fleetCompositionRows = fleetOverviewTable.eq(1).children().children();
var shipList = [];
for(var i = 1; i < fleetCompositionRows.length; i++)
{
  var row = fleetCompositionRows.eq(i).children();
  shipList.push({name:row.eq(0).text(), amount:row.eq(1).text(), repair:row.eq(2).html()});
  // Needs repairs?
  console.log("row.eq(2).html(): " + row.eq(2).html());
  if(row.eq(2).html() != "") mustRepair = true;
}
var fleetSizeText = fleetOverviewTable.eq(3).text();
var recyclerStatusHtml = fleetOverviewTable.eq(5).html(); // Can be undefined if not present

// Information about repairs
if(mustRepair)
{
  var totalRepairsHtml = $("#background-content").children().eq(4).html();
}

// Change the page UI
console.log("Changing page UI...");
// Insert the fleet unit table
$("#fleet_overview").replaceWith("<table id='fleetOverviewBg' class='box-complex box box-full box3'><tr><td><table class='box3_box-header box-header'><tr><td class='box3_box-header-left box-header-left'>&nbsp;</td><td class='box3_box-header-center box-header-center'><div class='box3_box-title-wrapper box-title-wrapper'><div class='box3_box-title-container box-title-container'><table class='box3_box-title box-title'><tr><td class='box3_box-title-left box-title-left'>&nbsp;</td><td class='box3_box-title-center box-title-center'>Fleet Overview</td><td class='box3_box-title-right box-title-right'>&nbsp;</td></tr></table></div></div></td><td class='box3_box-header-right box-header-right'>&nbsp;</td></tr></table></td></tr><tr><td><table class='box3_box-content box-content'><tr><td class='box3_box-content-left box-content-left'>&nbsp;</td><td class='box3_box-content-center box-content-center'><div class='box3_content'><div class='box3_box-title-pad box-title-pad'>&nbsp;</div><table class='layout'><tr><td width='*' style='vertical-align: top; padding: 0px 5px 0px 5px;'><table class='layout'><tr><td style='vertical-align: top;'><br/><center id='fleetOverview'><table class='box-complex box box-compact box4' id='fleetComposition'><tbody><tr><td><table class='box4_box-header box-header'><tbody><tr><td class='box4_box-header-left box-header-left'>&nbsp;</td><td class='box4_box-header-center box-header-center'>&nbsp;</td><td class='box4_box-header-right box-header-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-content box-content'><tbody><tr><td class='box4_box-content-left box-content-left'>&nbsp;</td><td class='box4_box-content-center box-content-center box4_content'><table id='unitsTable' class='layout listing tbllisting2'><tr class='listing-header'><th>Ship</th><th>Units</th><th></th></tr></table><br/><center> " + fleetSizeText + "</center></td><td class='box4_box-content-right box-content-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-footer box-footer'><tbody><tr><td class='box4_box-footer-left box-footer-left'>&nbsp;</td><td class='box4_box-footer-center box-footer-center'>&nbsp;</td><td class='box4_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table></center><br></td></tr></table></td></tr></table></div></td><td class='box3_box-content-right box-content-right'>&nbsp;</td></tr></table></td></tr><tr><td><table class='box3_box-footer box-footer'><tr><td class='box3_box-footer-left box-footer-left'>&nbsp;</td><td class='box3_box-footer-center box-footer-center'>&nbsp;</td><td class='box3_box-footer-right box-footer-right'>&nbsp;</td></tr></table></td></tr></table>");
// Add the units to the table
if(!mustRepair)
{
  for(var i = 0; i < shipList.length; i++) {$("#fleetComposition .box-content table").append("<tr><td class='double'><b>" + shipList[i].name + "</b></td><td class='double'>" + shipList[i].amount + "</td></tr>");}
}
else for(var i = 0; i < shipList.length; i++) {$("#fleetComposition .box-content table").append("<tr><td class='triple'><b>" + shipList[i].name + "</b></td><td class='triple'>" + shipList[i].amount + "</td><td class='triple'>" + shipList[i].repair + "</td></tr>");}
// Add the recycler status
if(recyclerStatusHtml != undefined) $("#fleetComposition .box4_content").append("<br/><center>" + recyclerStatusHtml + "</center>");
// Add the repairs
if(mustRepair) $("#fleetComposition .box4_content").append("<br/><center>" + totalRepairsHtml + "</center>")
console.log("fleetComposition section");

// Add stuff if fleet is moving
if(isMoving)
{
  // Remove old UI
  $("#background-content").children().eq(5).remove();
  $("#background-content").children().eq(5).remove();
  // Add our UI
  $("#fleetOverview").append("<table class='box-complex box box-compact box4' id='fleetTravel'> <tbody> <tr> <td> <table class='box4_box-header box-header'> <tbody> <tr> <td class='box4_box-header-left box-header-left'>&nbsp;</td><td class='box4_box-header-center box-header-center'>&nbsp;</td><td class='box4_box-header-right box-header-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box4_box-content box-content'> <tbody> <tr> <td class='box4_box-content-left box-content-left'>&nbsp;</td><td class='box4_box-content-center box-content-center'> <div class='box4_content'> <b>" + travelTimeText + "</b> <br><div id='currentNotification' class='notify'>" + currentNotificationText + "</div></div></td><td class='box4_box-content-right box-content-right'>&nbsp;</td></tr></tbody> </table> </td></tr><tr> <td> <table class='box4_box-footer box-footer'> <tbody> <tr> <td class='box4_box-footer-left box-footer-left'>&nbsp;</td><td class='box4_box-footer-center box-footer-center'>&nbsp;</td><td class='box4_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table>");
  console.log("fleetTravel section");
}
// Add stuff if fleet can be recalled
if(canRecall)
{
  // Remove old UI
  $("#background-content").children().eq(5).remove();
  $("#background-content").children().eq(5).remove();
  // Add our UI
  $("#fleetOverview").append("<table class='box-complex box box-compact box4' id='fleetRecall'><tbody><tr><td><table class='box4_box-header box-header'><tbody><tr><td class='box4_box-header-left box-header-left'>&nbsp;</td><td class='box4_box-header-center box-header-center'>&nbsp;</td><td class='box4_box-header-right box-header-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-content box-content'><tbody><tr><td class='box4_box-content-left box-content-left'>&nbsp;</td><td class='box4_box-content-center box-content-center'><div class='box4_content'><div id='recallNotification' class='notify'><input type='checkbox' name='be_notified' id='notificationFleetRecall' class='notificationCheckbox notification'><label for='notificationFleetRecall'>Upon recalling, be notified <input type='text' id='notificationOffSetRecall' class='input-numeric notificationInput notification' value='5'> seconds before landing</label></div>" + recallForm + " </div></td><td class='box4_box-content-right box-content-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-footer box-footer'><tbody><tr><td class='box4_box-footer-left box-footer-left'>&nbsp;</td><td class='box4_box-footer-center box-footer-center'>&nbsp;</td><td class='box4_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table>");
  // Change action url when user changes notification values
  $("#recallNotification .notification").change(function()
  {
    changeFormAction();
  });
  console.log("fleetRecall section");
}
console.log("... complete!");

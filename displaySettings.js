//++ ================================== displaySettings ================================== ++//
//++                                                                                       ++//
//-- This script is fired on http://*.astroempires.com/account.aspx?view=display           --//
//-- This is the display settings page. The script adds an interface to allow the user to  --//
//-- manage the addon settings, such as the display of the fleet arrival time.             --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// - default value for fleet notification delay

// Say hi
console.log('displaySettings.js');
// Add a table for our settings
var settingsTableRow = $('table.layout tr', '#account_main').eq(0);//#DEBUG# console.log(settingsTableRow);
var settingsCell = settingsTableRow.children().eq(-1);
settingsCell.append("<table class='box-complex box box-compact box4' id='displaySettings'><tbody><tr><td><table class='box4_box-header box-header'><tbody><tr><td class='box4_box-header-left box-header-left'>&nbsp;</td><td class='box4_box-header-center box-header-center'>&nbsp;</td><td class='box4_box-header-right box-header-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-content box-content'><tbody><tr><td class='box4_box-content-left box-content-left'>&nbsp;</td><td class='box4_box-content-center box-content-center'><h3>AE_Addon options</h3><div class='box4_content'><input type='checkbox' name='arrival_server_time' class='arrival_time' id='arrival_server_time'>Display arrival server time.<br><input type='checkbox' name='arrival_local_time' class='arrival_time' id='arrival_local_time'>Display arrival local time.<br></div></td><td class='box4_box-content-right box-content-right'>&nbsp;</td></tr></tbody></table></td></tr><tr><td><table class='box4_box-footer box-footer'><tbody><tr><td class='box4_box-footer-left box-footer-left'>&nbsp;</td><td class='box4_box-footer-center box-footer-center'>&nbsp;</td><td class='box4_box-footer-right box-footer-right'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table>");
// Retrieve the settings
var defaultSettings = {server:false, local:false};
chrome.storage.local.get({arrivalTime:defaultSettings}, function (result)
{
  // Check the boxes according to settings
  $("#arrival_server_time").prop('checked', result.arrivalTime.server);
  $("#arrival_local_time").prop('checked', result.arrivalTime.local);
});

// Automatically save any change
$(".arrival_time").change(function() {
  // Retrieve the field values
  var arrival_server_time = $("#arrival_server_time").prop('checked');
  var arrival_local_time = $("#arrival_local_time").prop('checked');
  //#DEBUG# console.log('arrival_server_time: ' + arrival_server_time + ', arrival_local_time: ' + arrival_local_time);
  var setting = {server:arrival_server_time, local:arrival_local_time};
  // Update the local storage
  chrome.storage.local.set({'arrivalTime': setting}, function()
  {
    // Notify that we saved.
    console.log('Settings saved: ' + setting);
  });
});
/*<table class='box-complex box box-compact box4' id='displaySettings'>
    <tbody>
        <tr>
            <td>
                <table class='box4_box-header box-header'>
                    <tbody>
                        <tr>
                            <td class='box4_box-header-left box-header-left'>&nbsp;</td>
                            <td class='box4_box-header-center box-header-center'>&nbsp;</td>
                            <td class='box4_box-header-right box-header-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class='box4_box-content box-content'>
                    <tbody>
                        <tr>
                            <td class='box4_box-content-left box-content-left'>&nbsp;</td>
                            <td class='box4_box-content-center box-content-center'>
                                <h3>AE_Addon options</h3>
                                <div class='box4_content'>
                                    <input type='checkbox' name='arrival_server_time' class='arrival_time' id='arrival_server_time'> Display arrival server time.
                                    <br>
                                    <input type='checkbox' name='arrival_local_time' class='arrival_time' id='arrival_local_time'> Display arrival local time.
                                    <br>
                                </div>
                            </td>
                            <td class='box4_box-content-right box-content-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table class='box4_box-footer box-footer'>
                    <tbody>
                        <tr>
                            <td class='box4_box-footer-left box-footer-left'>&nbsp;</td>
                            <td class='box4_box-footer-center box-footer-center'>&nbsp;</td>
                            <td class='box4_box-footer-right box-footer-right'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>*/

//++ ======================================== core ======================================= ++//
//++                                                                                       ++//
//-- This script is fired on login pages. It sets justLoggedIn to true so that core.js     --//
//-- knows we just logged in and proceeds with initializations.                            --//                                              --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("login.js");
// Note that we just logged in
var url = $("form .input-button").click(function()
{
  chrome.storage.local.set({justLoggedIn:true});
})

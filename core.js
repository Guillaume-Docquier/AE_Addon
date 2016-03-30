//++ ======================================== core ======================================= ++//
//++                                                                                       ++//
//-- This script is fired on all pages. It receives messages for debugging and also does   --//
//-- some initializations if the user just logged in.                                      --//                                                            --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("core.js");
// Verify if we just logged in
chrome.storage.local.get("justLoggedIn", function(result)
{
  if (result.justLoggedIn == false) return;
  console.log("Just logged in.");
  chrome.storage.local.set({justLoggedIn:false});
  // Do any init you need
  chrome.runtime.sendMessage({type:"init"});
});

//=Listen to incoming messages
// #auto-update updates the page if there is any new message/board post
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type)
    {
    case "auto-update":
      console.log("Auto-update");
      // Update the messages/board
      $("#main-header-infobox_content .row1 .menu-item").eq(2).html(request.messages.button);
      $("#main-header-infobox_content .row1 .menu-item").eq(3).html(request.messages.field);
      $("#main-header-infobox_content .row2 .menu-item").eq(2).html(request.board.button);
      $("#main-header-infobox_content .row2 .menu-item").eq(3).html(request.board.field);
      break;
    }
  }
);

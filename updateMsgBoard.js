//++ =================================== updateMsgBoard ================================== ++//
//++                                                                                       ++//
//-- This script is fired upon visiting the messages or board pages. It updates the number --//
//-- of new messages and board posts on all other tabs.                                        --//
//++                                                                                       ++//
//++ ===================================================================================== ++//

// Say hi
console.log("updateMsgBoard.js");

chrome.runtime.sendMessage({type:"update_msg_board"});

# AE_Addon  
This is a chrome extension for Astroempires that adds functionalities to the game. Modularity will be a key aspect for the addon. By that I mean that the user should always be able to choose which functionalities he wants to use and disable anything else. Below you will find a list of the expected functionalities. These are the ideas I currently have in mind. Please note that they might not all be implemented in the future. You can however find the list of the currently implemented functionalities as well as the version history.  
If you happen to have ideas in mind, feel free to propose them!  

> Astro Empires (AE) is an Internet Browser game opened in May 2006. The game has attracted over 35,000 players since it first opened  >and has recently started play on its sixteenth server, known as Pegasus.  
>The game takes place in one universe spanning dozens of galaxies, thousands of systems and tens of thousands of worlds in which >players can build up their own Astro Empire of the stars.  
>\- Taken from the [Astroempires Wikia](http://astroempires.wikia.com/wiki/What_is_Astro_Empires)

# Key features  

## Improved UI  
AE's UI is good but is flawed in many places. I decided to correct these flaws where I could or improve the existing design in some places. For example, the fleet overview is very simple and feels a bit too basic. I added already existing styles to make it feel a lot more polished. The result is a better look and a hover effect on the ship rows so that reading those big crunchy numbers becomes easier.  
  
<img src="https://github.com/Guillaume-Docquier/AE_Addon/blob/master/screens/After_FleetOverview.png"></img>

## Notification system  
Have you ever forgot that you sent a fleet and it got destroyed by your ennemies? This dark age is now over with the Fleet Notification System™. Whenever you launch a fleet, you can decide how long before it lands you want to be notified. A notification will pop-up even if you are not on Astroempires! Moreover, if your fleet is schedueled to land in a couple of days, it will work even if you log in/out multiple times!  
  
<img src="https://github.com/Guillaume-Docquier/AE_Addon/blob/master/screens/After_FleetNotification.png"></img>

## Use only what you want!  
Because I believe in freedom and because not everyone might want all of these (awesome) features, you can choose which ones you want to use. Whenever you want, simply checkout the AE_Addon setting at the bottom of the display settings page. There, you can tick whatever feature you'd like to have.  
  
<p align="center">
<img src="https://github.com/Guillaume-Docquier/AE_Addon/blob/master/screens/Split_DisplaySettings.png" width=625px/>
</p>

# Expected functionalities
Being able to choose to be notified when  
* A building is queued or has finished
* A research is queued or has finished
* A ship construction has finished

Program afleet launch in the future    
Integrated battle calculator  
Automated technology checking and saving

# All features  
AE_Addon settings section in the display settings that allows you to enable/disable any functionality.  
See the expected arrival time (server/local time) before launching your fleet. _Requires animated server time_  
Choose to be notified before a fleet lands when moving/recalling it.  
Messages and board posts number automatically update every minute across all tabs and whenever you view them.  

### Version history (Current version: v0.5.4)  
v0.5.2
> **Modified**    
Viewing board posts and messages updates all other tabs.  

v0.5.0
> **Added**    
Message and board post number are now automatically updated every minute.  

v0.4.7
> **Modified**    
You can now choose to be notified x seconds before a fleet lands when **recalling** it.  

v0.4
> **Added**    
You can now choose to be notified x seconds before a fleet lands when moving it.  

v0.3
> **Added**    
There is now an AE_Addon settings section in the display settings that allows you to check/uncheck server/local arrival times.

v0.2
> **Modified**    
You can now see the expected arrival time (**local** time) before launching your fleet. _Requires animated server time_   

v0.1          
> **Added**   
You can now see the expected arrival time (server time) before launching your fleet. _Requires animated server time_

### Comments  
Links like "*/AE_Addon/tests/fleet_overview/*" are used to test the extension while developing it.

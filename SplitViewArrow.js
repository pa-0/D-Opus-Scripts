﻿// Automatically sets lister background to point from the source to the destination side of a dual lister view
// Allows setting different images for dark/light mode.

// Still To Do:
//   - Add proper config setting of variables
//   - See if there are any possible universal default images to use
//   - Update the arrows if the swap button is used
//   - Maybe instead of separate colors, use fillcolor

// Set arrow file names
var upImage, downImage, leftImage, rightImage;

//upImage = "Up-Vector-Arrow.svg";
//downImage = "Down-Vector-Arrow.svg"; 
//leftImage = "Left-Vector-Arrow.svg";
//rightImage = "Right-Vector-Arrow.svg";

upImage = "Up-Gray-Arrow.png";
downImage = "Down-Gray-Arrow.png";  
leftImage = "Left-Gray-Arrow.png";
rightImage = "Right-Gray-Arrow.png";

// Options
var opacityPercent = "20";
var useFill = false;
var lightModeFill = "";
var darkModeFill = "";


// Set directory with the images. Defaults to folder called "BG_Images" within the "User Data" directory opus directory
var imagesDir = "/dopusdata\\User Data\\BG_Images\\"

function OnInit(initData) {
	initData.name = "Lister Split View Arrow Indicator";
    initData.desc = "Displays an arrow (or any custom image) pointing to the destination (non-active) lister in split view.";
	initData.copyright = "ThioJoe"
	initData.version = "0.1" // Work in progress
    initData.min_version = "12.0"
    initData.default_enable = true; 
    return false;
}

function OnActivateLister(data) {
    //DOpus.Output("OnActivateLister called"); 
    // If it's not the active lister we don't care
    if (data.active == false) {
        return;
    }
    //DOpus.Output("Lister is in dual mode: " + data.lister.dual); 
    if (data.lister.dual) { 
        updateArrow(data.lister);
    } else {
        removeArrow(data.lister); 
    }
}

function OnActivateTab(data) {
    //DOpus.Output("OnActivateTab called"); 
    // Only update if the Lister containing the new active tab is in dual mode
    if (data.newtab && data.newtab.lister && data.newtab.lister.dual) { 
        updateArrow(data.newtab.lister); 
    }
}

function OnSourceDestChange(data) {
    //DOpus.Output("OnSourceDestChange called");
    if (data.tab.lister.dual) { 
		//DOpus.Output("Dual Type: " + data.tab.lister.dual);
        updateArrow(data.tab.lister); 
    }
}

function updateArrow(lister) {
    //DOpus.Output("updateArrow called");
	
    // Check if Opus is in dark mode
    var isDarkMode = DOpus.Create.SysInfo().DarkMode;

	var fillColorString=""
	if (isDarkMode && useFill == true) {
		fillColorString = ",fillcolor:" + darkModeFill;
	} else if (useFill == true) {
		fillColorString = ",fillcolor:" + lightModeFill;
	}
	DOpus.Output("Fill Color String: " + fillColorString);

    var imageName;
	if (lister.dual === 2) { // Horizontal split
	    imageName = (lister.activetab.right) ? upImage : downImage;
	} else if (lister.dual === 1) { // Vertical split
	    imageName = (lister.activetab.right) ? leftImage : rightImage;

	} else {
	    // Handle the case where the Lister is not in dual mode, if needed
	    imageName = ""; // Or set a default image if appropriate
	}

	var imagePath = DOpus.FSUtil.Resolve(imagesDir + imageName);
    //DOpus.Output("Image path: " + imagePath); 
    var cmd = DOpus.Create.Command();
	var commandString = 'Set BACKGROUNDIMAGE="filedisplay:' + imagePath + '" BACKGROUNDIMAGEOPTS=shared,center,nofade,opacity:' + opacityPercent + fillColorString;
	//DOpus.Output("Command String:  " + commandString);
	
    cmd.RunCommand(commandString);	
}

function removeArrow(lister) { 
    //DOpus.Output("removeArrow called"); 
    var cmd = DOpus.Create.Command();
    cmd.SetSourceTab(lister.activetab); 
    cmd.RunCommand('Set BACKGROUNDIMAGE="all:" BACKGROUNDIMAGEOPTS=nofade'); 
}

function OnListerUIChange(data) {
    //DOpus.Output("OnListerUIChange called"); 
    //DOpus.Output("Change type: " + data.change);
    if (data.change == "dual" || data.change == "duallayout") { 
        if (data.lister.dual) {
            updateArrow(data.lister);
        } else {
            removeArrow(data.lister); 
        }
    }
}
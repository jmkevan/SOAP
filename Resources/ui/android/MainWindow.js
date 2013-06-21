/**
 * Main UI with all the components created.
 */

//get the cloud module from the Appcelerator Titanium
var Cloud = require('ti.cloud');

/**
 * Create the main window, getting data from the server
 */
function getApplicationWindow (controller) {
	
	//main window
	var mainWindow = Ti.UI.createWindow({
	    backgroundColor: 'white',
	    navBarHidden:true
	});
	
	//top bar. Android does not have a own navigation bar, so need to be manually created
	var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:'Welcome',
	   	height:40,
	   	width:Titanium.Platform.displayCaps.platformWidth,
	   	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	   	font: { fontSize:25 }
	});
	mainWindow.add(topBar);
	
	//Main view
	var mainView = Ti.UI.createView ({
	 	backgroundColor: 'white',
	 	top: 80,
	 	left: 0,
	 	bottom: 60,
	 	width: '100%',
	 	height: '100%',
	 	layout: 'horizontal'
	}); 
    mainWindow.add(mainView);
    
    //get data from the server, and create the main cases
    Cloud.Objects.query ({
        classname: 'soap',
        where: {
            name: 'databases'
        },
    
        }, function (e) {
        if (e.success) {
        	//for each case, create the components
            for (var i = 0; i < e.soap[0].databases.length; i++) {
                var generalCaseName = e.soap[0].databases[i];
                mainView.add(createGeneralCaseIcon('/images/'+generalCaseName+'_Android.png', generalCaseName, controller));
            }
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
   		
	return mainWindow;   
}

/**
 * Create the cases with icons
 * @param {Object} image, the image of the case
 * @param {Object} generalName, the name of the case
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createGeneralCaseIcon (image, generalName, controller) {
	
	//android has different screen sizes, so get the sizes dynamically
	//is divided by two to accomodate 2 cases in one row
	var width = (Titanium.Platform.displayCaps.platformWidth - 30) / 2;
	var height = (Titanium.Platform.displayCaps.platformHeight - 180) /2;
	
	//main view for each case
	var generalTestCase = 	Ti.UI.createView ({
		top:0,
		left:10,
		width:width,
		height:height+20,
		layout: 'vertical',
	});
	
	//button with the case image
	var button = Ti.UI.createButton ({
		backgroundImage: image,
		width:width,
		height:height-25
	});
	generalTestCase.add(button);
	
	//open a new window when the image of the case (button) is clicked
	button.addEventListener('click', function(){
		var tabWindow= require('/ui/android/ApplicationWindow').createTestCases(generalName, controller);
		//Open the navigation group, passing the nav as parameter to keep navigating
    	controller.open(tabWindow);
	});
	
	//label with name of the case
	var label = Ti.UI.createLabel ({
		top:1,
		text:generalName,
		font:{fontFamily:'Helvetica', fontSize: 14},
		color:'#58595B' 
	});
	generalTestCase.add(label);
	
	return generalTestCase;
}

module.exports = getApplicationWindow;
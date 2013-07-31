var Cloud = require('ti.cloud');

//Get the names of the general cases from the server
function getApplicationWindow (controller) {
	
	var leftButton = Ti.UI.createButton ({
		title: "Log out"
	})
	
	leftButton.addEventListener('click', function(e) {
		
    	Cloud.Users.logout(function (e) {
    		if (e.success) {
    			TestflightTi.passCheckpoint("Logged Out");
				controller.navGroup.close(mainWindow);
		    } else {
		    	TestflightTi.passCheckpoint("Error Logging out");
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
    });
	/*
	 * Main Window of the app
	 */
	var mainWindow = Ti.UI.createWindow({
		title: 'Welcome',
	    backgroundColor: 'white',
	    barColor:'#024731',
	    leftNavButton:leftButton
	});
	
	//Main view
	var mainView = Ti.UI.createView ({
	 	backgroundColor: 'white',
	 	top: 39,
	 	left: 0,
	 	width: '100%',
	 	height: '100%',
	 	layout: 'horizontal'
	}); 
    
    Cloud.Objects.query ({
        classname: 'soap',
        where: {
            name: 'databases'
        },
    
        }, function (e) {
        if (e.success) {
            for (var i = 0; i < e.soap[0].databases.length; i++) {
                var generalCaseName = e.soap[0].databases[i];
                mainView.add(createGeneralCaseIcon('/images/'+generalCaseName+'_Main.png', generalCaseName, controller));
            }
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });

	mainWindow.add(mainView);
   	return mainWindow;
}

//Create each testCase and align it to the view
function createGeneralCaseIcon (image, generalName, controller) {
	var generalTestCase = 	Ti.UI.createView ({
		top:0,
		left:10,
		width:145,
		height:169,
		layout: 'vertical',
	});
	
	var button = Ti.UI.createButton ({
		image: image,
		width:145,
		height:145
	});
	
	var label = Ti.UI.createLabel ({
		top:1,
		text:generalName,
		font:{fontFamily:'Helvetica', fontSize: 14},
		color:'#58595B' 
		
	});
	
	button.addEventListener('click', function(){
		TestflightTi.passCheckpoint("Clicked on " + generalName + " cases group");
		var applicationWindow = require('/ui/iphone/ApplicationWindow').createTestCases(generalName, controller);
		//Open the navigation group, passing the nav as parameter to keep navigating
    	controller.open(applicationWindow);
	});
	
	generalTestCase.add(button);
	generalTestCase.add(label);
	
	return generalTestCase;
}

exports.getApplicationWindow = getApplicationWindow;
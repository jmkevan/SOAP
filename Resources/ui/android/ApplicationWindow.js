/**
 * unique cases with all the components created.
 */

//get the cloud module from the Appcelerator Titanium
var Cloud = require('ti.cloud');

/**
 * Create the main window, getting data from the server
 */
function getTestCases (generalNameTitle, controller) {
	
	//main window
	var mainWindow = Titanium.UI.createWindow({
        backgroundColor: 'white',
        navBarHidden:true
    });
    
    //top bar. Android does not have a own navigation bar, so need to be manually created
    var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:generalNameTitle,
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
    
    //get data from the server, and create the test cases
	Cloud.Objects.query({
	    
    classname: 'soap',
    where: {
        rootCase: generalNameTitle
    },
    order: 'created_at'
    
    }, function (e) {
        if (e.success) {
        	//for each test case, create the components
            for (var i = 0; i < e.soap.length; i++) {
                mainView.add(createTestCaseIcon('/images/'+generalNameTitle+'_Main.png', i, e.soap[i], controller));
            }
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
		
	return mainWindow;
}

/**
 * Create the test cases with icons
 * @param {Object} image, the image of the case
 * @param {Object} number, the number of the case
 * @param {Object} soapCase, all the data of the case
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createTestCaseIcon (image, number, soapCase, controller) {
	
	//android has different screen sizes, so get the sizes dynamically
	//is divided by 3 to accomodate 3 cases in one row
	var width = (Titanium.Platform.displayCaps.platformWidth - 40) / 3;
	
	//main view for each case
	var testView = 	Ti.UI.createView ({
		top:0,
		left:10,
		width:width,
		height:width+24,
		layout: 'vertical'
	});
	
	//main button with the image
	var button = Ti.UI.createButton ({
		backgroundImage: image,
		width:width,
		height:width
	});
	testView.add(button);
	
	//open a new window when the image of the case (button) is clicked
	button.addEventListener("click", function() {
		//start the SOAP with the Subjective and Objective method
		var subObj = require ('ui/android/SubjectiveObjective').createSoap(soapCase, controller);
		controller.open(subObj);
	});
	
	//label with the number of the case
	var label = Ti.UI.createLabel ({
		top:1,
		text:(number + 1),
		font:{fontFamily:'Helvetica', fontSize: 14},
		color:'#58595B' 
	});
	testView.add(label);
	
	// Store case number
	soapCase.caseNumber = label.text;
	
	// Store case label
	soapCase.caseLabel = soapCase.caseNumber + '. ' + soapCase.testcase;
	
	return testView;
}

exports.createTestCases = getTestCases;
var Cloud = require('ti.cloud');

//get information from the json file after alpha test
function getTestCases (generalNameTitle, controller) {
	
	var mainWindow = Titanium.UI.createWindow({
        title: generalNameTitle, //Sent data string from the main window after alpha test
        backgroundColor: 'white',
        barColor:'#024731',
    });
    
    mainWindow.addEventListener('close', function(e) {
		TestflightTi.passCheckpoint("Went back to Welcome Window");
    });
    
     //Main view
    var mainView = Ti.UI.createView ({
        backgroundColor: 'white',
        top: 20,
        left: 0,
        width: '100%',
        height: '100%',
        layout: 'horizontal'
    });
    
	Cloud.Objects.query({
	    
    classname: 'soap',
    where: {
        rootCase: generalNameTitle
    },
    order: 'created_at'
    
    }, function (e) {
        if (e.success) {
            for (var i = 0; i < e.soap.length; i++) {
                //var testCaseName = e.soap[i].testcase;
                mainView.add(createTestCaseIcon('/images/'+generalNameTitle+'_Main.png', i, e.soap[i], controller));
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
function createTestCaseIcon (image, number, soapCase, controller) {
	var testView = 	Ti.UI.createView ({
		top:0,
		left:20,
		width:80,
		height:104,
		layout: 'vertical'
	});
	
	var button = Ti.UI.createButton ({
		image: image,
		width:80,
		height:80
	});
	
	var label = Ti.UI.createLabel ({
		top:1,
		text:(number + 1),
		font:{fontFamily:'Helvetica', fontSize: 14},
		color:'#58595B' 
		
	});
	
	// Store case number
	soapCase.caseNumber = label.text;
	
	// Store case label
	soapCase.caseLabel = soapCase.caseNumber + '. ' + soapCase.testcase;
	
	button.addEventListener("click", function() {
		TestflightTi.passCheckpoint("Clicked on " + soapCase.testcase + " case. In S&O window.");
		var subObj = require('/ui/iphone/SubjectiveObjective').createSoap(soapCase, controller);
		controller.open(subObj);
	});
	
	testView.add(button);
	testView.add(label);
	
	return testView;
}

exports.createTestCases = getTestCases;
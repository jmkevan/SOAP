var Cloud = require('ti.cloud');

//get information from the json file after alpha test
function getTestCases (generalNameTitle) {
	
	var mainWindow = Titanium.UI.createWindow({
        title: generalNameTitle, //Sent data string from the main window after alpha test
        backgroundColor: 'white',
        barColor:'#024731',
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
    
    var nav = Titanium.UI.iPhone.createNavigationGroup ({
       window: mainWindow
    });
    	
    var navWindow = Titanium.UI.createWindow({
        navBarHidden: true
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
                var testCaseName= e.soap[i].testcase;
                mainView.add(createTestCaseIcon('/images/'+generalNameTitle+'_Main.png', testCaseName, nav, navWindow));
            }
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });

	mainWindow.add(mainView);
	navWindow.add(nav);
	return navWindow;
}

//Create each testCase and align it to the view
function createTestCaseIcon (image, testCaseName, nav, navWindow) {
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
		text:testCaseName,
		font:{fontFamily:'Helvetica', fontSize: 14},
		color:'#58595B' 
		
	});
	
	button.addEventListener("click", function() {
		var openCase = require('/ui/common/SubjectiveObjective');
		var nextWindow = openCase.createSoap(testCaseName, nav);
		Ti.API.info('nav.viewArray.length = ' + nav.viewArray.length);
		nav.viewArray.push(nextWindow);
		Ti.API.info('nav.viewArray.length = ' + nav.viewArray.length);
		nav.open(nextWindow, {animated:true});
	});
	
	testView.add(button);
	testView.add(label);
	
	return testView;
}

exports.createTestCases = getTestCases;
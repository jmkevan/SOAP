var Cloud = require('ti.cloud');

//get information from the json file after alpha test
function getTestCases (cases, controller) {
	
	var mainWindow = Titanium.UI.createWindow({
        title: cases.generalNameTitle, //Sent data string from the main window after alpha test
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
    
    var tblData = [];
    
    for (var i = 0; i < cases.length; i++) {
    	var caseInfo = cases[i];
    	var image = '/images/'+caseInfo.rootCase+'_Main.png';
        if(userInfo.casesDone.has(caseInfo.id)) {
        	image = '/images/'+caseInfo.rootCase+'_Completed.png'
        }
        //mainView.add(createTestCaseIcon(image, i, caseInfo, controller));
        tblData.push(createTestCaseIcon(image, i, caseInfo, controller));
    }
    
    Ti.API.info (tblData.length);
    var blogTable = Titanium.UI.createTableView({
        data:tblData,
        rowHeight:100,
        seperatorColor:'transparent'
    });

	mainWindow.add(blogTable);
	return mainWindow;
}

//Create each testCase and align it to the view
function createTestCaseIcon (image, number, soapCase, controller) {
	var row = Titanium.UI.createTableViewRow();
	
	var image = Ti.UI.createImageView ({
		image: image,
		width:65,
		height:65,
		left:5
	});
	
	  var textView = Ti.UI.createView ({
        layout: 'vertical',
        width:Ti.UI.FILL,
        height: Ti.UI.SIZE,
    });
	
	var title = Ti.UI.createLabel ({
		left:80,
		height:"auto",
		width:"auto",
		text:"Acute genitourinary problem in young women",
		font:{fontFamily:'Helvetica', fontSize: 14, fontWeight:'bold'},
		color:'#58595B' 		
	});
	
	var author = Ti.UI.createLabel ({
		left:80,
		height:"auto",
		width:"auto",
		text:"Alexander Cam Liu",
		font:{fontFamily:'Helvetica', fontSize: 12},
		color:'#58595B' 		
	});
	
	row.addEventListener("click", function() {
		TestflightTi.passCheckpoint("Clicked on " + soapCase.testcase + " case. In S&O window.");
		var subObj = require('/ui/iphone/SubjectiveObjective').createSoap(soapCase, controller);
		controller.open(subObj);
	});
	
	//containerView.add(button);
	//containerView.add(label);
	
	row.add(image);
	textView.add(title);
	textView.add(author);
	row.add(textView);
	//row.add(title);
	//row.add(author);
	
	return row;
}

exports.createTestCases = getTestCases;
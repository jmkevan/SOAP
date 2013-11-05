var Cloud = require('ti.cloud');

/*
 * Create the Subjective and Objective Cases
 */
function createDiscussionScreen (soapCase, controller) {
    
    var nextButton = Ti.UI.createButton ( {
    	title: 'Comments'
    });
    
    nextButton.addEventListener('click', function(e) {
    	TestflightTi.passCheckpoint("Closed " + soapCase.testcase + " case. In Comments"); 	
    	/**
      	controller.home();
      	
      	var dialog = Ti.UI.createAlertDialog({
    		ok: 'Go to Survey',
    		message: 'Thanks for testing the app. Please take few minutes to complete a survey about the usability of the app. This will provide us great feedback to improve it for future users',
    		title: 'Thank You!'
  		});
  		dialog.addEventListener('click', function(e){
  			TestflightTi.passCheckpoint("Opened up Survey"); 
    		Ti.Platform.openURL("https://docs.google.com/a/hawaii.edu/spreadsheet/viewform?fromEmail=true&formkey=dGx6RkhSTFkxSEJwRXVMYUVJSlVDTmc6MQ");
  		});
  		dialog.show();
  		**/
  		var cloud = require('/ui/common/CloudData');
		cloud.getComments (soapCase, controller);
   		
    });
    
    //Main window
    var discussionWindow = Ti.UI.createWindow ( {
        title:'Discussion',
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: nextButton
    });
    
    discussionWindow.addEventListener('close', function(e) {
		TestflightTi.passCheckpoint("Went back to Plan window");
    });
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 26,
        contentHeight: 'auto',
        bottom: 10,
        width: '100%'    
    });
    
    //Main view to hold all sub-fields
    var mainView = Titanium.UI.createView({
        top:0,
        left: 0,
        width: '100%',
        height: Titanium.UI.SIZE,
        layout: 'vertical'
    });
    
    //Test case name and number (from json file?)
    var discussionSubTitle = Ti.UI.createLabel( {
       backgroundColor: "#87898C",
       top:0,
       left:0,
       width: '100%',
       height: 25,
       text: soapCase.testcase,
       textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
       color:'white',
       font: {fontSize:14, fontFamily:'Helvetica-Light'}
        
    });
    
    for (var key in soapCase.Discussion[0])
    {
    	mainView.add(createDiscussion(key, soapCase.Discussion[0][key]));
    }

    discussionWindow.add(discussionSubTitle);
    scrollView.add(mainView);
    discussionWindow.add(scrollView);
    return discussionWindow;
};

function createDiscussion (caseName, caseInfo) {

    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: 'white',
        borderRadius: 5,
        expanded:true
    });

    var nameLabel = Ti.UI.createLabel ({
        left: 10,
        top: 15,
        font: {fontWeight:'semibold', fontFamily:'Helvetica', fontSize: 14},
        text:  caseName
    });
    
    var infoLabel = Ti.UI.createLabel ({
        left: 10,
        top: 44,
        right: 10,
        font: {fontFamily:'Helvetica-Light'},
        text:  caseInfo  + "\n\n"
    });
    
    var arrowImage = Ti.UI.createLabel ({
        top:15,
        right:10,
        backgroundImage: '/images/DownArrow.png',
        width:16,
        height:11
    });

    subField.addEventListener('click', function() {
        if(subField.expanded) {
            subField.setHeight(44);
            subField.expanded = false;
            arrowImage.setBackgroundImage('/images/Arrow.png');
            arrowImage.setWidth(11);
            arrowImage.setHeight(16);
        }
        else {
            subField.setHeight(Ti.UI.SIZE);
            subField.expanded = true; 
            arrowImage.setBackgroundImage('/images/DownArrow.png');
            arrowImage.setWidth(16);
            arrowImage.setHeight(11);
        }
           
    });
  
    subField.add(nameLabel);
    subField.add(arrowImage);
    subField.add(infoLabel);

    return subField;

};

exports.createDiscussionScreen = createDiscussionScreen;
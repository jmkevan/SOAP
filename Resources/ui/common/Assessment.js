var Cloud = require('ti.cloud');

/*
 * Create the Assessment Screen
 */
function createAssessmentScreen(testCaseName) {

    var nextButton = Ti.UI.createButton ( {
    	systemButton: Ti.UI.iPhone.SystemButton.DONE
    });
    
    nextButton.addEventListener('click', function(e)
    {
    	//var assessmentScreen = require('/ui/common/Assessment');
		//nav.open(assessmentScreen.createAssessmentScreen(testCaseName), {animated:true});
    });
    
    //Main window
    var aWindow = Ti.UI.createWindow ( {
        title:testCaseName,
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: nextButton,
        layout: 'vertical'
    });
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 5,
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
    var aSubTitle = Ti.UI.createLabel( {
       backgroundColor: "#87898C",
       top:0,
       left:0,
       width: '100%',
       height: 25,
       text: 'Case Title and Number',
       textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
       color:'white',
       font: {fontSize:14, fontFamily:'Helvetica-Light'}
        
    });
    
    var aInstructions = Ti.UI.createLabel( {
       top:10,
       left:10,
       width: '100%',
       text: 'Select the most appropriate diagnosis',
       font: {fontSize:14, fontFamily:'Helvetica-Light'}
    });

    Cloud.Objects.query({
        
    classname: 'soap',
    where: {
        testcase: testCaseName
    },
    limit: 1
    
    }, function (e) {
        if (e.success) {
            mainView.add(createAssessmentUI(e.soap[0].Assestment));
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });

    aWindow.add(aSubTitle);
    aWindow.add(aInstructions);
    scrollView.add(mainView);
    aWindow.add(scrollView);
    return aWindow;
};

function createAssessmentUI (caseInfo) {
	
	var theButtons = new Array();
	
    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: 'white',
        borderRadius: 5,
        expanded:false,
        layout: 'vertical',
        buttonList : null
    });

	var topBuffer = Ti.UI.createView({
		height: 8	
	});
	subField.add(topBuffer);
	
	for(i=0; i < caseInfo.length; i++)
	{
		Ti.API.info('In the loop array. This is loop ' + i);
		var optionContainer = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'horizontal'
		});
	
		var optionButton = Ti.UI.createButton({
			left: 10,
			top: 5,
			width: 15,
			height: 15,
			borderWidth: 1,
			borderColor: 'black',
			backgroundColor: 'white',
			backgroundImage: null
		});
		theButtons.push(optionButton);
		Ti.API.info('subFields # of optionButtons = ' + theButtons.length);
		Ti.API.info('subField.buttons[i] = ' + theButtons[i]);
		
		optionButton.addEventListener('click', function(e){
			if(e.source.backgroundColor == 'white')
			{
				for(x=0; x < subField.buttonList.length; x++)
				{
					subField.buttonList[x].backgroundColor = 'white';
				}
				
				e.source.backgroundColor = 'green';
			} else {
				e.source.backgroundColor = 'white';
			}

		});
		
		var optionTitle = Ti.UI.createLabel({
			left:7,
			top: 3,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			text: caseInfo[i].assestTitle,
			font: {fontWeight:'semibold', fontFamily:'Helvetica', fontSize: 14}	
		});
		
		optionContainer.add(optionButton);
		optionContainer.add(optionTitle);
		subField.add(optionContainer);
		
		var optionFeedback = Ti.UI.createLabel({
			text: caseInfo[i].assestText,
			top:5,
			left:32,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			font: {fontFamily:'Helvetica-Light'}
		});
		subField.add(optionFeedback);
				
		var bottomBuffer = Ti.UI.createView({
			height: 8	
		});
		subField.add(bottomBuffer);		
	}
	
	subField.buttonList = theButtons;
	/*
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
        text:  caseInfo
    });
    
    var arrowImage = Ti.UI.createLabel ({
        top:15,
        right:10,
        backgroundImage: '/images/Arrow.png',
        width:11,
        height:16
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
	*/
    return subField;

};

exports.createAssessmentScreen = createAssessmentScreen;
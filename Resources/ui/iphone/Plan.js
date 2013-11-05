var Cloud = require('ti.cloud');

/*
 * Create the Subjective and Objective Cases
 */
function createPlanScreen (soapCase, controller) {
    
    var nextButton = Ti.UI.createButton ( {
    	title: 'Next'
    });
    
    nextButton.addEventListener('click', function(e) {
    	TestflightTi.passCheckpoint("In Discussion window");
    	
    	//if no cases had been completed
    	if (userInfo.casesDone.length == 0) {
			//Adding the id case to the user cloud data
	    	userInfo.casesDone.push(soapCase.id);	
	    	var cloud = require('/ui/common/CloudData');
			cloud.addCaseDone();
    	}
    	//Check if case is done previously
    	//if not, add the case id to the user cloud data
    	else {
    		for (var i = 0; i < userInfo.casesDone.length; i++) {
    			caseDone = userInfo.casesDone[i];
    			if(caseDone === soapCase.id) {
    				break;
    			}
	    		if(i == userInfo.casesDone.length - 1) {
	    			//Adding the id case to the user cloud data
			    	userInfo.casesDone.push(soapCase.id);	
			    	var cloud = require('/ui/common/CloudData');
					cloud.addCaseDone();
	    		}
	    	}
    	}
    	

    	var discussionScreen = require('/ui/iphone/Discussion').createDiscussionScreen(soapCase, controller);
		controller.open(discussionScreen);
    });
    
    //Main window
    var planWindow = Ti.UI.createWindow ( {
        title:'Plan',
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: null
    });
    
    planWindow.addEventListener('close', function(e) {
		TestflightTi.passCheckpoint("Went back to Assessment window");
    });
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 26,
        contentHeight: 'auto',
        bottom: 10,
        width: '100%',
        layout: 'vertical'    
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
    var planSubTitle = Ti.UI.createLabel( {
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
    
	var submitPlan = Ti.UI.createButton({
		title: 'Submit',
		top:10,
		right:10,
		height:30,
		visible:true,
		enabled:false,
		rxSelected:false,
		dxSelected:false,
		edSelected:false,
		followUpSelected:false
	});
	   
    for (var i = 0; i < soapCase.Plan.length; i++) {
        mainView.add(createPlan(soapCase.Plan[i], submitPlan));
    }
	
	submitPlan.addEventListener('click', function(e){
		TestflightTi.passCheckpoint("Clicked Submit button in Plan");
		planWindow.rightNavButton = nextButton;
		scrollView.scrollTo(0,0);
		Ti.App.fireEvent('showAssessmentFeedback', null);
		submitPlan.visible = false;	
	});
	
    planWindow.add(planSubTitle);
    scrollView.add(mainView);
    scrollView.add(submitPlan);
    planWindow.add(scrollView);
    return planWindow;
};

function createPlan (caseInfo, submitPlan) {

    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: 42,
        backgroundColor: 'white',
        borderRadius: 5,
        layout: 'vertical',
        collapsedCounter: 0,
        expandedCounter: 0
        
    });

	var planTypeContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		expanded:false
	});
	subField.add(planTypeContainer);

    var nameLabel = Ti.UI.createLabel ({
        left: 10,
        top: 15,
        font: {fontWeight:'semibold', fontFamily:'Helvetica', fontSize: 14},
        text:  caseInfo['planTitle']
    });
    planTypeContainer.add(nameLabel);
    
    var arrowImage = Ti.UI.createLabel ({
        top:15,
        right:10,
        backgroundImage: '/images/Arrow.png',
        width:11,
        height:16
    });
    planTypeContainer.add(arrowImage);

    planTypeContainer.addEventListener('click', function() {
        if(planTypeContainer.expanded) {
        	subField.collapsedCounter += 1;
        	TestflightTi.passCheckpoint(nameLabel.text  + " collapsed " + subField.collapsedCounter + " times.");
            subField.setHeight(42);
            planTypeContainer.expanded = false;
            arrowImage.setBackgroundImage('/images/Arrow.png');
            arrowImage.setWidth(11);
            arrowImage.setHeight(16);
        }
        else {
        	subField.expandedCounter += 1;
        	TestflightTi.passCheckpoint(nameLabel.text  + " expanded " + subField.expandedCounter + " times.");
            subField.setHeight(Ti.UI.SIZE);
            planTypeContainer.expanded = true; 
            arrowImage.setBackgroundImage('/images/DownArrow.png');
            arrowImage.setWidth(16);
            arrowImage.setHeight(11);
        }
           
    });
    
    for(var i = 0; i < caseInfo['options'].length; i++)
    {
    	var optionContainerView = Ti.UI.createView({
			id: 'optionContainerView',
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical',
			top:10
		});
		subField.add(optionContainerView);
		
		var optionView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			touchEnabled:false
		});
		optionContainerView.add(optionView);
		
		var optionButton = Ti.UI.createButton({
			id: i,
			left: 10,
			top: 5,
			width: 16,
			height: 16,
			borderWidth: 1,
			borderColor: 'black',
			backgroundColor: 'white',
			backgroundImage: '/images/noSelection.png',
			correctAnswer: caseInfo['options'][i].isCorrect
		});
		optionView.add(optionButton);
		
		var optionTitle = Ti.UI.createLabel({
			left: 31,
			top: 3,
			right: 1,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			text: caseInfo['options'][i].text,
			font: {fontWeight:'semibold', fontFamily:'Helvetica', fontSize: 14},
			touchEnabled: false	
		});
		optionView.add(optionTitle);
		
		var feedbackView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			touchEnabled:false
		});
		optionContainerView.add(feedbackView);
		
		var optionFeedback = Ti.UI.createLabel({
			id: 'optionFeedback',
			top:15,
			bottom:10,
			left:30,
			right:10,
			width: Ti.UI.FILL,
			height: 0,
			font: {fontWeight:'semibold', fontFamily:'Helvetica-Light', fontSize: 14},
			touchEnabled: false,
			text: caseInfo['options'][i].feedback
		});
		feedbackView.add(optionFeedback);

		optionContainerView.elements = {'button' : optionButton, 'feedback' : optionFeedback};

		optionContainerView.addEventListener('click', function(e){

			switch(caseInfo['planTitle'])
			{
				case 'RX' :
					submitPlan.rxSelected = true;
					break;
				case 'ED' :
					submitPlan.edSelected = true;
					break;
				case 'DX' :
					submitPlan.dxSelected = true;
					break;
				case 'Follow-up' :
					submitPlan.followUpSelected = true;
					break;
			}

			if(submitPlan.rxSelected && submitPlan.edSelected && submitPlan.dxSelected && submitPlan.followUpSelected)
			{
				submitPlan.enabled = true;
			}
			
			Ti.App.fireEvent('clearOptionButtons' + caseInfo['planTitle'], {button: e.source.elements["button"].id});				
		});
		
	}
	
	Ti.App.addEventListener('clearOptionButtons' + caseInfo['planTitle'], function(data){
		var subChildren = subField.children;
		
		for(var x=0; x < subChildren.length; x++)
		{
			if(subChildren[x].elements !== undefined)
			{
				subChildren[x].elements["button"].backgroundImage = '/images/noSelection.png';
				
				if(subChildren[x].elements["button"].id == data.button)
				{
					subChildren[x].elements["button"].backgroundImage = '/images/selectionIcon.png';
				}
			}
		}
	});

	Ti.App.addEventListener('showAssessmentFeedback', function(data){
		
		subField.setHeight(Ti.UI.SIZE);
        planTypeContainer.expanded = true; 
        arrowImage.setBackgroundImage('/images/DownArrow.png');
        arrowImage.setWidth(16);
        arrowImage.setHeight(11);

		var subChildren = subField.children;
		var correct = true;

		for(var x=0; x < subChildren.length; x++)
		{
			if(subChildren[x].elements !== undefined)
			{

				if(subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == true)
				{
					subChildren[x].elements["button"].backgroundImage = '/images/correctSelection.png';
				} else if(subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == false)
				{
					subChildren[x].elements["button"].backgroundImage = '/images/wrongSelection.png';
					correct = false;
				}
				
				//subChildren[x].elements["feedback"].text = subChildren[x].elements["feedback"].feedback;
				subChildren[x].elements["feedback"].setHeight(Ti.UI.SIZE);
				
				if(submitPlan.visible == true)
				{
					submitPlan.visible = false;
				}					
			}

		}
		
		if(correct)
			TestflightTi.passCheckpoint(nameLabel.text + " choice is correct");
		else
			TestflightTi.passCheckpoint(nameLabel.text + " choice is NOT correct");	
		
	});

    return subField;

};

exports.createPlanScreen = createPlanScreen;
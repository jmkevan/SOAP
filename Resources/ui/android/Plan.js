/*
 * Create the Assessment UI
 */

/**
 * create the Assessment window with all the components
 * @param {Object} soapCase, the case with all the assessment data
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createPlanScreen (soapCase, controller) {
    
    //Main window
    var planWindow = Ti.UI.createWindow ( {
       	navBarHidden:true,
        backgroundColor: '#E6E7E8'
    });
    
    //top bar. Android does not have a own navigation bar, so need to be manually created
    var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:"Plan",
	   	height:40,
	   	width:'100%',
	   	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	   	font: { fontSize:25 }
	});
	planWindow.add(topBar);
	
	//Next button to go to the next window
	var nextButton = Ti.UI.createButton ( {
    	title: 'Next',
    	right: 10,
    	top: 2,
    	height : 40,
    	font: {fontSize:12, fontFamily:'Helvetica-Light'},
    	borderRadius: 10
    });
    
    //open the Discussion UI when the image of the case (button) is clicked
    nextButton.addEventListener('click', function(e) {
    	var discussionScreen = require('/ui/android/Discussion').createDiscussionScreen(soapCase, controller);
    	controller.open(discussionScreen);
    });
	
	//Test case name and number
    var planSubTitle = Ti.UI.createLabel( {
       backgroundColor: "#87898C",
       top:40,
       left:0,
       width: '100%',
       height: 25,
       text: soapCase.caseLabel,
       textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
       color:'white',
       font: {fontSize:14, fontFamily:'Helvetica-Light'} 
    });
    planWindow.add(planSubTitle);
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 65,
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
    scrollView.add(mainView);
    
     //button to submit the answer
    //button is not enabled until the users has selected an option 
	var submitPlan = Ti.UI.createButton({
		title: 'Submit',
		top:10,
		right:10,
		height:40,
		font: {fontSize:12, fontFamily:'Helvetica-Light'},
		borderRadius: 10,
		visible:true,
		enabled:false,
		rxSelected:false,
		dxSelected:false,
		edSelected:false,
		followUpSelected:false
	});
	scrollView.add(submitPlan);
	
	submitPlan.addEventListener('click', function(e) {
		planWindow.add(nextButton);
		scrollView.scrollTo(0,0);
		Ti.App.fireEvent('showAssessmentFeedback', null);
		submitPlan.visible = false;	
	});
	
	//create all the plans   
    for (var i = 0; i < soapCase.Plan.length; i++) {
        mainView.add(createPlan(soapCase.Plan[i], submitPlan));
    }
	
    planWindow.add(scrollView);
    
    return planWindow;
};

/**
 * Create the assessments with all the options
 * @param {Object} caseInfo, the Plans info
 * @param {Object} submitPlan, the submit button 
 */
function createPlan (caseInfo, submitPlan) {
	
	//create the subfield view
    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: 42,
        backgroundColor: 'white',
        borderRadius: 5,
        layout: 'vertical'
    });
	
	//container for the each option in a plan
	var planTypeContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		expanded:false
	});
	subField.add(planTypeContainer);
	
	//name of the plan
    var nameLabel = Ti.UI.createLabel ({
    	color: 'black',
        left: 10,
        top: 15,
        font: {fontWeight:'bold', fontFamily:'Helvetica', fontSize: 14},
        text:  caseInfo['planTitle']
    });
    planTypeContainer.add(nameLabel);
    
    //an arrow image
    var arrowImage = Ti.UI.createLabel ({
        top:15,
        right:10,
        backgroundImage: '/images/Arrow.png',
        width:11,
        height:16
    });
    planTypeContainer.add(arrowImage);
	
	//expand the subfield listener with is touched
    planTypeContainer.addEventListener('click', function() {
        if(planTypeContainer.expanded) {
            subField.setHeight(42);
            planTypeContainer.expanded = false;
            arrowImage.setBackgroundImage('/images/Arrow.png');
            arrowImage.setWidth(11);
            arrowImage.setHeight(16);
        }
        else {
            subField.setHeight(Ti.UI.SIZE);
            planTypeContainer.expanded = true; 
            arrowImage.setBackgroundImage('/images/DownArrow.png');
            arrowImage.setWidth(16);
            arrowImage.setHeight(11);
        }
           
    });
    
    //behavior of the options in each plan
    for(var i = 0; i < caseInfo['options'].length; i++) {
    	var optionContainerView = Ti.UI.createView({
			id: 'optionContainerView',
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical',
			top:10
		});
		subField.add(optionContainerView);
		
		//container for the options
		var optionView = Ti.UI.createView({
			touchEnabled:false
		});
		optionContainerView.add(optionView);
		
		//a square button
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
		
		//the option title
		var optionTitle = Ti.UI.createLabel({
			color:'black',
			left:30,
			top: 5,
			right:5,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			text: caseInfo['options'][i].text,
			font: {fontWeight:'bold', fontFamily:'Helvetica-Light', fontSize: 14},
			touchEnabled: false	
		});
		optionView.add(optionTitle);
		
		//the feedback for each option
		var feedbackView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			touchEnabled:false
		});
		optionContainerView.add(feedbackView);
		
		//feedback info
		var optionFeedback = Ti.UI.createLabel({
			color: 'black',
			id: 'optionFeedback',
			top:15,
			bottom:10,
			left:25,
			right:10,
			width: Ti.UI.FILL,
			height: 0,
			font: {fontStyle:'italic', fontFamily:'Georgia-Italic', fontSize: 14},
			touchEnabled: false,
			text: caseInfo['options'][i].feedback
		});
		feedbackView.add(optionFeedback);
		
		//add elements to the whole container
		optionContainerView.elements = {'button' : optionButton, 'feedback' : optionFeedback};
		
		//listener for the options for each plan
		optionContainerView.addEventListener('click', function(e) { 

			switch(caseInfo['planTitle']) {
				case 'RX' :
					submitPlan.rxSelected = true;
					break;
				case 'ED' :
					submitPlan.edSelected = true;
					break;
				case 'DX' :
					submitPlan.dxSelected = true;
					break;
				case 'Follow up' :
					submitPlan.followUpSelected = true;
					break;
			}
			
			//if all plans has at least one option selected, enable the submit button
			if(submitPlan.rxSelected && submitPlan.edSelected && submitPlan.dxSelected && submitPlan.followUpSelected) {
				submitPlan.enabled = true;
			}
			
			//fire the event
			Ti.App.fireEvent('clearOptionButtons' + caseInfo['planTitle'], {button: e.source.elements['button'].id});				
		});
		
	}
	
	//listener for the button to act as a radio button
	Ti.App.addEventListener('clearOptionButtons' + caseInfo['planTitle'], function(data) {
		var subChildren = subField.children;
		
		for(var x=0; x < subChildren.length; x++) {
			if(subChildren[x].elements !== undefined) {
				subChildren[x].elements["button"].backgroundImage = '/images/noSelection.png';
				
				if (subChildren[x].elements["button"].id == data.button) {
					subChildren[x].elements["button"].backgroundImage = '/images/selectionIcon.png';
				}
			}
		}
	});
	
	///fireevent 'showAssessmentFeedback' to show the feedbacks and see which one is the correct one
	Ti.App.addEventListener('showAssessmentFeedback', function(data) {
		var subChildren = subField.children;

		for(var x=0; x < subChildren.length; x++) {
			if(subChildren[x].elements !== undefined) {

				if(subChildren[x].elements["button"].correctAnswer == true) {
					subChildren[x].elements["button"].backgroundImage = '/images/correctSelection.png';
				} 
				else if(subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == false) {
					subChildren[x].elements["button"].backgroundImage = '/images/wrongSelection.png';
				}
				//subChildren[x].elements["feedback"].text = subChildren[x].elements["feedback"].feedback;
				subChildren[x].elements["feedback"].setHeight(Ti.UI.SIZE);
				
				if(submitPlan.visible == true) {
					submitPlan.visible = false;
				}					
			}
		}	
		
	});

    return subField;

};

exports.createPlanScreen = createPlanScreen;
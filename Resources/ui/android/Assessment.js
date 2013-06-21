/*
 * Create the Assessment UI
 */

/**
 * create the Assessment window with all the components
 * @param {Object} soapCase, the case with all the assessment data
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createAssessmentScreen(soapCase, controller) {

    //Main window
    var aWindow = Ti.UI.createWindow ( {
       	navBarHidden:true,
        backgroundColor: '#E6E7E8'
    });
    
    //top bar. Android does not have a own navigation bar, so need to be manually created
    var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:"Assessment",
	   	height:40,
	   	width:'100%',
	   	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	   	font: { fontSize:25 }
	});
	aWindow.add(topBar);
	
	//Next button to go to the next window
	var nextButton = Ti.UI.createButton ( {
    	title: 'Next',
    	right: 10,
    	top: 2,
    	height : 40,
    	font: {fontSize:12, fontFamily:'Helvetica-Light'},
    	borderRadius: 10
    });
    
    //open the Plan UI when the image of the case (button) is clicked
    nextButton.addEventListener('click', function(e)
    {
    	var planScreen = require('/ui/android/Plan').createPlanScreen(soapCase, controller);
    	controller.open(planScreen);
    });
	
	//Test case name and number
    var aSubTitle = Ti.UI.createLabel( {
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
    aWindow.add(aSubTitle);
    
    //Instructions to the user to select one option
    var aInstructions = Ti.UI.createLabel( {
       color: 'black',
       top:75,
       left:10,
       width: '100%',
       text: 'Select the most appropriate diagnosis',
       font: {fontSize:14, fontFamily:'Helvetica-Light'}
    });
    aWindow.add(aInstructions);
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 90,
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
	var submitAssessment = Ti.UI.createButton({
		title: 'Submit',
		top:10,
		right:10,
		height:40,
		enabled:false,
		visible:true,
		font: {fontSize:12, fontFamily:'Helvetica-Light'},
		borderRadius: 10
	});
	scrollView.add(submitAssessment);
	
	submitAssessment.addEventListener('click', function(e){
		//add the next button when the user has clicked the submit button
		aWindow.add(nextButton);
		//fire the 'showAssesstmentFeedBack' event
		Ti.App.fireEvent('showAssessmentFeedback', null);
		//once clicked, again do not enable the submit button
		submitAssessment.enabled = false;
	});
	
	//create the options in a view container
	mainView.add(createAssessmentUI(soapCase.Assestment, submitAssessment));
	
	aWindow.add(scrollView);
    
    return aWindow;
};

/**
 * Create the assessment options with their feedbacks
 * @param {Object} caseInfo, the Assessment info
 * @param {Object} submitButton, the submit button to add listeners to it
 */
function createAssessmentUI (caseInfo, submitButton) {
	
	//create the subfield view
    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: 'white',
        borderRadius: 5,
        expanded:false,
        layout: 'vertical'
    });
	
	//Iterate through the options and create the components for them
	for (i=0; i < caseInfo.length; i++) {
		
		//container for the options and feedback
		var optionContainerView = Ti.UI.createView({
			id: 'optionContainerView',
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical',
			top:5,
			bottom:7
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
			touchEnabled: false,
			correctAnswer: caseInfo[i].isCorrect
		});
		optionView.add(optionButton);
		
		//the option title
		var optionTitle = Ti.UI.createLabel({
			color:'black',
			left: 30,
			top: 5,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			text: caseInfo[i].assestTitle,
			font: {fontWeight:'bold', fontFamily:'Helvetica-Light', fontSize: 14},
			touchEnabled: false	
		});
		optionView.add(optionTitle);
		
		//container for the feedback
		var feedbackView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			touchEnabled:false
		});
		optionContainerView.add(feedbackView);
		
		//feedback info
		var optionFeedback = Ti.UI.createLabel({
			color:'black',
			id: 'optionFeedback',
			text: '',
			top:10,
			left:25,
			right: 10,
			width: Ti.UI.FILL,
			height: 0,
			font: {fontFamily:'Georgia-Italic', fontSize: 14},
			touchEnabled: false,
			text: caseInfo[i].assestText
		});
		feedbackView.add(optionFeedback);
	
		//add elements to the whole container
		optionContainerView.elements = {'button' : optionButton, 'feedback' : optionFeedback};
		
		//listener for the buttons
		optionContainerView.addEventListener('click', function(e) {
			if(submitButton.visible == true){ 
				Ti.App.fireEvent('clearOptionButtons', {button: e.source.elements["button"].id});	
			}				
		});
		
	}
	
	//fireevent 'clearOptionButtons' to work as radio buttons for each subfield
	Ti.App.addEventListener('clearOptionButtons', function(data){ 
		var subChildren = subField.children;
		
		if(subChildren) {
			for(var x=0; x < subChildren.length; x++) {
				subChildren[x].elements["button"].backgroundImage = '/images/noSelection.png';
			}
			subChildren[data.button].elements["button"].backgroundImage = '/images/selectionIcon.png';	
		}
		
		if(submitButton.enabled == false) {
			submitButton.enabled = true;
		}
		
	});
	
	//fireevent 'showAssessmentFeedback' to show the feedbacks and see which one is the correct one
	Ti.App.addEventListener('showAssessmentFeedback', function(data){
		var subChildren = subField.children;
		
		if(subChildren) {
			for(var x=0; x < subChildren.length; x++) {
				if(subChildren[x].elements["button"].correctAnswer == true) {
					subChildren[x].elements["button"].backgroundImage = '/images/correctSelection.png';
				} 
				else if (subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == false) {
					subChildren[x].elements["button"].backgroundImage = '/images/wrongSelection.png';
				}
				//subChildren[x].elements["feedback"].text = subChildren[x].elements["feedback"].feedback;
				subChildren[x].elements["feedback"].setHeight(Ti.UI.SIZE);
			}
			
			if(submitButton.visible == true) {
				submitButton.visible = false;
			}
		}		
	});
	
    return subField;

};

exports.createAssessmentScreen = createAssessmentScreen;
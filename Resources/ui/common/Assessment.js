var Cloud = require('ti.cloud');

/*
 * Create the Assessment Screen
 */
function createAssessmentScreen(soapCase, nav) {

    var nextButton = Ti.UI.createButton ( {
    	title: 'Next'
    });
    
    nextButton.addEventListener('click', function(e)
    {
    	var planScreen = require('/ui/common/Plan');
		var nextWindow = planScreen.createPlanScreen(soapCase.testcase, nav);
		nav.plan = nextWindow;
		nav.open(nextWindow, {animated:true});
    });
    
    //Main window
    var aWindow = Ti.UI.createWindow ( {
        title:'Assessment',
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: null,
        layout: 'vertical'
    });
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 5,
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
    var aSubTitle = Ti.UI.createLabel( {
       backgroundColor: "#87898C",
       top:0,
       left:0,
       width: '100%',
       height: 25,
       text: soapCase.caseLabel,
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

    mainView.add(createAssessmentUI(soapCase.Assestment));

	var submitAssessment = Ti.UI.createButton({
		title: 'Submit',
		top:10,
		right:10,
		height:30,
	});
	
	submitAssessment.addEventListener('click', function(e){
		aWindow.rightNavButton = nextButton;
		Ti.App.fireEvent('showAssessmentFeedback', null);
		submitAssessment.enabled = false;
	});
	
    aWindow.add(aSubTitle);
    aWindow.add(aInstructions);
    scrollView.add(mainView);
    scrollView.add(submitAssessment);
    aWindow.add(scrollView);
    return aWindow;
};

function createAssessmentUI (caseInfo) {
	
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

	for(i=0; i < caseInfo.length; i++)
	{
		var optionContainerView = Ti.UI.createView({
			id: 'optionContainerView',
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical',
			top:4
		});
		subField.add(optionContainerView);
		
		var optionView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'horizontal',
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
			touchEnabled: false,
			correctAnswer: caseInfo[i].isCorrect
		});
		optionView.add(optionButton);
		
		var optionTitle = Ti.UI.createLabel({
			left:5,
			top: 3,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			text: caseInfo[i].assestTitle,
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
			text: '',
			top:5,
			left:45,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			font: {fontFamily:'Helvetica-Light'},
			touchEnabled: false,
			feedback: caseInfo[i].assestText
		});
		feedbackView.add(optionFeedback);

		optionContainerView.elements = {'button' : optionButton, 'feedback' : optionFeedback};

		optionContainerView.addEventListener('click', function(e){
			Ti.App.fireEvent('clearOptionButtons', {button: e.source.elements["button"].id});				
		});
		
	}
	
	Ti.App.addEventListener('clearOptionButtons', function(data){
		var subChildren = subField.children;
		if(subChildren)
		{
			for(var x=0; x < subChildren.length; x++)
			{
				subChildren[x].elements["button"].backgroundImage = '/images/noSelection.png';
			}
			subChildren[data.button].elements["button"].backgroundImage = '/images/selectionIcon.png';	
		}
	});

	Ti.App.addEventListener('showAssessmentFeedback', function(data){
		var subChildren = subField.children;
		if(subChildren)
		{
			for(var x=0; x < subChildren.length; x++)
			{
				if(subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == true)
				{
					subChildren[x].elements["button"].backgroundImage = '/images/correctSelection.png';
				} else if(subChildren[x].elements["button"].backgroundImage == '/images/selectionIcon.png' && subChildren[x].elements["button"].correctAnswer == false)
				{
					subChildren[x].elements["button"].backgroundImage = '/images/wrongSelection.png';
				}
				
				subChildren[x].elements["feedback"].text = subChildren[x].elements["feedback"].feedback;
			}
		}		
	});
	
    return subField;

};

exports.createAssessmentScreen = createAssessmentScreen;
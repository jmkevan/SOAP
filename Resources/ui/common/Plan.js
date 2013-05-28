var Cloud = require('ti.cloud');

/*
 * Create the Subjective and Objective Cases
 */
function createPlanScreen (testCaseName, nav) {
    
    var nextButton = Ti.UI.createButton ( {
    	title: 'Next'
    });
    
    nextButton.addEventListener('click', function(e)
    {
    	var discussionScreen = require('/ui/common/Discussion');
		var nextWindow = discussionScreen.createDiscussionScreen(testCaseName, nav);
		nav.discussion = nextWindow
		nav.open(nextWindow, {animated:true});
    });
    
    //Main window
    var planWindow = Ti.UI.createWindow ( {
        title:testCaseName,
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: null
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
       text: 'Case Title and Number',
       textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
       color:'white',
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
            //var test = JSON.stringify(e.soap[0]);
            mainView.add(createPlan(e.soap[0].Plan[0]));
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
    
	var submitPlan = Ti.UI.createButton({
		title: 'Submit',
		top:5,
		right:10
	});
	
	submitPlan.addEventListener('click', function(e){
		planWindow.rightNavButton = nextButton;
		Ti.App.fireEvent('showAssessmentFeedback', null);
	});
    planWindow.add(planSubTitle);
    scrollView.add(mainView);
    scrollView.add(submitPlan);
    planWindow.add(scrollView);
    return planWindow;
};

function createPlan (caseInfo) {

    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: 44,
        backgroundColor: 'white',
        borderRadius: 5,
        layout: 'vertical'
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
            subField.setHeight(44);
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
    
    for(var i = 0; i < caseInfo['options'].length; i++)
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
			width: 30,
			height: 30,
			borderWidth: 1,
			borderColor: 'black',
			backgroundColor: 'white',
			backgroundImage: null,
			touchEnabled: false,
			correctAnswer: caseInfo['options'][i].isCorrect
		});
		optionView.add(optionButton);
		
		var optionTitle = Ti.UI.createLabel({
			left:5,
			top: 3,
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
			text: 'BLAH BLAH',
			top:5,
			left:45,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			font: {fontFamily:'Helvetica-Light'},
			touchEnabled: false,
			feedback: 'PLACEHOLDER - NEED THIS STILL'
		});
		feedbackView.add(optionFeedback);

		optionContainerView.elements = {'button' : optionButton, 'feedback' : optionFeedback};

		optionContainerView.addEventListener('click', function(e){
			Ti.App.fireEvent('clearOptionButtons', {button: e.source.elements["button"].id});				
		});
		
	}
	
	Ti.App.addEventListener('clearOptionButtons', function(data){
		var subChildren = subField.children;
		
		for(var x=0; x < subChildren.length; x++)
		{
			if(subChildren[x].elements !== undefined)
			{
				subChildren[x].elements["button"].backgroundColor = 'white';
				
				if(subChildren[x].elements["button"].id == data.button)
				{
					subChildren[x].elements["button"].backgroundColor = 'green';
				}
			}
		}
	});

	Ti.App.addEventListener('showAssessmentFeedback', function(data){
		var subChildren = subField.children;

		for(var x=0; x < subChildren.length; x++)
		{
			if(subChildren[x].elements !== undefined)
			{
				subChildren[x].elements["feedback"].text = subChildren[x].elements["feedback"].feedback;					
			}

		}		
	});

    return subField;

};

exports.createPlanScreen = createPlanScreen;
/**
 * Subjective and Objective UI with all the components created.
 */

/**
 * Create the S&O UI with all the components
 * @param {Object} soapCase, the data of the case
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createSoap (soapCase, controller) {
    
    //Main window
    var soWindow = Ti.UI.createWindow ( {
       	navBarHidden:true,
        backgroundColor: '#E6E7E8'
    });
    
    //top bar. Android does not have a own navigation bar, so need to be manually created
    var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:"Subj & Obj",
	   	height:40,
	   	width:'100%',
	   	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	   	font: { fontSize:25 }
	});
	soWindow.add(topBar);
    
    //Next button to go to the next window
    var nextButton = Ti.UI.createButton ( {
    	title: 'Next',
    	right: 10,
    	top: 2,
    	height : 40,
    	font: {fontSize:12, fontFamily:'Helvetica-Light'},
    	borderRadius: 10
    });
    soWindow.add(nextButton);
    
    //open the Assesstment UI when the image of the case (button) is clicked
    nextButton.addEventListener('click', function(e)
    {
    	var assessmentScreen = require('/ui/android/Assessment').createAssessmentScreen(soapCase, controller);
    	controller.open(assessmentScreen);
    });
    
    //Test case name and number
    var soSubTitle = Ti.UI.createLabel( {
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
    soWindow.add(soSubTitle);
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 65,
        contentHeight: 'auto',
        bottom: 10,
        width: '100%'    
    });
    soWindow.add(scrollView);
    
    //Main view to hold all sub-fields
    var mainView = Titanium.UI.createView({
        top:0,
        left: 0,
        width: '100%',
        height: Titanium.UI.SIZE,
        layout: 'vertical'
    });
    scrollView.add(mainView);
       
    // Create subjective and objective content on the main view
    mainView.add(createSO('Subjective', soapCase.Subjective + "\n\n"));
    mainView.add(createSO('Objective', soapCase.Objective + "\n\n"));
       
    return soWindow;
};

/**
 * create the components of the S&O
 * @param {Object} caseName, the case name
 * @param {Object} caseInfo, the Subjective and Objective data
 */
function createSO (caseName, caseInfo) {
	
	//create the subfield view
    var subField  = Ti.UI.createView ({
        top: 10,
        left: 10,
        right: 10,
        width: Ti.UI.FILL,
        height: 44,
        backgroundColor: 'white',
        borderRadius: 5,
        expanded:false
    });
	
	//label with the case name
    var nameLabel = Ti.UI.createLabel ({
    	color: 'black',
        left: 10,
        top: 15,
        font: {fontWeight:'bold', fontFamily:'Helvetica', fontSize: 14},
        text:  caseName
    });
    subField.add(nameLabel);
    
    //the info for the S & O
    var infoLabel = Ti.UI.createLabel ({
    	color: 'black',
        left: 10,
        top: 44,
        right: 10,
        font: {fontFamily:'Helvetica-Light', fontSize: 14},
        text:  caseInfo
    });
     subField.add(infoLabel);
    
    //an arrow image
    var arrowImage = Ti.UI.createLabel ({
        top:15,
        right:10,
        backgroundImage: '/images/Arrow.png',
        width:11,
        height:16
    });
    subField.add(arrowImage);
	
	//Expand the subfield with it is clicked
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

    return subField;
}

exports.createSoap = createSoap;
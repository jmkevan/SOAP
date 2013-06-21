/**
 * Discussion UI with all the components created.
 */

/**
 * Create the Discussion UI with all the components
 * @param {Object} soapCase, the data of the case
 * @param {Object} controller, the navigation controller to open a new window when the case is clicked
 */
function createDiscussionScreen (soapCase, controller) {
    
    //Main window
    var discussionWindow = Ti.UI.createWindow ( {
		navBarHidden:true,
        backgroundColor: '#E6E7E8'
    });
    
    //top bar. Android does not have a own navigation bar, so need to be manually created
    var topBar = Ti.UI.createLabel ({
		top:0,
		backgroundColor:'#024731',
	    color:'#fff',
	    text:"Discussion",
	   	height:40,
	   	width:'100%',
	   	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	   	font: { fontSize:25 }
	});
	discussionWindow.add(topBar);
	
	//close button to go back to the first window
	var closeButton = Ti.UI.createButton ( {
    	title: 'Close',
    	right: 10,
    	top: 2,
    	height : 40,
    	font: {fontSize:12, fontFamily:'Helvetica-Light'},
    	borderRadius: 10
    });
    
    //go back to the Main Window
    closeButton.addEventListener('click', function(e) {
      	controller.home();
    });
    discussionWindow.add(closeButton);
	
	//Test case name and number
    var discussionSubTitle = Ti.UI.createLabel( {
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
    discussionWindow.add(discussionSubTitle);
    
    //ScrollView used for scroll down when the subfields are expanded
    var scrollView = Ti.UI.createScrollView ({
        top: 90,
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
    scrollView.add(mainView);
    
    //create each discussion field
    for (var key in soapCase.Discussion[0]) {
    	mainView.add(createDiscussion(key, soapCase.Discussion[0][key]));
    }

    discussionWindow.add(scrollView);
    
    return discussionWindow;
};

function createDiscussion (caseName, caseInfo) {
	
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
	
	//name of the discussion field
    var nameLabel = Ti.UI.createLabel ({
    	color:'black',
        left: 10,
        top: 15,
        font: {fontWeight:'bold', fontFamily:'Helvetica', fontSize: 14},
        text:  caseName
    });
    subField.add(nameLabel);
    
    //info on the discussion field
    var infoLabel = Ti.UI.createLabel ({
    	color:'black',
        left: 10,
        top: 44,
        right: 10,
        font: {fontFamily:'Helvetica-Light', fontSize: 14},
        text:  caseInfo  + "\n\n"
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
	
	//expand the subfield
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

};

exports.createDiscussionScreen = createDiscussionScreen;
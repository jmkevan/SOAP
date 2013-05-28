var Cloud = require('ti.cloud');

/*
 * Create the Subjective and Objective Cases
 */
function createDiscussionScreen (testCaseName, nav) {
    
    var nextButton = Ti.UI.createButton ( {
    	title: 'Next'
    });
    
    nextButton.addEventListener('click', function(e)
    {
      	nav.close(nav.subObj, {animated:false});
      	nav.close(nav.assessment, {animated:false});
      	nav.close(nav.plan, {animated:false});
      	nav.close(nav.discussion, {animated:false});
    });
    
    //Main window
    var discussionWindow = Ti.UI.createWindow ( {
        title:testCaseName,
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: nextButton
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
            for (var key in e.soap[0].Discussion[0])
            {
            	mainView.add(createDiscussion(key, e.soap[0].Discussion[0][key]));
            }
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });

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
        height: 44,
        backgroundColor: 'white',
        borderRadius: 5,
        expanded:false
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

    return subField;

};

exports.createDiscussionScreen = createDiscussionScreen;
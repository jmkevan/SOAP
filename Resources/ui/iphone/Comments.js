/*
 * Create the Subjective and Objective Cases
 */
function createCommentScreen (soapCase, comments, controller) {
    
    var nextButton = Ti.UI.createButton ( {
    	title: 'Close'
    });
    
    nextButton.addEventListener('click', function(e) {
		controller.home();
      	
    });
    
    //Main window
    var commentWindow = Ti.UI.createWindow ( {
        title:'Comments',
        backgroundColor: '#E6E7E8',
        barColor:'#024731',
        rightNavButton: nextButton
    });
    
    //Test case name and number (from json file?)
    var commentSubTitle = Ti.UI.createLabel( {
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
    
	var tableView = createComments (comments);

    commentWindow.add(commentSubTitle);
    commentWindow.add(tableView);
    return commentWindow;
};

function createComments (comments) {

  //start creating the table
    var tblData = [];
    
    //create the list
    for (var i = 0;  i < comments.length; i++) {
    	
    	var comment = comments[i];
    	
        var row = Titanium.UI.createTableViewRow();
        
        var name = Titanium.UI.createLabel ({
           text:comment.user.first_name + " " + comment.user.last_name,
           font:{fontFamily:'Optima', fontSize:19, fontWeight:'bold'},
           width:Titanium.UI.FILL,
           height:19,
           top: 10,
           left: 15
        });
        
        var content = Titanium.UI.createLabel ({
           text:comment.content + "\n",
           font:{fontFamily:'Optima', fontSize:15},
           width:Titanium.UI.FILL,
           height:Titanium.UI.SIZE,
           top: 35,
           bottom: 10,
           left: 15
        });
        
        row.add(name);
        row.add(content);
        
        tblData.push(row);
    }
    
    var postTable = Titanium.UI.createTableView({
    	top: 35,
        left: 8,
        right: 8,
        bottom:10,
        borderRadius:5,
        data:tblData,
        rowHeight:Titanium.UI.SIZE,
        seperatorColor:'transparent'
    });
    
    return postTable;

};

exports.createCommentScreen = createCommentScreen;
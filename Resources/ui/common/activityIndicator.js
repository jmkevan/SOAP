/**
 * Indicator window with a spinner and a label
 *
 * @param {Object} args
 * 
 * 
 * Prepping Indicator Window
 * var utilities = require('utilities');
 * var myIndicatorWindow = utilities.createIndicatorWindow({top:140,text:'Loading...'});
 * 
 * Indicator Window Functions
 * myIndicatorWindow.setText('Logging into Laulima'); // Change the text
 * myIndicatorWindow.openIndicator(); // Open indicator window
 * myIndicatorWindow.closeIndicator(); // Close indicator window
 */
function createIndicatorWindow(args) {
	
	//iphone and android style are different
	var style;
	
	//if Android
	if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
		style = Ti.UI.ActivityIndicatorStyle.DARK;
	}	
	
    var count = 0;
    var width = 180,
        height = 50;

    var args = args || {};
    var bottom = args.bottom || (Ti.Platform.displayCaps.platformHeight) / 6;
    var text = args.text || '';

    var win = Titanium.UI.createWindow({
        height:           height,
        width:            width,
        bottom:           bottom,
        borderRadius:     10,
        touchEnabled:     false,
        backgroundColor:  '#000',
        opacity:          0.6
    });

    var view = Ti.UI.createView({
        width:   Ti.UI.SIZE,
        height:  Ti.UI.FILL,
        center:  { x: (width/2), y: (height/2) },
        layout:  'horizontal'
    });

    var activityIndicator = Ti.UI.createActivityIndicator({
        style:   style,
        left:    0,
        height:  Ti.UI.FILL,
        width:   30
    });

    var label = Titanium.UI.createLabel({
        left:    10,
        width:   Ti.UI.FILL,
        height:  Ti.UI.FILL,
        text:    text,
        color:   '#fff',
        font:    { fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 'bold' }
    });

    view.add(activityIndicator);
    view.add(label);
    win.add(view);

    function openIndicator() {
        count +=1;
        win.open();
        activityIndicator.show();
    
    }

    win.openIndicator = openIndicator;

    function closeIndicator() {
        count -=1;
        activityIndicator.hide();
        win.close();

    }

    win.closeIndicator = closeIndicator;
    
    function setText(newText) {
        label.text = newText;
    }
    
    win.setText = setText;

    return win;
}

// Public interface
exports.createIndicatorWindow = createIndicatorWindow;
/**
 * Create a Navigation controller depending on which os using.
 */

//Create an array method to check if an element exists in this array
Array.prototype.has = function(value) {

	var i;

	for (var i = 0; i < this.length; i++) {
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};

//Create the Navigation Controller for android
var NavigationController = require ("ui/common/NavigationController").NavigationController;
var controller = new NavigationController ();

//utilities used through out the entire app
var utilities = {
	activityIndicator : null
}

var userInfo = {
	casesDone : []
}

//a self made activity indicator
var activityIndicator = require ('/ui/common/activityIndicator');
utilities.activityIndicator = activityIndicator.createIndicatorWindow();


//if Android
if(Ti.Platform.osname === 'android') {
	//create the main UI
	var AndroidLogin = require ('ui/android/Login');
	//open the main UI with the nav controller
	controller.open(new AndroidLogin(controller));
}
else if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {

	//Testflight. DELETE WHEN UPLOAD TO ITUNES
	var TestflightTi = require('com.clinsoftsolutions.testflight');
    TestflightTi.takeOff("<KEY>", true);
    
	//create the main UI
	var iPhoneLogin = require('ui/iphone/Login');
	//Call the method exported
	controller.open(new iPhoneLogin(controller));
}
	


/**
 * Create a Navigation controller depending on which os using.
 */

//Create the Navigation Controller for android
var NavigationController = require ("ui/common/NavigationController").NavigationController;
var controller = new NavigationController ();

//utilities used through out the entire app
var utilities = {
	activityIndicator : null
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
    TestflightTi.takeOff("5959e0de-ef61-42b8-a908-89d9b49dc924", true);
    
	//create the main UI
	var iPhoneLogin = require('ui/iphone/Login');
	//Call the method exported
	controller.open(new iPhoneLogin(controller));
}	


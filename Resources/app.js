/**
 * Create a Navigation controller depending on which os using.
 */

//Create the Navigation Controller for android
var NavigationController = require ("ui/common/NavigationController").NavigationController;
var controller = new NavigationController ();

//if Android
if(Ti.Platform.osname === 'android') {
	//create the main UI
	var AndroidUI = require ('ui/android/MainWindow');
	//open the main UI with the nav controller
	controller.open(new AndroidUI (controller));
}
else if (Ti.Platform.osname === 'iphone') {
	//create the main UI
	var MainWindow = require('ui/iphone/MainWindow');
	//Call the method exported
	var Window = new MainWindow ();
}	


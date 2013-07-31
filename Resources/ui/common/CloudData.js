var Cloud = require('ti.cloud');

exports.getComments = function (soapCase, controller) {
	
	Cloud.Reviews.query({
	    page: 1,
	    per_page: 20,
	    custom_object_id : soapCase.id
	}, function (e) {
    	if (e.success) {
	        if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	        	var commentScreen = require('/ui/iphone/Comments').createCommentScreen(soapCase, e.reviews, controller);
				controller.open(commentScreen);
	        }
	    } else {
	        return 'Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e));
	    }
	});
}

exports.login = function (username, password, controller) {
	
	 Cloud.Users.login({
    	login: username,
    	password: password
	}, function (e) {
    	if (e.success) {
    			var user = e.users[0];
    			var mainWindow;
    		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    			TestflightTi.passCheckpoint("Login Success");
    			utilities.activityIndicator.closeIndicator();
	        	mainWindow = require ('/ui/iphone/MainWindow').getApplicationWindow(controller);
	        	controller.open(mainWindow);
	        }
	        else if (Ti.Platform.osname === 'android') {
	        	utilities.activityIndicator.closeIndicator();
	        	mainWindow = require ('/ui/android/MainWindow').getApplicationWindow(controller);
	        	controller.open(mainWindow);
	        }
        	
    	} else {
    		if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    			TestflightTi.passCheckpoint("Login Failed.\n" + + "Error:\n" +
	            ((e.error && e.message) || JSON.stringify(e)));
    		}
    		utilities.activityIndicator.closeIndicator();
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
    	}
	});
}

exports.createAccount = function (email, firstName, lastName, password, controller) {
	
	Cloud.Users.create({
	    email: email,
	    first_name: firstName,
	    last_name: lastName,
	    password: password,
	    password_confirmation: password
	}, function (e) {
		utilities.activityIndicator.closeIndicator();
	    if (e.success) {
	        if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	        	TestflightTi.passCheckpoint("Create Account Success");
    			controller.navGroup.close(controller.windowStack[controller.windowStack.length-1]);
	        }
	        else if (Ti.Platform.osname === 'android') {
	        	controller.windowStack[controller.windowStack.length-1].close();
	        }
	        alert("Success. An email will be sent to activate your account.");
	    } else {
	    	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	        	TestflightTi.passCheckpoint("Create Account Failed.\n" + "Error:\n" +
	            ((e.error && e.message) || JSON.stringify(e)));
	       }
	    	utilities.activityIndicator.closeIndicator();
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	        controller.windowStack[controller.windowStack.length-1].setOpacity(1.0);
	        controller.windowStack[controller.windowStack.length-1].getChildren()[0].getChildren()[4].setTouchEnabled(true);
	    }
	});
	
}

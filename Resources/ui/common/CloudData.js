var Cloud = require('ti.cloud');

exports.getCases = function (generalNameTitle, controller) {
	
	Cloud.Objects.query({
	    
    classname: 'soap',
    where: {
        rootCase: generalNameTitle
    },
    order: 'created_at'
    
    }, function (e) {
        if (e.success) {
        	e.soap.generalNameTitle = generalNameTitle;
        	var applicationWindow = require('/ui/iphone/ApplicationWindow').createTestCases(e.soap, controller);
			//Open the navigation group, passing the nav as parameter to keep navigating
	    	controller.open(applicationWindow);
        } else {
            alert('Error:\\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

/**
 * Get comments for a case
 * @param {Object} soapCase - the case info
 * @param {Object} controller - the nav controller
 */
exports.getComments = function (soapCase, controller) {
	
	Cloud.Posts.query({
	    page: 1,
	    per_page: 20,
	    where: {
	    	caseId: soapCase.id
	    }
	}, function (e) {
    	if (e.success) {
	        if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	        	var commentScreen = require('/ui/iphone/Comments').createCommentScreen(soapCase, e.posts, controller);
				controller.open(commentScreen);
	        }
	    } else {
	        return 'Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e));
	    }
	});
}

/**
 * Login to the app
 * @param {Object} username
 * @param {Object} password
 * @param {Object} controller - the nav controller
 */
exports.login = function (username, password, controller) {
	 Cloud.Users.login({
    	login: username,
    	password: password
	}, function (e) {
    	if (e.success) {
    			var user = e.users[0];
    			var mainWindow;
    			userInfo.casesDone = user.custom_fields.casesDone;
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

/**
 * Create an account
 * @param {Object} email
 * @param {Object} firstName
 * @param {Object} lastName
 * @param {Object} password
 * @param {Object} controller
 */
exports.createAccount = function (email, firstName, lastName, password, controller) {
	
	Cloud.Users.create({
	    email: email,
	    first_name: firstName,
	    last_name: lastName,
	    password: password,
	    password_confirmation: password,
	    custom_fields: {
	    	casesDone: []
	    }
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

exports.addCaseDone = function () {
	
	Cloud.Users.update({
	    custom_fields: {
	    	casesDone: userInfo.casesDone
	    }
	}, function (e) {
	    if (e.success) {
	        alert("You have done " + e.users[0].custom_fields.casesDone.length + " cases");
	    } else {
	    	
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	           }

	});
	
}

function createAccountFormWindow (controller) {
	
	var self = Ti.UI.createWindow ({
		backgroundImage:'background@2x.png',
        visible:true,
        barColor:'#004b2d',
        title: "New Account"
	});
	
	self.addEventListener('close', function() {
		TestflightTi.passCheckpoint("Closed Create Account Form");
    });
	
	var scrollView = Ti.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto'
	});
	self.add(scrollView);
	
	//username textfield
    var email = Ti.UI.createTextField({
        color:'black',
        hintText:'EMAIL',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:40,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        top:60,
        borderRadius:5,
        keyboardType: Titanium.UI.KEYBOARD_EMAIL
    })
    scrollView.add(email);
    
    //username textfield
    var firstName = Ti.UI.createTextField({
        color:'black',
        hintText:'FIRST NAME',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:40,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        top: 110,
        borderRadius:5
        
    })
    scrollView.add(firstName);
    
    //username textfield
    var lastName = Ti.UI.createTextField({
        color:'black',
        hintText:'LAST NAME',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:40,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        top:160,
        borderRadius:5
        
    })
    scrollView.add(lastName);
    
    //username textfield
    var password = Ti.UI.createTextField({
        color:'black',
        hintText:'PASSWORD',
        passwordMask:true,
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:40,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        top:210,
        borderRadius:5
        
    })
    scrollView.add(password);
    
     //Login button
    //submit credentials
    var btnSubmit = Ti.UI.createButton({
        backgroundColor:'white',
        color:'#0d4e32',
		top:260,
        width: 90,
        height:34,
        title:'CREATE',
        font:{fontFamily:'Optima',fontSize:'16pt'},
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    })
    scrollView.add(btnSubmit);
    
    email.addEventListener('return', function() {
        firstName.focus();
       	lastName.blur();
       	password.blur();
    });
    
    firstName.addEventListener('return', function() {
        lastName.focus();
       	password.blur();
       	email.blur();
    });
    
    lastName.addEventListener('return', function() {
        password.focus();
       	email.blur();
       	firstName.blur();
    });
    
    password.addEventListener('return', function() {
       	firstName.blur();
       	lastName.blur();
       	password.blur();
    });
    
    btnSubmit.addEventListener('click', function() {
    	self.setOpacity(0.5);
    	btnSubmit.setTouchEnabled(false);
    	//activity indicator for signing in
    	utilities.activityIndicator.setText("Processing...");
    	utilities.activityIndicator.openIndicator();
    	var cloud = require('/ui/common/CloudData');
		cloud.createAccount (email.value, firstName.value, lastName.value, password.value, controller);
       	
    });
    
    return self;
}

exports.createAccountFormWindow = createAccountFormWindow;

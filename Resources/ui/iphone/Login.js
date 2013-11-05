//Login ui components structure
function createApplicationWindow (controller) {
	
	
	var height = Ti.Platform.displayCaps.platformHeight;
	var width = Ti.Platform.displayCaps.platformWidth;
    
    //window widget
    var self = Ti.UI.createWindow({
        backgroundImage:'background@2x.png',
        visible:true,
        barColor:'#004b2d',
        navBarHidden: true
    });
    
    var scrollView = Ti.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'100%'
	});
	self.add(scrollView);
    
    //UH NURSING banner logo
    var sondhLogo = Ti.UI.createImageView({
        image:'UHM_Nursing_mobile_banner.png',
        top:40
    })
    scrollView.add(sondhLogo);
    
    //username textfield
    var txtUsername = Ti.UI.createTextField({
        color:'black',
        hintText:'EMAIL',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:44,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        top:height/3,
        borderRadius:5,
        value:"ayj@hawaii.edu"
        
    })
    scrollView.add(txtUsername);
    
    //password textfield
    var txtPassword = Ti.UI.createTextField({
        color:'black',
        hintText:'PASSWORD',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        width:'80%',
        paddingLeft:9,
        height:44,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        passwordMask:true,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        top:(height/3) + 60,
        borderRadius:5,
        value:"test"
    })
    scrollView.add(txtPassword);
    
    txtUsername.addEventListener('return', function() {
        txtPassword.focus();
    });
    
    txtPassword.addEventListener('return', function() {
        txtPassword.blur();
    });
    
    //Login button
    //submit credentials
    var btnSubmitCreds = Ti.UI.createButton({
        backgroundColor:'white',
        color:'#0d4e32',
		top:(height/3) + 120,
		left:width/8,
        width:90,
        height:34,
        title:'SIGN IN',
        font:{fontFamily:'Optima',fontSize:'16pt'},
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    })
    scrollView.add(btnSubmitCreds);
    
    //Add login button listener
    btnSubmitCreds.addEventListener('click', function() {
    	
    	utilities.activityIndicator.setText("Signing in...");
    	utilities.activityIndicator.openIndicator();
        // Hide keyboard if it's still up
        txtUsername.blur();
        txtPassword.blur();
        
        var cloud = require('/ui/common/CloudData');
		cloud.login (txtUsername.value, txtPassword.value, controller);
        
        btnSubmitCreds.backgroundColor = 'white';
        btnSubmitCreds.color = '#0d4e32';
        
    });
    
    //when the login button is touched.
    //for ui view
    btnSubmitCreds.addEventListener('touchstart', function() {
        btnSubmitCreds.backgroundColor = '#e6e7e8';
        btnSubmitCreds.color = '#a7a9ac';
    });
    
    
    var btnNewAccount = Ti.UI.createButton({
        backgroundColor:'white',
        color:'#0d4e32',
		top:(height/3) + 120,
		right:width/8,
        width:90,
        height:34,
        title:'New Account',
        font:{fontFamily:'Optima',fontSize:'12pt'},
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    })
    scrollView.add(btnNewAccount);
    
    //Add login button listener
    btnNewAccount.addEventListener('click', function() {
    	
    	TestflightTi.passCheckpoint("Creating Account");
    	
        // Hide keyboard if it's still up
        txtUsername.blur();
        txtPassword.blur();
        
        var accountForm = require ('/ui/iphone/NewAccount');
        controller.open(accountForm.createAccountFormWindow(controller));
        
        btnSubmitCreds.backgroundColor = 'white';
        btnSubmitCreds.color = '#0d4e32';
        
    });
    
    //when the login button is touched.
    //for ui view
    btnNewAccount.addEventListener('touchstart', function() {
        btnSubmitCreds.backgroundColor = '#e6e7e8';
        btnSubmitCreds.color = '#a7a9ac';
    });

    return self;
}

module.exports = createApplicationWindow;
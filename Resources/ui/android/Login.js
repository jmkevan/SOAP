var Cloud = require('ti.cloud');

//Login ui components structure
function createApplicationWindow (controller) {
    
    var width = (Ti.Platform.displayCaps.platformWidth) / 2;
    
    //window widget
    var self = Ti.UI.createWindow({
        backgroundImage:'/images/background@2x.png',
        visible:true,
        barColor:'#004b2d'
    });
    
    //UH NURSING banner logo
    var sondhLogo = Ti.UI.createImageView({
        image:'/images/UHM_Nursing_mobile_banner.png',
		top:25
    })
    self.add(sondhLogo);
    
    var scrollView = Ti.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		width:'100%'
	});
	self.add(scrollView);
    
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
        font:{fontFamily:'Optima'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT,
        top:180,
        borderRadius:5
        
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
        font:{fontFamily:'Optima'},
        passwordMask:true,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        top:240,
        borderRadius:5
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
		top: 300,
		left:width/4,
        width: 90,
        height:34,
        title:'SIGN IN',
        font:{fontFamily:'Optima'},
    })
    scrollView.add(btnSubmitCreds);
    
    //Add login button listener
    btnSubmitCreds.addEventListener('click', function() {
    	
    	//activity indicator for signing in
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
    
    btnNewAccount = Ti.UI.createButton({
        backgroundColor:'white',
        color:'#0d4e32',
		top: 300,
		right:width/4,
        width: Ti.UI.SIZE,
        height:34,
        title:'New Account',
        font:{fontFamily:'Optima'},
    })
    scrollView.add(btnNewAccount);
    
    btnNewAccount.addEventListener('click', function() {
    	
    	 // Hide keyboard if it's still up
        txtUsername.blur();
        txtPassword.blur();
        
        var accountForm = require ('/ui/android/NewAccount');
        controller.open(accountForm.createAccountFormWindow(controller));
        
        btnSubmitCreds.backgroundColor = 'white';
        btnSubmitCreds.color = '#0d4e32';
        
    });
    
     //when the login button is touched.
    //for ui view
    btnNewAccount.addEventListener('touchstart', function() {
        btnNewAccount.backgroundColor = '#e6e7e8';
        btnNewAccount.color = '#a7a9ac';
        btnNewAccount.backgroundColor = 'white';
        btnNewAccount.color = '#0d4e32';
    });
    
    return self;
}

module.exports = createApplicationWindow;
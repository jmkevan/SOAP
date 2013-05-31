//Create the Tab Window for all GeneralCases
function createTab (allGeneralCases, activeTab) {
	
    // create tab group
    var tabGroup = Titanium.UI.createTabGroup({
        activeTab: activeTab
    });
    var testCasesWindow = require('/ui/common/ApplicationWindow');
    for (var i = 0; i < allGeneralCases.length; i++) {
        var mainWindow = testCasesWindow.createTestCases(allGeneralCases[i]);
        
        var tabWindow = null;
        
        if(Ti.Platform.osname === 'android')
        {
        	tabWindow = mainWindow.windowStack[activeTab];
        } else {
        	tabWindow = mainWindow.containerWindow;
        }
        
        var tab = Ti.UI.createTab ({
           title: allGeneralCases[i],
           window: tabWindow
        }); 
        tabGroup.addTab(tab); 
    }
    tabGroup.open();
}

exports.createTab = createTab;
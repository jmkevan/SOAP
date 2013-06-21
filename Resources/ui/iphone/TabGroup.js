//Create the Tab Window for all GeneralCases
function createTab (allGeneralCases, activeTab) {

    // create tab group
    var tabGroup = Titanium.UI.createTabGroup({
        activeTab: activeTab
    });
    var testCasesWindow = require('/ui/iphone/ApplicationWindow');
    for (var i = 0; i < allGeneralCases.length; i++) {
        var mainWindow = testCasesWindow.createTestCases(allGeneralCases[i]);
        var tab = Ti.UI.createTab ({
           title: allGeneralCases[i],
           window: mainWindow 
        }); 
        tabGroup.addTab(tab); 
    }
    tabGroup.open();
}

exports.createTab = createTab;
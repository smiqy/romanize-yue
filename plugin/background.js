chrome.browserAction.onClicked.addListener((tab) => {
    for (const path of ["jquery.min.js", "romanization/yue-standard.js", "romanization/cmn-standard.js", "romanization-cmn-simple.js", "all.js"])
        chrome.tabs.executeScript(null, {
            file: path
        });
});
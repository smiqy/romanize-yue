chrome.browserAction.onClicked.addListener(tab => {
  for (const path of ["jquery.min.js", "show.js", "data/cmn.js", "data/yue.js", "all.js"])
    chrome.tabs.executeScript(null, {
      file: path
    });
});
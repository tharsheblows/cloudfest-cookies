console.log(chrome.devtools)

chrome.devtools.panels.create(
  "Cloudfest Cookies",
  "hello.png",
  "devtools/index.html",
  function (panel) { console.log(panel) }
);

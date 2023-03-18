console.log(chrome.devtools)

chrome.devtools.panels.create(
	"Cloudfest Cookies",
	"hello.png",
	"devtools/panel.html",
	function (panel) { console.log(panel) }
);
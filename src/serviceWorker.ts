


chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, { urls: ["<all_urls>"]}, ["responseHeaders", "blocking","extraHeaders"] );
console.log("TEST")
function onHeadersReceived(details: any) {
  console.log("ON HEADER RECIVE")

  if (details.responseHeaders) {
    console.log("BEFORE: " + details.responseHeaders.length)
    return {
      responseHeaders: details.responseHeaders.filter((x:any) => {
       // console.log(x.name.toLowerCase() !== 'set-cookie')
        return x.name.toLowerCase() !== 'set-cookie';
      })

    };
  }
  return {};
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    console.log("FOOO1")
    details.requestHeaders.forEach(function(requestHeader){
      if (requestHeader.name.toLowerCase() === "cookie") {
        requestHeader.value = "TEST"
      }
    });
    return {
      requestHeaders: details.requestHeaders
    };
  }, {
    urls: [ "*://*/*" ]
  }, ['blocking', 'requestHeaders',"extraHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    console.log("FOOO2")
    details.responseHeaders.forEach(function(responseHeader){
      if (responseHeader.name.toLowerCase() === "set-cookie") {
        responseHeader.value = "TEST"
      }
    });
    return {
      responseHeaders: details.responseHeaders
    };
  }, {
    urls: ["*://*/*"]
  }, ['blocking','responseHeaders',"extraHeaders"]
);




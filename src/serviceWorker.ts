

//import cookie from "./storage/cookies";
//import deleteAllCookies from './deleteAllCookies'


function deleteAllCookies(){
  // Thank you nameless user https://stackoverflow.com/questions/74021842/chrome-extension-remove-cookies.
  //get all cookies belongs to us and allowed by the host_permissions:
  chrome.cookies.getAll({}, function (cookies) {
    console.log('cookies:', cookies); //<=== Check the cookies I get here below;

    //loop the cookies:
    cookies.forEach(function (cookie, i) {
      let cookieUrl = 'http';
      cookieUrl += cookie.secure ? 's' : '';
      cookieUrl += '://' + cookie.domain + cookie.path;

      //remove this cookie:
      chrome.cookies.remove(
        {
          url: cookieUrl,
          name: cookie.name,
        },
        function (removedCookie) {
          console.log('removedCookie:', removedCookie); //<=== Why do I get an empty value here?
        }
      );
    });
  });
}


(function () {
  const tabStorage = {};
  const networkFilters = {
    urls: ['*://*/*'],
  };

  // Responsible for listening for a request to send the cookies to the browser.
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === 'getCookies')
      {
        // @ts-ignore
        sendResponse({ cookies: tabStorage[request.tabId].cookies });
      }
  });

  // Responsible for listening for a request to send the cookies to the browser.
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === 'deleteCookies'){
      deleteAllCookies()
    };
  });

  chrome.webRequest.onResponseStarted.addListener(
    (details) => {
      const { tabId, initiator, url } = details;
      const setCookie = details.responseHeaders.filter(
        (n) => n.name === 'set-cookie'
      );
      const cookies = setCookie.map((c) => {
        // SO https://stackoverflow.com/questions/10730362/get-cookie-by-name/64472572#64472572
        // @ts-ignore
        const parsed = cookie.parse(c.value);
        const requestorDetails = {
          initiator,
          url,
        };
        return { ...parsed, ...requestorDetails };
      });

      // @ts-ignore
      const current = tabStorage[tabId]?.cookies ?? [];
      // @ts-ignore
      tabStorage[tabId] = {
        cookies: [...current, ...cookies],
      };
    },
    networkFilters,
    ['extraHeaders', 'responseHeaders']
  );
})();


chrome.webRequest.onHeadersReceived.addListener((details) => {
  if (details.responseHeaders) {
   // console.log("TEST")
   // console.log(details)
    return {
      responseHeaders: details.responseHeaders.filter((x:any) => {
        console.log()
        if (x.name.toLowerCase() === 'set-cookie') {
          console.log("ICH BLOCKE")
       //   console.log(details)
        }
        return x.name.toLowerCase() !== 'set-cookie';
      })

    };
  }
  return {};

}, { urls: ["<all_urls>"]}, ["responseHeaders","extraHeaders","blocking"] );



import cookie from 'cookie';
import deleteAllCookies from './deleteAllCookies'




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
      sendResponse({ cookies: tabStorage[request.tabId].cookies });
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
        const parsed = cookie.parse(c.value);
        const requestorDetails = {
          initiator,
          url,
        };
        return { ...parsed, ...requestorDetails };
      });

      const current = tabStorage[tabId]?.cookies ?? [];
      tabStorage[tabId] = {
        cookies: [...current, ...cookies],
      };
    },
    networkFilters,
    ['extraHeaders', 'responseHeaders']
  );
})();

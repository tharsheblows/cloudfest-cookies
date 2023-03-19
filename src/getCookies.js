import cookie from 'cookie';
import deleteAllCookies from './deleteAllCookies'

import {blockedCookies} from "./storage/blockedCookies";



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
      tabStorage[request.tabId].cookies = [];
      deleteAllCookies();
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
      if ( cookies.length > 0 ) {
        sendSound(tabId, cookies);
      }

    },
    networkFilters,
    ['extraHeaders', 'responseHeaders']
  );

  const sendSound = (listenerTabId, cookies) => {
    console.log('send sound')
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tabId === listenerTabId) {
        chrome.tabs.sendMessage(tabId, {
          action: 'makeASound',
          cookies: cookies
        });
      }
    });
  }
})();

//Example to add a remove name of a cookie to the block list
//blockedCookies.addCookie("MMAUTHTOKEN")
//blockedCookies.removeCookie("MMAUTHTOKEN")

chrome.cookies.onChanged.addListener(function(changeInfo) {

 /* console.log('Cookie changed: ' +
    '\n * Cookie: ' + JSON.stringify(changeInfo.cookie) +
    '\n * Cause: ' + changeInfo.cause +
    '\n * Removed: ' + changeInfo.removed);*/

  let help = blockedCookies.getSnapshot()
  if (help.includes(changeInfo.cookie.name) ) {
    console.log(changeInfo)
    chrome.cookies.remove({
      "url": "https://" + changeInfo.cookie.domain + changeInfo.cookie.path,
      "name": changeInfo.cookie.name
    }, function (deleted_cookie) {
      console.log(deleted_cookie);
    });
    chrome.cookies.remove({
      "url": "http://" + changeInfo.cookie.domain + changeInfo.cookie.path,
      "name": changeInfo.cookie.name
    }, function (deleted_cookie) {
      console.log(deleted_cookie);
    });
  }
});

import { cookies } from "./storage/cookies";


import cookie from 'cookie';
// @ts-ignore
import * as deleteAllCookies from './deleteAllCookies'

import { blockedCookies } from "./storage/blockedCookies";

chrome.webRequest.onResponseStarted.addListener(
  details => {
    const { tabId, initiator, url } = details;
    const headers = details.responseHeaders
    cookies.addFromRequest(tabId, { initiator, url, headers })
  }, { urls: ['*://*/*'] }, ['extraHeaders', 'responseHeaders']
);

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, frameType } = details;
  url && frameType === "outermost_frame" &&
    cookies.updateTabLocation(tabId, new URL(url))
})

const tabStorage = {};
const networkFilters = {
  urls: ['*://*/*'],
};
 // @ts-ignore
 tabStorage.cookieRequests = [];

// Responsible for listening for a request to send the cookies to the browser.
chrome.runtime.onMessage.addListener((
  request,
  sender,
  sendResponse
) => {
  if (request.action === 'getCookies') { // @ts-ignore
    sendResponse({ cookies: tabStorage[request.tabId].cookies });
  }
  return true;
});

// Responsible for listening for a request to send the cookies to the browser.
chrome.runtime.onMessage.addListener((
  request,
  sender,
  sendResponse
) => {
  if (request.action === 'deleteCookies') {
    // @ts-ignore
    tabStorage[request.tabId].cookies = [];
    deleteAllCookies();
  }

  return true;
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

    if (cookies.length > 0) {
      // @ts-ignore
      tabStorage.cookieRequests = [ ...tabStorage.cookieRequests, cookies ];
      sendSound(tabId);
    }

  },
  networkFilters,
  ['extraHeaders', 'responseHeaders']
);

const sendSound = (listenerTabId: any) => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tabId === listenerTabId) {
      console.log(`complete ${tabId}`)
      // @ts-ignore
      tabStorage.cookieRequests.forEach( async (c) => {
              await chrome.tabs.sendMessage(tabId, {
              action: 'makeASound',
              cookies: c
        });
      })
    }
  });
}


//Example to add a remove name of a cookie to the block list
//blockedCookies.addCookie("MMAUTHTOKEN")
//blockedCookies.removeCookie("MMAUTHTOKEN")

chrome.cookies.onChanged.addListener(function (changeInfo) {

  /* console.log('Cookie changed: ' +
     '\n * Cookie: ' + JSON.stringify(changeInfo.cookie) +
     '\n * Cause: ' + changeInfo.cause +
     '\n * Removed: ' + changeInfo.removed);*/

  let help = blockedCookies.getSnapshot()
  if (help.includes(changeInfo.cookie.name)) {
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
})

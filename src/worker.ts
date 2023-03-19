
import { cookies } from "./storage/cookies";

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    const { tabId, initiator, url } = details;
    const headers = details.responseHeaders
    cookies.addFromRequest(tabId, { initiator, url, headers })
  }, { urls: ['*://*/*'] }, ['extraHeaders', 'responseHeaders']
);

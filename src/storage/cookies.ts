let _cookies: Cookie[] = [];
let _url: URL;
let _listeners: (() => void)[] = [];

type Cookie = {}
type CookieStore = {
  subscribe: (listener: () => void) => (() => void)
  getSnapshot: () => { cookies: Cookie[], url: URL }
  addCookie: (cookie: Cookie) => void
  requestCookies: () => Promise<void>
}

function emitChange() {
  for (let listener of _listeners) {
    listener();
  }
}

export const cookies: CookieStore = {
  addCookie(cookie: Cookie) {
    _cookies = _cookies.concat([cookie])
    emitChange()
  },
  subscribe(listener) {
    _listeners = _listeners.concat([listener]);
    return () => {
      _listeners = _listeners.filter(x => x === listener);
    };
  },
  getSnapshot() {
    return { cookies: _cookies.slice(), url: _url };
  },
  async requestCookies() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.runtime.sendMessage({ tabId: tab.id, action: 'getCookies' });
    // do something with response here, not outside the function
    const cookies = (response as any).cookies;
    _url = new URL(tab.url);
    _cookies = cookies;
    emitChange();
  }
};

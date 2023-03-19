let _listeners: (() => void)[] = [];
let _store: { cookies: Cookie[], url: URL | undefined } = { cookies: [], url: undefined }

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
    _store = { ..._store, cookies: [..._store.cookies, cookie] }
    emitChange()
  },
  subscribe(listener) {
    _listeners = [..._listeners, listener];
    return () => {
      _listeners = _listeners.filter(x => x !== listener);
    };
  },
  getSnapshot() {
    // IMPORTANT: identity must change iff value has changed
    return _store;
  },
  async requestCookies() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.runtime.sendMessage({ tabId: tab.id, action: 'getCookies' });
    // do something with response here, not outside the function
    const cookies = response.cookies;
    const url = tab.url ? new URL(tab.url) : undefined;
    _store = { url, cookies }
    emitChange();
  }
};

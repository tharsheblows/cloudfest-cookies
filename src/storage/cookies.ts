import cookie from 'simple-cookie';
import type { Cookie } from 'simple-cookie';

let _store: { [tabId: string]: { cookies: Cookie[]; url: URL | undefined } } =
  {};
let _listeners: {
  [tabId: string]: {
    subscriber: (() => void)[];
    listener: (change: {
      [name: string]: chrome.storage.StorageChange;
    }) => void | undefined;
  };
} = {};

/*
type Cookie = {
  [key: string]: string
  url: string,
  initiator: string | undefined
}
*/

type CookieStore = {
  addFromRequest: (tabId: number, request: Request) => void;
  getSyncStore: (tabId: number) => {
    getSnapshot: () => { cookies: Cookie[]; url: URL };
    subscribe: (listener: () => void) => () => void;
  };
};
type Request = {
  headers: chrome.webRequest.HttpHeaders;
  initiator: string | null;
  url: string;
};
type Header = {
  name: string;
  value?: string;
};

const mkHeaderToCookie =
  (url: string, initiator: string | undefined) =>
  (header: Header): Cookie | undefined => {
    // console.log(`${header.name}: ${header.value}`)
    if (!header.value || header.name.toLowerCase() !== 'set-cookie') {
      return;
    }
    const c = cookie.parse(header.value);
    return c;
  };

export const cookies: CookieStore = {
  async addFromRequest(tabId: number, { headers, initiator, url }) {
    const newCookies = headers
      .map(mkHeaderToCookie(url, initiator))
      .filter((x: Cookie | undefined) => x);
    const storage = await chrome.storage.local.get(tabId + '');
    if (!storage[tabId]) {
      storage[tabId] = { cookies: [], url: undefined };
    }
    storage[tabId] = {
      ...storage[tabId],
      cookies: [...storage[tabId].cookies, ...newCookies],
    };
    await chrome.storage.local.set(storage);
  },
  getSyncStore: (tabId: number) => ({
    subscribe(listener) {
      const tab = `${tabId}`;
      _listeners[tab] = _listeners[tab] || {
        subscriber: [],
        listener: undefined,
      };
      if (!_listeners[tab].listener) {
        _listeners[tab].listener = (changes) => {
          if (Object.keys(changes).includes(tab)) {
            _store[tab] = changes[tab].newValue;
            _listeners[tab].subscriber.forEach((l) => l());
          }
          console.log('changed', _store);
        };
        chrome.storage.onChanged.addListener(_listeners[tab].listener);
      }
      _listeners[tab].subscriber.push(listener);
      return () => {
        _listeners[tab].subscriber = _listeners[tab].subscriber.filter(
          (l) => l !== listener
        );
        if (_listeners[tab].subscriber.length === 0) {
          chrome.storage.onChanged.removeListener(_listeners[tab].listener);
          _listeners[tab].listener = undefined;
        }
      };
    },
    getSnapshot() {
      // IMPORTANT: identity must change iff value has changed
      return _store[tabId] || { cookies: [], url: undefined };
    },
  }),
};

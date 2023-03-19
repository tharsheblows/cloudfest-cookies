import cookie from 'cookie';

let _listeners: { [tabId: number]: (() => void)[] } = {};
let _store: { [tabId: string]: { cookies: Cookie[], url: URL | undefined } } = {}

type Cookie = {
  [key: string]: string
  url: string,
  initiator: string | undefined
}
type CookieStore = {
  addFromRequest: (tabId: number, request: Request) => void
  getSyncStore: (tabId: number) => {
    getSnapshot: () => { cookies: Cookie[], url: URL }
    subscribe: (listener: () => void) => (() => void)
  }
}
type Request = {
  headers: chrome.webRequest.HttpHeaders,
  initiator: string | null, url: string
}
type Header = {
  name: string;
  value?: string;
}

const mkHeaderToCookie = (
  url: string,
  initiator: string | undefined) =>
  (header: Header): Cookie | undefined => {
    // console.log(`${header.name}: ${header.value}`)
    if (!header.value ||
      header.name.toLowerCase() !== 'set-cookie') { return }
    const c = cookie.parse(header.value);
    return {
      ...c,
      url,
      initiator
    }

  }

chrome.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach(tabId => { _store[tabId] = changes[tabId].newValue })
  console.log("changed", _store)
})

export const cookies: CookieStore = {
  async addFromRequest(tabId: number, { headers, initiator, url }) {
    const newCookies = headers.map(mkHeaderToCookie(url, initiator))
      .filter((x: Cookie | undefined) => x)
    const _store = await chrome.storage.local.get(tabId + '')
    if (!_store[tabId]) { _store[tabId] = { cookies: [], url: undefined } }
    _store[tabId] = {
      ..._store[tabId]
      , cookies: [..._store[tabId].cookies, ...newCookies]
    }
    await chrome.storage.local.set(_store)
  },
  getSyncStore: (tabId: number) => ({
    subscribe(listener) {
      const _listener = (changes: chrome.storage.StorageChange) => {
        if (Object.keys(changes).includes(tabId + '')) { listener() }
      }
      chrome.storage.onChanged.addListener(_listener)
      return () => chrome.storage.onChanged.removeListener(_listener)
    },
    getSnapshot() {
      // IMPORTANT: identity must change iff value has changed
      return _store[tabId];
    },
  })
};

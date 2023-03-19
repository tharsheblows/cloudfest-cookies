import cookie from 'simple-cookie';
import type { Cookie } from 'simple-cookie';
import { cookieInfoHashMap } from './analyticsCookies';
//import CookieDetails from '../../react/src/components/CookieDetails/index';

let _store: { [tabId: string]: typeof empty } = {};
let _listeners: {
  [tabId: string]: {
    subscriber: (() => void)[];
    listener: (change: {
      [name: string]: chrome.storage.StorageChange;
    }) => void | undefined;
  };
} = {};

const empty: { cookies: Cookie[]; url: URL | undefined } = {
  cookies: [],
  url: undefined,
};

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

type CookieAnalytics = {
  id: string;
  platform: string;
  category: string;
  subCategory: string;
  functionality: string;
  description: string;
  dataController: string;
  GDPRPortal: string;
  retentionPeriod: string;
  usage: string;
  popularity: string;
  comment: string[];
};

function getJsonAttributeIgnoreCase(json: JSON, attrName: string) {
  return json.hasOwnProperty(attrName)
    ? //@ts-ignore
      json[attrName]
    : //@ts-ignore
      json[attrName.toLowerCase()];
}

function jsonToCookieAnalytics(cookieAnalyticsJson: JSON) {
  let cookieAnalytics: CookieAnalytics = {
    id: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'ID'),
    platform: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Platform'),
    category: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Category'),
    subCategory: undefined,
    functionality: undefined,
    description: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Description'),
    dataController: getJsonAttributeIgnoreCase(
      cookieAnalyticsJson,
      'DataController'
    ),
    GDPRPortal: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'GDPR'),
    retentionPeriod: getJsonAttributeIgnoreCase(
      cookieAnalyticsJson,
      'Retention'
    ),
    usage: undefined,
    popularity: undefined,
    comment: undefined,
  };
  return cookieAnalytics;
}

const mkHeaderToCookie =
  (url: string, top: string | undefined) =>
  (
    header: Header
  ):
    | {
        cookie: Cookie;
        analytics: CookieAnalytics;
        origin: string;
        toplevel: string;
      }
    | undefined => {
    // console.log(`${header.name}: ${header.value}`)
    if (!header.value || header.name.toLowerCase() !== 'set-cookie') {
      return;
    }
    const c = cookie.parse(header.value);

    let analytics;
    if (cookieInfoHashMap.hasOwnProperty(c.name)) {
      // @ts-ignore
      let analyticsFromCsvJSON = cookieInfoHashMap[c.name][0];
      analytics = jsonToCookieAnalytics(analyticsFromCsvJSON);
    }
    let origin = new URL(url).origin;
    let toplevel = new URL(top).origin;
    return { cookie: c, analytics, origin, toplevel };
  };

export const cookies: CookieStore = {
  async addFromRequest(tabId: number, { headers, initiator, url }) {
    const tab = await chrome.tabs.get(tabId);
    const newCookies = headers
      .map(mkHeaderToCookie(url, tab.url))
      .filter(
        (x: { cookie: Cookie; analytics: CookieAnalytics } | undefined) => x
      );
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
      return _store[tabId] || empty;
    },
  }),
};

import cookie from 'simple-cookie';
import type { Cookie as ParsedCookie } from 'simple-cookie';
import { cookieInfoHashMap } from './analyticsCookies';
//import CookieDetails from '../../react/src/components/CookieDetails/index';

let _store: { [tabId: string]: StorageValue } =
  {};
let _listeners: {
  [tabId: string]: {
    subscriber: (() => void)[];
    listener: (change: {
      [name: string]: chrome.storage.StorageChange;
    }) => void | undefined;
  };
} = {};

const empty: StorageValue = { cookies: [], url: undefined }


type Cookie = {
  cookie: ParsedCookie,
  analytics: CookieAnalytics | undefined, origin: string, toplevel: string
}
type StorageValue = {
  cookies: Cookie[]; url: URL | undefined
}

type CookieStore = {
  addFromRequest: (tabId: number, request: Request) => void;
  updateTabLocation: (tabId: number, url: URL) => void;
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
      Cookie | undefined => {
      // console.log(`${header.name}: ${header.value}`)
      if (!header.value || header.name.toLowerCase() !== 'set-cookie') {
        return;
      }
      const c = cookie.parse(header.value);

      let analytics: CookieAnalytics | undefined;
      if (cookieInfoHashMap.hasOwnProperty(c.name)) {
        // @ts-ignore
        let analyticsFromCsvJSON = cookieInfoHashMap[c.name][0];
        analytics = jsonToCookieAnalytics(analyticsFromCsvJSON);
      }
      let origin = new URL(url).origin;
      let toplevel = new URL(top).origin;
      return { cookie: c, analytics, origin, toplevel };
    };

// This should be a transaction. Currently it has very likely a race condition.
const updateStorage: <A>(
  key: string,
  def: A,
  step: ((val: A) => A)) => Promise<void> = async (key, def, step) => {
    const storage = await chrome.storage.local.get(key);
    if (!storage[key]) {
      storage[key] = def;
    }
    storage[key] = step(storage[key])
    await chrome.storage.local.set(storage);
  }

export const cookies: CookieStore = {
  async addFromRequest(tabId: number, { headers, url }) {
    const tab = await chrome.tabs.get(tabId);
    const newCookies = headers
      .map(mkHeaderToCookie(url, tab.url))
      .filter(
        (x: Cookie | undefined) => !!x
      );
    await updateStorage(tabId + '', empty, (x: StorageValue) => ({
      ...x, cookies: [...x.cookies, ...newCookies]
    }))
  },
  async updateTabLocation(tabId: number, url) {
    // console.log("new url", tabId, url)
    await updateStorage(tabId + '', empty, (x: StorageValue) => ({
      ...x, cookies: [], url
    }))
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

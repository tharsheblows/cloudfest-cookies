import { cookieInfoHashMap } from './analyticsCookies';

let _cookies: Cookie[] = [];
let _listeners: (() => void)[] = [];

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

type Cookie = {
  id: string;
  SameSite: string;
  domain: string;
  expires: string;
  initiator: string;
  path: string;
  keyName: string;
  url: string;
  analytics: CookieAnalytics;
};

type CookieStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Cookie[];
  addCookie: (cookie: Cookie) => void;
  jsonToCookie: (cookieJson: JSON) => Cookie;
  jsonToCookieAnalytics: (cookieJson: JSON) => CookieAnalytics;
};

function emitChange() {
  for (let listener of _listeners) {
    listener();
  }
}

function getJsonAttributeIgnoreCase(json: JSON, attrName: string) {
  return json.hasOwnProperty(attrName)
    ? //@ts-ignore
      json[attrName]
    : //@ts-ignore
      json[attrName.toLowerCase()];
}

export const cookies: CookieStore = {
  addCookie(cookie: Cookie) {
    _cookies = _cookies.concat([cookie]);
    emitChange();
  },
  subscribe(listener) {
    _listeners = _listeners.concat([listener]);
    return () => {
      _listeners = _listeners.filter((x) => x === listener);
    };
  },
  getSnapshot() {
    return _cookies.slice();
  },
  jsonToCookie(cookieJson: JSON) {
    let directions = new Set<string>([
      'samesite',
      'domain',
      'expires',
      'url',
      'path',
      'initiator',
      'priority',
    ]);
    let keyName: string;

    for (let key of Object.keys(cookieJson)) {
      if (!directions.has(key.toLowerCase())) {
        keyName = key;
        break;
      }
    }

    let cookie: Cookie = {
      id: '',
      SameSite: getJsonAttributeIgnoreCase(cookieJson, 'SameSite'),
      domain: getJsonAttributeIgnoreCase(cookieJson, 'Domain'),
      expires: getJsonAttributeIgnoreCase(cookieJson, 'Expires'),
      path: getJsonAttributeIgnoreCase(cookieJson, 'Path'),
      url: getJsonAttributeIgnoreCase(cookieJson, 'Url'),
      initiator: getJsonAttributeIgnoreCase(cookieJson, 'Initiator'),
      keyName: keyName,
      analytics: undefined,
    };

    return cookie;
  },
  jsonToCookieAnalytics(cookieAnalyticsJson: JSON) {
    let cookieAnalytics: CookieAnalytics = {
      id: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'ID'),
      platform: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Platform'),
      category: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Category'),
      subCategory: undefined,
      functionality: undefined,
      description: getJsonAttributeIgnoreCase(
        cookieAnalyticsJson,
        'Description'
      ),
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
  },
};

export function loadCookiesStore(cookiesJSON: JSON[]) {
  for (const cookieJSON of cookiesJSON) {
    let cookie: Cookie = cookies.jsonToCookie(cookieJSON);

    if (
      cookie.keyName != undefined &&
      cookieInfoHashMap.hasOwnProperty(cookie.keyName)
    ) {
      // @ts-ignore
      let analyticsFromCsvJSON = cookieInfoHashMap[cookie.keyName][0];
      cookie.analytics = cookies.jsonToCookieAnalytics(analyticsFromCsvJSON);
    }

    cookies.addCookie(cookie);
  }
}

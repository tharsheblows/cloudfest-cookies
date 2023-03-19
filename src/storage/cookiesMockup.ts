let _cookies: Cookie[] = [];
let _listeners: (() => void)[] = [];

type CookieAnalytics = {
  id: string,
  platform: string,
  category: string,
  subCategory: string,
  functionality: string,
  description: string,
  dataController: string,
  GDPRPortal: string,
  retentionPeriod: string,
  usage: string,
  popularity: string,
  comment: string[]
}

type Cookie = {
  id: string,
  SameSite: string,
  domain: string,
  expires: string,
  initiator: string,
  path: string,
  keyName: string,
  url: string,
  analytics: CookieAnalytics
}

type CookieStore = {
  subscribe: (listener: () => void) => (() => void)
  getSnapshot: () => Cookie[]
  addCookie: (cookie: Cookie) => void
}

function emitChange() {
  for (let listener of _listeners) {
    listener();
  }
}

//Load JSON file containing mockup cookies
async function getCookiesMockup(){

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
    return _cookies.slice();
  }
};

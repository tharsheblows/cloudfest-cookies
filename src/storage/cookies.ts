let _cookies: Cookie[] = [];
let _listeners: (() => void)[] = [];

type Cookie = {}
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

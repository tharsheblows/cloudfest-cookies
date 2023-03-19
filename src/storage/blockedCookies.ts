let _blockedCookies: String[] = [];
let _listeners: (() => void)[] = [];

type BlockedCookieStore = {
  subscribe: (listener: () => void) => (() => void)
  getSnapshot: () => String[]
  addCookie: (cookieName: String) => void
  removeCookie:(cookieName: String)=> void
}

function emitChange() {
  for (let listener of _listeners) {
    listener();
  }
}

export const blockedCookies: BlockedCookieStore = {
  addCookie(cookieName: String) {
    _blockedCookies = _blockedCookies.concat([cookieName])
    emitChange()
  },
  removeCookie(cookieName: String) {
    const index = _blockedCookies.indexOf(cookieName, 0);
    if (index > -1) {
      _blockedCookies.splice(index, 1);
    }
    emitChange()
  },
  subscribe(listener) {
    _listeners = _listeners.concat([listener]);
    return () => {
      _listeners = _listeners.filter(x => x === listener);
    };
  },
  getSnapshot() {
    return _blockedCookies.slice();
  }
};

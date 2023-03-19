let _blockedCookies: String[] = [];
let _listeners: (() => void)[] = [];

type BlockedCookieStore = {
  subscribe: (listener: () => void) => (() => void)
  getSnapshot: () => String[]
  addCookie: (cookieName: String) => void
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

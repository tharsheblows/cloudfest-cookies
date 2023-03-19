import { useSyncExternalStore } from 'react';
import { cookies } from './cookies';

export function useCookies() {
  const getCookiesSnapshot = () => cookies.getSnapshot();
  const subscribe = (callback) => cookies.subscribe(callback);

  const cookieData = useSyncExternalStore(subscribe, getCookiesSnapshot);

  return cookieData;
}

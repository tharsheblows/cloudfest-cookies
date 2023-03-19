import { Bars3Icon } from '@heroicons/react/24/solid';
import { useState, useSyncExternalStore } from 'react';
import { cookies } from '../../cookies';
import logo from '../../images/take-a-bite-green.svg';
import CookiePreview from '../CookiePreview';
import DummySort from '../DummySort';
import Overlay from '../Overlay';
import Sidebar from '../Sidebar';
import CookieDetails from '../CookieDetails';

const cookiesTemp = [
  {
    id: 'someid3',
    name: 'UserMatchHistory',
    url: '.linkedin.com',
    value:
      'AQKZWm9of69k1AAAAYb5BJOfgLvem54nsBIaSvOSw6vuG07D7zR-yEbZr87bWVCEYbt_qZmkuln8Dw',
    category: 'tracking',
    active: false,
  },
  {
    id: 'someid1',
    name: 'cookiefirst-consent',
    url: 'www.cloudfest.com',
    value:
      '%7B%22necessary%22%3Atrue%2C%22performance%22%3Atrue%2C%22functional%22%3Atrue%2C%22advertising%22%3Atrue%2C%22timestamp%22%3A1679215079%2C%22type%22%3A%22category%22%2C%22version%22%3A%22c838beda-6c15-421b-87b0-0cfb408b5bdf%22%7D',
    category: 'analytics',
    active: true,
  },
  {
    id: 'someid2',
    name: 'ln_or',
    url: 'www.cloudfest.com',
    value: 'eyI0MzMxNzM4IjoiZCJ9',
    category: 'session',
    active: true,
  },

  {
    id: 'someid4',
    name: 'guest_id',
    url: '.twitter.com',
    value: 'v1%3A167921507214501224',
    category: 'analytics',
    active: true,
  },
];

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCookie, setCurrentCookie] = useState({});
  const { subscribe, getSnapshot } =
    /*global chrome .*/
    cookies.getSyncStore(chrome?.devtools?.inspectedWindow?.tabId);
  const cookieData = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <>
      <div className="flex h-full min-h-screen">
        <Overlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
              <div>
                <img className="h-8 w-auto" src={logo} alt="Your Company" />
              </div>
              <div>
                <button
                  type="button"
                  className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <aside className="relative w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 flex flex-col">
              <div className="bg-white lg:min-w-0 lg:flex-1">
                <DummySort />
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-b border-gray-200"
                >
                  {cookieData.cookies.map((cookie) => (
                    <li key={cookie.id}>
                      <CookiePreview
                        cookie={cookie}
                        isActive={cookie.id === currentCookie.id}
                        onClick={() => setCurrentCookie(cookie)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
              <CookieDetails cookie={currentCookie} />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

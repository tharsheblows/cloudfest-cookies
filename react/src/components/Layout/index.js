import { Bars3Icon } from '@heroicons/react/24/solid';
import { useState, useSyncExternalStore } from 'react';
import { cookies } from '../../cookies';
import logo from '../../images/take-a-bite-green.svg';
import CookiePreview from '../CookiePreview';
import DummySort from '../DummySort';
import Overlay from '../Overlay';
import Sidebar from '../Sidebar';
import CookieDetails from '../CookieDetails';

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCookie, setCurrentCookie] = useState(undefined);
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
                  {cookieData.cookies.map(
                    ({ cookie, analytics, origin, toplevel }, idx) => {
                      return (
                        <li key={idx}>
                          <CookiePreview
                            cookie={cookie}
                            analytics={analytics}
                            origin={origin}
                            toplevel={toplevel}
                            isActive={false}
                            onClick={() =>
                              setCurrentCookie({ cookie, analytics })
                            }
                          />
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </aside>
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
              {currentCookie ? (
                <CookieDetails
                  cookie={currentCookie.cookie}
                  analytics={currentCookie.analytics}
                />
              ) : (
                []
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

import React from 'react';

const CookiePreview = ({
  cookie,
  analytics,
  origin,
  toplevel,
  isActive,
  onClick,
}) => {
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <a
      href="#"
      className={classNames(
        isActive ? 'bg-gray-50' : '',
        'block hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div
            className={classNames(
              isActive ? 'font-bold' : 'font-medium',
              'truncate text-sm text-indigo-600'
            )}
          >
            <span>{cookie.name}</span>
          </div>
          <div className="ml-2 flex flex-shrink-0">
            <span className="bg-blue-400 mr-1 text-white inline-flex rounded-full px-2 text-xs font-semibold leading-5">
              {analytics?.category || 'Uncategorized'}
            </span>
            <span
              className={classNames(
                toplevel.includes(cookie.domain)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-400 text-white',
                'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
              )}
            >
              {toplevel.includes(cookie.domain) ? '1st Party' : '3rd Party'}
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <div className="truncate max-w-full flex text-sm text-gray-500 sm:flex">
            <span>{cookie.value}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CookiePreview;

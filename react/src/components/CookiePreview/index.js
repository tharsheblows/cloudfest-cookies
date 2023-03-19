import React from 'react';

const CookiePreview = ({ cookie }) => {
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <a href="#" className="block hover:bg-gray-50">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="truncate text-sm font-medium text-indigo-600">
            <span>{cookie.name}</span>
          </div>
          <div className="ml-2 flex flex-shrink-0">
            <span className="bg-blue-400 mr-1 text-white inline-flex rounded-full px-2 text-xs font-semibold leading-5">
              {cookie.category}
            </span>
            <span
              className={classNames(
                cookie.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-400 text-white',
                'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
              )}
            >
              {cookie.active ? '1st Party' : '3rd Party'}
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

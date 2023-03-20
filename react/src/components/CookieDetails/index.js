import { PaperClipIcon } from '@heroicons/react/20/solid';

const CookieDetails = ({ cookie, analytics }) => {
  return true ? (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {cookie.name} {`(${analytics?.platform})` || ''}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {analytics?.description || 'No description available.'}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {cookie &&
            Object.entries(cookie).map(([key, value]) => {
              return (
                typeof value === 'string' && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900 break-all">
                      {value || '-'}
                    </dd>
                  </div>
                )
              );
            })}
        </dl>
      </div>
    </div>
  ) : (
    <div className="p-12 min-h-screen flex justify-center">
      <div className="text-xl text-blue-600/[.5]">Please choose a cookie</div>
    </div>
  );
};

export default CookieDetails;

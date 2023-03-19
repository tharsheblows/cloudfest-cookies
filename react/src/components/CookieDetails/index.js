const CookieDetails = ({ cookie }) => {
  return Object.keys(cookie).length > 0 ? (
    <div className="p-12">
      <h1 className="text-2xl">{cookie.name}</h1>
      <p className="max-w-md break-words">{JSON.stringify(cookie)}</p>
    </div>
  ) : (
    <div className="p-12 min-h-screen flex justify-center">
      <div className="text-xl text-blue-600/[.5]">Please choose a cookie</div>
    </div>
  );
};

export default CookieDetails;

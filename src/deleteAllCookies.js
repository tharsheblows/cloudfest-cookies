
export default function () {
  // Thank you nameless user https://stackoverflow.com/questions/74021842/chrome-extension-remove-cookies.
  //get all cookies belongs to us and allowed by the host_permissions:
  chrome.cookies.getAll({}, function (cookies) {
    console.log('cookies:', cookies); //<=== Check the cookies I get here below;

    //loop the cookies:
    cookies.forEach(function (cookie, i) {
      let cookieUrl = 'http';
      cookieUrl += cookie.secure ? 's' : '';
      cookieUrl += '://' + cookie.domain + cookie.path;

      //remove this cookie:
      chrome.cookies.remove(
        {
          url: cookieUrl,
          name: cookie.name,
        },
        function (removedCookie) {
          console.log('removedCookie:', removedCookie); //<=== Why do I get an empty value here?
        }
      );
    });
  });
}


(function () {
 const badCookieAudio = new Audio(
   'https://porchy.co.uk/wp-content/uploads/2023/03/mixkit-dog-barking-twice-1.wav'
 );

  // Listen for a bark.
   chrome.runtime.onMessage.addListener(async function (
     request,
     sender,
     sendResponse
   ) {
     if (request.action === 'makeASound') {

      const cookies = request.cookies;

      cookies.forEach((c) => {
        const hostname = window.location.hostname;
        const cookie = new URL(c.url);

        const firstParty = hostname === cookie.hostname;

        if (!firstParty) {
          badCookieAudio.play();
        }
      })
       return { message: 'makeASound' };
     }
   });

})();

  // Responsible for listening for a request to send the cookies to the browser.




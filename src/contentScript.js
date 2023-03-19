
(function () {
console.log('Just add some content reactions');
  console.log('here')
   chrome.runtime.onMessage.addListener(function (
     request,
     sender,
     sendResponse
   ) {
     if (request.action === 'makeASound') {

      const cookies = request.cookies;
      console.log({cookies})
      cookies.forEach((c) => {
       const hostname = window.location.hostname;
       console.log({ hostname });
       const cookie = new URL(c.url);
       console.log({ cookie });

       const firstParty = hostname === cookie.hostname;

       if (!firstParty) {
         let badCookieAudio = new Audio(
           'https://porchy.co.uk/wp-content/uploads/2023/03/mixkit-dog-barking-twice-1.wav'
         );
         badCookieAudio.play();
       }
      })
       return { message: 'makeASound' };
     }
   });

})();

  // Responsible for listening for a request to send the cookies to the browser.




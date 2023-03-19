console.log("Just add some content reactions")

  // Responsible for listening for a request to send the cookies to the browser.
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {

    if (request.action === 'makeASound') {
      console.log({ request });
      let badCookieAudio = new Audio('../public/door-knock-1.wav');
      badCookieAudio.play();
      return { message: 'makeASound' }
    }
  });

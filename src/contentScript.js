import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()


const badCookieAudio = new Audio(
  'https://porchy.co.uk/wp-content/uploads/2023/03/cookieMonster.wav'
);

// Listen for a bark.
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === 'makeASound') {
    const cookies = request.cookies;
    let thirdPartyCookieCount = 0;
    let thirdPartyCookies = false;
    cookies.forEach((c) => {
      const hostname = window.location.hostname;
      const cookie = new URL(c.url);
      const firstParty = hostname.includes( cookie.hostname );

      if (!firstParty) {
        thirdPartyCookieCount++;
        thirdPartyCookies = true;
      }
    });
    if ( thirdPartyCookies ) {
      jsConfetti.clearCanvas();
      jsConfetti.addConfetti({
        emojis: ['🍪'],
        confettiNumber: thirdPartyCookieCount * 5,
      });
      badCookieAudio.play();
    }


  }
});


let readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
   // runScript()
  }
}, Math.random() * 10000 + 1000);

function runScript() {

  setTimeout(() => {

    if (Math.random() > 0.75) {
      const emojies = []
      for (let i = 0; i < 12; i++) {
        const emojiRegex = /\p{Emoji}/u;
        const potEmoji = String.fromCodePoint(128516 + Math.ceil(Math.random() * 598));
        if (emojiRegex.test(potEmoji)) {
          emojies.push(potEmoji)
        } else {
          i--;
        }

      }
      jsConfetti.addConfetti({emojis: emojies, confettiNumber: 500})
    } else if (Math.random() > 0.25) {
      jsConfetti.addConfetti({
        confettiNumber: Math.random() * 1000 + 1000,
        confettiSpeed: {x: Math.random(), y: Math.random()}
      })
    } else {
      jsConfetti.addConfetti({
        emojis: ['TLT️'],
        confettiNumber: 1000,
      })
      console.log(`                                                                   ‚
         ,----,   ,--,           ,----,
      ,/   .\`|,---.'|         ,/   .\`|
    ,\`   .'  :|   | :       ,\`   .'  :
  ;    ;     /:   : |     ;    ;     /
.'___,/    ,' |   ' :   .'___,/    ,'
|    :     |  ;   ; '   |    :     |
;    |.';  ;  '   | |__ ;    |.';  ;
\`----'  |  |  |   | :.'|\`----'  |  |
    '   :  ;  '   :    ;    '   :  ;
    |   |  '  |   |  ./     |   |  '
    '   :  |  ;   : ;       '   :  |
    ;   |.'   |   ,/        ;   |.'
    '---'     '---'         '---'


                                                                          ‘
`);
    }

  })
}


// Responsible for listening for a request to send the cookies to the browser.




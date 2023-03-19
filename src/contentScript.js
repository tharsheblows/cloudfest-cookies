import JSConfetti from 'js-confetti'


let readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    runScript()
  }
}, Math.random() * 10000 + 1000);

function runScript() {

  setTimeout(() => {


    const jsConfetti = new JSConfetti()
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

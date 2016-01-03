/* eslint no-console:0 */
// Leave a pretty printed message in console letting users know that
// Freshest Squid's source code is free and open-source

const css = 'font-family: "Arial";' +
            'font-size: 24px;' +
            'font-weight: bold';

const message1 = 'Hey Squiddo!';

const message2 = 'Are you interested in seeing the code that powers Freshest Squid?';

const message3 = 'Freshest Squid\'s source code is available on GitHub for free!\n' +
                  'https://github.com/chrisngobanh/freshestsquid';
console.log(`%c${message1}`, css);
console.log(`%c${message2}`, css);
console.log(`%c${message3}`, css);

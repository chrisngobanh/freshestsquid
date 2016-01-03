/* eslint id-length: 0 */

import $ from 'jquery';

import './console';
import '../../shared/router';

const $document = $(document);
const $html = $('html');
const $loading = $('#loading');
const $window = $(window);

let altcrement = -1;

$document.ready(() => {
  // Event listener for when the window changes
  $window.resize(() => {
    if (screen.height > screen.width) {
      switch (window.orientation) {
        case 'portrait-primary':
        case 'portrait-secondary':

          // TODO: Please turn your phone
          break;
        default:

          // TODO: Please resize your window to be wider
      }
    }

    // The purpose of these lines is to fix the viewport units when the window is resized
    const currentFontSize = parseFloat($('html').css('font-size'));
    $html.css('font-size', currentFontSize + (altcrement *= -1) + 'px');
  });

  // Remove the loading screen
  $loading.remove();
});

// ==UserScript==
// @name         Higher Contrast in Jira Rapid Board for Standup
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Clicks to the title link on a card should open the actual card, not the Detail View. Otherwise, why is it a link???
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://*/secure/RapidBoard.jspa*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-highlight.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-highlight.js
// ==/UserScript==

// TODO: PLEASE NOTE THIS IS EXTREMELY BUGGY, THUS NOT QUITE FUNCTIONAL YET!

(function() {
  'use strict';

  // add button to page to activate/deactivate "Standup Mode"
  // on click of button, toggle button state and toggle bright border highlight functionality

  var NAMESPACE = 'adriantp-jira-standup',
      UNIQUE_OVERLAY_ID = `${NAMESPACE}-overlay`,
      UNIQUE_CLASS_NAME = `${NAMESPACE}-active`,
      CONTAINER_SELECTOR = '#ghx-pool-column',
      BUTTON_TEXT_ENABLED = 'Disable Standup Mode',
      BUTTON_TEXT_DISABLED = 'Enable Standup Mode',
      BUTTON_PARENT_SELECTOR = 'ul.aui-nav',
      JIRA_CARD_SELECTOR = '.ghx-issue',
      style = `#${UNIQUE_OVERLAY_ID} {
                 pointer-events: none;
                 position: absolute;
                 display: none;
                 z-index: 100;
                 top: 0;
                 left: 0;
                 width: 0;
                 height: 0;
                 background: transparent;
                 margin: 0;
                 padding: 0;
                 /*border: 5px solid #F00;*/
                 box-shadow: 0 0 5px 5px #00F;
                 transition: width 1s, height 1s, width: 1s, height: 1s;
               }`,
//
//               ${CONTAINER_SELECTOR}.${UNIQUE_CLASS_NAME} #${UNIQUE_OVERLAY_ID} {
//                 display: block;
//               }`,
      button = document.createElement('button'),
      overlay = document.createElement('div'),
      overlayPlayer = null,
      rapidboard = null,
      // Taken from https://stackoverflow.com/a/442474/771948
      // because getBoundingClientRect() does not provide me with absolute values...
//      getOffset = function getOffset( el ) {
//          //     var x = getOffset( document.getElementById('yourElId') ).left;
//          var _x = 0;
//          var _y = 0;
//          while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
//              _x += el.offsetLeft - el.scrollLeft;
//              _y += el.offsetTop - el.scrollTop;
//              el = el.offsetParent;
//          }
//          return { top: _y, left: _x };
//      },
      hoverFollow = function hoverFollow(e) {
        var card = e.target.closest(JIRA_CARD_SELECTOR),
            container = e.target.closest(CONTAINER_SELECTOR);

        console.log('mouseover', e.target, card, container, overlay);

        if (!container || !container.classList.contains(UNIQUE_CLASS_NAME)) {
          return true;
        }

        if (card) {
          var rect = card.getBoundingClientRect();
//          var rect = getOffset(card);

          overlay.style.display = 'block'; // TODO: temporary, until i can figure out smooth animations and scrolling

          overlay.style.left = `${rect.left + container.scrollLeft}px`;
          overlay.style.top = `${rect.top + container.scrollTop}px`;
          overlay.style.width = `${rect.width}px`;
          overlay.style.height = `${rect.height}px`;

          // TODO: from what I have read, this should force recalculation, thus triggering transitions...but nope.
          overlay.offsetLeft;
          overlay.offsetTop;
          overlay.offsetWidth;
          overlay.offsetHeight;

// TODO: figure out smooth animation of overlay properties -- this should work, but the CSS transitions are not triggering when the properties are changed via JS.
//          if (overlayPlayer && !overlayPlayer.finished) {
//            overlayPlayer.cancel();
//          }
//
//          overlayPlayer = overlay.animate([
//            { transform: `translate(${rect.left + container.scrollLeft}px, ${rect.top + container.scrollTop}px)` },
//            { left: `${rect.left + container.scrollLeft}px` },
//            { top: `${rect.top + container.scrollTop}px` },
//            { width: `${rect.width}px` },
//            { height: `${rect.height}px` }
//          ], {
//            easing: 'ease-in-out',
//            duration: 1000
//          });

//          overlay.style.width = `${card.offsetWidth}px`;
//          overlay.style.height = `${card.offsetHeight}px`;

//          console.log(container.scrollX, container.scrollY, container.scrollLeft, container.scrollTop);
//          console.log('rects', card.getBoundingClientRect(), overlay.getBoundingClientRect());
        } else {
          overlay.style.display = 'none'; // TODO: temporary, until i can figure out smooth animations and scrolling
        }

        // TODO: floating overlay element
        //       1. get size of hovered element
        //       2. move overlay element over hovered element
        //       3. smoothly animate move and resize operations
      },
      init = function init() {
        var styleTag = document.createElement('style'),
            nav = document.querySelector(BUTTON_PARENT_SELECTOR),
            li = document.createElement('li');

        overlay.id = UNIQUE_OVERLAY_ID;

//        GM_addStyle(style); // TODO: figure out why the fuck this doesn't work
        styleTag.innerText = style;
        document.head.appendChild(styleTag);

        button.innerText = BUTTON_TEXT_DISABLED;
        button.classList.add('aui-button', 'aui-button-primary', 'aui-style');
        li.appendChild(button);
        nav.appendChild(li);

        button.addEventListener('click', () => {
          if (!rapidboard) {
            rapidboard = document.querySelector(CONTAINER_SELECTOR);
            rapidboard.addEventListener('mouseover', hoverFollow);
//            rapidboard.addEventListener('mouseout', hoverFollow);
            rapidboard.addEventListener('scroll', hoverFollow);
//            rapidboard.appendChild(overlay);
            document.body.appendChild(overlay);
            // TODO: figure out how to position the overlay properly inside the
            //       scrolling element so it follows the cards and hides appropriately
            //       behind the header
            //       #ghx-pool-column (scroller)
            //       #ghx-column-header-group (sticky column headers)
            //       #ghx-pool (where the cards go) <-- put the overlay in here
          }

          rapidboard.classList.toggle(UNIQUE_CLASS_NAME);

          if (rapidboard.classList.contains(UNIQUE_CLASS_NAME)) {
            button.innerText = BUTTON_TEXT_ENABLED;
          } else {
            overlay.style.display = 'none';
            button.innerText = BUTTON_TEXT_DISABLED;
          }
        });
      };

  init();
})();

// ==UserScript==
// @name         (Simplified) Higher Contrast in Jira Rapid Board for Standup
// @namespace    https://github.com/AdrianTP
// @version      0.2
// @description  Highlights the hovered card in JIRA's Rapid Board view to make standups a little bit easier.
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://*/secure/RapidBoard.jspa*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-highlight-simplified.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-highlight-simplified.js
// ==/UserScript==

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-jira-standup',
      UNIQUE_ACTIVE_CLASS = `${NAMESPACE}-active`,
      UNIQUE_BUTTON_CLASS = `${NAMESPACE}-button`,
      BUTTON_TEXT_ENABLED = 'Disable Standup Mode',
      BUTTON_TEXT_DISABLED = 'Enable Standup Mode',
      BUTTON_PARENT_SELECTOR = 'ul.aui-nav',
      JIRA_CARD_SELECTOR = '.ghx-issue',
      style = `/* thanks to https://alligator.io/css/transition-box-shadows/ for the optimisation */
        .${UNIQUE_ACTIVE_CLASS} ${JIRA_CARD_SELECTOR} {
           position: relative;
         }

        .${UNIQUE_ACTIVE_CLASS} ${JIRA_CARD_SELECTOR}::before {
          content: ' ';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          box-shadow: 0 0 4px 4px #00F;
          border-radius: 1px;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          pointer-events: none;
        }

        .${UNIQUE_ACTIVE_CLASS} ${JIRA_CARD_SELECTOR}:hover::before {
          opacity: 1;
        }

        .${UNIQUE_BUTTON_CLASS}:focus {
          outline: none;
        }`,
      button = document.createElement('button'),
      navLi = document.createElement('li'),
      init = function init() {
        var styleTag = document.createElement('style'),
            nav = document.querySelector(BUTTON_PARENT_SELECTOR);

//        GM_addStyle(style); // TODO: figure out why the fuck this doesn't work
        styleTag.innerHTML = style;
        document.head.appendChild(styleTag);

        button.innerText = BUTTON_TEXT_DISABLED;
        button.classList.add('aui-button', 'aui-button-primary', 'aui-style', UNIQUE_BUTTON_CLASS);
        navLi.appendChild(button);
        nav.appendChild(navLi);

        button.addEventListener('click', () => {
          document.body.classList.toggle(UNIQUE_ACTIVE_CLASS);

          if (document.body.classList.contains(UNIQUE_ACTIVE_CLASS)) {
            button.innerText = BUTTON_TEXT_ENABLED;
          } else {
            button.innerText = BUTTON_TEXT_DISABLED;
          }
        });
      };

  init();
})();

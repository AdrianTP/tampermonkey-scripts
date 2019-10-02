// ==UserScript==
// @name         Flexible Detail View in Jira Rapid Board
// @namespace    https://github.com/AdrianTP
// @version      0.2
// @description  Clicks to the title link on a card should open the actual card, not the Detail View. Otherwise, why is it a link???
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://*/secure/RapidBoard.jspa*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-links-click-through.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/jira.rapid-board-card-links-click-through.js
// ==/UserScript==

(function() {
  'use strict';

  var clickOverrideHandler = function clickOverrideHandler(e) {
        if(e.target.closest('a.ghx-key-link')) {
          e.stopPropagation();
          return true;
        }
      },
      init = function init() {
        document.addEventListener('click', clickOverrideHandler, true);
      };

  init();
})();

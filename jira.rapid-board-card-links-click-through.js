// ==UserScript==
// @name         Flexible Detail View in Jira Rapid Board
// @namespace    https://github.com/AdrianTP
// @version      0.1
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

  var findAncestor = function findAncestor(el, constructor) {
        var roots = [HTMLHtmlElement, HTMLDocument];

        if (el.constructor === constructor) {
          return el; // current element matches
        } else if (roots.includes(el.constructor) && !roots.includes(constructor)) {
          return null; // we hit the document root but we were not looking for it -- no matching parent element
        } else if (roots.includes(el.constructor) && roots.includes(constructor)) {
          return el; // current element is root and we happened to be looking for root
        } else {
          return findAncestor(el.parentNode, constructor); // recurse
        }
      },
      modifiersPressed = function modifiersPressed(e) {
        return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
      },
      clickOverrideHandler = function clickOverrideHandler(e) {
        if (e.type === 'click') {
          var anchorEl = findAncestor(e.target, HTMLAnchorElement);

          if (anchorEl === null || modifiersPressed(e)) {
            return true;
          } else if (anchorEl.parentNode.className.includes('ghx-key')) {
            window.location.href = anchorEl.href;
            e.preventDefault();
            e.stopPropagation();
          }
        }
      },
      init = function init() {
        document.addEventListener('click', clickOverrideHandler, true);
      };

  init();
})();

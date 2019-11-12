// ==UserScript==
// @name         Slack Web App Print Entire Chat
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Collect all hot-loaded-and-swapped messages in a chat in chronological order for export
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://app.slack.com/client*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/slack.collect-messages.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/slack.collect-messages.js
// ==/UserScript==

(function() {
  var ITEM_CLASS = 'c-virtual_list__item',
    container = document.querySelector('[data-qa="slack_kit_list"]'),
    els = [],
    ids = [],
    observer = new MutationObserver((mutations, observer) => {
      console.log('mutations:', mutations);

      mutations.forEach((mutation) => {
        var i;

        if (mutation.target !== container) { return; }

        if (mutation.nextSibling) {
          i = els.indexOf(mutation.nextSibling) - 1;
        } else if (mutation.previousSibling) {
          i = els.indexOf(mutation.previousSibling);
        } else {
          i = els.length;
        }

        collectNodes(i, mutation.addedNodes);
      });
    }),
    collectNodes = function collectNodes(startIndex, nodes) {
      nodes.forEach(node => {
        var el;
        if (els.includes(node)) { return; }

        el = node.classList.contains(ITEM_CLASS) ?
             node :
             node.querySelector(`.${ITEM_CLASS}`);

        if (ids.includes(el.id)) { return; }

        els.splice(startIndex, 0, el);
        ids.push(el.id);
        startIndex += 1;
      });
    },
    init = function init() {
      collectNodes(0, container.childNodes);
      observer.observe(container, { childList: true });

      // TODO: auto-scroll to collect nodes
      // TODO: export
    };

  init();
})();

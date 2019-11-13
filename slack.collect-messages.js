// ==UserScript==
// @name         Slack Web App Print Entire Chat
// @namespace    https://github.com/AdrianTP
// @version      0.2
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

// TODO: add "record" and "print" buttons
// TODO: auto-scroll recording mode
//       i spent several hours reverse-engineering the code, only to be foiled
//       by a new version being deployed while i was debugging. i got as far as
//       triggering the react scroll event handler, but i have not been able to
//       figure out what i need to do in order to actually trigger the scroll
//       update routine (let alone figure out where in the code that happens).
//       react is confusing. i give up for now. - Adrian 2019-11-12

(function() {
  var NAMESPACE = 'adriantp-slack-collect'
    ITEM_CLASS = 'c-virtual_list__item',
    UNIQUE_OUTPUT_ID = `${NAMESPACE}-output`,
    EVENT_TARGET_SELECTOR = '[data-qa="message_pane"] [data-qa="slack_kit_scrollbar"].c-scrollbar__hider',
    EXPAND_TRIGGER_SELECTOR = '[data-qa="message_pane"] .expand-trigger',
    MESSAGE_CONTAINER_SELECTOR = '[data-qa="slack_kit_list"]',
    messageContainer = null,
    outputContainer = null,
    els = [],
    ids = [],
    style = `@media print {
      body > .p-client_container { display: none; visibility: hidden; opacity: 0; }
    }`,
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
             node.cloneNode(true) :
             node.querySelector(`.${ITEM_CLASS}`).cloneNode(true);

        if (ids.includes(el.id)) { return; }

        el.removeAttribute('style');

        els.splice(startIndex, 0, el);
        ids.push(el.id);
        startIndex += 1;
      });
    },
    triggerScroll = function triggerScroll() {
      var target = document.querySelector(EXPAND_TRIGGER_SELECTOR),
        fakeEventHash = {
          currentTarget: document,
          srcElement: target,
          target: target,
          type: 'scroll'
        },
        fakeEventInstance = new Event('scroll', fakeEventHash);

      target.dispatchEvent(fakeEventInstance);
    },
    print = function print() {
      if (els.length === 0) {
        displayMessage('The buffer is empty. Please record some messages first.');
      }

      outputContainer = document.createElement('div');

      document.body.insertAdjacentElement('afterbegin', outputContainer);

      outputContainer.id = UNIQUE_OUTPUT_ID;

      els.sort((first, second) => {
        var id1 = first.id.replace(/\./gi, ''),
          id2 = second.id.replace(/\./gi, '');

        if (id1 < id2) { return -1; }
        if (id1 > id2) { return 1; }
        return 0;
      }).forEach((el) => {
        outputContainer.appendChild(el);
      });

      outputContainer.childNodes.forEach((el) => {
        el.removeAttribute('style');
        el.style.position = 'static';
      });
    },
    reset = function reset() {
      observer.disconnect();
      els = [];
    },
    record = function record() {
      collectNodes(0, messageContainer.childNodes);
      observer.observe(container, { childList: true });
      displayMessage('Start at the bottom and scroll as far back as you want to capture');
    },
    stop = function stop() {
      outputContainer.remove();
    },
    displayMessage = function displayMessage(message) {
      alert(message); // TODO: gross. please use something other than `alert`
    },
    init = function init() {
      var styleTag = document.createElement('style');

      messageContainer = document.querySelector(MESSAGE_CONTAINER_SELECTOR);

      styleTag.innerText = style;
      document.head.appendChild(styleTag);

      window.addEventListener('beforeprint', output);

      window.addEventListener('afterprint', reset);
    };

  init();
})();

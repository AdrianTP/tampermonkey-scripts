// ==UserScript==
// @name         Slack Web App Print Entire Chat
// @namespace    https://github.com/AdrianTP
// @version      0.4.1
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

// TODO: auto-scroll recording mode
//       i spent several hours reverse-engineering the code, only to be foiled
//       by a new version being deployed while i was debugging. i got as far as
//       triggering the react scroll event handler, but i have not been able to
//       figure out what i need to do in order to actually trigger the scroll
//       update routine (let alone figure out where in the code that happens).
//       react is confusing. i give up for now. - Adrian 2019-11-12
// TODO: see slack-junk.js for a bunch of related garbage including failed
//       scroll trigger hacking. - Adrian 2019-11-13

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-slack-collect',
    UNIQUE_OUTPUT_ID = `${NAMESPACE}-output`,
    ARIA_LABELS = {
      printButton: 'Print this conversation history',
      recordButton: [
        'Scrape this conversation to be printed',
        'Stop scraping this conversation',
        'Clear the print cache'
      ]
    },
    MESSAGES = {
      print: 'The buffer is empty. Please record some messages first.',
      record: 'Start at the bottom and scroll as far back as you want to capture.'
    },
    OFF = 0, // not started, show record icon
    RECORDING = 1, // recording, show stop icon
    STOPPED = 2, // done, show reset icon
    UNIQUE_BUTTON_CLASS = `${NAMESPACE}-button`,
    ICON_CLASSES = {
      print: 'c-icon--print', // \E046 'print'
      record: [
        'c-icon--form-radio-checked', // \E703 'form-radio-checked'
        'c-icon--form-checkbox-checked', // \E701 'form-checkbox-checked'
        'c-icon--undo' // \E075 'undo'
      ]
    },
    SLACK_ITEM_CLASS = 'c-virtual_list__item',
    SLACK_DIVIDER_CLASS = 'c-virtual_list__sticky_container',
    SLACK_STICKY_CLASS = 'c-virtual_list__item--sticky',
    SLACK_BUTTONS_CONTAINER_SELECTOR = '[data-qa="channel_header__buttons"]',
    SLACK_MESSAGES_CONTAINER_SELECTOR = '[data-qa="slack_kit_list"]',
    slackButtonsContainer,
    slackMessagesContainer,
    outputContainer,
    styleTag,
    printButton,
    printIcon,
    recordButton,
    recordIcon,
    recordingState = OFF,
    prePrintDone = false,
    els = [],
    ids = [],
    style = `@media print {
      body > .p-client_container {
        display: none;
        visibility: hidden;
        opacity: 0;
      }
    }

    .${UNIQUE_BUTTON_CLASS}.red {
      color: #F00;
    }

    #${UNIQUE_OUTPUT_ID}.hide,
    .${UNIQUE_BUTTON_CLASS}.hide {
      display: none;
      visibility: hidden;
      opacity: 0;
      height: 0;
      width: 0;
      overflow: hidden;
    }`,
    messageScraper = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        var i;

        if (mutation.target !== slackMessagesContainer) { return; }

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

        el = node.classList.contains(SLACK_ITEM_CLASS) ?
             node.cloneNode(true) :
             node.querySelector(`.${SLACK_ITEM_CLASS}`).cloneNode(true);

        if (ids.includes(el.id)) { return; }

        el.removeAttribute('style');
        el.classList.remove(SLACK_STICKY_CLASS);

        els.splice(startIndex, 0, el);
        ids.push(el.id);
        startIndex += 1;
      });
    },
    prePrint = function prePrint() {
      if (!outputContainer) {
        outputContainer = document.createElement('div');
        outputContainer.id = UNIQUE_OUTPUT_ID;
        document.body.insertAdjacentElement('afterbegin', outputContainer);
      }

      outputContainer.classList.remove('hide');

      if (prePrintDone) { return; }

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

      prePrintDone = true;
    },
    postPrint = function postPrint() {
      outputContainer.classList.add('hide');
    },
    reset = function reset() {
      if (outputContainer) {
        while (outputContainer.lastChild) {
          outputContainer.lastChild.remove();
        }
      }

      els = [];
      ids = [];
      prePrintDone = false;
    },
    record = function record() {
      collectNodes(0, slackMessagesContainer.childNodes);
      messageScraper.observe(slackMessagesContainer, { childList: true });
      displayMessage(MESSAGES.record);
    },
    stop = function stop() {
      messageScraper.disconnect();
    },
    displayMessage = function displayMessage(message) {
      alert(message); // TODO: gross. please use something other than `alert`
    },
    printButtonHandler = function printHandler() {
      if (els.length === 0) {
        displayMessage(MESSAGES.print);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      window.print();
      return true;
    },
    updateButtons = function updateButtons() {
      ICON_CLASSES.record.forEach((iconClass, index) => {
        recordIcon.classList.toggle(iconClass, index === recordingState);
      });

      recordButton.classList.toggle('red', recordingState === OFF);

      recordButton.setAttribute('aria-label', ARIA_LABELS.recordButton[recordingState]);

      printButton.classList.toggle('hide', recordingState !== STOPPED);
    },
    recordButtonHandler = function recordHandler() {
      switch (recordingState) {
        case OFF:
          record();
          recordingState = RECORDING;
          break;
        case RECORDING:
          stop();
          recordingState = STOPPED;
          break;
        case STOPPED:
          reset();
          recordingState = OFF;
          break;
        default:
          recordingState = OFF;
          break;
      }

      updateButtons();
    },
    placeButtons = function placeButtons() {
      var cloneCandidate = slackButtonsContainer.childNodes[0];

      printButton = cloneCandidate.cloneNode(true);
      recordButton = cloneCandidate.cloneNode(true);

      printIcon = printButton.querySelector('i');
      recordIcon = recordButton.querySelector('i');

      printButton.classList.add(UNIQUE_BUTTON_CLASS);
      recordButton.classList.add(UNIQUE_BUTTON_CLASS);

      printButton.removeAttribute('data-qa');
      recordButton.removeAttribute('data-qa');

      printIcon.classList.remove(printIcon.classList[printIcon.classList.length - 1]);
      printIcon.classList.add(ICON_CLASSES.print);

      printButton.setAttribute('aria-label', ARIA_LABELS.printButton);

      recordIcon.classList.remove(recordIcon.classList[recordIcon.classList.length - 1]);

      updateButtons();

      slackButtonsContainer.insertAdjacentElement('afterbegin', printButton);
      slackButtonsContainer.insertAdjacentElement('afterbegin', recordButton);

      printButton.addEventListener('click', printButtonHandler);
      recordButton.addEventListener('click', recordButtonHandler);
    },
    findContainers = function findContainers() {
      slackButtonsContainer = document.querySelector(SLACK_BUTTONS_CONTAINER_SELECTOR);
      slackMessagesContainer = document.querySelector(SLACK_MESSAGES_CONTAINER_SELECTOR);
    },
    addStylesheet = function addStylesheet() {
      styleTag = document.createElement('style');
      styleTag.innerText = style;
      document.head.appendChild(styleTag);
    },
    addPrintEventListeners = function addPrintEventListeners() {
      window.addEventListener('beforeprint', prePrint);
      window.addEventListener('afterprint', postPrint);
    },
    waitForElements = function waitForElements(selectors, cb) {
      var domEls = selectors.map(i => document.querySelector(i)).filter(i => i !== null);

      console.log(domEls.length, selectors.length);

      if (domEls.length !== selectors.length) {
        window.requestAnimationFrame(()=>{ waitForElements(selectors, cb); });
      } else {
        cb();
      }
    },
    init = function init() {
      // TODO: figure out how to use MutationObserver for this, too
      waitForElements([SLACK_BUTTONS_CONTAINER_SELECTOR, SLACK_MESSAGES_CONTAINER_SELECTOR], () => {
        addStylesheet();
        findContainers();
        placeButtons();
        addPrintEventListeners();
      });
    };

  init();
})();

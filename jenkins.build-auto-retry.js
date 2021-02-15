// ==UserScript==
// @name         Jenkins Build Auto-Continue and Auto-Retry
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Make Jenkins need fewer clicks and less active oversight to build. Automatically re-run flappy failing tasks. Skip the Build Options page.
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://app.slack.com/client*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/jenkins.build-auto-retry.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/jenkins.build-auto-retry.js
// ==/UserScript==

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-jenkins-build-auto-retry',
    buildHistoryEl = document.querySelector('#buildHistory .pane-content tbody'),
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
    build1 = function build1() {
      // TODO:
      // find "Build with Parameters" button
      // if "Build with Parameters" button:
      //   set cookie "building"
      //   click "Build with Parameters" button
    },
    build2 = function build2() {
      // TODO:
      // find "Build" button
      // if "Build" button:
      //   delete cookie "building"
      //   click "Build" button
    },
    buttonHandler = function buttonHandler() {
      // TODO:
      // if first .build-row (or .transitive) contains .icon-red with [title^=Failure]:
      //   set cookie "watching"
      //   build1()
    },
    observer = function observer() {
      // TODO:
      // find first .build-row (or .transitive)
      // if contains .icon-blue with [title^=Success]:
      //   delete cookie "watching"
      //   kill observer
      //   alert('Build completed Successfully')
      // if contains .icon-red with [title^=Failure]:
      //   build1()
    },
    findContainers = function findContainers() {
      // TODO: change for this script:
      // slackButtonsContainer = document.querySelector(SLACK_BUTTONS_CONTAINER_SELECTOR);
      // slackMessagesContainer = document.querySelector(SLACK_MESSAGES_CONTAINER_SELECTOR);
    },
    addStylesheet = function addStylesheet() {
      styleTag = document.createElement('style');
      styleTag.innerHTML = style;
      document.head.appendChild(styleTag);
    },
    addPrintEventListeners = function addPrintEventListeners() {
      // TODO: change for this script:
      // window.addEventListener('beforeprint', prePrint);
      // window.addEventListener('afterprint', postPrint);
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
      // TODO: change for this script:
      // TODO: figure out how to use MutationObserver for this, too
      // waitForElements([SLACK_BUTTONS_CONTAINER_SELECTOR, SLACK_MESSAGES_CONTAINER_SELECTOR], () => {
      //   addStylesheet();
      //   findContainers();
      //   placeButtons();
      //   addPrintEventListeners();
      // });

      // TODO: MutationObserver on buildHistoryEl
      // if url ends with "build" and if read cookie "building":
      //   build2()
      // else:
      //   find first .build-row (or .transitive)
      //   if contains .icon-red with [title^=Failure] and if read cookie "watching":
      //     build1()
      //   else if contains .icon-anime and if read cookie "watching":
      //     attach observer to buildHistoryEl
      //   else if contains .icon-blue with [title^=Success]:
      //     delete cookie "watching"
      //     delete cookie "building"
    };

  init();

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

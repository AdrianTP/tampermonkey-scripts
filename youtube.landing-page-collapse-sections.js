// ==UserScript==
// @name         YouTube Landing Page Collapsible Sections
// @namespace    https://github.com/AdrianTP
// @version      0.3
// @description  Click landing page section titles to collapse/expand that section.
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @include      http*://*.youtube.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/youtube.landing-page-collapse-sections.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/youtube.landing-page-collapse-sections.js
// ==/UserScript==

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-youtube-landing-collapse',
    STORAGE_NAME = `${NAMESPACE}-cookie`,
    COLLAPSED_CLASS = `${NAMESPACE}-collapsed`,
    BROWSE_PARENT_SELECTOR = 'ytd-two-column-browse-results-renderer',
    BROWSE_ID = 'primary',
    HEADER_ID = 'grid-header',
    CONTENTS_ID = 'contents',
    styleTag = document.createElement('style'),
    style = `#${HEADER_ID} {
      cursor: pointer;
    }

    #${HEADER_ID}:hover {
      background: rgba(0, 0, 0, .1);
    }

    #${HEADER_ID} #title::before {
      content: "▾";
      width: 15px;
      margin-top: -3px;
      cursor: pointer;
    }

    .${COLLAPSED_CLASS} #${HEADER_ID} #title::before {
      content: "▸";
    }

    .${COLLAPSED_CLASS} #${CONTENTS_ID} {
      visibility: hidden;
    }`,
    // modified from: https://stackoverflow.com/q/13452626/771948
    setCookie = function setCookie(name, value = 1, expiredays = null) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = name + "=" + escape(value) + ((expiredays == null) ?
        "" :
        ";expires=" + exdate.toUTCString());
    },
    // taken from: https://stackoverflow.com/a/25490531/771948
    getCookieValue = function getCookieValue(a) {
      var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    },
    deleteCookie = function deleteCookie(a) {
      document.cookie = a + '= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    },
    toggle = function toggle(e) {
      var browseWrapper = document.querySelector(`#${BROWSE_ID}`);

      if (getCookieValue(STORAGE_NAME)) {
        deleteCookie(STORAGE_NAME);
      } else {
        setCookie(STORAGE_NAME);
      }

      loadState();
    },
    loadState = function loadState(){
      var browseWrapper = document.querySelector(`#${BROWSE_ID}`);

      browseWrapper.classList.toggle(COLLAPSED_CLASS, getCookieValue(STORAGE_NAME));
    },
    waitForElements = function waitForElements(selectors, cb) {
      var domEls = selectors.map(i => document.querySelector(i)).filter(i => i !== null);

      if (domEls.length !== selectors.length) {
        window.requestAnimationFrame(()=>{ waitForElements(selectors, cb); });
      } else {
        cb();
      }
    },
    init = function init() {
      styleTag.innerText = style;
      document.head.appendChild(styleTag);

      waitForElements([`#${BROWSE_ID}`, `#${HEADER_ID}`, `#${CONTENTS_ID}`], () => {
        // TODO: consider using MutationObserver instead: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        // TODO: example with Promises: https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
        document.querySelector(`#${HEADER_ID}`).addEventListener('click', toggle);

        loadState();
      });
    };

  init();
})();

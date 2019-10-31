// ==UserScript==
// @name         YouTube Landing Page Collapsible Sections
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Click landing page section titles to collapse/expand that section. Alt-click to collapse/expand all of them at once.
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

// TODO: style button

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-youtube-landing-collapse',
    STORAGE_NAME = `${NAMESPACE}-list`,
    COLLAPSED_CLASS = `${NAMESPACE}-collapsed`,
    BUTTON_TEXT_EXPANDED = 'HIDE ALL',
    BUTTON_TEXT_COLLAPSED = 'SHOW ALL',
    BUTTON_BAR_SELECTOR = 'ytd-masthead #buttons',
    BROWSE_PARENT_SELECTOR = 'ytd-two-column-browse-results-renderer',
    BROWSE_ID = 'primary',
    SECTION_PARENT_SELECTOR = 'ytd-section-list-renderer[page-subtype="home"]',
    SECTION_SELECTOR = 'ytd-shelf-renderer',
    TITLE_ID = 'title-container',
    CONTENTS_ID = 'contents',
    buttonParent = null,
    browseParent = null,
    sectionParent = null,
    styleTag = document.createElement('style'),
    button = document.createElement('button'),
    style = `${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR} #${TITLE_ID} {
      cursor: pointer;
    }

    ${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR} #${TITLE_ID}:hover {
      background: rgba(0, 0, 0, .1);
    }

    ${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR} #${TITLE_ID} h2::before {
      content: "▾";
      width: 15px;
      margin-top: -3px;
      cursor: pointer;
    }

    ${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR}.${COLLAPSED_CLASS} #${TITLE_ID} h2::before {
      content: "▸";
    }

    ${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR}.${COLLAPSED_CLASS} #${CONTENTS_ID} {
      display: none;
    }

    ${BROWSE_PARENT_SELECTOR}.${COLLAPSED_CLASS} #${BROWSE_ID} {
      display: none;
    }`,
    // taken from: https://stackoverflow.com/q/13452626/771948
    setCookie = function setCookie(c_name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ?
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
    superCollapsed = !! getCookieValue(STORAGE_NAME),
    loadState = function loadState() {
      button.innerText = superCollapsed ? BUTTON_TEXT_COLLAPSED : BUTTON_TEXT_EXPANDED;
      browseParent.classList.toggle(COLLAPSED_CLASS, superCollapsed);

      if (superCollapsed) {
        setCookie(STORAGE_NAME, 1, null);
      } else {
        deleteCookie(STORAGE_NAME);
      }
    },
    toggleAll = function toggleAll(state) {
      document.querySelectorAll(SECTION_SELECTOR).forEach((el)=>{
        el.classList.toggle(COLLAPSED_CLASS, state);
      });
    },
    toggle = function toggle(e) {
      var titleElement = e.target.closest(`#${TITLE_ID}`),
        sectionElement = e.target.closest(SECTION_SELECTOR);

      if (!titleElement || !sectionElement) {
        return true;
      }

      sectionElement.classList.toggle(COLLAPSED_CLASS);

      if (e.altKey) {
        toggleAll(sectionElement.classList.contains(COLLAPSED_CLASS));
      }
    },
    superToggle = function superToggle(e) {
      browseParent.classList.toggle(COLLAPSED_CLASS);

      superCollapsed = browseParent.classList.contains(COLLAPSED_CLASS);

      loadState();
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
//      GM_addStyle(style); // TODO: figure out why the fuck this doesn't work
      styleTag.innerText = style;
      document.head.appendChild(styleTag);

      waitForElements([`${BUTTON_BAR_SELECTOR} ytd-topbar-menu-button-renderer`, BROWSE_PARENT_SELECTOR, SECTION_PARENT_SELECTOR], () => {
        // TODO: consider using MusationObserver instead: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

        buttonParent = document.querySelector(BUTTON_BAR_SELECTOR);
        browseParent = document.querySelector(BROWSE_PARENT_SELECTOR);
        sectionParent = document.querySelector(SECTION_PARENT_SELECTOR);

        buttonParent.insertAdjacentElement('afterbegin', button);

        button.addEventListener('click', superToggle);
        sectionParent.addEventListener('click', toggle);

        loadState();
      });
    };

  init();
})();

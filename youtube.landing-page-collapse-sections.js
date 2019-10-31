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

// TODO: cookie or localStorage to save collapsed state and restore on page load

(function() {
  'use strict';

  var NAMESPACE = 'adriantp-youtube-landing-collapse',
    STORAGE_NAME = `${NAMESPACE}-list`,
    COLLAPSED_CLASS = `${NAMESPACE}-collapsed`,
    SECTION_PARENT_SELECTOR = 'ytd-section-list-renderer[page-subtype="home"]',
    SECTION_SELECTOR = 'ytd-shelf-renderer',
    TITLE_ID = 'title-container',
    CONTENTS_ID = 'contents',
    sectionParent = null,
    styleTag = null,
    style = `${SECTION_PARENT_SELECTOR} ${SECTION_SELECTOR} #${TITLE_ID} h2::before {
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
    }`,
    toggle = function toggle(e) {
      var titleElement = e.target.closest(`#${TITLE_ID}`),
        sectionElement = e.target.closest(SECTION_SELECTOR);

      if (!titleElement || !sectionElement) {
        return true;
      }

      sectionElement.classList.toggle(COLLAPSED_CLASS);

      if (e.altKey) {
        document.querySelectorAll(SECTION_SELECTOR).forEach((el)=>{
          el.classList.toggle(COLLAPSED_CLASS, sectionElement.classList.contains(COLLAPSED_CLASS));
        });
      }
    },
    init = function init() {
      styleTag = document.createElement('style');
      sectionParent = document.querySelector(SECTION_PARENT_SELECTOR);

//      GM_addStyle(style); // TODO: figure out why the fuck this doesn't work
      styleTag.innerText = style;
      document.head.appendChild(styleTag);

      sectionParent.addEventListener('click', toggle);
    };

  init();
})();

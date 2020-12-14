// ==UserScript==
// @name         Inara Tech Broker Calculator
// @namespace    https://github.com/AdrianTP
// @version      1.0
// @description  Adds a "Calculate" button to the Tech Broker page on Inara.cz to enable calculation of total materials required for multiple Unlocks
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://*.inara.cz/galaxy-techbroker*
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/inara.tech-broker-calculator.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/inara.tech-broker-calculator.js
// ==/UserScript==

/* jshint esversion: 6 */

(function($) {
  'use strict';

  var NAMESPACE = 'adriantp-inara-tech-broker',
    WRAPPER_SELECTOR = '.switchtabs',
    MODULE_HEADER_SELECTOR = 'h3', // document.queryString('#techbrokerslot2 h3').lastChild
    MODULE_BUTTONS_CONTAINER_SELECTOR = '.headerbuttons',
    QTY_PREFIX = `${NAMESPACE}-qty`,
    QTY_DATA_ATTRIBUTE_NAME = `${QTY_PREFIX}-in-bom`.replaceAll('-', '_'),
    QTY_CONTROLS_DISPLAY_FIELD_CLASS = `${QTY_PREFIX}-display`,
    QTY_CONTROLS_BUTTON_CLASS = `${QTY_PREFIX}-button`,
    MATERIAL_COST_SELECTOR = '.materialcount',
    MATERIAL_NAME_SELECTOR = '.tooltip a span',
    MATERIAL_STOCK_SELECTOR = '.minor.smaller',
    SIDE_CONTENT_SELECTOR = '.sidecontent1',
    SIDE_CONTENT_BUTTON_WRAPPER_CLASS = 'sidesubcontentwidth50',
    calculateButtonElement,
    wrapperElement,
    stock = {},
    cost = {},
    bom = {},
    calculate = function calculate() {
      var dialogContent = '<div class="inputblockdialog"><table>';

      Object.keys(cost).forEach(function(name) {
        if (name in stock && stock[name] < cost[name]) {
          bom[name] = cost[name] - stock[name];
          dialogContent += `<tr><td>${bom[name]}</td><td>${name}</td></tr>`;
        }
      });

      calculateButtonElement.dataset.dialogcontent = dialogContent + '</table></div>';
    },
    qtyButtonHandler = function qtyButtonHandler(e) {
      if (e.target.matches(`.${QTY_CONTROLS_BUTTON_CLASS}`)) {
        var buttonsWrapper = e.target.closest(MODULE_BUTTONS_CONTAINER_SELECTOR),
          currentQty = parseInt(buttonsWrapper.dataset[QTY_DATA_ATTRIBUTE_NAME], 10),
          multiplier = parseInt(e.target.dataset.multiplier, 10);

        if (currentQty + multiplier >= 0) {
          var moduleHeader = e.target.closest(MODULE_HEADER_SELECTOR),
            requirementsDiv = moduleHeader.nextSibling,
            prices = requirementsDiv.querySelectorAll(MATERIAL_COST_SELECTOR),
            names = requirementsDiv.querySelectorAll(MATERIAL_NAME_SELECTOR),
            haves = requirementsDiv.querySelectorAll(MATERIAL_STOCK_SELECTOR);

          if (prices.length === names.length && prices.length === haves.length) {
            prices.forEach(function(priceEl, i) {
              var price = parseInt(priceEl.innerText, 10),
                have = parseInt(haves[i].innerText.replace(/(\(|\))/g, ''), 10),
                name = names[i].innerText;

              if (!(name in stock)) {
                stock[name] = have;
              }

              if (name in cost) {
                cost[name] += multiplier * price;
              } else {
                cost[name] = price;
              }
            });

            buttonsWrapper.dataset[QTY_DATA_ATTRIBUTE_NAME] = currentQty + multiplier;
            buttonsWrapper.querySelector(`.${QTY_CONTROLS_DISPLAY_FIELD_CLASS}`).innerText = currentQty + multiplier;

          }

          calculate();
        }
      }
    },
    placeButtons = function placeButtons() {
      var moduleHeaders = wrapperElement.querySelectorAll(MODULE_HEADER_SELECTOR),
        sideContentWrapper = document.querySelector(SIDE_CONTENT_SELECTOR),
        calculateButtonWrapper = document.createElement('div');

      moduleHeaders.forEach(function(el) {
        var buttonsWrapper = el.querySelector(MODULE_BUTTONS_CONTAINER_SELECTOR),
          qtyDecreaseButton = document.createElement('div'),
          qtyDisplaySpan = document.createElement('span'),
          qtyIncreaseButton = document.createElement('div');

        qtyDecreaseButton.appendChild(document.createTextNode('-'));
        qtyDecreaseButton.classList.add('iconbutton', 'inlinebutton', 'clickable', 'clickbound', QTY_CONTROLS_BUTTON_CLASS);
        qtyDecreaseButton.setAttribute('title', 'Decrease number of this module in the BOM');
        qtyDecreaseButton.dataset.multiplier = '-1';

        qtyDisplaySpan.classList.add(QTY_CONTROLS_DISPLAY_FIELD_CLASS);
        qtyDisplaySpan.appendChild(document.createTextNode('0'));

        qtyIncreaseButton.appendChild(document.createTextNode('+'));
        qtyIncreaseButton.classList.add('iconbutton', 'inlinebutton', 'clickable', 'clickbound', QTY_CONTROLS_BUTTON_CLASS);
        qtyIncreaseButton.setAttribute('title', 'Increase number of this module in the BOM');
        qtyIncreaseButton.dataset.multiplier = '1';

        buttonsWrapper.appendChild(qtyDecreaseButton);
        buttonsWrapper.appendChild(qtyDisplaySpan);
        buttonsWrapper.appendChild(qtyIncreaseButton);

        buttonsWrapper.dataset[QTY_DATA_ATTRIBUTE_NAME] = 0;
      });

      calculateButtonElement = document.createElement('span');
      calculateButtonElement.classList.add('linkbutton', 'clickable');//, 'customdialog');
      calculateButtonElement.appendChild(document.createTextNode('Tech Broker BOM'));
      calculateButtonElement.dataset.dialogid = '1';
      calculateButtonElement.dataset.dialogtitle = 'Tech Broker Bill of Materials';
      calculateButtonElement.dataset.dialogcontent = '<div class="inputblockdialog">Please add Unlocks using the - and + buttons.</div>';

      calculateButtonWrapper.classList.add(SIDE_CONTENT_BUTTON_WRAPPER_CLASS);
      calculateButtonWrapper.appendChild(calculateButtonElement);

      sideContentWrapper.insertAdjacentElement('beforeend', calculateButtonWrapper);

      wrapperElement.addEventListener('click', qtyButtonHandler);
      $(calculateButtonElement).bind().click(function() {
        var dialog = $(`#customdialog${this.dataset.dialogid}`);

        dialog.dialog('option', 'title', this.dataset.dialogtitle).
          html(this.dataset.dialogcontent).
          dialog('open');
      });
    },
    findContainers = function findContainers() {
      wrapperElement = document.querySelector(WRAPPER_SELECTOR);
    },
    init = function init() {
      findContainers();
      placeButtons();
    };

  init();
})(jQuery);

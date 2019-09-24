// ==UserScript==
// @name         Beatport Download All
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Adds a "Download All" button to beatport.com/downloads/available
// @encoding     utf-8
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @author       https://github.com/AdrianTP
// @icon         https://avatars3.githubusercontent.com/u/1585276?s=200&v=3
// @homepage     https://github.com/AdrianTP/userscripts/
// @match        *://*.beatport.com/downloads/available*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/AdrianTP/userscripts/master/beatport.download-all.js
// @downloadURL  https://raw.githubusercontent.com/AdrianTP/userscripts/master/beatport.download-all.js
// ==/UserScript==

// 1. Scan HTML, find element:
//    a. <div class="download-button-parent" data-download-id="383749140" data-type="track" data-id="6440554" data-format="mp3">
// 2. data-download-id goes at the end of this url:
//    a. https://www.beatport.com/api/downloads/purchase?downloadId=
// 3. receives JSON response:
//    a. {"download_url": "http://download.beatport.com/download/track/ee79f37a-93c7-4b7d-9013-e8df017dfb0d.mp3?t=3709338648c4cd1b98bf7fd1057057b7/5cc47c49&f=6449387_Where_s_Your_Head_At__DJ_Seduction___Al_Storm_Remix.mp3&i=37332e382e36342e3131353a35343139343931&adltk=1556380745_3982b39c54576f901a8e40ef90e6e487"}

(function() {
  'use strict';

  var DOWNLOAD_MODES = {
        location: 0,
        open: 1,
        link: 2,
        iframe: 3
      },
      DOWNLOAD_MODE = 1,
      AUTO_COOKIE_NAME = 'beatport.download-all_auto',
      TEST_COOKIE_NAME = 'beatport.download-all_test',
      BASE_URL = 'https://www.beatport.com/api/downloads/purchase?downloadId=',
      downloading = false,
      msMinWait = 1000,
      msMaxWait = 10000,
      loc = window.location,
      href_300 = loc.origin + loc.pathname + '?per-page=300',
      liTracks = document.querySelectorAll('.available-downloads-tracks .track'),
      tracks = {},
      trackKeys = [],
      iterations = 0,
      downloadAllButton = document.createElement('button'),
      nextBtn,
      insertAfter = function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
      },
      // randomInt gets a random integer between min and max
      // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
      randomInt = function randomInt(min_, max_) {
        var min = Math.ceil(min_),
            max = Math.floor(max_);

        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      // synchonous wait
      wait = function wait(ms) {
        var start = Date.now(),
            now = start;

        while (now - start < ms) {
          now = Date.now();
        }
      },
      // wait a random amount of time
      waitRand = function waitRand(min, max) {
        wait(randomInt(min, max));
      },
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
      // downloads a track
      downloadTrack = function downloadTrack(url) {
        switch(DOWNLOAD_MODE) {
          case DOWNLOAD_MODES.link:
            // modified from: https://stackoverflow.com/a/50487674/771948
            var a = document.createElement('a');
            a.href = url;
            document.body.appendChild(a);
            wait(100);
            a.click();
            wait(100);
            window.URL.revokeObjectURL(url);
            a.remove();
            break;
          case DOWNLOAD_MODES.location:
            window.location = url;
            break;
          case DOWNLOAD_MODES.open:
            window.open(url);
            break;
          case DOWNLOAD_MODES.iframe:
            // modified from: https://stackoverflow.com/a/9425731/771948
            for(var i = 0; i < arguments.length; ++ i) {
              var iframe = document.createElement('iframe'),
                  // iform = document.createElement('form'),
                  icontent,
                  removeFn = (function(iframe) {
                    return function() {
                      iframe.remove();
                    }
                  })(iframe);

              iframe.style.visibility = 'collapse';
              // iform.setAttribute('action', url);
              // iform.setAttribute('method', 'GET');

              document.body.appendChild(iframe);

              icontent = iframe.contentDocument;
              icontent.write(
                `<form action="${url.replace(/\"/g, '"')}" method="GET"></form>`
              );
              icontent.forms[0].submit();

              // icontent.appendChild(iform);

              // iform.submit();
              // icontent.querySelector('form').submit();

              setTimeout(removeFn, 2000);
            }
            break;
          default:
            console.log('invalid DOWNLOAD_MODE: ' + DOWNLOAD_MODE);
            console.log('valid DOWNLOAD_MODE values: ' + JSON.stringify(DOWNLOAD_MODES));
            break;
        }
      },
      autoModeIsActive = function autoModeIsActive() {
        return !! getCookieValue(AUTO_COOKIE_NAME);
      },
      setAutoMode = function setAutoMode(mode) {
        if (mode == true) {
          setCookie(AUTO_COOKIE_NAME, 1, null);
        } else {
          deleteCookie(AUTO_COOKIE_NAME);
        }
      },
      testModeIsActive = function testModeIsActive() {
        return !! getCookieValue(TEST_COOKIE_NAME);
      },
      setTestMode = function setTestMode(mode) {
        if (mode == true) {
          setCookie(TEST_COOKIE_NAME, 1, null);
        } else {
          deleteCookie(TEST_COOKIE_NAME);
        }
      },
      resetModes = function resetModes() {
        deleteCookie(AUTO_COOKIE_NAME);
        deleteCookie(TEST_COOKIE_NAME);
      },
      disableButton = function disableButton() {
        downloadAllButton.setAttribute('disabled', 'disabled');
        downloadAllButton.innerText = 'PLEASE WAIT...';
      },
      enableButton = function enableButton() {
        downloadAllButton.innerText = 'DOWNLOAD ALL';
        downloadAllButton.removeAttribute('disabled');
      },
      // download every track on the page
      downloadAll = function downloadAll(e) {
        var i = 0,
            confirmationMessage = '';

        confirmationMessage += 'This will take a long time and you must leave';
        confirmationMessage += " this window open until it's finished.";
        confirmationMessage += "\n\nFor best results visit " + href_300;
        confirmationMessage += ' before downloading';

        if (!autoModeIsActive() && ! confirm(confirmationMessage)) {
          return;
        }

        disableButton();

        downloading = true;

        console.log('downloading all tracks');

        // gather the relevant data from the page
        for (i = 0; i < liTracks.length; ++ i) {
          var liTrack = liTracks[i],
              artistEl = liTrack.querySelector('.buk-track-artists'),
              titleEl = liTrack.querySelector('.buk-track-title'),
              buttonEl = liTrack.querySelector('.download-button-parent'),
              trackData = {
                artist: artistEl.innerText,
                title: titleEl.innerText,
                downloadId: buttonEl.dataset.downloadId,
              };

          tracks[buttonEl.dataset.id] = trackData;
        }

        console.log('loaded:', tracks);

        trackKeys = Object.keys(tracks);
        iterations = testModeIsActive() ? 5 : trackKeys.length;

        // get the download URLs and download the tracks
        for (i = 0; i < iterations; ++ i) {
          var key = trackKeys[i],
              track = tracks[key],
              xhr = new XMLHttpRequest();

          console.log('getting link for track:', track);

          xhr.addEventListener('load', function() {
            var responseJSON = JSON.parse(this.responseText),
                rawDownloadURL = responseJSON.download_url,
                url = new URL(rawDownloadURL),
                params = new URLSearchParams(url.search),
                reformattedURL = '',
                rawFilename = track.artist + ' - ' + track.title + '.mp3';

            console.log('received response for track:', track, responseJSON);

            url.protocol = 'https:';
            params.set('f', encodeURIComponent(rawFilename));
            reformattedURL = url.origin + url.pathname + params.toString();

            track.downloadLink = reformattedURL;

            waitRand(msMinWait, msMaxWait);
          });

          xhr.open('GET', BASE_URL + track.downloadId, false);
          xhr.send();

          console.log('downloading track from:', track.downloadLink);
          downloadTrack(track.downloadLink);

          // Look less like a script and avoid throttling
          waitRand(msMinWait, msMaxWait);
        }

        downloading = false;

        enableButton();

        if (! testModeIsActive() && !! nextBtn) {
          setAutoMode(true);
          nextBtn.click();
        } else {
          setAutoMode(false);
        }

        return;
      },
      init = function init() {
        window.bpdownload = window.bpdownload || {};
        window.bpdownload.setTestMode = window.bpdownload.setTestMode || setTestMode;
        window.bpdownload.resetModes = window.bpdownload.resetModes || resetModes;

        downloadAllButton.style.backgroundColor = '#FFF';
        downloadAllButton.style.border = '1px solid #F00';
        downloadAllButton.style.padding = '5px 10px';
        downloadAllButton.innerText = 'DOWNLOAD ALL';
        downloadAllButton.style.textWeight = 'bold';
        downloadAllButton.addEventListener('click', downloadAll);

        nextBtn = document.querySelector('.pag-next');

        insertAfter(downloadAllButton, document.querySelector('.available-downloads-tracks h2'));

        if (! testModeIsActive() && autoModeIsActive()) {
          downloadAllButton.click();
        }
      };

  init();
})();
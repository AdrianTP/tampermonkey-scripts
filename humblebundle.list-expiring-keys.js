// ==UserScript==
// @name         List Expiring Humble Bundle Keys
// @namespace    https://github.com/AdrianTP
// @version      0.1
// @description  Adds a "Expiring Keys" button to https://www.humblebundle.com/home/keys
// @author       https://github.com/AdrianTP
// @match        *://*.humblebundle.com/home/keys
// @grant        none
// ==/UserScript==

// TODO: implement grouping feature and links to take user to bundle page containing expiring keys; link format: https://www.humblebundle.com/downloads?key=<bundle_key>

(function() {
  var LZ_STRING_URL = 'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.js',
      LOCAL_STORAGE_BUNDLE_REGEX = /^v2|\/api\/v1\/order\//,
      EXPIRING_TPKD_REGEX = /Keys must be redeemed/,
      scrape = function(e) {
        // console.log(e);

        // var bundleKeys = ['KhbA5MmVyxWHc3Yu'], // TODO: this should be gotten from script#user-home-json-data
        //   expiring = [];

        // bundleKeys.forEach(function(bundleKey) {
        //   expiring = expiring.concat(getExpiringItemsByBundleKey(bundleKey));
        // });

        // console.log(expiring);

        // TODO: figure out how i want to display the expiring keys...
        console.log(compileExpiringList());
      },
      // This would be easier, but somehow the script#user-home-json-data element is not visible outside of View Source
      // <script id="user-home-json-data" type="application/json">
      //   {
      //     "activePlatform": "mac",
      //     "gamekeys":  [...] // This contains all the bundle keys
      //     "hasAdmin": false
      //   }
      // </script>
      // So damned frustrating that this is seemingly deleted at some point during page load
      filterLocalStorageKeys = function(key) {
        return LOCAL_STORAGE_BUNDLE_REGEX.test(key);
      },
      reduceLocalStorage = function(obj, key) {
        obj[key] = localStorage[key];
        return obj;
      },
      expires = function(tpkdItem) {
        return EXPIRING_TPKD_REGEX.test(tpkdItem.custom_instructions_html);
      },
      getExpiringItemsFromBundle = function(compressedBundleData) {
        var decompressedBundleData = LZString.decompressFromUTF16(compressedBundleData),
            bundleData,
            tpkdList;

        try {
          bundleData = JSON.parse(decompressedBundleData);
          tpkdList = bundleData.tpkd_dict.all_tpks.filter(expires);
        } catch(e) {
          console.log('could not parse: ', compressedBundleData, decompressedBundleData);
          tpkdList = [];
        }

        return tpkdList;
      },
      compileExpiringList = function() {
        var localStorageBundleKeys = Object.keys(localStorage)
                                           .filter(filterLocalStorageKeys),
            localStorageBundles = localStorageBundleKeys.reduce(reduceLocalStorage, {}),
            currentBundleExpiringItems,
            expiring = [];

        console.log(localStorageBundleKeys);

        for (var bundleId in localStorageBundles) {
          currentBundleExpiringItems = getExpiringItemsFromBundle(localStorageBundles[bundleId]);
          expiring = expiring.concat(currentBundleExpiringItems);
        }

        return expiring;
      },
      // getExpiringItemsByBundleKey = function(bundleKey) {
      //   var compressedBundleData = localStorage.getItem('v2|/api/v1/order/' + bundleKey),
      //       decompressedBundleData = LZString.decompressFromUTF16(compressedBundleData),
      //       bundleData = JSON.parse(decompressedBundleData);

      //   console.log(bundleData);

      //   return bundleData.tpkd_dict.all_tpks.filter(expires);
      // },
      init = function() {
        // window.hbexpiring = window.hbexpiring || {};
        // window.hbexpiring.setMode = window.hbexpiring.setMode || setMode;

        var lzsEl = document.createElement('script');

        lzsEl.setAttribute('type', 'application/javascript');
        lzsEl.setAttribute('src', LZ_STRING_URL);
        lzsEl.addEventListener('load', scrape);

        document.body.appendChild(lzsEl);
      };

  init();
})();

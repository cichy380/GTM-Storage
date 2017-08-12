/**
 * GTM-Storage example of usage
 *
 * @link https://github.com/cichy380/GTM-Storage
 * @author Marcin Dobroszek
 * @license The MIT License (MIT)
 *
 * @todo Enhanced Ecommerce handling
 */
;(function($, dataLayer, gtmStorage, window, undefined) {
    'use strict';

    /**
     * Error logger
     */
    function logError(message) {
        if (window.console && typeof window.console.warn === 'function') {
            console.warn('GTM: ' + message);
        }
    }

    /**
     * Read Storage data and send it to GTM
     */
    function sendGtmStorage() {
        var gtmData = gtmStorage.getItems();

        gtmData.forEach(function (item) {
            var data2send;

            if (item.sending === false) { // data item not sending yet

                // read data from element (from data-* attribute)
                data2send = $(item.element).data(gtmStorage.namespace);

                // check if required object and property exists
                if (typeof data2send === 'object' && typeof data2send.event !== 'undefined') {
                    // sending data to GTM...
                    dataLayer.push({
                        event: data2send.event,
                        data: data2send.data || null,
                        eventCallback: function () {
                            // remove item data from storage after GTM callback
                            gtmStorage.removeItem(item.id);
                        },
                    });

                    // prevent double sending
                    item.sending = true;
                    gtmStorage.editItem(item, item.id);
                }
                else {
                    // item data is invalid - remove it
                    gtmStorage.removeItem(item.id);
                    logError('HTML tag ' + gtmStorage.getElementName($(item.element).get(0)) + ' does not have ' +
                        'required data-gtm attribute or this attribute has wrong data format.');
                }
            }
        });
    }

    // checking new data in GTM-Storage every 1.5 sec.
    var intervalId = setInterval(sendGtmStorage, 1500);

    // click event listener on class
    $('.gtm-click').on('click', function () {
        gtmStorage.push(this);
    });

    // stop interval action (sending data) after clicking any link on page
    $(window).on('beforeunload', function () {
        clearInterval(intervalId);
    });

})(jQuery, dataLayer, gtmStorage, window);

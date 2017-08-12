/**
 * GTM-Storage
 *
 * Using HTML5 Local Storage creates numerous stack elements which the event was made on.
 *
 * @version 0.0.3
 * @link https://github.com/cichy380/GTM-Storage
 * @author Marcin Dobroszek
 * @license The MIT License (MIT)
 *
 * @todo action after lock storage handling
 */
var gtmStorage = (function() {
    'use strict';

    var namespace = 'gtm',

        /**
         * Returns all data about storaged events.
         * @return {Object} data - List of events
         */
        getItems = function () {
            var localStorageValue = typeof localStorage.getItem(namespace) !== 'undefined'
                    && localStorage.getItem(namespace) ? localStorage.getItem(namespace) : '[]';

            return JSON.parse(localStorageValue);
        },

        /**
         * Saves new data in storage.
         * @param {Array} data - List of events
         */
        _saveGtmStorage = function (data) {
            // if GTM Storage is not lock we can save new data (add new event) ..
            if (localStorage.getItem(namespace + 'lock') === 'off') {

                // set lock on GTM Storage
                localStorage.setItem(namespace + 'lock', 'on');

                localStorage.setItem(namespace, JSON.stringify(data));

                // set unlock on GTM Storage
                localStorage.setItem(namespace + 'lock', 'off');
            } else {
                // .. else lost info about new data (new events)
                // TODO: lock storage handling
            }
        },

        /**
         * Changes item data in storage.
         * @param {Array} data - New data of item event
         * @param {number} id - ID of item event to edit
         */
        editItem = function (data, id) {
            var currentGtmStorage,
                newGtmStorage;

            newGtmStorage = [];
            currentGtmStorage = getItems();
            currentGtmStorage.forEach(function(item, index) {
                if (item.id === id) {
                    newGtmStorage.push(data);
                } else {
                    newGtmStorage.push(item);
                }
            });

            _saveGtmStorage(newGtmStorage);
        },

        removeItem = function (id) {
            var currentGtmStorage = getItems(),
                newGtmStorage = [];

            currentGtmStorage.forEach(function (item) {
                if (item.id !== id) {
                    newGtmStorage.push(item);
                }
            });

            _saveGtmStorage(newGtmStorage);
        },

        /**
         * Clears flags "sending" from all data items and allows next sending try.
         */
        _clearSendingFlag = function () {
            var gtmStorage = getItems();

            gtmStorage.forEach(function (item, index) {
                if (item.sending === true) { // not sending yet
                    // prevent double sending
                    item.sending = false;
                    editItem(item, item.id);
                }
            });
        },

        /**
         * Adds element to storage.
         * @param {Object} param - HTML DOM Element Object or Plain Object with "ready to send" data
         */
        push = function (param) {
            var gtmLocalStorage,
                data = {
                    id: Math.random(),
                    time: new Date(),
                    sending: false, // FALSE == item did not send yet,  TRUE == just sending
                };

            if (typeof localStorage !== 'object' || typeof JSON !== 'object') {
                // browser does not support required function
                return;
            }

            try {
                // reads current data and convert to array
                gtmLocalStorage = JSON.parse(localStorage.getItem(namespace) || '[]');
            } catch (errMsg) {
                // problem with data in localStorage -- clear all data
                localStorage.removeItem(namespace);
                gtmLocalStorage = [];

                window.console && console.warn(errMsg);
            }

            // got Plain Object means "ready to send" data
            if (Object.prototype.toString.call(param) === '[object Object]') {
                data.data = param;
            }
            // got HTML DOM Element Object
            else if (param.outerHTML) {
                data.element = param.outerHTML;
            }
            else {
                window.console && console.warn('Incorrect input data');
                return;
            }

            // push new data
            gtmLocalStorage.push(data);

            // save
            _saveGtmStorage(gtmLocalStorage);
        },

        /**
         * Initialization of GTM-Storage.
         */
        _init = function () {
            if (typeof localStorage === 'object') {
                // reset always after start loading website (this file loaded)
                localStorage.setItem(namespace + 'lock', 'off');

                _clearSendingFlag();
            }
        },

        /**
         * Returns easy readable descrition of HTML element.
         * Eg. "<a.btn.btn-submit>"
         * @param {Object} element - HTML Element Object
         * @return {string}
         */
        getElementName = function (element) {
            var tagName = element.localName,
                idName = element.id ? '#' + element.id : '',
                classNameListString = element.classList.length
                    ? '.' + Array.prototype.join.call(element.classList, '.') : '';

            return '<' + tagName + idName + classNameListString + '>';
        };

    // initialization
    _init();

    return {
        namespace: namespace,
        push: push,
        getItems: getItems,
        editItem: editItem,
        removeItem: removeItem,
        getElementName: getElementName,
    }
}());

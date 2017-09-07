
(function(base) {
    "use strict";

    /**
     * Storage JavaScript Plugin
     * v1.0.0
     *
     * Provides methods for storage management
     * Author: Neven Dyulgerov
     * Released under the MIT license
     *
     * The default implementation uses localStorage
     * You can plug in your own storage template by adding it via setTemplate()
     *
     * Custom storage templates must expose the following API:
     *
     * getStorageItem     - gets a single storage item as JSON string
     * @param key
     * @param value
     * @return JSON string
     *
     * setStorageItem     - sets a single storage item
     * @param key
     *
     * removeStorageItem  - removes a single storage item
     * @param key
     */

    base.storage = function(key) {
        var storage;

        if ( typeof key !== "string" ) {
            return new Error("[Storage] Invalid storage key. Provide a key{string}.");
        }


        /**
         * Private
         * Storage Templates
         */
        var storageTemplates = {
            localStorage: {
                getStorage: function() {
                    return localStorage;
                },
                setStorageItem: function(key, value) {
                    this.getStorage().setItem(key, value);
                },
                getStorageItem: function(key) {
                    return this.getStorage().getItem(key);
                },
                removeStorageItem: function(key) {
                    this.getStorage().removeItem(key);
                }
            }
        };


        // select storage API
        storage = storageTemplates.localStorage;


        /**
         * Private
         * Get Data
         * @param key
         * @returns object
         */
        var getData = function(key) {
            return decodeData(storage.getStorageItem(key));
        };


        /**
         * Private
         * Set Data
         * @param key
         * @param data
         */
        var setData = function(key, data) {
            storage.setStorageItem(key, encodeData(data));
        };


        /**
         * Private
         * Remove Data
         * @param key
         */
        var removeData = function(key) {
            storage.removeStorageItem(key);
        };


        /**
         * Private
         * Decode Data
         * @param data
         */
        var decodeData = function(data) {
            return JSON.parse(data);
        };


        /**
         * Private
         * Encode Data
         * @param data
         */
        var encodeData = function(data) {
            return JSON.stringify(data);
        };


        /**
         * Public API
         */
        return {
            setTemplate: function(template, storageApi) {
                if ( typeof template !== "string" ) {
                    return new Error("[Storage] Invalid template name. Provide a name{string}.");
                }
                if ( typeof storageApi !== "object" || typeof storageApi.setStorageItem !== "function" || typeof storageApi.getStorageItem !== "function" || typeof storageApi.removeStorageItem !== "function" ) {
                    return new Error("[Storage] Invalid storage API. Provide an API, containing getStorageItem{function}, setStorageItem{function}, removeStorageItem{function}.");
                }
                storageTemplates[template] = storageApi;
                storage = storageApi;
                return this;
            },
            getData: function() {
                var data = getData(key);
                return data !== null ? getData(key) : undefined;
            },
            setData: function(newData) {
                setData(key, newData);
                return this;
            },
            removeData: function() {
                removeData(key);
                return this;
            },
            getItem: function(itemKey) {
                var data = this.getData();
                return data[itemKey];
            },
            setItem: function(itemKey, itemValue) {
                var data = this.getData();
                data[itemKey] = itemValue;
                setData(key, data);
                return this;
            },
            removeItem: function(itemKey) {
                var data = this.getData();
                data[itemKey] = undefined;
                setData(key, data);
                return this;
            }
        };
    };
})(window);

/**
 * Utilities JavaScript Belt
 * v1.0.0
 *
 * Provides general-purpose utility methods
 * Author: Neven Dyulgerov
 * Released under the MIT license
 */

(function(base) {
    base.utils = (function() {


        /**
         * Public
         * Is Object
         * @param val
         * @returns {boolean}
         */
        let isO = function(val) {
            return typeof val === "object" && !isA(val) && val !== null;
        };


        /**
         * Public
         * Is Number
         * @param val
         * @returns {boolean}
         */
        let isN = function(val) {
            return typeof val === "number" && !isNaN(val);
        };


        /**
         * Public
         * Is Function
         * @param val
         * @returns {boolean}
         */
        let isF = function(val) {
            return typeof val === "function";
        };


        /**
         * Public
         * Is Array
         * @param val
         * @returns {boolean}
         */
        let isA = function(val) {
            return Array.isArray(val);
        };


        /**
         * Public
         * Is String
         * @param val
         * @returns {boolean}
         */
        let isS = function(val) {
            return typeof val === "string";
        };


        /**
         * Public
         * Is Undefined
         * @param val
         * @returns {boolean}
         */
        let isU = function(val) {
            return typeof val === "undefined";
        };


        /**
         * Public
         * Is Boolean
         * @param val
         * @returns {boolean}
         */
        let isB = function(val) {
            return typeof val === "boolean";
        };


        /**
         * Public
         * To Number
         * @param val
         * @returns {Number}
         */
        let toN = function(val) {
            return parseInt(val, 10);
        };


        /**
         * Public
         * To Boolean
         * @param val
         * @returns {boolean}
         */
        let toB = function(val) {
            return val.toLowerCase() == "true";
        };

        /**
         * Public
         * Has Method
         * @param obj
         * @param method
         * @returns {boolean}
         */
        let hasM = function(obj, method) {
            return hasP(obj, method) && isF(method);
        };


        /**
         * Public
         * Run Methods
         * @param obj
         */
        let runM = function(obj) {
            for ( let i in obj ) {
                let prop = obj[i];
                if ( hasP(obj, i) && isF(prop) ) {
                    prop();
                }
            }
        };


        /**
         * Public
         * Run Exclude Methods
         * @param obj
         * @param excludes
         */
        let runExclM = function(obj, excludes) {
            let excl = isA(excludes) ? excludes : [];

            for ( let i in obj ) {
                let prop = obj[i];
                if ( hasP(obj, i) && isF(prop) && excl.indexOf(i) === -1 ) {
                    prop();
                }
            }
        };


        /**
         * Public
         * Has Property
         * @param obj
         * @param prop
         * @returns {boolean}
         */
        let hasP = function(obj, prop) {
            return obj.hasOwnProperty(prop);
        };


        /**
         * Get Property
         * @param obj
         * @param prop
         * @returns {*}
         */
        let getP = function(obj, prop) {
            return hasP(obj, prop) ? obj[prop] : "";
        };


        /**
         * Public
         * Has Key
         * @param obj
         * @param key
         * @returns {boolean}
         */
        let hasK = function(obj, key) {
            return getK(obj).indexOf(key) > -1;
        };


        /**
         * Public
         * Get Keys
         * @param obj
         * @returns {Array}
         */
        let getK = function(obj) {
            return Object.keys(obj);
        };


        /**
         * Public
         * Get Shallow Copy
         * @param obj
         */
        let getSC = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        };


        /**
         * Iterate Recursive
         * @param handler
         * @param complete
         * @param data
         * @param index
         * @returns {*}
         */
        let recurIter = (handler, complete, index) => {
            index = index || 0;
            handler(index, (canRecur) => {
                if ( ! canRecur ) {
                    return complete();
                }
                recurIter(handler, complete, ++index);
            });
        };


        /**
         * Poll
         * @param handler
         * @param complete
         * @param interval
         */
        let poll = (handler, complete, interval) => {
            setTimeout(() => {
                handler((canPoll) => {
                    if ( canPoll ) {
                        return poll(handler, complete, interval);
                    }
                    complete();
                });
            }, interval);
        };


        /**
         * Buffer
         */
        let buffer = function() {
            let timers = {};
            return (id, ms, clb) => {
                if ( ! id ) {
                    timers[id] = '0';
                }
                if ( timers[id] ) {
                    clearTimeout(timers[id]);
                }
                timers[id] = setTimeout(clb, ms);
            };
        };

        let getUrlParam = (name) => {
            let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        };


        let jsonCopy = (obj) => {
            return JSON.parse(JSON.stringify(obj));
        };

        let exportToCsv = function(filename, rows) {
            let processRow = function (row) {
                let finalVal = '';
                for (let j = 0; j < row.length; j++) {
                    let innerValue = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    }
                    let result = innerValue.replace(/"/g, '""');
                    if (result.search(/("|,|\n)/g) >= 0) {
                        result = '"' + result + '"';
                    }
                    if (j > 0) {
                        finalVal += ',';
                    }

                    finalVal += result;
                }
                return finalVal + '\n';
            };

            let csvFile = '\uFEFF';
            for (let i = 0; i < rows.length; i++) {
                csvFile += processRow(rows[i]);
            }

            let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                let link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    let url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };

        let numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        let capitalize = function (str) {
            return str.charAt(0).toUpperCase()+str.slice(1);
        };


        /**
         * Public API
         */
        return {
            isS,
            isN,
            isB,
            isO,
            isA,
            isF,
            isU,
            toN,
            toB,
            hasM,
            runM,
            runExclM,
            hasP,
            getP,
            hasK,
            getK,
            getSC,
            recurIter,
            buffer,
            poll,
            getUrlParam,
            jsonCopy,
            exportToCsv,
            numberWithCommas,
            capitalize
        };
    })();
})(window);
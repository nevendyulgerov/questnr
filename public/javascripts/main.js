"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (base) {
    "use strict";

    /**
     * Initialzr JavaScript Library
     * v1.1.0
     *
     * Provides app constructs on local and global level
     * Author: Neven Dyulgerov
     * Released under the MIT license
     */

    base.initialzr = function (config) {
        var hasConfig = false;
        var isGlobal = false;

        if ((typeof config === "undefined" ? "undefined" : _typeof(config)) === "object" && config !== null) {
            hasConfig = true;
        }

        if (hasConfig && typeof config.global === "boolean") {
            isGlobal = config.global;
        }

        if (isGlobal && !hasConfig || isGlobal && hasConfig && !config.name) {
            return new Error("[Initialzr] Invalid initialization. Global applications require a name. Pass a name as part of the app's config.");
        }

        var app = {
            config: config || {},
            nodes: {}
        };

        var schemas = {
            "default": ["events", "renderers", "actions"],
            "app": ["events", "actions", "common", "modules", "core"]
        };

        var factory = function factory() {
            var augment = function augment(nodeFamily) {
                var nodes = app.nodes;
                var families = !Array.isArray(nodeFamily) ? ["" + nodeFamily] : nodeFamily;
                families.map(function (nf) {
                    if (!nodes.hasOwnProperty(nf)) {
                        nodes[nf] = {};
                    }
                });
                return this;
            };

            var addSchema = function addSchema(schemaName, schema) {
                if (!schemas.hasOwnProperty(schemaName) && Array.isArray(schema)) {
                    schemas[schemaName] = schema;
                }
                return this;
            };

            var schema = function schema(_schema) {
                if (schemas.hasOwnProperty(_schema)) {
                    augment(schemas[_schema]);
                }
                return this;
            };

            var addNode = function addNode(nodeFamily, nodeName, func) {
                var nodes = app.nodes;
                if (nodes.hasOwnProperty(nodeFamily) && !nodes[nodeFamily].hasOwnProperty(nodeName) && typeof func === "function") {
                    nodes[nodeFamily][nodeName] = func;
                }
                return this;
            };

            var getNode = function getNode(nodeFamily, nodeName) {
                var nodes = app.nodes;
                if (nodes.hasOwnProperty(nodeFamily) && nodes[nodeFamily].hasOwnProperty(nodeName) && typeof nodes[nodeFamily][nodeName] === "function") {
                    return nodes[nodeFamily][nodeName];
                } else {
                    return false;
                }
            };

            var callNode = function callNode(nodeFamily, nodeName, params) {
                var nodeParams = typeof params !== "undefined" ? params : {};
                var node = getNode(nodeFamily, nodeName);
                if (node) {
                    node(nodeParams);
                }
                return this;
            };

            var getNodes = function getNodes(nodeFamily) {
                return nodeFamily && app.nodes.hasOwnProperty(nodeFamily) ? app.nodes[nodeFamily] : app.nodes;
            };

            var configure = function configure(nodeFamily) {
                var nodes = app.nodes;
                if (nodes.hasOwnProperty(nodeFamily)) {
                    return {
                        node: function node(nodeName, func) {
                            addNode(nodeFamily, nodeName, func);
                            return this;
                        },
                        configure: configure
                    };
                }
                return false;
            };

            var nodeExists = function nodeExists(nodeFamily, nodeName) {
                return typeof getNode(nodeFamily, nodeName) === "function";
            };

            var getConfig = function getConfig(name) {
                var config = app.config;
                if (config.hasOwnProperty(name)) {
                    return config[name];
                } else {
                    return false;
                }
            };

            var createInstance = function createInstance() {
                return {
                    schema: schema,
                    addSchema: addSchema,
                    augment: augment,
                    configure: configure,
                    addNode: addNode,
                    getNode: getNode,
                    callNode: callNode,
                    nodeExists: nodeExists,
                    getNodes: getNodes,
                    getConfig: getConfig
                };
            };

            return createInstance();
        };

        var setGlobal = function setGlobal(instance) {
            base[app.config.name] = base[app.config.name] || instance;
        };

        if (isGlobal) {
            setGlobal(factory());
        } else {
            return factory();
        }
    };
})(window);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function (global, factory) {

    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ? factory(global, true) : function (w) {
            if (!w.document) {
                throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
        };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {

    // Support: Firefox 18+
    // Can't be in strict mode, several libs including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    //"use strict";
    var arr = [];

    var document = window.document;

    var _slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var support = {};

    var version = "2.2.4",


    // Define a local copy of jQuery
    jQuery = function jQuery(selector, context) {

        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init(selector, context);
    },


    // Support: Android<4.1
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


    // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,


    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function fcamelCase(all, letter) {
        return letter.toUpperCase();
    };

    jQuery.fn = jQuery.prototype = {

        // The current version of jQuery being used
        jquery: version,

        constructor: jQuery,

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function toArray() {
            return _slice.call(this);
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function get(num) {
            return num != null ?

            // Return just the one element from the set
            num < 0 ? this[num + this.length] : this[num] :

            // Return all the elements in a clean array
            _slice.call(this);
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function pushStack(elems) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        each: function each(callback) {
            return jQuery.each(this, callback);
        },

        map: function map(callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },

        slice: function slice() {
            return this.pushStack(_slice.apply(this, arguments));
        },

        first: function first() {
            return this.eq(0);
        },

        last: function last() {
            return this.eq(-1);
        },

        eq: function eq(i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },

        end: function end() {
            return this.prevObject || this.constructor();
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function () {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({

        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

        // Assume jQuery is ready without the ready module
        isReady: true,

        error: function error(msg) {
            throw new Error(msg);
        },

        noop: function noop() {},

        isFunction: function isFunction(obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray,

        isWindow: function isWindow(obj) {
            return obj != null && obj === obj.window;
        },

        isNumeric: function isNumeric(obj) {

            // parseFloat NaNs numeric-cast false positives (null|true|false|"")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            // adding 1 corrects loss of precision from parseFloat (#15100)
            var realStringObj = obj && obj.toString();
            return !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0;
        },

        isPlainObject: function isPlainObject(obj) {
            var key;

            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own
            for (key in obj) {}

            return key === undefined || hasOwn.call(obj, key);
        },

        isEmptyObject: function isEmptyObject(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        type: function type(obj) {
            if (obj == null) {
                return obj + "";
            }

            // Support: Android<4.0, iOS<6 (functionish RegExp)
            return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
        },

        // Evaluates a script in a global context
        globalEval: function globalEval(code) {
            var script,
                indirect = eval;

            code = jQuery.trim(code);

            if (code) {

                // If the code includes a valid, prologue position
                // strict mode pragma, execute code by injecting a
                // script tag into the document.
                if (code.indexOf("use strict") === 1) {
                    script = document.createElement("script");
                    script.text = code;
                    document.head.appendChild(script).parentNode.removeChild(script);
                } else {

                    // Otherwise, avoid the DOM node creation, insertion
                    // and removal by using an indirect global eval

                    indirect(code);
                }
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Support: IE9-11+
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function camelCase(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },

        nodeName: function nodeName(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        each: function each(obj, callback) {
            var length,
                i = 0;

            if (isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }

            return obj;
        },

        // Support: Android<4.1
        trim: function trim(text) {
            return text == null ? "" : (text + "").replace(rtrim, "");
        },

        // results is for internal usage only
        makeArray: function makeArray(arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    push.call(ret, arr);
                }
            }

            return ret;
        },

        inArray: function inArray(elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },

        merge: function merge(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        grep: function grep(elems, callback, invert) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }

            return matches;
        },

        // arg is for internal usage only
        map: function map(elems, callback, arg) {
            var length,
                value,
                i = 0,
                ret = [];

            // Go through the array, translating each of the items to their new values
            if (isArrayLike(elems)) {
                length = elems.length;
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }

                // Go through every key on the object,
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            }

            // Flatten any nested arrays
            return concat.apply([], ret);
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function proxy(fn, context) {
            var tmp, args, proxy;

            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }

            // Simulated bind
            args = _slice.call(arguments, 2);
            proxy = function proxy() {
                return fn.apply(context || this, args.concat(_slice.call(arguments)));
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        now: Date.now,

        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    });

    // JSHint would error on this code due to the Symbol not being defined in ES5.
    // Defining this global in .jshintrc would create a danger of using the global
    // unguarded in another place, it seems safer to just disable JSHint for these
    // three lines.
    /* jshint ignore: start */
    if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
    }
    /* jshint ignore: end */

    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function isArrayLike(obj) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length,
            type = jQuery.type(obj);

        if (type === "function" || jQuery.isWindow(obj)) {
            return false;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.2.1
     * http://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2015-10-17
     */
    function (window) {

        var i,
            support,
            Expr,
            getText,
            isXML,
            tokenize,
            compile,
            select,
            outermostContext,
            sortInput,
            hasDuplicate,


        // Local document vars
        setDocument,
            document,
            docElem,
            documentIsHTML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,


        // Instance-specific data
        expando = "sizzle" + 1 * new Date(),
            preferredDoc = window.document,
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),
            sortOrder = function sortOrder(a, b) {
            if (a === b) {
                hasDuplicate = true;
            }
            return 0;
        },


        // General-purpose constants
        MAX_NEGATIVE = 1 << 31,


        // Instance methods
        hasOwn = {}.hasOwnProperty,
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            push = arr.push,
            slice = arr.slice,

        // Use a stripped-down indexOf as it's faster than native
        // http://jsperf.com/thor-indexof-vs-for/5
        indexOf = function indexOf(list, elem) {
            var i = 0,
                len = list.length;
            for (; i < len; i++) {
                if (list[i] === elem) {
                    return i;
                }
            }
            return -1;
        },
            booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


        // Regular expressions

        // http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",


        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",


        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
        // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace +
        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
            pseudos = ":(" + identifier + ")(?:\\((" +
        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
        // 1. quoted (capture 3; capture 4 or capture 5)
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
        // 2. simple (capture 6)
        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
        // 3. anything else (capture 2)
        ".*" + ")\\)|)",


        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rwhitespace = new RegExp(whitespace + "+", "g"),
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
            rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
            rpseudo = new RegExp(pseudos),
            ridentifier = new RegExp("^" + identifier + "$"),
            matchExpr = {
            "ID": new RegExp("^#(" + identifier + ")"),
            "CLASS": new RegExp("^\\.(" + identifier + ")"),
            "TAG": new RegExp("^(" + identifier + "|[*])"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "bool": new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },
            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,
            rnative = /^[^{]+\{\s*\[native \w/,


        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            rsibling = /[+~]/,
            rescape = /'|\\/g,


        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function funescape(_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            // Support: Firefox<24
            // Workaround erroneous numeric interpretation of +"0x"
            return high !== high || escapedWhitespace ? escaped : high < 0 ?
            // BMP codepoint
            String.fromCharCode(high + 0x10000) :
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        },


        // Used for iframes
        // See setDocument()
        // Removing the function wrapper causes a "Permission Denied"
        // error in IE
        unloadHandler = function unloadHandler() {
            setDocument();
        };

        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = { apply: arr.length ?

                // Leverage slice if possible
                function (target, els) {
                    push_native.apply(target, slice.call(els));
                } :

                // Support: IE<9
                // Otherwise append directly
                function (target, els) {
                    var j = target.length,
                        i = 0;
                    // Can't trust NodeList.length
                    while (target[j++] = els[i++]) {}
                    target.length = j - 1;
                }
            };
        }

        function Sizzle(selector, context, results, seed) {
            var m,
                i,
                elem,
                nid,
                nidselect,
                match,
                groups,
                newSelector,
                newContext = context && context.ownerDocument,


            // nodeType defaults to 9, since context defaults to document
            nodeType = context ? context.nodeType : 9;

            results = results || [];

            // Return early from calls with invalid selector or context
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

                return results;
            }

            // Try to shortcut find operations (as opposed to filters) in HTML documents
            if (!seed) {

                if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                    setDocument(context);
                }
                context = context || document;

                if (documentIsHTML) {

                    // If the selector is sufficiently simple, try using a "get*By*" DOM method
                    // (excepting DocumentFragment context, where the methods don't exist)
                    if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

                        // ID selector
                        if (m = match[1]) {

                            // Document context
                            if (nodeType === 9) {
                                if (elem = context.getElementById(m)) {

                                    // Support: IE, Opera, Webkit
                                    // TODO: identify versions
                                    // getElementById can match elements by name instead of ID
                                    if (elem.id === m) {
                                        results.push(elem);
                                        return results;
                                    }
                                } else {
                                    return results;
                                }

                                // Element context
                            } else {

                                // Support: IE, Opera, Webkit
                                // TODO: identify versions
                                // getElementById can match elements by name instead of ID
                                if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

                                    results.push(elem);
                                    return results;
                                }
                            }

                            // Type selector
                        } else if (match[2]) {
                            push.apply(results, context.getElementsByTagName(selector));
                            return results;

                            // Class selector
                        } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

                            push.apply(results, context.getElementsByClassName(m));
                            return results;
                        }
                    }

                    // Take advantage of querySelectorAll
                    if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

                        if (nodeType !== 1) {
                            newContext = context;
                            newSelector = selector;

                            // qSA looks outside Element context, which is not what we want
                            // Thanks to Andrew Dupont for this workaround technique
                            // Support: IE <=8
                            // Exclude object elements
                        } else if (context.nodeName.toLowerCase() !== "object") {

                            // Capture the context ID, setting it first if necessary
                            if (nid = context.getAttribute("id")) {
                                nid = nid.replace(rescape, "\\$&");
                            } else {
                                context.setAttribute("id", nid = expando);
                            }

                            // Prefix every selector in the list
                            groups = tokenize(selector);
                            i = groups.length;
                            nidselect = ridentifier.test(nid) ? "#" + nid : "[id='" + nid + "']";
                            while (i--) {
                                groups[i] = nidselect + " " + toSelector(groups[i]);
                            }
                            newSelector = groups.join(",");

                            // Expand context for sibling selectors
                            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                        }

                        if (newSelector) {
                            try {
                                push.apply(results, newContext.querySelectorAll(newSelector));
                                return results;
                            } catch (qsaError) {} finally {
                                if (nid === expando) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }
                }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }

        /**
         * Create key-value caches of limited size
         * @returns {function(string, object)} Returns the Object data after storing it on itself with
         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *	deleting the oldest entry
         */
        function createCache() {
            var keys = [];

            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key + " ") > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return cache[key + " "] = value;
            }
            return cache;
        }

        /**
         * Mark a function for special use by Sizzle
         * @param {Function} fn The function to mark
         */
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created div and expects a boolean result
         */
        function assert(fn) {
            var div = document.createElement("div");

            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        }

        /**
         * Adds the same handler for all of the specified attrs
         * @param {String} attrs Pipe-separated list of attributes
         * @param {Function} handler The method that will be applied
         */
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"),
                i = arr.length;

            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }

        /**
         * Checks document order of two siblings
         * @param {Element} a
         * @param {Element} b
         * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
         */
        function siblingCheck(a, b) {
            var cur = b && a,
                diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while (cur = cur.nextSibling) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }

            return a ? 1 : -1;
        }

        /**
         * Returns a function to use in pseudos for input types
         * @param {String} type
         */
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for buttons
         * @param {String} type
         */
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for positionals
         * @param {Function} fn
         */
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j,
                        matchIndexes = fn([], seed.length, argument),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while (i--) {
                        if (seed[j = matchIndexes[i]]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Checks a node for validity as a Sizzle context
         * @param {Element|Object=} context
         * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
         */
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
        }

        // Expose support vars for convenience
        support = Sizzle.support = {};

        /**
         * Detects XML nodes
         * @param {Element|Object} elem An element or a document
         * @returns {Boolean} True iff elem is a non-HTML XML node
         */
        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         * Sets document-related variables once based on the current document
         * @param {Element|Object} [doc] An element or document object to use to set the document
         * @returns {Object} Returns the current document
         */
        setDocument = Sizzle.setDocument = function (node) {
            var hasCompare,
                parent,
                doc = node ? node.ownerDocument || node : preferredDoc;

            // Return early if doc is invalid or already selected
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }

            // Update global variables
            document = doc;
            docElem = document.documentElement;
            documentIsHTML = !isXML(document);

            // Support: IE 9-11, Edge
            // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
            if ((parent = document.defaultView) && parent.top !== parent) {
                // Support: IE 11
                if (parent.addEventListener) {
                    parent.addEventListener("unload", unloadHandler, false);

                    // Support: IE 9 - 10 only
                } else if (parent.attachEvent) {
                    parent.attachEvent("onunload", unloadHandler);
                }
            }

            /* Attributes
             ---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (div) {
                div.className = "i";
                return !div.getAttribute("className");
            });

            /* getElement(s)By*
             ---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(document.createComment(""));
                return !div.getElementsByTagName("*").length;
            });

            // Support: IE<9
            support.getElementsByClassName = rnative.test(document.getElementsByClassName);

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !document.getElementsByName || !document.getElementsByName(expando).length;
            });

            // ID find and filter
            if (support.getById) {
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                        var m = context.getElementById(id);
                        return m ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                // Support: IE6/7
                // getElementById is not reliable as a find shortcut
                delete Expr.find["ID"];

                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }

            // Tag
            Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
                if (typeof context.getElementsByTagName !== "undefined") {
                    return context.getElementsByTagName(tag);

                    // DocumentFragment nodes don't have gEBTN
                } else if (support.qsa) {
                    return context.querySelectorAll(tag);
                }
            } : function (tag, context) {
                var elem,
                    tmp = [],
                    i = 0,

                // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                results = context.getElementsByTagName(tag);

                // Filter out possible comments
                if (tag === "*") {
                    while (elem = results[i++]) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }

                    return tmp;
                }
                return results;
            };

            // Class
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };

            /* QSA/matchesSelector
             ---------------------------------------------------------------------- */

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];

            if (support.qsa = rnative.test(document.querySelectorAll)) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (div) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

                    // Support: IE8, Opera 11-12.16
                    // Nothing should be selected when empty strings follow ^= or $= or *=
                    // The test attribute must be unknown in Opera but "safe" for WinRT
                    // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                    if (div.querySelectorAll("[msallowcapture^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }

                    // Support: IE8
                    // Boolean attributes and "value" are not treated correctly
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }

                    // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
                    if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
                        rbuggyQSA.push("~=");
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }

                    // Support: Safari 8+, iOS 8+
                    // https://bugs.webkit.org/show_bug.cgi?id=136851
                    // In-page `selector#id sibing-combinator selector` fails
                    if (!div.querySelectorAll("a#" + expando + "+*").length) {
                        rbuggyQSA.push(".#.+[+~]");
                    }
                });

                assert(function (div) {
                    // Support: Windows 8 Native Apps
                    // The type and name attributes are restricted during .innerHTML assignment
                    var input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    div.appendChild(input).setAttribute("name", "D");

                    // Support: IE8
                    // Enforce case-sensitivity of name attribute
                    if (div.querySelectorAll("[name=d]").length) {
                        rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

                assert(function (div) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call(div, "div");

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(div, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }

            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

            /* Contains
             ---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);

            // Element contains another
            // Purposefully self-exclusive
            // As in, an element does not contain itself
            contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function (a, b) {
                if (b) {
                    while (b = b.parentNode) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            };

            /* Sorting
             ---------------------------------------------------------------------- */

            // Document order sorting
            sortOrder = hasCompare ? function (a, b) {

                // Flag for duplicate removal
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                // Sort on method existence if only one input has compareDocumentPosition
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                    return compare;
                }

                // Calculate position if both inputs belong to the same document
                compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

                // Otherwise we know they are disconnected
                1;

                // Disconnected nodes
                if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

                    // Choose the first element that is related to our preferred document
                    if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }

                    // Maintain original order
                    return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
                }

                return compare & 4 ? -1 : 1;
            } : function (a, b) {
                // Exit early if the nodes are identical
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                var cur,
                    i = 0,
                    aup = a.parentNode,
                    bup = b.parentNode,
                    ap = [a],
                    bp = [b];

                // Parentless nodes are either documents or disconnected
                if (!aup || !bup) {
                    return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

                    // If the nodes are siblings, we can do a quick check
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }

                // Otherwise we need full lists of their ancestors for comparison
                cur = a;
                while (cur = cur.parentNode) {
                    ap.unshift(cur);
                }
                cur = b;
                while (cur = cur.parentNode) {
                    bp.unshift(cur);
                }

                // Walk down the tree looking for a discrepancy
                while (ap[i] === bp[i]) {
                    i++;
                }

                return i ?
                // Do a sibling check if the nodes have a common ancestor
                siblingCheck(ap[i], bp[i]) :

                // Otherwise nodes in our document sort first
                ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            };

            return document;
        };

        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };

        Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']");

            if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

                try {
                    var ret = matches.call(elem, expr);

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
                    elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) {}
            }

            return Sizzle(expr, document, null, [elem]).length > 0;
        };

        Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };

        Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            var fn = Expr.attrHandle[name.toLowerCase()],

            // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

            return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        /**
         * Document sorting and removing duplicates
         * @param {ArrayLike} results
         */
        Sizzle.uniqueSort = function (results) {
            var elem,
                duplicates = [],
                j = 0,
                i = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
                while (elem = results[i++]) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            // Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            sortInput = null;

            return results;
        };

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function (elem) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if (!nodeType) {
                // If no nodeType, this is expected to be an array
                while (node = elem[i++]) {
                    // Do not traverse comment nodes
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (jQuery #11153)
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            attrHandle: {},

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function ATTR(match) {
                    match[1] = match[1].replace(runescape, funescape);

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                "CHILD": function CHILD(match) {
                    /* matches from matchExpr["CHILD"]
                     1 type (only|nth|...)
                     2 what (child|of-type)
                     3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                     4 xn-component of xn+y argument ([+-]?\d*n|)
                     5 sign of xn-component
                     6 x of xn-component
                     7 sign of y-component
                     8 y of y-component
                     */
                    match[1] = match[1].toLowerCase();

                    if (match[1].slice(0, 3) === "nth") {
                        // nth-* requires argument
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +(match[7] + match[8] || match[3] === "odd");

                        // other types prohibit arguments
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                "PSEUDO": function PSEUDO(match) {
                    var excess,
                        unquoted = !match[6] && match[2];

                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";

                        // Strip excess characters from unquoted arguments
                    } else if (unquoted && rpseudo.test(unquoted) && (
                    // Get excess from tokenize (recursively)
                    excess = tokenize(unquoted, true)) && (
                    // advance to the next closing parenthesis
                    excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                        // excess is a negative index
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                }
            },

            filter: {

                "TAG": function TAG(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ? function () {
                        return true;
                    } : function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },

                "CLASS": function CLASS(className) {
                    var pattern = classCache[className + " "];

                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
                        return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                    });
                },

                "ATTR": function ATTR(name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                    };
                },

                "CHILD": function CHILD(type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth",
                        forward = type.slice(-4) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                    // Shortcut for :nth-*(n)
                    function (elem) {
                        return !!elem.parentNode;
                    } : function (elem, context, xml) {
                        var cache,
                            uniqueCache,
                            outerCache,
                            node,
                            nodeIndex,
                            start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(),
                            useCache = !xml && !ofType,
                            diff = false;

                        if (parent) {

                            // :(first|last|only)-(child|of-type)
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while (node = node[dir]) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }

                            start = [forward ? parent.firstChild : parent.lastChild];

                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (forward && useCache) {

                                // Seek `elem` from a previously-cached index

                                // ...in a gzip-friendly way
                                node = parent;
                                outerCache = node[expando] || (node[expando] = {});

                                // Support: IE <9 only
                                // Defend against cloned attroperties (jQuery gh-1709)
                                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                cache = uniqueCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = nodeIndex && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];

                                while (node = ++nodeIndex && node && node[dir] || (

                                // Fallback to seeking `elem` from the start
                                diff = nodeIndex = 0) || start.pop()) {

                                    // When found, cache indexes on `parent` and break
                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        uniqueCache[type] = [dirruns, nodeIndex, diff];
                                        break;
                                    }
                                }
                            } else {
                                // Use previously-cached element index if available
                                if (useCache) {
                                    // ...in a gzip-friendly way
                                    node = elem;
                                    outerCache = node[expando] || (node[expando] = {});

                                    // Support: IE <9 only
                                    // Defend against cloned attroperties (jQuery gh-1709)
                                    uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                    cache = uniqueCache[type] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = nodeIndex;
                                }

                                // xml :nth-child(...)
                                // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                if (diff === false) {
                                    // Use the same loop as above to seek `elem` from the start
                                    while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

                                        if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

                                            // Cache the index of each encountered element
                                            if (useCache) {
                                                outerCache = node[expando] || (node[expando] = {});

                                                // Support: IE <9 only
                                                // Defend against cloned attroperties (jQuery gh-1709)
                                                uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                                uniqueCache[type] = [dirruns, diff];
                                            }

                                            if (node === elem) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || diff % first === 0 && diff / first >= 0;
                        }
                    };
                },

                "PSEUDO": function PSEUDO(pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
                            var idx,
                                matched = fn(seed, argument),
                                i = matched.length;
                            while (i--) {
                                idx = indexOf(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) : function (elem) {
                            return fn(elem, 0, args);
                        };
                    }

                    return fn;
                }
            },

            pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function (selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile(selector.replace(rtrim, "$1"));

                    return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
                        var elem,
                            unmatched = matcher(seed, null, xml, []),
                            i = seed.length;

                        // Match elements unmatched by `matcher`
                        while (i--) {
                            if (elem = unmatched[i]) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) : function (elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        // Don't keep the element (issue #299)
                        input[0] = null;
                        return !results.pop();
                    };
                }),

                "has": markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),

                "contains": markFunction(function (text) {
                    text = text.replace(runescape, funescape);
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction(function (lang) {
                    // lang value must be a valid identifier
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function target(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },

                "root": function root(elem) {
                    return elem === docElem;
                },

                "focus": function focus(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": function enabled(elem) {
                    return elem.disabled === false;
                },

                "disabled": function disabled(elem) {
                    return elem.disabled === true;
                },

                "checked": function checked(elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
                },

                "selected": function selected(elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function empty(elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                    //   but not by others (comment: 8; processing instruction: 7; etc.)
                    // nodeType < 6 works because attributes (2) do not appear as children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },

                "parent": function parent(elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                // Element/input types
                "header": function header(elem) {
                    return rheader.test(elem.nodeName);
                },

                "input": function input(elem) {
                    return rinputs.test(elem.nodeName);
                },

                "button": function button(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function text(elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

                    // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                    (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                },

                // Position-in-collection
                "first": createPositionalPseudo(function () {
                    return [0];
                }),

                "last": createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),

                "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),

                "even": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };

        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        // Add button/input type pseudos
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }

        // Easy API for creating new setFilters
        function setFilters() {}
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();

        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched,
                match,
                tokens,
                type,
                soFar,
                groups,
                preFilters,
                cached = tokenCache[selector + " "];

            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {

                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }

                matched = false;

                // Combinators
                if (match = rcombinators.exec(soFar)) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace(rtrim, " ")
                    });
                    soFar = soFar.slice(matched.length);
                }

                // Filters
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }

                if (!matched) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
            // Cache the tokens
            tokenCache(selector, groups).slice(0);
        };

        function toSelector(tokens) {
            var i = 0,
                len = tokens.length,
                selector = "";
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
                checkNonElements = base && dir === "parentNode",
                doneName = done++;

            return combinator.first ?
            // Check against closest ancestor/preceding element
            function (elem, context, xml) {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } :

            // Check against all ancestor/preceding elements
            function (elem, context, xml) {
                var oldCache,
                    uniqueCache,
                    outerCache,
                    newCache = [dirruns, doneName];

                // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                if (xml) {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});

                            // Support: IE <9 only
                            // Defend against cloned attroperties (jQuery gh-1709)
                            uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

                            if ((oldCache = uniqueCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

                                // Assign to newCache so results back-propagate to previous elements
                                return newCache[2] = oldCache[2];
                            } else {
                                // Reuse newcache so results back-propagate to previous elements
                                uniqueCache[dir] = newCache;

                                // A match means we're done; a fail means we have to keep checking
                                if (newCache[2] = matcher(elem, context, xml)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ? function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }

        function multipleContexts(selector, contexts, results) {
            var i = 0,
                len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for (; i < len; i++) {
                if (elem = unmatched[i]) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp,
                    i,
                    elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,


                // Get initial elements from seed or context
                elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
                    matcherOut = matcher ?
                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                postFinder || (seed ? preFilter : preexisting || postFilter) ?

                // ...intermediate processing is necessary
                [] :

                // ...otherwise use results directly
                results : matcherIn;

                // Find primary matches
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }

                // Apply postFilter
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while (i--) {
                        if (elem = temp[i]) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }

                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if (elem = matcherOut[i]) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push(matcherIn[i] = elem);
                                }
                            }
                            postFinder(null, matcherOut = [], temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext,
                matcher,
                j,
                len = tokens.length,
                leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,


            // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator(function (elem) {
                return elem === checkContext;
            }, implicitRelative, true),
                matchAnyContext = addCombinator(function (elem) {
                return indexOf(checkContext, elem) > -1;
            }, implicitRelative, true),
                matchers = [function (elem, context, xml) {
                var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                // Avoid hanging onto element (issue #299)
                checkContext = null;
                return ret;
            }];

            for (; i < len; i++) {
                if (matcher = Expr.relative[tokens[i].type]) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                        tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function superMatcher(seed, context, xml, results, outermost) {
                var elem,
                    j,
                    matcher,
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    setMatched = [],
                    contextBackup = outermostContext,

                // We must always have either seed elements or outermost context
                elems = seed || byElement && Expr.find["TAG"]("*", outermost),

                // Use integer dirruns iff this is the outermost matcher
                dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
                    len = elems.length;

                if (outermost) {
                    outermostContext = context === document || context || outermost;
                }

                // Add elements passing elementMatchers directly to results
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for (; i !== len && (elem = elems[i]) != null; i++) {
                    if (byElement && elem) {
                        j = 0;
                        if (!context && elem.ownerDocument !== document) {
                            setDocument(elem);
                            xml = !documentIsHTML;
                        }
                        while (matcher = elementMatchers[j++]) {
                            if (matcher(elem, context || document, xml)) {
                                results.push(elem);
                                break;
                            }
                        }
                        if (outermost) {
                            dirruns = dirrunsUnique;
                        }
                    }

                    // Track unmatched elements for set filters
                    if (bySet) {
                        // They will have gone through all possible matchers
                        if (elem = !matcher && elem) {
                            matchedCount--;
                        }

                        // Lengthen the array for every element, matched or not
                        if (seed) {
                            unmatched.push(elem);
                        }
                    }
                }

                // `i` is now the count of elements visited above, and adding it to `matchedCount`
                // makes the latter nonnegative.
                matchedCount += i;

                // Apply set filters to unmatched elements
                // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                // no element matchers and no seed.
                // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                // numerically zero.
                if (bySet && i !== matchedCount) {
                    j = 0;
                    while (matcher = setMatchers[j++]) {
                        matcher(unmatched, setMatched, context, xml);
                    }

                    if (seed) {
                        // Reintegrate element matches to eliminate the need for sorting
                        if (matchedCount > 0) {
                            while (i--) {
                                if (!(unmatched[i] || setMatched[i])) {
                                    setMatched[i] = pop.call(results);
                                }
                            }
                        }

                        // Discard index placeholder values to get only actual matches
                        setMatched = condense(setMatched);
                    }

                    // Add matches to results
                    push.apply(results, setMatched);

                    // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

                        Sizzle.uniqueSort(results);
                    }
                }

                // Override manipulation of globals by nested matchers
                if (outermost) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }

                return unmatched;
            };

            return bySet ? markFunction(superMatcher) : superMatcher;
        }

        compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[selector + " "];

            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }

                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

                // Save selector and tokenization
                cached.selector = selector;
            }
            return cached;
        };

        /**
         * A low-level selection function that works with Sizzle's compiled
         *  selector functions
         * @param {String|Function} selector A selector or a pre-compiled
         *  selector function built with Sizzle.compile
         * @param {Element} context
         * @param {Array} [results]
         * @param {Array} [seed] A set of elements to match against
         */
        select = Sizzle.select = function (selector, context, results, seed) {
            var i,
                tokens,
                token,
                type,
                find,
                compiled = typeof selector === "function" && selector,
                match = !seed && tokenize(selector = compiled.selector || selector);

            results = results || [];

            // Try to minimize operations if there is only one selector in the list and no seed
            // (the latter of which guarantees us context)
            if (match.length === 1) {

                // Reduce context if the leading compound selector is an ID
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;

                        // Precompiled matchers will still verify ancestry, so step up a level
                    } else if (compiled) {
                        context = context.parentNode;
                    }

                    selector = selector.slice(tokens.shift().value.length);
                }

                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];

                    // Abort if we hit a combinator
                    if (Expr.relative[type = token.type]) {
                        break;
                    }
                    if (find = Expr.find[type]) {
                        // Search, expanding context for leading sibling combinators
                        if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }

                            break;
                        }
                    }
                }
            }

            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
            return results;
        };

        // One-time assignments

        // Sort stability
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

        // Support: Chrome 14-35+
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = !!hasDuplicate;

        // Initialize against the default document
        setDocument();

        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function (div1) {
            // Should return 1, but returns 4 (following)
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        });

        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (!assert(function (div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }

        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        if (!support.attributes || !assert(function (div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
            addHandle("value", function (elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }

        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        if (!assert(function (div) {
            return div.getAttribute("disabled") == null;
        })) {
            addHandle(booleans, function (elem, name, isXML) {
                var val;
                if (!isXML) {
                    return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }
            });
        }

        return Sizzle;
    }(window);

    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;

    var dir = function dir(elem, _dir, until) {
        var matched = [],
            truncate = until !== undefined;

        while ((elem = elem[_dir]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
                if (truncate && jQuery(elem).is(until)) {
                    break;
                }
                matched.push(elem);
            }
        }
        return matched;
    };

    var _siblings = function _siblings(n, elem) {
        var matched = [];

        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
                matched.push(n);
            }
        }

        return matched;
    };

    var rneedsContext = jQuery.expr.match.needsContext;

    var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;

    var risSimple = /^.[^:#\[\.,]*$/;

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                /* jshint -W018 */
                return !!qualifier.call(elem, i, elem) !== not;
            });
        }

        if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return elem === qualifier !== not;
            });
        }

        if (typeof qualifier === "string") {
            if (risSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }

            qualifier = jQuery.filter(qualifier, elements);
        }

        return jQuery.grep(elements, function (elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
        });
    }

    jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];

        if (not) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
            return elem.nodeType === 1;
        }));
    };

    jQuery.fn.extend({
        find: function find(selector) {
            var i,
                len = this.length,
                ret = [],
                self = this;

            if (typeof selector !== "string") {
                return this.pushStack(jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }

            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }

            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },
        filter: function filter(selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function not(selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },
        is: function is(selector) {
            return !!winnow(this,

            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
        }
    });

    // Initialize a jQuery object


    // A central reference to the root jQuery(document)
    var rootjQuery,


    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        init = jQuery.fn.init = function (selector, context, root) {
        var match, elem;

        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) {
            return this;
        }

        // Method init() accepts an alternate rootjQuery
        // so migrate can support jQuery.sub (gh-2101)
        root = root || rootjQuery;

        // Handle HTML strings
        if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [null, selector, null];
            } else {
                match = rquickExpr.exec(selector);
            }

            // Match html or make sure no context is specified for #id
            if (match && (match[1] || !context)) {

                // HANDLE: $(html) -> $(array)
                if (match[1]) {
                    context = context instanceof jQuery ? context[0] : context;

                    // Option to run scripts is true for back-compat
                    // Intentionally let the error be thrown if parseHTML is not present
                    jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

                    // HANDLE: $(html, props)
                    if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                        for (match in context) {

                            // Properties of context are called as methods if possible
                            if (jQuery.isFunction(this[match])) {
                                this[match](context[match]);

                                // ...and otherwise set as attributes
                            } else {
                                this.attr(match, context[match]);
                            }
                        }
                    }

                    return this;

                    // HANDLE: $(#id)
                } else {
                    elem = document.getElementById(match[2]);

                    // Support: Blackberry 4.6
                    // gEBID returns nodes no longer in the document (#6963)
                    if (elem && elem.parentNode) {

                        // Inject the element directly into the jQuery object
                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

                // HANDLE: $(expr, $(...))
            } else if (!context || context.jquery) {
                return (context || root).find(selector);

                // HANDLE: $(expr, context)
                // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor(context).find(selector);
            }

            // HANDLE: $(DOMElement)
        } else if (selector.nodeType) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;

            // HANDLE: $(function)
            // Shortcut for document ready
        } else if (jQuery.isFunction(selector)) {
            return root.ready !== undefined ? root.ready(selector) :

            // Execute immediately if ready is not present
            selector(jQuery);
        }

        if (selector.selector !== undefined) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray(selector, this);
    };

    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

    // Initialize central reference
    rootjQuery = jQuery(document);

    var rparentsprev = /^(?:parents|prev(?:Until|All))/,


    // Methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

    jQuery.fn.extend({
        has: function has(target) {
            var targets = jQuery(target, this),
                l = targets.length;

            return this.filter(function () {
                var i = 0;
                for (; i < l; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        closest: function closest(selectors, context) {
            var cur,
                i = 0,
                l = this.length,
                matched = [],
                pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;

            for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

                    // Always skip document fragments
                    if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 :

                    // Don't pass non-elements to Sizzle
                    cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

                        matched.push(cur);
                        break;
                    }
                }
            }

            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },

        // Determine the position of an element within the set
        index: function index(elem) {

            // No argument, return index in parent
            if (!elem) {
                return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }

            // Index in selector
            if (typeof elem === "string") {
                return indexOf.call(jQuery(elem), this[0]);
            }

            // Locate the position of the desired element
            return indexOf.call(this,

            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem);
        },

        add: function add(selector, context) {
            return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
        },

        addBack: function addBack(selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });

    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) {}
        return cur;
    }

    jQuery.each({
        parent: function parent(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function parents(elem) {
            return dir(elem, "parentNode");
        },
        parentsUntil: function parentsUntil(elem, i, until) {
            return dir(elem, "parentNode", until);
        },
        next: function next(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function prev(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function nextAll(elem) {
            return dir(elem, "nextSibling");
        },
        prevAll: function prevAll(elem) {
            return dir(elem, "previousSibling");
        },
        nextUntil: function nextUntil(elem, i, until) {
            return dir(elem, "nextSibling", until);
        },
        prevUntil: function prevUntil(elem, i, until) {
            return dir(elem, "previousSibling", until);
        },
        siblings: function siblings(elem) {
            return _siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function children(elem) {
            return _siblings(elem.firstChild);
        },
        contents: function contents(elem) {
            return elem.contentDocument || jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var matched = jQuery.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                matched = jQuery.filter(selector, matched);
            }

            if (this.length > 1) {

                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    jQuery.uniqueSort(matched);
                }

                // Reverse order for parents* and prev-derivatives
                if (rparentsprev.test(name)) {
                    matched.reverse();
                }
            }

            return this.pushStack(matched);
        };
    });
    var rnotwhite = /\S+/g;

    // Convert String-formatted options into Object-formatted ones
    function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function (options) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

        var // Flag to know if list is currently firing
        firing,


        // Last fire value for non-forgettable lists
        memory,


        // Flag to know if list was already fired
        _fired,


        // Flag to prevent firing
        _locked,


        // Actual callback list
        list = [],


        // Queue of execution data for repeatable lists
        queue = [],


        // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1,


        // Fire callbacks
        fire = function fire() {

            // Enforce single-firing
            _locked = options.once;

            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            _fired = firing = true;
            for (; queue.length; firingIndex = -1) {
                memory = queue.shift();
                while (++firingIndex < list.length) {

                    // Run callback and check for early termination
                    if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if (!options.memory) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if (_locked) {

                // Keep an empty list if we have data for future add calls
                if (memory) {
                    list = [];

                    // Otherwise, this object is spent
                } else {
                    list = "";
                }
            }
        },


        // Actual Callbacks object
        self = {

            // Add a callback or a collection of callbacks to the list
            add: function add() {
                if (list) {

                    // If we have memory from a past run, we should fire after adding
                    if (memory && !firing) {
                        firingIndex = list.length - 1;
                        queue.push(memory);
                    }

                    (function add(args) {
                        jQuery.each(args, function (_, arg) {
                            if (jQuery.isFunction(arg)) {
                                if (!options.unique || !self.has(arg)) {
                                    list.push(arg);
                                }
                            } else if (arg && arg.length && jQuery.type(arg) !== "string") {

                                // Inspect recursively
                                add(arg);
                            }
                        });
                    })(arguments);

                    if (memory && !firing) {
                        fire();
                    }
                }
                return this;
            },

            // Remove a callback from the list
            remove: function remove() {
                jQuery.each(arguments, function (_, arg) {
                    var index;
                    while ((index = jQuery.inArray(arg, list, index)) > -1) {
                        list.splice(index, 1);

                        // Handle firing indexes
                        if (index <= firingIndex) {
                            firingIndex--;
                        }
                    }
                });
                return this;
            },

            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function has(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
            },

            // Remove all callbacks from the list
            empty: function empty() {
                if (list) {
                    list = [];
                }
                return this;
            },

            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function disable() {
                _locked = queue = [];
                list = memory = "";
                return this;
            },
            disabled: function disabled() {
                return !list;
            },

            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function lock() {
                _locked = queue = [];
                if (!memory) {
                    list = memory = "";
                }
                return this;
            },
            locked: function locked() {
                return !!_locked;
            },

            // Call all callbacks with the given context and arguments
            fireWith: function fireWith(context, args) {
                if (!_locked) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    queue.push(args);
                    if (!firing) {
                        fire();
                    }
                }
                return this;
            },

            // Call all the callbacks with the given arguments
            fire: function fire() {
                self.fireWith(this, arguments);
                return this;
            },

            // To know if the callbacks have already been called at least once
            fired: function fired() {
                return !!_fired;
            }
        };

        return self;
    };

    jQuery.extend({

        Deferred: function Deferred(func) {
            var tuples = [

            // action, add listener, listener list, final state
            ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
                _state = "pending",
                _promise = {
                state: function state() {
                    return _state;
                },
                always: function always() {
                    deferred.done(arguments).fail(arguments);
                    return this;
                },
                then: function then() /* fnDone, fnFail, fnProgress */{
                    var fns = arguments;
                    return jQuery.Deferred(function (newDefer) {
                        jQuery.each(tuples, function (i, tuple) {
                            var fn = jQuery.isFunction(fns[i]) && fns[i];

                            // deferred[ done | fail | progress ] for forwarding actions to newDefer
                            deferred[tuple[1]](function () {
                                var returned = fn && fn.apply(this, arguments);
                                if (returned && jQuery.isFunction(returned.promise)) {
                                    returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                                } else {
                                    newDefer[tuple[0] + "With"](this === _promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                }
                            });
                        });
                        fns = null;
                    }).promise();
                },

                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function promise(obj) {
                    return obj != null ? jQuery.extend(obj, _promise) : _promise;
                }
            },
                deferred = {};

            // Keep pipe for back-compat
            _promise.pipe = _promise.then;

            // Add list-specific methods
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2],
                    stateString = tuple[3];

                // promise[ done | fail | progress ] = list.add
                _promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function () {

                        // state = [ resolved | rejected ]
                        _state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }

                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + "With"](this === deferred ? _promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // Make the deferred a promise
            _promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function when(subordinate /* , ..., subordinateN */) {
            var i = 0,
                resolveValues = _slice.call(arguments),
                length = resolveValues.length,


            // the count of uncompleted subordinates
            remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,


            // the master Deferred.
            // If resolveValues consist of only a single Deferred, just use that.
            deferred = remaining === 1 ? subordinate : jQuery.Deferred(),


            // Update function for both resolve and progress values
            updateFunc = function updateFunc(i, contexts, values) {
                return function (value) {
                    contexts[i] = this;
                    values[i] = arguments.length > 1 ? _slice.call(arguments) : value;
                    if (values === progressValues) {
                        deferred.notifyWith(contexts, values);
                    } else if (! --remaining) {
                        deferred.resolveWith(contexts, values);
                    }
                };
            },
                progressValues,
                progressContexts,
                resolveContexts;

            // Add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
                    } else {
                        --remaining;
                    }
                }
            }

            // If we're not waiting on anything, resolve the master
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });

    // The deferred used on DOM ready
    var readyList;

    jQuery.fn.ready = function (fn) {

        // Add the callback
        jQuery.ready.promise().done(fn);

        return this;
    };

    jQuery.extend({

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function holdReady(hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },

        // Handle when the DOM is ready
        ready: function ready(wait) {

            // Abort if there are pending holds or we're already ready
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith(document, [jQuery]);

            // Trigger any bound ready events
            if (jQuery.fn.triggerHandler) {
                jQuery(document).triggerHandler("ready");
                jQuery(document).off("ready");
            }
        }
    });

    /**
     * The ready event handler and self cleanup method
     */
    function completed() {
        document.removeEventListener("DOMContentLoaded", completed);
        window.removeEventListener("load", completed);
        jQuery.ready();
    }

    jQuery.ready.promise = function (obj) {
        if (!readyList) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called
            // after the browser event has already occurred.
            // Support: IE9-10 only
            // Older IE sometimes signals "interactive" too soon
            if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

                // Handle it asynchronously to allow scripts the opportunity to delay ready
                window.setTimeout(jQuery.ready);
            } else {

                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", completed);

                // A fallback to window.onload, that will always work
                window.addEventListener("load", completed);
            }
        }
        return readyList.promise(obj);
    };

    // Kick off the DOM ready check even if the user does not
    jQuery.ready.promise();

    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0,
            len = elems.length,
            bulk = key == null;

        // Sets many values
        if (jQuery.type(key) === "object") {
            chainable = true;
            for (i in key) {
                access(elems, fn, i, key[i], true, emptyGet, raw);
            }

            // Sets one value
        } else if (value !== undefined) {
            chainable = true;

            if (!jQuery.isFunction(value)) {
                raw = true;
            }

            if (bulk) {

                // Bulk operations run against the entire set
                if (raw) {
                    fn.call(elems, value);
                    fn = null;

                    // ...except when executing function values
                } else {
                    bulk = fn;
                    fn = function fn(elem, key, value) {
                        return bulk.call(jQuery(elem), value);
                    };
                }
            }

            if (fn) {
                for (; i < len; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }

        return chainable ? elems :

        // Gets
        bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
    };
    var acceptData = function acceptData(owner) {

        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        /* jshint -W018 */
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
    };

    function Data() {
        this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

        register: function register(owner, initial) {
            var value = initial || {};

            // If it is a node unlikely to be stringify-ed or looped over
            // use plain assignment
            if (owner.nodeType) {
                owner[this.expando] = value;

                // Otherwise secure it in a non-enumerable, non-writable property
                // configurability must be true to allow the property to be
                // deleted with the delete operator
            } else {
                Object.defineProperty(owner, this.expando, {
                    value: value,
                    writable: true,
                    configurable: true
                });
            }
            return owner[this.expando];
        },
        cache: function cache(owner) {

            // We can accept data for non-element nodes in modern browsers,
            // but we should not, see #8335.
            // Always return an empty object.
            if (!acceptData(owner)) {
                return {};
            }

            // Check if the owner object already has a cache
            var value = owner[this.expando];

            // If not, create one
            if (!value) {
                value = {};

                // We can accept data for non-element nodes in modern browsers,
                // but we should not, see #8335.
                // Always return an empty object.
                if (acceptData(owner)) {

                    // If it is a node unlikely to be stringify-ed or looped over
                    // use plain assignment
                    if (owner.nodeType) {
                        owner[this.expando] = value;

                        // Otherwise secure it in a non-enumerable property
                        // configurable must be true to allow the property to be
                        // deleted when data is removed
                    } else {
                        Object.defineProperty(owner, this.expando, {
                            value: value,
                            configurable: true
                        });
                    }
                }
            }

            return value;
        },
        set: function set(owner, data, value) {
            var prop,
                cache = this.cache(owner);

            // Handle: [ owner, key, value ] args
            if (typeof data === "string") {
                cache[data] = value;

                // Handle: [ owner, { properties } ] args
            } else {

                // Copy the properties one-by-one to the cache object
                for (prop in data) {
                    cache[prop] = data[prop];
                }
            }
            return cache;
        },
        get: function get(owner, key) {
            return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][key];
        },
        access: function access(owner, key, value) {
            var stored;

            // In cases where either:
            //
            //   1. No key was specified
            //   2. A string key was specified, but no value provided
            //
            // Take the "read" path and allow the get method to determine
            // which value to return, respectively either:
            //
            //   1. The entire cache object
            //   2. The data stored at the key
            //
            if (key === undefined || key && typeof key === "string" && value === undefined) {

                stored = this.get(owner, key);

                return stored !== undefined ? stored : this.get(owner, jQuery.camelCase(key));
            }

            // When the key is not a string, or both a key and value
            // are specified, set or extend (existing objects) with either:
            //
            //   1. An object of properties
            //   2. A key and value
            //
            this.set(owner, key, value);

            // Since the "set" path can have two possible entry points
            // return the expected data based on which path was taken[*]
            return value !== undefined ? value : key;
        },
        remove: function remove(owner, key) {
            var i,
                name,
                camel,
                cache = owner[this.expando];

            if (cache === undefined) {
                return;
            }

            if (key === undefined) {
                this.register(owner);
            } else {

                // Support array or space separated string of keys
                if (jQuery.isArray(key)) {

                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = key.concat(key.map(jQuery.camelCase));
                } else {
                    camel = jQuery.camelCase(key);

                    // Try the string as a key before any manipulation
                    if (key in cache) {
                        name = [key, camel];
                    } else {

                        // If a key with the spaces exists, use it.
                        // Otherwise, create an array by matching non-whitespace
                        name = camel;
                        name = name in cache ? [name] : name.match(rnotwhite) || [];
                    }
                }

                i = name.length;

                while (i--) {
                    delete cache[name[i]];
                }
            }

            // Remove the expando if there's no more data
            if (key === undefined || jQuery.isEmptyObject(cache)) {

                // Support: Chrome <= 35-45+
                // Webkit & Blink performance suffers when deleting properties
                // from DOM nodes, so set to undefined instead
                // https://code.google.com/p/chromium/issues/detail?id=378607
                if (owner.nodeType) {
                    owner[this.expando] = undefined;
                } else {
                    delete owner[this.expando];
                }
            }
        },
        hasData: function hasData(owner) {
            var cache = owner[this.expando];
            return cache !== undefined && !jQuery.isEmptyObject(cache);
        }
    };
    var dataPriv = new Data();

    var dataUser = new Data();

    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        rmultiDash = /[A-Z]/g;

    function dataAttr(elem, key, data) {
        var name;

        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true : data === "false" ? false : data === "null" ? null :

                    // Only convert to a number if it doesn't change the string
                    +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {}

                // Make sure we set the data so it isn't changed later
                dataUser.set(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }

    jQuery.extend({
        hasData: function hasData(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },

        data: function data(elem, name, _data) {
            return dataUser.access(elem, name, _data);
        },

        removeData: function removeData(elem, name) {
            dataUser.remove(elem, name);
        },

        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function _data(elem, name, data) {
            return dataPriv.access(elem, name, data);
        },

        _removeData: function _removeData(elem, name) {
            dataPriv.remove(elem, name);
        }
    });

    jQuery.fn.extend({
        data: function data(key, value) {
            var i,
                name,
                data,
                elem = this[0],
                attrs = elem && elem.attributes;

            // Gets all values
            if (key === undefined) {
                if (this.length) {
                    data = dataUser.get(elem);

                    if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                        i = attrs.length;
                        while (i--) {

                            // Support: IE11+
                            // The attrs elements can be null (#14894)
                            if (attrs[i]) {
                                name = attrs[i].name;
                                if (name.indexOf("data-") === 0) {
                                    name = jQuery.camelCase(name.slice(5));
                                    dataAttr(elem, name, data[name]);
                                }
                            }
                        }
                        dataPriv.set(elem, "hasDataAttrs", true);
                    }
                }

                return data;
            }

            // Sets multiple values
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
                return this.each(function () {
                    dataUser.set(this, key);
                });
            }

            return access(this, function (value) {
                var data, camelKey;

                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if (elem && value === undefined) {

                    // Attempt to get data from the cache
                    // with the key as-is
                    data = dataUser.get(elem, key) ||

                    // Try to find dashed key if it exists (gh-2779)
                    // This is for 2.2.x only
                    dataUser.get(elem, key.replace(rmultiDash, "-$&").toLowerCase());

                    if (data !== undefined) {
                        return data;
                    }

                    camelKey = jQuery.camelCase(key);

                    // Attempt to get data from the cache
                    // with the key camelized
                    data = dataUser.get(elem, camelKey);
                    if (data !== undefined) {
                        return data;
                    }

                    // Attempt to "discover" the data in
                    // HTML5 custom data-* attrs
                    data = dataAttr(elem, camelKey, undefined);
                    if (data !== undefined) {
                        return data;
                    }

                    // We tried really hard, but the data doesn't exist.
                    return;
                }

                // Set the data...
                camelKey = jQuery.camelCase(key);
                this.each(function () {

                    // First, attempt to store a copy or reference of any
                    // data that might've been store with a camelCased key.
                    var data = dataUser.get(this, camelKey);

                    // For HTML5 data-* attribute interop, we have to
                    // store property names with dashes in a camelCase form.
                    // This might not apply to all properties...*
                    dataUser.set(this, camelKey, value);

                    // *... In the case of properties that might _actually_
                    // have dashes, we need to also store a copy of that
                    // unchanged property.
                    if (key.indexOf("-") > -1 && data !== undefined) {
                        dataUser.set(this, key, value);
                    }
                });
            }, null, value, arguments.length > 1, null, true);
        },

        removeData: function removeData(key) {
            return this.each(function () {
                dataUser.remove(this, key);
            });
        }
    });

    jQuery.extend({
        queue: function queue(elem, type, data) {
            var queue;

            if (elem) {
                type = (type || "fx") + "queue";
                queue = dataPriv.get(elem, type);

                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = dataPriv.access(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },

        dequeue: function dequeue(elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function next() {
                jQuery.dequeue(elem, type);
            };

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                // Clear up the last queue stop function
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }

            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },

        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function _queueHooks(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    dataPriv.remove(elem, [type + "queue", key]);
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function queue(type, data) {
            var setter = 2;

            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }

            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }

            return data === undefined ? this : this.each(function () {
                var queue = jQuery.queue(this, type, data);

                // Ensure a hooks for this queue
                jQuery._queueHooks(this, type);

                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function dequeue(type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        clearQueue: function clearQueue(type) {
            return this.queue(type || "fx", []);
        },

        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function promise(type, obj) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function resolve() {
                if (! --count) {
                    defer.resolveWith(elements, [elements]);
                }
            };

            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while (i--) {
                tmp = dataPriv.get(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

    var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

    var cssExpand = ["Top", "Right", "Bottom", "Left"];

    var isHidden = function isHidden(elem, el) {

        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    };

    function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted,
            scale = 1,
            maxIterations = 20,
            currentValue = tween ? function () {
            return tween.cur();
        } : function () {
            return jQuery.css(elem, prop, "");
        },
            initial = currentValue(),
            unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


        // Starting value computation is required for potential unit mismatches
        initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

        if (initialInUnit && initialInUnit[3] !== unit) {

            // Trust units reported by jQuery.css
            unit = unit || initialInUnit[3];

            // Make sure we update the tween properties later on
            valueParts = valueParts || [];

            // Iteratively approximate from a nonzero starting point
            initialInUnit = +initial || 1;

            do {

                // If previous iteration zeroed out, double until we get *something*.
                // Use string for doubling so we don't accidentally see scale as unchanged below
                scale = scale || ".5";

                // Adjust and apply
                initialInUnit = initialInUnit / scale;
                jQuery.style(elem, prop, initialInUnit + unit);

                // Update scale, tolerating zero or NaN from tween.cur()
                // Break the loop if scale is unchanged or perfect, or if we've just had enough.
            } while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
        }

        if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;

            // Apply relative offset (+=/-=) if specified
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
                tween.unit = unit;
                tween.start = initialInUnit;
                tween.end = adjusted;
            }
        }
        return adjusted;
    }
    var rcheckableType = /^(?:checkbox|radio)$/i;

    var rtagName = /<([\w:-]+)/;

    var rscriptType = /^$|\/(?:java|ecma)script/i;

    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {

        // Support: IE9
        option: [1, "<select multiple='multiple'>", "</select>"],

        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

        _default: [0, "", ""]
    };

    // Support: IE9
    wrapMap.optgroup = wrapMap.option;

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    function getAll(context, tag) {

        // Support: IE9-11+
        // Use typeof to avoid zero-argument method invocation on host objects (#15151)
        var ret = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== "undefined" ? context.querySelectorAll(tag || "*") : [];

        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
    }

    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        var i = 0,
            l = elems.length;

        for (; i < l; i++) {
            dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
        }
    }

    var rhtml = /<|&#?\w+;/;

    function buildFragment(elems, context, scripts, selection, ignored) {
        var elem,
            tmp,
            tag,
            wrap,
            contains,
            j,
            fragment = context.createDocumentFragment(),
            nodes = [],
            i = 0,
            l = elems.length;

        for (; i < l; i++) {
            elem = elems[i];

            if (elem || elem === 0) {

                // Add nodes directly
                if (jQuery.type(elem) === "object") {

                    // Support: Android<4.1, PhantomJS<2
                    // push.apply(_, arraylike) throws on ancient WebKit
                    jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                    // Convert non-html into a text node
                } else if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));

                    // Convert html into DOM nodes
                } else {
                    tmp = tmp || fragment.appendChild(context.createElement("div"));

                    // Deserialize a standard representation
                    tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                    wrap = wrapMap[tag] || wrapMap._default;
                    tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

                    // Descend through wrappers to the right content
                    j = wrap[0];
                    while (j--) {
                        tmp = tmp.lastChild;
                    }

                    // Support: Android<4.1, PhantomJS<2
                    // push.apply(_, arraylike) throws on ancient WebKit
                    jQuery.merge(nodes, tmp.childNodes);

                    // Remember the top-level container
                    tmp = fragment.firstChild;

                    // Ensure the created nodes are orphaned (#12392)
                    tmp.textContent = "";
                }
            }
        }

        // Remove wrapper from fragment
        fragment.textContent = "";

        i = 0;
        while (elem = nodes[i++]) {

            // Skip elements already in the context collection (trac-4087)
            if (selection && jQuery.inArray(elem, selection) > -1) {
                if (ignored) {
                    ignored.push(elem);
                }
                continue;
            }

            contains = jQuery.contains(elem.ownerDocument, elem);

            // Append to fragment
            tmp = getAll(fragment.appendChild(elem), "script");

            // Preserve script evaluation history
            if (contains) {
                setGlobalEval(tmp);
            }

            // Capture executables
            if (scripts) {
                j = 0;
                while (elem = tmp[j++]) {
                    if (rscriptType.test(elem.type || "")) {
                        scripts.push(elem);
                    }
                }
            }
        }

        return fragment;
    }

    (function () {
        var fragment = document.createDocumentFragment(),
            div = fragment.appendChild(document.createElement("div")),
            input = document.createElement("input");

        // Support: Android 4.0-4.3, Safari<=5.1
        // Check state lost if the name is set (#11217)
        // Support: Windows Web Apps (WWA)
        // `name` and `type` must use .setAttribute for WWA (#14901)
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");

        div.appendChild(input);

        // Support: Safari<=5.1, Android<4.2
        // Older WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

        // Support: IE<=11+
        // Make sure textarea (and checkbox) defaultValue is properly cloned
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
    })();

    var rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    // Support: IE9
    // See #13393 for more info
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) {}
    }

    function _on(elem, types, selector, data, fn, one) {
        var origFn, type;

        // Types can be a map of types/handlers
        if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

            // ( types-Object, selector, data )
            if (typeof selector !== "string") {

                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                _on(elem, type, selector, data, types[type], one);
            }
            return elem;
        }

        if (data == null && fn == null) {

            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if (fn == null) {
            if (typeof selector === "string") {

                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {

                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if (fn === false) {
            fn = returnFalse;
        } else if (!fn) {
            return elem;
        }

        if (one === 1) {
            origFn = fn;
            fn = function fn(event) {

                // Can use an empty set, since event contains the info
                jQuery().off(event);
                return origFn.apply(this, arguments);
            };

            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function () {
            jQuery.event.add(this, types, fn, data, selector);
        });
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

        global: {},

        add: function add(elem, types, handler, data, selector) {

            var handleObjIn,
                eventHandle,
                tmp,
                events,
                t,
                handleObj,
                special,
                handlers,
                type,
                namespaces,
                origType,
                elemData = dataPriv.get(elem);

            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (!elemData) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {

                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
                };
            }

            // Handle multiple events separated by a space
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // There *must* be a type, no attaching namespace-only handlers
                if (!type) {
                    continue;
                }

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[type] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);

                // Init the event handler queue if we're the first
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener if the special events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = true;
            }
        },

        // Detach an event or set of events from an element
        remove: function remove(elem, types, handler, selector, mappedTypes) {

            var j,
                origCount,
                tmp,
                events,
                t,
                handleObj,
                special,
                handlers,
                type,
                namespaces,
                origType,
                elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

            if (!elemData || !(events = elemData.events)) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                // Unbind all events (on this namespace, if provided) for the element
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }

                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                // Remove matching events
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];

                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        handlers.splice(j, 1);

                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    delete events[type];
                }
            }

            // Remove data and the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                dataPriv.remove(elem, "handle events");
            }
        },

        dispatch: function dispatch(event) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);

            var i,
                j,
                ret,
                matched,
                handleObj,
                handlerQueue = [],
                args = _slice.call(arguments),
                handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
                special = jQuery.event.special[event.type] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;

                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

                    // Triggered event must either 1) have no namespace, or 2) have namespace(s)
                    // a subset or equal to those in the bound event (both can have no namespace).
                    if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }

            return event.result;
        },

        handlers: function handlers(event, _handlers) {
            var i,
                matches,
                sel,
                handleObj,
                handlerQueue = [],
                delegateCount = _handlers.delegateCount,
                cur = event.target;

            // Support (at least): Chrome, IE9
            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            //
            // Support: Firefox<=42+
            // Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
            if (delegateCount && cur.nodeType && (event.type !== "click" || isNaN(event.button) || event.button < 1)) {

                for (; cur !== this; cur = cur.parentNode || this) {

                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = _handlers[i];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if (delegateCount < _handlers.length) {
                handlerQueue.push({ elem: this, handlers: _handlers.slice(delegateCount) });
            }

            return handlerQueue;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: ("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " + "metaKey relatedTarget shiftKey target timeStamp view which").split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function filter(event, original) {

                // Add which for key events
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: ("button buttons clientX clientY offsetX offsetY pageX pageY " + "screenX screenY toElement").split(" "),
            filter: function filter(event, original) {
                var eventDoc,
                    doc,
                    body,
                    button = original.button;

                // Calculate pageX/Y if missing and clientX/Y available
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!event.which && button !== undefined) {
                    event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
                }

                return event;
            }
        },

        fix: function fix(event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i,
                prop,
                copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[type];

            if (!fixHook) {
                this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

            event = new jQuery.Event(originalEvent);

            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }

            // Support: Cordova 2.5 (WebKit) (#13255)
            // All events should have a target; Cordova deviceready doesn't
            if (!event.target) {
                event.target = document;
            }

            // Support: Safari 6.0+, Chrome<28
            // Target should not be a text node (#504, #13143)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },

        special: {
            load: {

                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {

                // Fire native event if possible so blur/focus sequence is correct
                trigger: function trigger() {
                    if (this !== safeActiveElement() && this.focus) {
                        this.focus();
                        return false;
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function trigger() {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {

                // For checkbox, fire native event so checked state will be right
                trigger: function trigger() {
                    if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
                        this.click();
                        return false;
                    }
                },

                // For cross-browser consistency, don't fire native .click() on links
                _default: function _default(event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },

            beforeunload: {
                postDispatch: function postDispatch(event) {

                    // Support: Firefox 20+
                    // Firefox doesn't alert if the returnValue field is not set.
                    if (event.result !== undefined && event.originalEvent) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        }
    };

    jQuery.removeEvent = function (elem, type, handle) {

        // This "if" is needed for plain objects
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
        }
    };

    jQuery.Event = function (src, props) {

        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

            // Support: Android<4.0
            src.returnValue === false ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,

        preventDefault: function preventDefault() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if (e && !this.isSimulated) {
                e.preventDefault();
            }
        },
        stopPropagation: function stopPropagation() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if (e && !this.isSimulated) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function stopImmediatePropagation() {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e && !this.isSimulated) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    };

    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://code.google.com/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,

            handle: function handle(event) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mouseenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || related !== target && !jQuery.contains(target, related)) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });

    jQuery.fn.extend({
        on: function on(types, selector, data, fn) {
            return _on(this, types, selector, data, fn);
        },
        one: function one(types, selector, data, fn) {
            return _on(this, types, selector, data, fn, 1);
        },
        off: function off(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {

                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {

                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        }
    });

    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,


    // Support: IE 10-11, Edge 10240+
    // In IE/Edge using regex groups here causes severe slowdowns.
    // See https://connect.microsoft.com/IE/feedback/details/1736512/
    rnoInnerhtml = /<script|<style|<link/i,


    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    // Manipulating tables requires a tbody
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);

        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }

        return elem;
    }

    function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

        if (dest.nodeType !== 1) {
            return;
        }

        // 1. Copy private data: events, handlers, etc.
        if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.access(src);
            pdataCur = dataPriv.set(dest, pdataOld);
            events = pdataOld.events;

            if (events) {
                delete pdataCur.handle;
                pdataCur.events = {};

                for (type in events) {
                    for (i = 0, l = events[type].length; i < l; i++) {
                        jQuery.event.add(dest, type, events[type][i]);
                    }
                }
            }
        }

        // 2. Copy user data
        if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery.extend({}, udataOld);

            dataUser.set(dest, udataCur);
        }
    }

    // Fix IE bugs, see support tests
    function fixInput(src, dest) {
        var nodeName = dest.nodeName.toLowerCase();

        // Fails to persist the checked state of a cloned checkbox or radio button.
        if (nodeName === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;

            // Fails to return the selected option to the default selected state when cloning options
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }
    }

    function domManip(collection, args, callback, ignored) {

        // Flatten any nested arrays
        args = concat.apply([], args);

        var fragment,
            first,
            scripts,
            hasScripts,
            node,
            doc,
            i = 0,
            l = collection.length,
            iNoClone = l - 1,
            value = args[0],
            isFunction = jQuery.isFunction(value);

        // We can't cloneNode fragments that contain checked, in WebKit
        if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function (index) {
                var self = collection.eq(index);
                if (isFunction) {
                    args[0] = value.call(this, index, self.html());
                }
                domManip(self, args, callback, ignored);
            });
        }

        if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;

            if (fragment.childNodes.length === 1) {
                fragment = first;
            }

            // Require either new content or an interest in ignored elements to invoke the callback
            if (first || ignored) {
                scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                hasScripts = scripts.length;

                // Use the original fragment for the last item
                // instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for (; i < l; i++) {
                    node = fragment;

                    if (i !== iNoClone) {
                        node = jQuery.clone(node, true, true);

                        // Keep references to cloned scripts for later restoration
                        if (hasScripts) {

                            // Support: Android<4.1, PhantomJS<2
                            // push.apply(_, arraylike) throws on ancient WebKit
                            jQuery.merge(scripts, getAll(node, "script"));
                        }
                    }

                    callback.call(collection[i], node, i);
                }

                if (hasScripts) {
                    doc = scripts[scripts.length - 1].ownerDocument;

                    // Reenable scripts
                    jQuery.map(scripts, restoreScript);

                    // Evaluate executable scripts on first document insertion
                    for (i = 0; i < hasScripts; i++) {
                        node = scripts[i];
                        if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

                            if (node.src) {

                                // Optional AJAX dependency, but won't run scripts if not present
                                if (jQuery._evalUrl) {
                                    jQuery._evalUrl(node.src);
                                }
                            } else {
                                jQuery.globalEval(node.textContent.replace(rcleanScript, ""));
                            }
                        }
                    }
                }
            }
        }

        return collection;
    }

    function _remove(elem, selector, keepData) {
        var node,
            nodes = selector ? jQuery.filter(selector, elem) : elem,
            i = 0;

        for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
                jQuery.cleanData(getAll(node));
            }

            if (node.parentNode) {
                if (keepData && jQuery.contains(node.ownerDocument, node)) {
                    setGlobalEval(getAll(node, "script"));
                }
                node.parentNode.removeChild(node);
            }
        }

        return elem;
    }

    jQuery.extend({
        htmlPrefilter: function htmlPrefilter(html) {
            return html.replace(rxhtmlTag, "<$1></$2>");
        },

        clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
            var i,
                l,
                srcElements,
                destElements,
                clone = elem.cloneNode(true),
                inPage = jQuery.contains(elem.ownerDocument, elem);

            // Fix IE cloning issues
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll(clone);
                srcElements = getAll(elem);

                for (i = 0, l = srcElements.length; i < l; i++) {
                    fixInput(srcElements[i], destElements[i]);
                }
            }

            // Copy the events from the original to the clone
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);

                    for (i = 0, l = srcElements.length; i < l; i++) {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }

            // Preserve script evaluation history
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }

            // Return the cloned set
            return clone;
        },

        cleanData: function cleanData(elems) {
            var data,
                elem,
                type,
                special = jQuery.event.special,
                i = 0;

            for (; (elem = elems[i]) !== undefined; i++) {
                if (acceptData(elem)) {
                    if (data = elem[dataPriv.expando]) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }

                        // Support: Chrome <= 35-45+
                        // Assign undefined instead of using delete, see Data#remove
                        elem[dataPriv.expando] = undefined;
                    }
                    if (elem[dataUser.expando]) {

                        // Support: Chrome <= 35-45+
                        // Assign undefined instead of using delete, see Data#remove
                        elem[dataUser.expando] = undefined;
                    }
                }
            }
        }
    });

    jQuery.fn.extend({

        // Keep domManip exposed until 3.0 (gh-2225)
        domManip: domManip,

        detach: function detach(selector) {
            return _remove(this, selector, true);
        },

        remove: function remove(selector) {
            return _remove(this, selector);
        },

        text: function text(value) {
            return access(this, function (value) {
                return value === undefined ? jQuery.text(this) : this.empty().each(function () {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        this.textContent = value;
                    }
                });
            }, null, value, arguments.length);
        },

        append: function append() {
            return domManip(this, arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },

        prepend: function prepend() {
            return domManip(this, arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },

        before: function before() {
            return domManip(this, arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },

        after: function after() {
            return domManip(this, arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        empty: function empty() {
            var elem,
                i = 0;

            for (; (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {

                    // Prevent memory leaks
                    jQuery.cleanData(getAll(elem, false));

                    // Remove any remaining nodes
                    elem.textContent = "";
                }
            }

            return this;
        },

        clone: function clone(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },

        html: function html(value) {
            return access(this, function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined && elem.nodeType === 1) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                    value = jQuery.htmlPrefilter(value);

                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};

                            // Remove element nodes and prevent memory leaks
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (e) {}
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },

        replaceWith: function replaceWith() {
            var ignored = [];

            // Make the changes, replacing each non-ignored context element with the new content
            return domManip(this, arguments, function (elem) {
                var parent = this.parentNode;

                if (jQuery.inArray(this, ignored) < 0) {
                    jQuery.cleanData(getAll(this));
                    if (parent) {
                        parent.replaceChild(elem, this);
                    }
                }

                // Force callback invocation
            }, ignored);
        }
    });

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
                ret = [],
                insert = jQuery(selector),
                last = insert.length - 1,
                i = 0;

            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);

                // Support: QtWebKit
                // .get() because push.apply(_, arraylike) throws
                push.apply(ret, elems.get());
            }

            return this.pushStack(ret);
        };
    });

    var iframe,
        elemdisplay = {

        // Support: Firefox
        // We have to pre-define these values for FF (#10227)
        HTML: "block",
        BODY: "block"
    };

    /**
     * Retrieve the actual display of a element
     * @param {String} name nodeName of the element
     * @param {Object} doc Document object
     */

    // Called only from within defaultDisplay
    function actualDisplay(name, doc) {
        var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
            display = jQuery.css(elem[0], "display");

        // We don't have any data stored on the element,
        // so use "detach" method as fast way to get rid of the element
        elem.detach();

        return display;
    }

    /**
     * Try to determine the default display value of an element
     * @param {String} nodeName
     */
    function defaultDisplay(nodeName) {
        var doc = document,
            display = elemdisplay[nodeName];

        if (!display) {
            display = actualDisplay(nodeName, doc);

            // If the simple way fails, read from inside an iframe
            if (display === "none" || !display) {

                // Use the already-created iframe if possible
                iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = iframe[0].contentDocument;

                // Support: IE
                doc.write();
                doc.close();

                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }

            // Store the correct default display
            elemdisplay[nodeName] = display;
        }

        return display;
    }
    var rmargin = /^margin/;

    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

    var getStyles = function getStyles(elem) {

        // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;

        if (!view || !view.opener) {
            view = window;
        }

        return view.getComputedStyle(elem);
    };

    var swap = function swap(elem, options, callback, args) {
        var ret,
            name,
            old = {};

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[name] = old[name];
        }

        return ret;
    };

    var documentElement = document.documentElement;

    (function () {
        var pixelPositionVal,
            boxSizingReliableVal,
            pixelMarginRightVal,
            reliableMarginLeftVal,
            container = document.createElement("div"),
            div = document.createElement("div");

        // Finish early in limited (non-browser) environments
        if (!div.style) {
            return;
        }

        // Support: IE9-11+
        // Style of cloned element affects source element cloned (#8908)
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
        container.appendChild(div);

        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computeStyleTests() {
            div.style.cssText =

            // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
            div.innerHTML = "";
            documentElement.appendChild(container);

            var divStyle = window.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = divStyle.marginLeft === "2px";
            boxSizingReliableVal = divStyle.width === "4px";

            // Support: Android 4.0 - 4.3 only
            // Some styles come back with percentage values, even though they shouldn't
            div.style.marginRight = "50%";
            pixelMarginRightVal = divStyle.marginRight === "4px";

            documentElement.removeChild(container);
        }

        jQuery.extend(support, {
            pixelPosition: function pixelPosition() {

                // This test is executed only once but we still do memoizing
                // since we can use the boxSizingReliable pre-computing.
                // No need to check if the test was already performed, though.
                computeStyleTests();
                return pixelPositionVal;
            },
            boxSizingReliable: function boxSizingReliable() {
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return boxSizingReliableVal;
            },
            pixelMarginRight: function pixelMarginRight() {

                // Support: Android 4.0-4.3
                // We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
                // since that compresses better and they're computed together anyway.
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return pixelMarginRightVal;
            },
            reliableMarginLeft: function reliableMarginLeft() {

                // Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return reliableMarginLeftVal;
            },
            reliableMarginRight: function reliableMarginRight() {

                // Support: Android 2.3
                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // This support function is only executed once so no memoizing is needed.
                var ret,
                    marginDiv = div.appendChild(document.createElement("div"));

                // Reset CSS: box-sizing; display; margin; border; padding
                marginDiv.style.cssText = div.style.cssText =

                // Support: Android 2.3
                // Vendor-prefix box-sizing
                "-webkit-box-sizing:content-box;box-sizing:content-box;" + "display:block;margin:0;border:0;padding:0";
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";
                documentElement.appendChild(container);

                ret = !parseFloat(window.getComputedStyle(marginDiv).marginRight);

                documentElement.removeChild(container);
                div.removeChild(marginDiv);

                return ret;
            }
        });
    })();

    function curCSS(elem, name, computed) {
        var width,
            minWidth,
            maxWidth,
            ret,
            style = elem.style;

        computed = computed || getStyles(elem);
        ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

        // Support: Opera 12.1x only
        // Fall back to style even without computed
        // computed is undefined for elems on document fragments
        if ((ret === "" || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
            ret = jQuery.style(elem, name);
        }

        // Support: IE9
        // getPropertyValue is only needed for .css('filter') (#12537)
        if (computed) {

            // A tribute to the "awesome hack by Dean Edwards"
            // Android Browser returns percentage for some values,
            // but width seems to be reliably pixels.
            // This is against the CSSOM draft spec:
            // http://dev.w3.org/csswg/cssom/#resolved-values
            if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

                // Remember the original values
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                // Put in the new values to get a computed value out
                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;

                // Revert the changed values
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return ret !== undefined ?

        // Support: IE9-11+
        // IE returns zIndex value as an integer.
        ret + "" : ret;
    }

    function addGetHookIf(conditionFn, hookFn) {

        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function get() {
                if (conditionFn()) {

                    // Hook not needed (or it's not possible to use it due
                    // to missing dependency), remove it.
                    delete this.get;
                    return;
                }

                // Hook needed; redefine it so that the support test is not executed again.
                return (this.get = hookFn).apply(this, arguments);
            }
        };
    }

    var

    // Swappable if display is none or starts with table
    // except "table", "table-cell", or "table-caption"
    // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
    },
        cssPrefixes = ["Webkit", "O", "Moz", "ms"],
        emptyStyle = document.createElement("div").style;

    // Return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(name) {

        // Shortcut for names that are not vendor prefixed
        if (name in emptyStyle) {
            return name;
        }

        // Check for vendor prefixed names
        var capName = name[0].toUpperCase() + name.slice(1),
            i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
                return name;
            }
        }
    }

    function setPositiveNumber(elem, value, subtract) {

        // Any relative (+/-) values have already been
        // normalized at this point
        var matches = rcssNum.exec(value);
        return matches ?

        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ?

        // If we already have the right measurement, avoid augmentation
        4 :

        // Otherwise initialize for horizontal or vertical properties
        name === "width" ? 1 : 0,
            val = 0;

        for (; i < 4; i += 2) {

            // Both box models exclude margin, so add it if we want it
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }

            if (isBorderBox) {

                // border-box includes padding, so remove it if we want content
                if (extra === "content") {
                    val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                }

                // At this point, extra isn't border nor margin, so remove border
                if (extra !== "margin") {
                    val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            } else {

                // At this point, extra isn't content, so add padding
                val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

                // At this point, extra isn't content nor padding, so add border
                if (extra !== "padding") {
                    val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            }
        }

        return val;
    }

    function getWidthOrHeight(elem, name, extra) {

        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles(elem),
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

        // Some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {

            // Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }

            // Computed unit is not pixels. Stop here and return.
            if (rnumnonpx.test(val)) {
                return val;
            }

            // Check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }

        // Use the active box-sizing model to add/subtract irrelevant styles
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }

    function showHide(elements, show) {
        var display,
            elem,
            hidden,
            values = [],
            index = 0,
            length = elements.length;

        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }

            values[index] = dataPriv.get(elem, "olddisplay");
            display = elem.style.display;
            if (show) {

                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if (!values[index] && display === "none") {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = dataPriv.access(elem, "olddisplay", defaultDisplay(elem.nodeName));
                }
            } else {
                hidden = isHidden(elem);

                if (display !== "none" || !hidden) {
                    dataPriv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.extend({

        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function get(elem, computed) {
                    if (computed) {

                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            "float": "cssFloat"
        },

        // Get and set the style property on a DOM Node
        style: function style(elem, name, value, extra) {

            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret,
                type,
                hooks,
                origName = jQuery.camelCase(name),
                style = elem.style;

            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

            // Gets hook for the prefixed version, then unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value === "undefined" ? "undefined" : _typeof(value);

                // Convert "+=" or "-=" to relative numbers (#7345)
                if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                    value = adjustCSS(elem, name, ret);

                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that null and NaN values aren't set (#7116)
                if (value == null || value !== value) {
                    return;
                }

                // If a number was passed in, add the unit (except for certain CSS properties)
                if (type === "number") {
                    value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
                }

                // Support: IE9-11+
                // background-* props affect original clone's values
                if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

                    style[name] = value;
                }
            } else {

                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function css(elem, name, extra, styles) {
            var val,
                num,
                hooks,
                origName = jQuery.camelCase(name);

            // Make sure that we're working with the right name
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

            // Try prefixed name followed by the unprefixed name
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }

            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }

            // Convert "normal" to computed value
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }

            // Make numeric if forced or a qualifier was provided and val looks numeric
            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
        }
    });

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function get(elem, computed, extra) {
                if (computed) {

                    // Certain elements can have dimension info if we invisibly show them
                    // but it must have a current display style that would benefit
                    return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? swap(elem, cssShow, function () {
                        return getWidthOrHeight(elem, name, extra);
                    }) : getWidthOrHeight(elem, name, extra);
                }
            },

            set: function set(elem, value, extra) {
                var matches,
                    styles = extra && getStyles(elem),
                    subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);

                // Convert to pixels if value adjustment is needed
                if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

                    elem.style[name] = value;
                    value = jQuery.css(elem, name);
                }

                return setPositiveNumber(elem, value, subtract);
            }
        };
    });

    jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
        if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
                return elem.getBoundingClientRect().left;
            })) + "px";
        }
    });

    // Support: Android 2.3
    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
        if (computed) {
            return swap(elem, { "display": "inline-block" }, curCSS, [elem, "marginRight"]);
        }
    });

    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function expand(value) {
                var i = 0,
                    expanded = {},


                // Assumes a single number if not a string
                parts = typeof value === "string" ? value.split(" ") : [value];

                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            }
        };

        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });

    jQuery.fn.extend({
        css: function css(name, value) {
            return access(this, function (elem, name, value) {
                var styles,
                    len,
                    map = {},
                    i = 0;

                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;

                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }

                    return map;
                }

                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function show() {
            return showHide(this, true);
        },
        hide: function hide() {
            return showHide(this);
        },
        toggle: function toggle(state) {
            if (typeof state === "boolean") {
                return state ? this.show() : this.hide();
            }

            return this.each(function () {
                if (isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function init(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function cur() {
            var hooks = Tween.propHooks[this.prop];

            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function run(percent) {
            var eased,
                hooks = Tween.propHooks[this.prop];

            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;

            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function get(tween) {
                var result;

                // Use a property on the element directly when it is not a DOM element,
                // or when there is no matching style property that exists.
                if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                    return tween.elem[tween.prop];
                }

                // Passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails.
                // Simple values such as "10px" are parsed to Float;
                // complex values such as "rotate(1rad)" are returned as-is.
                result = jQuery.css(tween.elem, tween.prop, "");

                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function set(tween) {

                // Use step hook for back compat.
                // Use cssHook if its there.
                // Use .style if available and use plain properties where available.
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };

    // Support: IE9
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function set(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };

    jQuery.easing = {
        linear: function linear(p) {
            return p;
        },
        swing: function swing(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

    // Back Compat <1.8 extension point
    jQuery.fx.step = {};

    var fxNow,
        timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rrun = /queueHooks$/;

    // Animations created synchronously will run synchronously
    function createFxNow() {
        window.setTimeout(function () {
            fxNow = undefined;
        });
        return fxNow = jQuery.now();
    }

    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which,
            i = 0,
            attrs = { height: type };

        // If we include width, step value is 1 to do all cssExpand values,
        // otherwise step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }

        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    function createTween(value, prop, animation) {
        var tween,
            collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
            index = 0,
            length = collection.length;
        for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {

                // We're done with this property
                return tween;
            }
        }
    }

    function defaultPrefilter(elem, props, opts) {
        /* jshint validthis: true */
        var prop,
            value,
            toggle,
            tween,
            hooks,
            oldfire,
            display,
            checkDisplay,
            anim = this,
            orig = {},
            style = elem.style,
            hidden = elem.nodeType && isHidden(elem),
            dataShow = dataPriv.get(elem, "fxshow");

        // Handle queue: false promises
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function () {

                // Ensure the complete handler is called before this completes
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // Height/width overflow pass
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {

            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE9-10 do not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            display = jQuery.css(elem, "display");

            // Test default display if display is currently "none"
            checkDisplay = display === "none" ? dataPriv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

            if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
                style.display = "inline-block";
            }
        }

        if (opts.overflow) {
            style.overflow = "hidden";
            anim.always(function () {
                style.overflow = opts.overflow[0];
                style.overflowX = opts.overflow[1];
                style.overflowY = opts.overflow[2];
            });
        }

        // show/hide pass
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {

                    // If there is dataShow left over from a stopped hide or show
                    // and we are going to proceed with show, we should pretend to be hidden
                    if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                        hidden = true;
                    } else {
                        continue;
                    }
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

                // Any non-fx value stops us from restoring the original display value
            } else {
                display = undefined;
            }
        }

        if (!jQuery.isEmptyObject(orig)) {
            if (dataShow) {
                if ("hidden" in dataShow) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = dataPriv.access(elem, "fxshow", {});
            }

            // Store state if its toggle - enables .stop().toggle() to "reverse"
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;

                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (prop in orig) {
                tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }

            // If this is a noop like .hide().hide(), restore an overwritten display value
        } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
            style.display = display;
        }
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }

            if (index !== name) {
                props[name] = value;
                delete props[index];
            }

            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];

                // Not quite $.extend, this won't overwrite existing keys.
                // Reusing 'index' because we have the correct "name"
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }

    function Animation(elem, properties, options) {
        var result,
            stopped,
            index = 0,
            length = Animation.prefilters.length,
            deferred = jQuery.Deferred().always(function () {

            // Don't match elem in the :animated selector
            delete tick.elem;
        }),
            tick = function tick() {
            if (stopped) {
                return false;
            }
            var currentTime = fxNow || createFxNow(),
                remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


            // Support: Android 2.3
            // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
            temp = remaining / animation.duration || 0,
                percent = 1 - temp,
                index = 0,
                length = animation.tweens.length;

            for (; index < length; index++) {
                animation.tweens[index].run(percent);
            }

            deferred.notifyWith(elem, [animation, percent, remaining]);

            if (percent < 1 && length) {
                return remaining;
            } else {
                deferred.resolveWith(elem, [animation]);
                return false;
            }
        },
            animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
                specialEasing: {},
                easing: jQuery.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function createTween(prop, end) {
                var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                animation.tweens.push(tween);
                return tween;
            },
            stop: function stop(gotoEnd) {
                var index = 0,


                // If we are going to the end, we want to run all the tweens
                // otherwise we skip this part
                length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) {
                    return this;
                }
                stopped = true;
                for (; index < length; index++) {
                    animation.tweens[index].run(1);
                }

                // Resolve when we played the last frame; otherwise, reject
                if (gotoEnd) {
                    deferred.notifyWith(elem, [animation, 1, 0]);
                    deferred.resolveWith(elem, [animation, gotoEnd]);
                } else {
                    deferred.rejectWith(elem, [animation, gotoEnd]);
                }
                return this;
            }
        }),
            props = animation.props;

        propFilter(props, animation.opts.specialEasing);

        for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                if (jQuery.isFunction(result.stop)) {
                    jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
                }
                return result;
            }
        }

        jQuery.map(props, createTween, animation);

        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }

        jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        }));

        // attach callbacks from options
        return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }

    jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
            "*": [function (prop, value) {
                var tween = this.createTween(prop, value);
                adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
                return tween;
            }]
        },

        tweener: function tweener(props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.match(rnotwhite);
            }

            var prop,
                index = 0,
                length = props.length;

            for (; index < length; index++) {
                prop = props[index];
                Animation.tweeners[prop] = Animation.tweeners[prop] || [];
                Animation.tweeners[prop].unshift(callback);
            }
        },

        prefilters: [defaultPrefilter],

        prefilter: function prefilter(callback, prepend) {
            if (prepend) {
                Animation.prefilters.unshift(callback);
            } else {
                Animation.prefilters.push(callback);
            }
        }
    });

    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // Normalize opt.queue - true/undefined/null -> "fx"
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }

            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };

        return opt;
    };

    jQuery.fn.extend({
        fadeTo: function fadeTo(speed, to, easing, callback) {

            // Show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show()

            // Animate to the value specified
            .end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function animate(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop),
                optall = jQuery.speed(speed, easing, callback),
                doAnimation = function doAnimation() {

                // Operate on a copy of prop so per-property easing won't be lost
                var anim = Animation(this, jQuery.extend({}, prop), optall);

                // Empty animations, or finishing resolves immediately
                if (empty || dataPriv.get(this, "finish")) {
                    anim.stop(true);
                }
            };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function stop(type, clearQueue, gotoEnd) {
            var stopQueue = function stopQueue(hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };

            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }

            return this.each(function () {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = dataPriv.get(this);

                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }

                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }

                // Start the next in the queue if the last step wasn't forced.
                // Timers currently will call their complete callbacks, which
                // will dequeue but only if they were gotoEnd.
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        },
        finish: function finish(type) {
            if (type !== false) {
                type = type || "fx";
            }
            return this.each(function () {
                var index,
                    data = dataPriv.get(this),
                    queue = data[type + "queue"],
                    hooks = data[type + "queueHooks"],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;

                // Enable finishing flag on private data
                data.finish = true;

                // Empty the queue first
                jQuery.queue(this, type, []);

                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }

                // Look for any active animations, and finish them
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }

                // Look for any animations in the old queue and finish them
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }

                // Turn off finishing flag
                delete data.finish;
            });
        }
    });

    jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
    });

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.timers = [];
    jQuery.fx.tick = function () {
        var timer,
            i = 0,
            timers = jQuery.timers;

        fxNow = jQuery.now();

        for (; i < timers.length; i++) {
            timer = timers[i];

            // Checks the timer has not already been removed
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }

        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function (timer) {
        jQuery.timers.push(timer);
        if (timer()) {
            jQuery.fx.start();
        } else {
            jQuery.timers.pop();
        }
    };

    jQuery.fx.interval = 13;
    jQuery.fx.start = function () {
        if (!timerId) {
            timerId = window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };

    jQuery.fx.stop = function () {
        window.clearInterval(timerId);

        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,

        // Default speed
        _default: 400
    };

    // Based off of the plugin by Clint Helfers, with permission.
    // http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function (time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";

        return this.queue(type, function (next, hooks) {
            var timeout = window.setTimeout(next, time);
            hooks.stop = function () {
                window.clearTimeout(timeout);
            };
        });
    };

    (function () {
        var input = document.createElement("input"),
            select = document.createElement("select"),
            opt = select.appendChild(document.createElement("option"));

        input.type = "checkbox";

        // Support: iOS<=5.1, Android<=4.2+
        // Default value for a checkbox should be "on"
        support.checkOn = input.value !== "";

        // Support: IE<=11+
        // Must access selectedIndex to make default options select
        support.optSelected = opt.selected;

        // Support: Android<=2.3
        // Options inside disabled selects are incorrectly marked as disabled
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input = document.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
    })();

    var boolHook,
        attrHandle = jQuery.expr.attrHandle;

    jQuery.fn.extend({
        attr: function attr(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },

        removeAttr: function removeAttr(name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        }
    });

    jQuery.extend({
        attr: function attr(elem, name, value) {
            var ret,
                hooks,
                nType = elem.nodeType;

            // Don't get/set attributes on text, comment and attribute nodes
            if (nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if (typeof elem.getAttribute === "undefined") {
                return jQuery.prop(elem, name, value);
            }

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
            }

            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return;
                }

                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                }

                elem.setAttribute(name, value + "");
                return value;
            }

            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            }

            ret = jQuery.find.attr(elem, name);

            // Non-existent attributes return null, we normalize to undefined
            return ret == null ? undefined : ret;
        },

        attrHooks: {
            type: {
                set: function set(elem, value) {
                    if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },

        removeAttr: function removeAttr(elem, value) {
            var name,
                propName,
                i = 0,
                attrNames = value && value.match(rnotwhite);

            if (attrNames && elem.nodeType === 1) {
                while (name = attrNames[i++]) {
                    propName = jQuery.propFix[name] || name;

                    // Boolean attributes get special treatment (#10870)
                    if (jQuery.expr.match.bool.test(name)) {

                        // Set corresponding property to false
                        elem[propName] = false;
                    }

                    elem.removeAttribute(name);
                }
            }
        }
    });

    // Hooks for boolean attributes
    boolHook = {
        set: function set(elem, value, name) {
            if (value === false) {

                // Remove boolean attributes when set to false
                jQuery.removeAttr(elem, name);
            } else {
                elem.setAttribute(name, name);
            }
            return name;
        }
    };
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;

        attrHandle[name] = function (elem, name, isXML) {
            var ret, handle;
            if (!isXML) {

                // Avoid an infinite loop by temporarily removing this function from the getter
                handle = attrHandle[name];
                attrHandle[name] = ret;
                ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
                attrHandle[name] = handle;
            }
            return ret;
        };
    });

    var rfocusable = /^(?:input|select|textarea|button)$/i,
        rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend({
        prop: function prop(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },

        removeProp: function removeProp(name) {
            return this.each(function () {
                delete this[jQuery.propFix[name] || name];
            });
        }
    });

    jQuery.extend({
        prop: function prop(elem, name, value) {
            var ret,
                hooks,
                nType = elem.nodeType;

            // Don't get/set properties on text, comment and attribute nodes
            if (nType === 3 || nType === 8 || nType === 2) {
                return;
            }

            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

                // Fix name and attach hooks
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }

            if (value !== undefined) {
                if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                }

                return elem[name] = value;
            }

            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            }

            return elem[name];
        },

        propHooks: {
            tabIndex: {
                get: function get(elem) {

                    // elem.tabIndex doesn't always return the
                    // correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr(elem, "tabindex");

                    return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
                }
            }
        },

        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    });

    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    if (!support.optSelected) {
        jQuery.propHooks.selected = {
            get: function get(elem) {
                var parent = elem.parentNode;
                if (parent && parent.parentNode) {
                    parent.parentNode.selectedIndex;
                }
                return null;
            },
            set: function set(elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;

                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
            }
        };
    }

    jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    });

    var rclass = /[\t\r\n\f]/g;

    function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
    }

    jQuery.fn.extend({
        addClass: function addClass(value) {
            var classes,
                elem,
                cur,
                curValue,
                clazz,
                j,
                finalValue,
                i = 0;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, getClass(this)));
                });
            }

            if (typeof value === "string" && value) {
                classes = value.match(rnotwhite) || [];

                while (elem = this[i++]) {
                    curValue = getClass(elem);
                    cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            if (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = jQuery.trim(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute("class", finalValue);
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function removeClass(value) {
            var classes,
                elem,
                cur,
                curValue,
                clazz,
                j,
                finalValue,
                i = 0;

            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, getClass(this)));
                });
            }

            if (!arguments.length) {
                return this.attr("class", "");
            }

            if (typeof value === "string" && value) {
                classes = value.match(rnotwhite) || [];

                while (elem = this[i++]) {
                    curValue = getClass(elem);

                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {

                            // Remove *all* instances
                            while (cur.indexOf(" " + clazz + " ") > -1) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = jQuery.trim(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute("class", finalValue);
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function toggleClass(value, stateVal) {
            var type = typeof value === "undefined" ? "undefined" : _typeof(value);

            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
                });
            }

            return this.each(function () {
                var className, i, self, classNames;

                if (type === "string") {

                    // Toggle individual class names
                    i = 0;
                    self = jQuery(this);
                    classNames = value.match(rnotwhite) || [];

                    while (className = classNames[i++]) {

                        // Check each className given, space separated list
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }

                    // Toggle whole class name
                } else if (value === undefined || type === "boolean") {
                    className = getClass(this);
                    if (className) {

                        // Store className if set
                        dataPriv.set(this, "__className__", className);
                    }

                    // If the element has a class name or if we're passed `false`,
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    if (this.setAttribute) {
                        this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
                    }
                }
            });
        },

        hasClass: function hasClass(selector) {
            var className,
                elem,
                i = 0;

            className = " " + selector + " ";
            while (elem = this[i++]) {
                if (elem.nodeType === 1 && (" " + getClass(elem) + " ").replace(rclass, " ").indexOf(className) > -1) {
                    return true;
                }
            }

            return false;
        }
    });

    var rreturn = /\r/g,
        rspaces = /[\x20\t\r\n\f]+/g;

    jQuery.fn.extend({
        val: function val(value) {
            var hooks,
                ret,
                isFunction,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?

                    // Handle most common string cases
                    ret.replace(rreturn, "") :

                    // Handle cases where value is null/undef or number
                    ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var val;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, jQuery(this).val());
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

                // If set returns undefined, fall back to normal setting
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function get(elem) {

                    var val = jQuery.find.attr(elem, "value");
                    return val != null ? val :

                    // Support: IE10-11+
                    // option.text throws exceptions (#14686, #14858)
                    // Strip and collapse whitespace
                    // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                    jQuery.trim(jQuery.text(elem)).replace(rspaces, " ");
                }
            },
            select: {
                get: function get(elem) {
                    var value,
                        option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ? max : one ? index : 0;

                    // Loop through all the selected options
                    for (; i < max; i++) {
                        option = options[i];

                        // IE8-9 doesn't update selected after form reset (#2551)
                        if ((option.selected || i === index) && (

                        // Don't return options that are disabled or in a disabled optgroup
                        support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                            // Get the specific value for the option
                            value = jQuery(option).val();

                            // We don't need an array for one selects
                            if (one) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push(value);
                        }
                    }

                    return values;
                },

                set: function set(elem, value) {
                    var optionSet,
                        option,
                        options = elem.options,
                        values = jQuery.makeArray(value),
                        i = options.length;

                    while (i--) {
                        option = options[i];
                        if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                            optionSet = true;
                        }
                    }

                    // Force browsers to behave consistently when non-matching value is set
                    if (!optionSet) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        }
    });

    // Radios and checkboxes getter/setter
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = {
            set: function set(elem, value) {
                if (jQuery.isArray(value)) {
                    return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
                }
            }
        };
        if (!support.checkOn) {
            jQuery.valHooks[this].get = function (elem) {
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });

    // Return jQuery for attributes-only inclusion


    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

    jQuery.extend(jQuery.event, {

        trigger: function trigger(event, data, elem, onlyHandlers) {

            var i,
                cur,
                tmp,
                bubbleType,
                ontype,
                handle,
                special,
                eventPath = [elem || document],
                type = hasOwn.call(event, "type") ? event.type : event,
                namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }

            if (type.indexOf(".") > -1) {

                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ? [event] : jQuery.makeArray(data, [event]);

            // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

                event.type = i > 1 ? bubbleType : special.bindType || type;

                // jQuery handler
                handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }

                // Native handler
                handle = ontype && cur[ontype];
                if (handle && handle.apply && acceptData(cur)) {
                    event.result = handle.apply(cur, data);
                    if (event.result === false) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {

                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ontype];

                        if (tmp) {
                            elem[ontype] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;

                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function simulate(type, elem, event) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: true
            });

            jQuery.event.trigger(e, null, elem);
        }

    });

    jQuery.fn.extend({

        trigger: function trigger(type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function triggerHandler(type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });

    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {

        // Handle event binding
        jQuery.fn[name] = function (data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    });

    jQuery.fn.extend({
        hover: function hover(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    support.focusin = "onfocusin" in window;

    // Support: Firefox
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome, Safari
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
    if (!support.focusin) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

            // Attach a single capturing handler on the document while someone wants focusin/focusout
            var handler = function handler(event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
            };

            jQuery.event.special[fix] = {
                setup: function setup() {
                    var doc = this.ownerDocument || this,
                        attaches = dataPriv.access(doc, fix);

                    if (!attaches) {
                        doc.addEventListener(orig, handler, true);
                    }
                    dataPriv.access(doc, fix, (attaches || 0) + 1);
                },
                teardown: function teardown() {
                    var doc = this.ownerDocument || this,
                        attaches = dataPriv.access(doc, fix) - 1;

                    if (!attaches) {
                        doc.removeEventListener(orig, handler, true);
                        dataPriv.remove(doc, fix);
                    } else {
                        dataPriv.access(doc, fix, attaches);
                    }
                }
            };
        });
    }
    var location = window.location;

    var nonce = jQuery.now();

    var rquery = /\?/;

    // Support: Android 2.3
    // Workaround failure to string-cast null input
    jQuery.parseJSON = function (data) {
        return JSON.parse(data + "");
    };

    // Cross-browser xml parsing
    jQuery.parseXML = function (data) {
        var xml;
        if (!data || typeof data !== "string") {
            return null;
        }

        // Support: IE9
        try {
            xml = new window.DOMParser().parseFromString(data, "text/xml");
        } catch (e) {
            xml = undefined;
        }

        if (!xml || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    };

    var rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,


    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},


    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},


    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat("*"),


    // Anchor tag for parsing the document origin
    originAnchor = document.createElement("a");
    originAnchor.href = location.href;

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

            if (jQuery.isFunction(func)) {

                // For each dataType in the dataTypeExpression
                while (dataType = dataTypes[i++]) {

                    // Prepend if requested
                    if (dataType[0] === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);

                        // Otherwise append
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

        var inspected = {},
            seekingTransport = structure === transports;

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var key,
            deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }

        return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses(s, jqXHR, responses) {

        var ct,
            type,
            finalDataType,
            firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {

            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }

            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2,
            current,
            conv,
            tmp,
            prev,
            converters = {},


        // Work with a copy of dataTypes in case we need to modify it for conversion
        dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while (current) {

            if (s.responseFields[current]) {
                jqXHR[s.responseFields[current]] = response;
            }

            // Apply the dataFilter if provided
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }

            prev = current;
            current = dataTypes.shift();

            if (current) {

                // There's only work to do if current dataType is non-auto
                if (current === "*") {

                    current = prev;

                    // Convert response if prev dataType is non-auto and differs from current
                } else if (prev !== "*" && prev !== current) {

                    // Seek a direct converter
                    conv = converters[prev + " " + current] || converters["* " + current];

                    // If none found, seek a pair
                    if (!conv) {
                        for (conv2 in converters) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {

                                // If prev can be converted to accepted input
                                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                                if (conv) {

                                    // Condense equivalence converters
                                    if (conv === true) {
                                        conv = converters[conv2];

                                        // Otherwise, insert the intermediate dataType
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.unshift(tmp[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if (conv !== true) {

                        // Unless errors are allowed to bubble, catch and return them
                        if (conv && s.throws) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: conv ? e : "No conversion from " + prev + " to " + current
                                };
                            }
                        }
                    }
                }
            }
        }

        return { state: "success", data: response };
    }

    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: location.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             throws: false,
             traditional: false,
             headers: {},
             */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {

                // Convert anything to text
                "* text": String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function ajaxSetup(target, settings) {
            return settings ?

            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target);
        },

        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),

        // Main method
        ajax: function ajax(url, options) {

            // If url is an object, simulate pre-1.5 signature
            if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var transport,


            // URL without anti-cache param
            cacheURL,


            // Response headers
            responseHeadersString,
                responseHeaders,


            // timeout handle
            timeoutTimer,


            // Url cleanup var
            urlAnchor,


            // To know if global events are to be dispatched
            fireGlobals,


            // Loop variable
            i,


            // Create the final options object
            s = jQuery.ajaxSetup({}, options),


            // Callbacks context
            callbackContext = s.context || s,


            // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


            // Deferreds
            deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),


            // Status-dependent callbacks
            _statusCode = s.statusCode || {},


            // Headers (they are sent all at once)
            requestHeaders = {},
                requestHeadersNames = {},


            // The jqXHR state
            state = 0,


            // Default abort message
            strAbort = "canceled",


            // Fake xhr
            jqXHR = {
                readyState: 0,

                // Builds headers hashtable if needed
                getResponseHeader: function getResponseHeader(key) {
                    var match;
                    if (state === 2) {
                        if (!responseHeaders) {
                            responseHeaders = {};
                            while (match = rheaders.exec(responseHeadersString)) {
                                responseHeaders[match[1].toLowerCase()] = match[2];
                            }
                        }
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return match == null ? null : match;
                },

                // Raw string
                getAllResponseHeaders: function getAllResponseHeaders() {
                    return state === 2 ? responseHeadersString : null;
                },

                // Caches the header
                setRequestHeader: function setRequestHeader(name, value) {
                    var lname = name.toLowerCase();
                    if (!state) {
                        name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                        requestHeaders[name] = value;
                    }
                    return this;
                },

                // Overrides response content-type header
                overrideMimeType: function overrideMimeType(type) {
                    if (!state) {
                        s.mimeType = type;
                    }
                    return this;
                },

                // Status-dependent callbacks
                statusCode: function statusCode(map) {
                    var code;
                    if (map) {
                        if (state < 2) {
                            for (code in map) {

                                // Lazy-add the new callback in a way that preserves old ones
                                _statusCode[code] = [_statusCode[code], map[code]];
                            }
                        } else {

                            // Execute the appropriate callbacks
                            jqXHR.always(map[jqXHR.status]);
                        }
                    }
                    return this;
                },

                // Cancel the request
                abort: function abort(statusText) {
                    var finalText = statusText || strAbort;
                    if (transport) {
                        transport.abort(finalText);
                    }
                    done(0, finalText);
                    return this;
                }
            };

            // Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (prefilters might expect it)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || location.href) + "").replace(rhash, "").replace(rprotocol, location.protocol + "//");

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

            // A cross-domain request is in order when the origin doesn't match the current origin.
            if (s.crossDomain == null) {
                urlAnchor = document.createElement("a");

                // Support: IE8-11+
                // IE throws exception if url is malformed, e.g. http://example.com:80x/
                try {
                    urlAnchor.href = s.url;

                    // Support: IE8-11+
                    // Anchor's host property isn't correctly set when s.url is relative
                    urlAnchor.href = urlAnchor.href;
                    s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
                } catch (e) {

                    // If there is an error parsing the URL, assume it is crossDomain,
                    // it can be rejected by the transport if it is invalid
                    s.crossDomain = true;
                }
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefilter, stop there
            if (state === 2) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
            fireGlobals = jQuery.event && s.global;

            // Watch for a new set of requests
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if (!s.hasContent) {

                // If data is available, append data to url
                if (s.data) {
                    cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;

                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ?

                    // If there is already a '_' parameter, set its value
                    cacheURL.replace(rts, "$1_=" + nonce++) :

                    // Otherwise add one to the end
                    cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {

                // Abort if not done already and return
                return jqXHR.abort();
            }

            // Aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for (i in { success: 1, error: 1, complete: 1 }) {
                jqXHR[i](s[i]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }

                // If request was aborted inside ajaxSend, stop there
                if (state === 2) {
                    return jqXHR;
                }

                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = window.setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {

                    // Propagate exception as error if not done
                    if (state < 2) {
                        done(-1, e);

                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess,
                    success,
                    error,
                    response,
                    modified,
                    statusText = nativeStatusText;

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    window.clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;

                // Get response data
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert(s, response, jqXHR, isSuccess);

                // If successful, handle type chaining
                if (isSuccess) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }

                    // if no content
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";

                        // if not modified
                    } else if (status === 304) {
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {

                    // Extract error from statusText and normalize for non-aborts
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(_statusCode);
                _statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

                    // Handle the global AJAX counter
                    if (! --jQuery.active) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getJSON: function getJSON(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        getScript: function getScript(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    });

    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {

            // Shift arguments if data argument was omitted
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            // The url can be an options object (which then must have .url)
            return jQuery.ajax(jQuery.extend({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            }, jQuery.isPlainObject(url) && url));
        };
    });

    jQuery._evalUrl = function (url) {
        return jQuery.ajax({
            url: url,

            // Make this explicit, since user can override this through ajaxSetup (#11264)
            type: "GET",
            dataType: "script",
            async: false,
            global: false,
            "throws": true
        });
    };

    jQuery.fn.extend({
        wrapAll: function wrapAll(html) {
            var wrap;

            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {

                // The elements to wrap the target around
                wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstElementChild) {
                        elem = elem.firstElementChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function wrapInner(html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
                    contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        },

        wrap: function wrap(html) {
            var isFunction = jQuery.isFunction(html);

            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },

        unwrap: function unwrap() {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });

    jQuery.expr.filters.hidden = function (elem) {
        return !jQuery.expr.filters.visible(elem);
    };
    jQuery.expr.filters.visible = function (elem) {

        // Support: Opera <= 12.12
        // Opera reports offsetWidths and offsetHeights less than zero on some elements
        // Use OR instead of AND as the element is not visible if either is true
        // See tickets #10406 and #13132
        return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
    };

    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (jQuery.isArray(obj)) {

            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {

                    // Treat each array item as a scalar.
                    add(prefix, v);
                } else {

                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {

            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {

            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function (a, traditional) {
        var prefix,
            s = [],
            add = function add(key, value) {

            // If value is a function, invoke it and return its value
            value = jQuery.isFunction(value) ? value() : value == null ? "" : value;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

            // Serialize the form elements
            jQuery.each(a, function () {
                add(this.name, this.value);
            });
        } else {

            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    };

    jQuery.fn.extend({
        serialize: function serialize() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function serializeArray() {
            return this.map(function () {

                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function () {
                var type = this.type;

                // Use .is( ":disabled" ) so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function (i, elem) {
                var val = jQuery(this).val();

                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
                    return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
                }) : { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
        }
    });

    jQuery.ajaxSettings.xhr = function () {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {}
    };

    var xhrSuccessStatus = {

        // File protocol always yields status code 0, assume 200
        0: 200,

        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    },
        xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport(function (options) {
        var _callback, errorCallback;

        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) {
            return {
                send: function send(headers, complete) {
                    var i,
                        xhr = options.xhr();

                    xhr.open(options.type, options.url, options.async, options.username, options.password);

                    // Apply custom fields if provided
                    if (options.xhrFields) {
                        for (i in options.xhrFields) {
                            xhr[i] = options.xhrFields[i];
                        }
                    }

                    // Override mime type if needed
                    if (options.mimeType && xhr.overrideMimeType) {
                        xhr.overrideMimeType(options.mimeType);
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if (!options.crossDomain && !headers["X-Requested-With"]) {
                        headers["X-Requested-With"] = "XMLHttpRequest";
                    }

                    // Set headers
                    for (i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                    }

                    // Callback
                    _callback = function callback(type) {
                        return function () {
                            if (_callback) {
                                _callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

                                if (type === "abort") {
                                    xhr.abort();
                                } else if (type === "error") {

                                    // Support: IE9
                                    // On a manual native abort, IE9 throws
                                    // errors on any property access that is not readyState
                                    if (typeof xhr.status !== "number") {
                                        complete(0, "error");
                                    } else {
                                        complete(

                                        // File: protocol always yields status 0; see #8605, #14207
                                        xhr.status, xhr.statusText);
                                    }
                                } else {
                                    complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText,

                                    // Support: IE9 only
                                    // IE9 has no XHR2 but throws on binary (trac-11426)
                                    // For XHR2 non-text, let the caller handle it (gh-2498)
                                    (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
                                }
                            }
                        };
                    };

                    // Listen to events
                    xhr.onload = _callback();
                    errorCallback = xhr.onerror = _callback("error");

                    // Support: IE9
                    // Use onreadystatechange to replace onabort
                    // to handle uncaught aborts
                    if (xhr.onabort !== undefined) {
                        xhr.onabort = errorCallback;
                    } else {
                        xhr.onreadystatechange = function () {

                            // Check readyState before timeout as it changes
                            if (xhr.readyState === 4) {

                                // Allow onerror to be called first,
                                // but that will not handle a native abort
                                // Also, save errorCallback to a variable
                                // as xhr.onerror cannot be accessed
                                window.setTimeout(function () {
                                    if (_callback) {
                                        errorCallback();
                                    }
                                });
                            }
                        };
                    }

                    // Create the abort callback
                    _callback = _callback("abort");

                    try {

                        // Do send the request (this may raise an exception)
                        xhr.send(options.hasContent && options.data || null);
                    } catch (e) {

                        // #14683: Only rethrow if this hasn't been notified as an error yet
                        if (_callback) {
                            throw e;
                        }
                    }
                },

                abort: function abort() {
                    if (_callback) {
                        _callback();
                    }
                }
            };
        }
    });

    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function textScript(text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });

    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
        }
    });

    // Bind script tag hack transport
    jQuery.ajaxTransport("script", function (s) {

        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script, _callback2;
            return {
                send: function send(_, complete) {
                    script = jQuery("<script>").prop({
                        charset: s.scriptCharset,
                        src: s.url
                    }).on("load error", _callback2 = function callback(evt) {
                        script.remove();
                        _callback2 = null;
                        if (evt) {
                            complete(evt.type === "error" ? 404 : 200, evt.type);
                        }
                    });

                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    document.head.appendChild(script[0]);
                },
                abort: function abort() {
                    if (_callback2) {
                        _callback2();
                    }
                }
            };
        }
    });

    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function jsonpCallback() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
            this[callback] = true;
            return callback;
        }
    });

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName,
            overwritten,
            responseContainer,
            jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[0] === "jsonp") {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

            // Insert callback into url or form data
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };

            // Force json dataType
            s.dataTypes[0] = "json";

            // Install callback
            overwritten = window[callbackName];
            window[callbackName] = function () {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function () {

                // If previous value didn't exist - remove it
                if (overwritten === undefined) {
                    jQuery(window).removeProp(callbackName);

                    // Otherwise restore preexisting value
                } else {
                    window[callbackName] = overwritten;
                }

                // Save back as free
                if (s[callbackName]) {

                    // Make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // Save the callback name for future use
                    oldCallbacks.push(callbackName);
                }

                // Call if it was a function and we have a response
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });

    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function (data, context, keepScripts) {
        if (!data || typeof data !== "string") {
            return null;
        }
        if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
        }
        context = context || document;

        var parsed = rsingleTag.exec(data),
            scripts = !keepScripts && [];

        // Single tag
        if (parsed) {
            return [context.createElement(parsed[1])];
        }

        parsed = buildFragment([data], context, scripts);

        if (scripts && scripts.length) {
            jQuery(scripts).remove();
        }

        return jQuery.merge([], parsed.childNodes);
    };

    // Keep a copy of the old load method
    var _load = jQuery.fn.load;

    /**
     * Load a url into a page
     */
    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        var selector,
            type,
            response,
            self = this,
            off = url.indexOf(" ");

        if (off > -1) {
            selector = jQuery.trim(url.slice(off));
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            jQuery.ajax({
                url: url,

                // If "type" variable is undefined, then "GET" method will be used.
                // Make value of this field explicit since
                // user can override it through ajaxSetup method
                type: type || "GET",
                dataType: "html",
                data: params
            }).done(function (responseText) {

                // Save response for use in complete callback
                response = arguments;

                self.html(selector ?

                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

                // Otherwise use the full result
                responseText);

                // If the request succeeds, this function gets "data", "status", "jqXHR"
                // but they are ignored because response was set above.
                // If it fails, this function gets "jqXHR", "status", "error"
            }).always(callback && function (jqXHR, status) {
                self.each(function () {
                    callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
                });
            });
        }

        return this;
    };

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        jQuery.fn[type] = function (fn) {
            return this.on(type, fn);
        };
    });

    jQuery.expr.filters.animated = function (elem) {
        return jQuery.grep(jQuery.timers, function (fn) {
            return elem === fn.elem;
        }).length;
    };

    /**
     * Gets a window from an element
     */
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    jQuery.offset = {
        setOffset: function setOffset(elem, options, i) {
            var curPosition,
                curLeft,
                curCSSTop,
                curTop,
                curOffset,
                curCSSLeft,
                calculatePosition,
                position = jQuery.css(elem, "position"),
                curElem = jQuery(elem),
                props = {};

            // Set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

            // Need to be able to calculate position if either
            // top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (jQuery.isFunction(options)) {

                // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
                options = options.call(elem, i, jQuery.extend({}, curOffset));
            }

            if (options.top != null) {
                props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
                props.left = options.left - curOffset.left + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };

    jQuery.fn.extend({
        offset: function offset(options) {
            if (arguments.length) {
                return options === undefined ? this : this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            var docElem,
                win,
                elem = this[0],
                box = { top: 0, left: 0 },
                doc = elem && elem.ownerDocument;

            if (!doc) {
                return;
            }

            docElem = doc.documentElement;

            // Make sure it's not a disconnected DOM node
            if (!jQuery.contains(docElem, elem)) {
                return box;
            }

            box = elem.getBoundingClientRect();
            win = getWindow(doc);
            return {
                top: box.top + win.pageYOffset - docElem.clientTop,
                left: box.left + win.pageXOffset - docElem.clientLeft
            };
        },

        position: function position() {
            if (!this[0]) {
                return;
            }

            var offsetParent,
                offset,
                elem = this[0],
                parentOffset = { top: 0, left: 0 };

            // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
            // because it is its only offset parent
            if (jQuery.css(elem, "position") === "fixed") {

                // Assume getBoundingClientRect is there when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {

                // Get *real* offsetParent
                offsetParent = this.offsetParent();

                // Get correct offsets
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], "html")) {
                    parentOffset = offsetParent.offset();
                }

                // Add offsetParent borders
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
            }

            // Subtract parent offsets and element margins
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
        },

        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function offsetParent() {
            return this.map(function () {
                var offsetParent = this.offsetParent;

                while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || documentElement;
            });
        }
    });

    // Create scrollLeft and scrollTop methods
    jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
        var top = "pageYOffset" === prop;

        jQuery.fn[method] = function (val) {
            return access(this, function (elem, method, val) {
                var win = getWindow(elem);

                if (val === undefined) {
                    return win ? win[prop] : elem[method];
                }

                if (win) {
                    win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length);
        };
    });

    // Support: Safari<7-8+, Chrome<37-44+
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each(["top", "left"], function (i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
            if (computed) {
                computed = curCSS(elem, prop);

                // If curCSS returns percentage, fallback to offset
                return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
        });
    });

    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
        jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

            // Margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                return access(this, function (elem, type, value) {
                    var doc;

                    if (jQuery.isWindow(elem)) {

                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                        // whichever is greatest
                        return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
                    }

                    return value === undefined ?

                    // Get width or height on the element, requesting but not forcing parseFloat
                    jQuery.css(elem, type, extra) :

                    // Set width or height on the element
                    jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });

    jQuery.fn.extend({

        bind: function bind(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function unbind(types, fn) {
            return this.off(types, null, fn);
        },

        delegate: function delegate(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function undelegate(selector, types, fn) {

            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        size: function size() {
            return this.length;
        }
    });

    jQuery.fn.andSelf = jQuery.fn.addBack;

    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.

    // Note that for maximum portability, libraries that are not jQuery should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jQuery is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

    if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
            return jQuery;
        });
    }

    var

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,


    // Map over the $ in case of overwrite
    _$ = window.$;

    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }

        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    };

    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if (!noGlobal) {
        window.jQuery = window.$ = jQuery;
    }

    return jQuery;
});

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function swing(x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function easeInQuad(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function easeOutQuad(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function easeInOutQuad(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function easeInCubic(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function easeOutCubic(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function easeInOutCubic(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function easeInQuart(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function easeOutQuart(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function easeInOutQuart(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function easeInQuint(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function easeOutQuint(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function easeInOutQuint(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function easeInSine(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function easeOutSine(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function easeInOutSine(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function easeInExpo(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function easeOutExpo(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function easeInOutExpo(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function easeInCirc(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function easeOutCirc(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function easeInOutCirc(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function easeInElastic(x, t, b, c, d) {
        var s = 1.70158;var p = 0;var a = c;
        if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function easeOutElastic(x, t, b, c, d) {
        var s = 1.70158;var p = 0;var a = c;
        if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function easeInOutElastic(x, t, b, c, d) {
        var s = 1.70158;var p = 0;var a = c;
        if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function easeInBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function easeOutBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function easeInOutBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function easeInBounce(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function easeOutBounce(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    },
    easeInOutBounce: function easeInOutBounce(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
;"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}return target;
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

/*! flatpickr v2.6.2, @license MIT */
function Flatpickr(element, config) {
	var self = this;

	self._ = {};
	self._.afterDayAnim = afterDayAnim;
	self.changeMonth = changeMonth;
	self.changeYear = changeYear;
	self.clear = clear;
	self.close = close;
	self._createElement = createElement;
	self.destroy = destroy;
	self.isEnabled = isEnabled;
	self.jumpToDate = jumpToDate;
	self.open = open;
	self.redraw = redraw;
	self.set = set;
	self.setDate = setDate;
	self.toggle = toggle;

	function init() {
		self.element = element;
		self.instanceConfig = config || {};
		self.parseDate = Flatpickr.prototype.parseDate.bind(self);
		self.formatDate = Flatpickr.prototype.formatDate.bind(self);

		setupFormats();
		parseConfig();
		setupLocale();
		setupInputs();
		setupDates();
		setupHelperFunctions();

		self.isOpen = false;

		self.isMobile = !self.config.disableMobile && !self.config.inline && self.config.mode === "single" && !self.config.disable.length && !self.config.enable.length && !self.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if (!self.isMobile) build();

		bindEvents();

		if (self.selectedDates.length || self.config.noCalendar) {
			if (self.config.enableTime) {
				setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj || self.config.minDate : null);
			}
			updateValue();
		}

		if (self.config.weekNumbers) {
			self.calendarContainer.style.width = self.daysContainer.offsetWidth + self.weekWrapper.offsetWidth + "px";
		}

		self.showTimeInput = self.selectedDates.length > 0 || self.config.noCalendar;

		if (!self.isMobile) positionCalendar();

		triggerEvent("Ready");
	}

	/**
  * Binds a function to the current flatpickr instance
  * @param {Function} fn the function
  * @return {Function} the function bound to the instance
  */
	function bindToInstance(fn) {
		return fn.bind(self);
	}

	/**
  * The handler for all events targeting the time inputs
  * @param {Event} e the event - "input", "wheel", "increment", etc
  */
	function updateTime(e) {
		if (self.config.noCalendar && !self.selectedDates.length)
			// picking time only
			self.selectedDates = [self.now];

		timeWrapper(e);

		if (!self.selectedDates.length) return;

		if (!self.minDateHasTime || e.type !== "input" || e.target.value.length >= 2) {
			setHoursFromInputs();
			updateValue();
		} else {
			setTimeout(function () {
				setHoursFromInputs();
				updateValue();
			}, 1000);
		}
	}

	/**
  * Syncs the selected date object time with user's time input
  */
	function setHoursFromInputs() {
		if (!self.config.enableTime) return;

		var hours = (parseInt(self.hourElement.value, 10) || 0) % (self.amPM ? 12 : 24),
		    minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
		    seconds = self.config.enableSeconds ? (parseInt(self.secondElement.value, 10) || 0) % 60 : 0;

		if (self.amPM !== undefined) hours = hours % 12 + 12 * (self.amPM.textContent === "PM");

		if (self.minDateHasTime && compareDates(self.latestSelectedDateObj, self.config.minDate) === 0) {

			hours = Math.max(hours, self.config.minDate.getHours());
			if (hours === self.config.minDate.getHours()) minutes = Math.max(minutes, self.config.minDate.getMinutes());
		}

		if (self.maxDateHasTime && compareDates(self.latestSelectedDateObj, self.config.maxDate) === 0) {
			hours = Math.min(hours, self.config.maxDate.getHours());
			if (hours === self.config.maxDate.getHours()) minutes = Math.min(minutes, self.config.maxDate.getMinutes());
		}

		setHours(hours, minutes, seconds);
	}

	/**
  * Syncs time input values with a date
  * @param {Date} dateObj the date to sync with
  */
	function setHoursFromDate(dateObj) {
		var date = dateObj || self.latestSelectedDateObj;

		if (date) setHours(date.getHours(), date.getMinutes(), date.getSeconds());
	}

	/**
  * Sets the hours, minutes, and optionally seconds
  * of the latest selected date object and the
  * corresponding time inputs
  * @param {Number} hours the hour. whether its military
  *                 or am-pm gets inferred from config
  * @param {Number} minutes the minutes
  * @param {Number} seconds the seconds (optional)
  */
	function setHours(hours, minutes, seconds) {
		if (self.selectedDates.length) {
			self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
		}

		if (!self.config.enableTime || self.isMobile) return;

		self.hourElement.value = self.pad(!self.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours);

		self.minuteElement.value = self.pad(minutes);

		if (!self.config.time_24hr) self.amPM.textContent = hours >= 12 ? "PM" : "AM";

		if (self.config.enableSeconds === true) self.secondElement.value = self.pad(seconds);
	}

	/**
  * Handles the year input and incrementing events
  * @param {Event} event the keyup or increment event
  */
	function onYearInput(event) {
		var year = event.target.value;
		if (event.delta) year = (parseInt(year) + event.delta).toString();

		if (year.length === 4 || event.key === "Enter") {
			self.currentYearElement.blur();
			if (!/[^\d]/.test(year)) changeYear(year);
		}
	}

	/**
  * Essentially addEventListener + tracking
  * @param {Element} element the element to addEventListener to
  * @param {String} event the event name
  * @param {Function} handler the event handler
  */
	function bind(element, event, handler) {
		if (event instanceof Array) return event.forEach(function (ev) {
			return bind(element, ev, handler);
		});

		if (element instanceof Array) return element.forEach(function (el) {
			return bind(el, event, handler);
		});

		element.addEventListener(event, handler);
		self._handlers.push({ element: element, event: event, handler: handler });
	}

	/**
  * A mousedown handler which mimics click.
  * Minimizes latency, since we don't need to wait for mouseup in most cases.
  * Also, avoids handling right clicks.
  *
  * @param {Function} handler the event handler
  */
	function onClick(handler) {
		return function (evt) {
			return evt.which === 1 && handler(evt);
		};
	}

	/**
  * Adds all the necessary event listeners
  */
	function bindEvents() {
		self._handlers = [];
		if (self.config.wrap) {
			["open", "close", "toggle", "clear"].forEach(function (evt) {
				Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
					return bind(el, "mousedown", onClick(self[evt]));
				});
			});
		}

		if (self.isMobile) return setupMobile();

		self.debouncedResize = debounce(onResize, 50);
		self.triggerChange = function () {
			triggerEvent("Change");
		};
		self.debouncedChange = debounce(self.triggerChange, 300);

		if (self.config.mode === "range" && self.daysContainer) bind(self.daysContainer, "mouseover", function (e) {
			return onMouseOver(e.target);
		});

		bind(window.document.body, "keydown", onKeyDown);

		if (!self.config.static) bind(self._input, "keydown", onKeyDown);

		if (!self.config.inline && !self.config.static) bind(window, "resize", self.debouncedResize);

		if (window.ontouchstart !== undefined) bind(window.document, "touchstart", documentClick);

		bind(window.document, "mousedown", onClick(documentClick));
		bind(self._input, "blur", documentClick);

		if (self.config.clickOpens === true) bind(self._input, "focus", self.open);

		if (!self.config.noCalendar) {
			self.monthNav.addEventListener("wheel", function (e) {
				return e.preventDefault();
			});
			bind(self.monthNav, "wheel", debounce(onMonthNavScroll, 10));
			bind(self.monthNav, "mousedown", onClick(onMonthNavClick));

			bind(self.monthNav, ["keyup", "increment"], onYearInput);
			bind(self.daysContainer, "mousedown", onClick(selectDate));

			if (self.config.animate) {
				bind(self.daysContainer, ["webkitAnimationEnd", "animationend"], animateDays);
				bind(self.monthNav, ["webkitAnimationEnd", "animationend"], animateMonths);
			}
		}

		if (self.config.enableTime) {
			var selText = function selText(e) {
				return e.target.select();
			};
			bind(self.timeContainer, ["wheel", "input", "increment"], updateTime);
			bind(self.timeContainer, "mousedown", onClick(timeIncrement));

			bind(self.timeContainer, ["wheel", "increment"], self.debouncedChange);
			bind(self.timeContainer, "input", self.triggerChange);

			bind([self.hourElement, self.minuteElement], "focus", selText);

			if (self.secondElement !== undefined) bind(self.secondElement, "focus", function () {
				return self.secondElement.select();
			});

			if (self.amPM !== undefined) {
				bind(self.amPM, "mousedown", onClick(function (e) {
					updateTime(e);
					self.triggerChange(e);
				}));
			}
		}
	}

	/**
  * Removes the day container that slided out of view
  * @param {Event} e the animation event
  */
	function animateDays(e) {
		if (self.daysContainer.childNodes.length > 1) {
			switch (e.animationName) {
				case "fpSlideLeft":
					self.daysContainer.lastChild.classList.remove("slideLeftNew");
					self.daysContainer.removeChild(self.daysContainer.firstChild);
					self.days = self.daysContainer.firstChild;

					break;

				case "fpSlideRight":
					self.daysContainer.firstChild.classList.remove("slideRightNew");
					self.daysContainer.removeChild(self.daysContainer.lastChild);
					self.days = self.daysContainer.firstChild;

					break;

				default:
					break;
			}
		}
	}

	/**
  * Removes the month element that animated out of view
  * @param {Event} e the animation event
  */
	function animateMonths(e) {
		switch (e.animationName) {
			case "fpSlideLeftNew":
			case "fpSlideRightNew":
				self.navigationCurrentMonth.classList.remove("slideLeftNew");
				self.navigationCurrentMonth.classList.remove("slideRightNew");
				var nav = self.navigationCurrentMonth;

				while (nav.nextSibling && /curr/.test(nav.nextSibling.className)) {
					self.monthNav.removeChild(nav.nextSibling);
				}while (nav.previousSibling && /curr/.test(nav.previousSibling.className)) {
					self.monthNav.removeChild(nav.previousSibling);
				}self.oldCurMonth = null;
				break;
		}
	}

	/**
  * Set the calendar view to a particular date.
  * @param {Date} jumpDate the date to set the view to
  */
	function jumpToDate(jumpDate) {
		jumpDate = jumpDate ? self.parseDate(jumpDate) : self.latestSelectedDateObj || (self.config.minDate > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate < self.now ? self.config.maxDate : self.now);

		try {
			self.currentYear = jumpDate.getFullYear();
			self.currentMonth = jumpDate.getMonth();
		} catch (e) {
			/* istanbul ignore next */
			console.error(e.stack);
			/* istanbul ignore next */
			console.warn("Invalid date supplied: " + jumpDate);
		}

		self.redraw();
	}

	/**
  * The up/down arrow handler for time inputs
  * @param {Event} e the click event
  */
	function timeIncrement(e) {
		if (~e.target.className.indexOf("arrow")) incrementNumInput(e, e.target.classList.contains("arrowUp") ? 1 : -1);
	}

	/**
  * Increments/decrements the value of input associ-
  * ated with the up/down arrow by dispatching an
  * "increment" event on the input.
  *
  * @param {Event} e the click event
  * @param {Number} delta the diff (usually 1 or -1)
  * @param {Element} inputElem the input element
  */
	function incrementNumInput(e, delta, inputElem) {
		var input = inputElem || e.target.parentNode.childNodes[0];
		var event = createEvent("increment");
		event.delta = delta;
		input.dispatchEvent(event);
	}

	function createNumberInput(inputClassName) {
		var wrapper = createElement("div", "numInputWrapper"),
		    numInput = createElement("input", "numInput " + inputClassName),
		    arrowUp = createElement("span", "arrowUp"),
		    arrowDown = createElement("span", "arrowDown");

		numInput.type = "text";
		numInput.pattern = "\\d*";

		wrapper.appendChild(numInput);
		wrapper.appendChild(arrowUp);
		wrapper.appendChild(arrowDown);

		return wrapper;
	}

	function build() {
		var fragment = window.document.createDocumentFragment();
		self.calendarContainer = createElement("div", "flatpickr-calendar");
		self.calendarContainer.tabIndex = -1;

		if (!self.config.noCalendar) {
			fragment.appendChild(buildMonthNav());
			self.innerContainer = createElement("div", "flatpickr-innerContainer");

			if (self.config.weekNumbers) self.innerContainer.appendChild(buildWeeks());

			self.rContainer = createElement("div", "flatpickr-rContainer");
			self.rContainer.appendChild(buildWeekdays());

			if (!self.daysContainer) {
				self.daysContainer = createElement("div", "flatpickr-days");
				self.daysContainer.tabIndex = -1;
			}

			buildDays();
			self.rContainer.appendChild(self.daysContainer);

			self.innerContainer.appendChild(self.rContainer);
			fragment.appendChild(self.innerContainer);
		}

		if (self.config.enableTime) fragment.appendChild(buildTime());

		toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
		toggleClass(self.calendarContainer, "animate", self.config.animate);

		self.calendarContainer.appendChild(fragment);

		var customAppend = self.config.appendTo && self.config.appendTo.nodeType;

		if (self.config.inline || self.config.static) {
			self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");

			if (self.config.inline && !customAppend) {
				return self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
			}

			if (self.config.static) {
				var wrapper = createElement("div", "flatpickr-wrapper");
				self.element.parentNode.insertBefore(wrapper, self.element);
				wrapper.appendChild(self.element);

				if (self.altInput) wrapper.appendChild(self.altInput);

				wrapper.appendChild(self.calendarContainer);
				return;
			}
		}

		(customAppend ? self.config.appendTo : window.document.body).appendChild(self.calendarContainer);
	}

	function createDay(className, date, dayNumber, i) {
		var dateIsEnabled = isEnabled(date, true),
		    dayElement = createElement("span", "flatpickr-day " + className, date.getDate());

		dayElement.dateObj = date;
		dayElement.$i = i;
		dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));

		if (compareDates(date, self.now) === 0) {
			self.todayDateElem = dayElement;
			dayElement.classList.add("today");
		}

		if (dateIsEnabled) {
			dayElement.tabIndex = -1;
			if (isDateSelected(date)) {
				dayElement.classList.add("selected");
				self.selectedDateElem = dayElement;
				if (self.config.mode === "range") {
					toggleClass(dayElement, "startRange", compareDates(date, self.selectedDates[0]) === 0);

					toggleClass(dayElement, "endRange", compareDates(date, self.selectedDates[1]) === 0);
				}
			}
		} else {
			dayElement.classList.add("disabled");
			if (self.selectedDates[0] && date > self.minRangeDate && date < self.selectedDates[0]) self.minRangeDate = date;else if (self.selectedDates[0] && date < self.maxRangeDate && date > self.selectedDates[0]) self.maxRangeDate = date;
		}

		if (self.config.mode === "range") {
			if (isDateInRange(date) && !isDateSelected(date)) dayElement.classList.add("inRange");

			if (self.selectedDates.length === 1 && (date < self.minRangeDate || date > self.maxRangeDate)) dayElement.classList.add("notAllowed");
		}

		if (self.config.weekNumbers && className !== "prevMonthDay" && dayNumber % 7 === 1) {
			self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='disabled flatpickr-day'>" + self.config.getWeek(date) + "</span>");
		}

		triggerEvent("DayCreate", dayElement);

		return dayElement;
	}

	function focusOnDay(currentIndex, offset) {
		var newIndex = currentIndex + offset || 0,
		    targetNode = currentIndex !== undefined ? self.days.childNodes[newIndex] : self.selectedDateElem || self.todayDateElem || self.days.childNodes[0],
		    focus = function focus() {
			targetNode = targetNode || self.days.childNodes[newIndex];
			targetNode.focus();

			if (self.config.mode === "range") onMouseOver(targetNode);
		};

		if (targetNode === undefined && offset !== 0) {
			if (offset > 0) {
				self.changeMonth(1);
				newIndex = newIndex % 42;
			} else if (offset < 0) {
				self.changeMonth(-1);
				newIndex += 42;
			}

			return afterDayAnim(focus);
		}

		focus();
	}

	function afterDayAnim(fn) {
		if (self.config.animate) return setTimeout(fn, self._.daysAnimDuration + 1);
		fn();
	}

	function buildDays(delta) {
		var firstOfMonth = (new Date(self.currentYear, self.currentMonth, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7,
		    isRangeMode = self.config.mode === "range";

		self.prevMonthDays = self.utils.getDaysinMonth((self.currentMonth - 1 + 12) % 12);
		self.selectedDateElem = undefined;
		self.todayDateElem = undefined;

		var daysInMonth = self.utils.getDaysinMonth(),
		    days = window.document.createDocumentFragment();

		var dayNumber = self.prevMonthDays + 1 - firstOfMonth,
		    dayIndex = 0;

		if (self.config.weekNumbers && self.weekNumbers.firstChild) self.weekNumbers.textContent = "";

		if (isRangeMode) {
			// const dateLimits = self.config.enable.length || self.config.disable.length || self.config.mixDate || self.config.maxDate;
			self.minRangeDate = new Date(self.currentYear, self.currentMonth - 1, dayNumber);
			self.maxRangeDate = new Date(self.currentYear, self.currentMonth + 1, (42 - firstOfMonth) % daysInMonth);
		}

		// prepend days from the ending of previous month
		for (; dayNumber <= self.prevMonthDays; dayNumber++, dayIndex++) {
			days.appendChild(createDay("prevMonthDay", new Date(self.currentYear, self.currentMonth - 1, dayNumber), dayNumber, dayIndex));
		}

		// Start at 1 since there is no 0th day
		for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
			days.appendChild(createDay("", new Date(self.currentYear, self.currentMonth, dayNumber), dayNumber, dayIndex));
		}

		// append days from the next month
		for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth; dayNum++, dayIndex++) {
			days.appendChild(createDay("nextMonthDay", new Date(self.currentYear, self.currentMonth + 1, dayNum % daysInMonth), dayNum, dayIndex));
		}

		if (isRangeMode && self.selectedDates.length === 1 && days.childNodes[0]) {
			self._hidePrevMonthArrow = self._hidePrevMonthArrow || self.minRangeDate > days.childNodes[0].dateObj;

			self._hideNextMonthArrow = self._hideNextMonthArrow || self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
		} else updateNavigationCurrentMonth();

		var dayContainer = createElement("div", "dayContainer");
		dayContainer.appendChild(days);

		if (!self.config.animate || delta === undefined) clearNode(self.daysContainer);else {
			while (self.daysContainer.childNodes.length > 1) {
				self.daysContainer.removeChild(self.daysContainer.firstChild);
			}
		}

		if (delta >= 0) self.daysContainer.appendChild(dayContainer);else self.daysContainer.insertBefore(dayContainer, self.daysContainer.firstChild);

		self.days = self.daysContainer.firstChild;
		return self.daysContainer;
	}

	function clearNode(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	function buildMonthNav() {
		var monthNavFragment = window.document.createDocumentFragment();
		self.monthNav = createElement("div", "flatpickr-month");

		self.prevMonthNav = createElement("span", "flatpickr-prev-month");
		self.prevMonthNav.innerHTML = self.config.prevArrow;

		self.currentMonthElement = createElement("span", "cur-month");
		self.currentMonthElement.title = self.l10n.scrollTitle;

		var yearInput = createNumberInput("cur-year");
		self.currentYearElement = yearInput.childNodes[0];
		self.currentYearElement.title = self.l10n.scrollTitle;

		if (self.config.minDate) self.currentYearElement.min = self.config.minDate.getFullYear();

		if (self.config.maxDate) {
			self.currentYearElement.max = self.config.maxDate.getFullYear();

			self.currentYearElement.disabled = self.config.minDate && self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
		}

		self.nextMonthNav = createElement("span", "flatpickr-next-month");
		self.nextMonthNav.innerHTML = self.config.nextArrow;

		self.navigationCurrentMonth = createElement("span", "flatpickr-current-month");
		self.navigationCurrentMonth.appendChild(self.currentMonthElement);
		self.navigationCurrentMonth.appendChild(yearInput);

		monthNavFragment.appendChild(self.prevMonthNav);
		monthNavFragment.appendChild(self.navigationCurrentMonth);
		monthNavFragment.appendChild(self.nextMonthNav);
		self.monthNav.appendChild(monthNavFragment);

		Object.defineProperty(self, "_hidePrevMonthArrow", {
			get: function get() {
				return this.__hidePrevMonthArrow;
			},
			set: function set(bool) {
				if (this.__hidePrevMonthArrow !== bool) self.prevMonthNav.style.display = bool ? "none" : "block";
				this.__hidePrevMonthArrow = bool;
			}
		});

		Object.defineProperty(self, "_hideNextMonthArrow", {
			get: function get() {
				return this.__hideNextMonthArrow;
			},
			set: function set(bool) {
				if (this.__hideNextMonthArrow !== bool) self.nextMonthNav.style.display = bool ? "none" : "block";
				this.__hideNextMonthArrow = bool;
			}
		});

		updateNavigationCurrentMonth();

		return self.monthNav;
	}

	function buildTime() {
		self.calendarContainer.classList.add("hasTime");
		if (self.config.noCalendar) self.calendarContainer.classList.add("noCalendar");
		self.timeContainer = createElement("div", "flatpickr-time");
		self.timeContainer.tabIndex = -1;
		var separator = createElement("span", "flatpickr-time-separator", ":");

		var hourInput = createNumberInput("flatpickr-hour");
		self.hourElement = hourInput.childNodes[0];

		var minuteInput = createNumberInput("flatpickr-minute");
		self.minuteElement = minuteInput.childNodes[0];

		self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;

		self.hourElement.value = self.pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getHours() : self.config.defaultHour);

		self.minuteElement.value = self.pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getMinutes() : self.config.defaultMinute);

		self.hourElement.step = self.config.hourIncrement;
		self.minuteElement.step = self.config.minuteIncrement;

		self.hourElement.min = self.config.time_24hr ? 0 : 1;
		self.hourElement.max = self.config.time_24hr ? 23 : 12;

		self.minuteElement.min = 0;
		self.minuteElement.max = 59;

		self.hourElement.title = self.minuteElement.title = self.l10n.scrollTitle;

		self.timeContainer.appendChild(hourInput);
		self.timeContainer.appendChild(separator);
		self.timeContainer.appendChild(minuteInput);

		if (self.config.time_24hr) self.timeContainer.classList.add("time24hr");

		if (self.config.enableSeconds) {
			self.timeContainer.classList.add("hasSeconds");

			var secondInput = createNumberInput("flatpickr-second");
			self.secondElement = secondInput.childNodes[0];

			self.secondElement.value = self.latestSelectedDateObj ? self.pad(self.latestSelectedDateObj.getSeconds()) : "00";

			self.secondElement.step = self.minuteElement.step;
			self.secondElement.min = self.minuteElement.min;
			self.secondElement.max = self.minuteElement.max;

			self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
			self.timeContainer.appendChild(secondInput);
		}

		if (!self.config.time_24hr) {
			// add self.amPM if appropriate
			self.amPM = createElement("span", "flatpickr-am-pm", ["AM", "PM"][self.hourElement.value > 11 | 0]);
			self.amPM.title = self.l10n.toggleTitle;
			self.amPM.tabIndex = -1;
			self.timeContainer.appendChild(self.amPM);
		}

		return self.timeContainer;
	}

	function buildWeekdays() {
		if (!self.weekdayContainer) self.weekdayContainer = createElement("div", "flatpickr-weekdays");

		var firstDayOfWeek = self.l10n.firstDayOfWeek;
		var weekdays = self.l10n.weekdays.shorthand.slice();

		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
		}

		self.weekdayContainer.innerHTML = "\n\t\t<span class=flatpickr-weekday>\n\t\t\t" + weekdays.join("</span><span class=flatpickr-weekday>") + "\n\t\t</span>\n\t\t";

		return self.weekdayContainer;
	}

	/* istanbul ignore next */
	function buildWeeks() {
		self.calendarContainer.classList.add("hasWeeks");
		self.weekWrapper = createElement("div", "flatpickr-weekwrapper");
		self.weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
		self.weekNumbers = createElement("div", "flatpickr-weeks");
		self.weekWrapper.appendChild(self.weekNumbers);

		return self.weekWrapper;
	}

	function changeMonth(value, is_offset, animate) {
		is_offset = is_offset === undefined || is_offset;
		var delta = is_offset ? value : value - self.currentMonth;
		var skipAnimations = !self.config.animate || animate === false;

		if (delta < 0 && self._hidePrevMonthArrow || delta > 0 && self._hideNextMonthArrow) return;

		self.currentMonth += delta;

		if (self.currentMonth < 0 || self.currentMonth > 11) {
			self.currentYear += self.currentMonth > 11 ? 1 : -1;
			self.currentMonth = (self.currentMonth + 12) % 12;

			triggerEvent("YearChange");
		}

		buildDays(!skipAnimations ? delta : undefined);

		if (skipAnimations) {
			triggerEvent("MonthChange");
			return updateNavigationCurrentMonth();
		}

		// remove possible remnants from clicking too fast
		var nav = self.navigationCurrentMonth;
		if (delta < 0) {
			while (nav.nextSibling && /curr/.test(nav.nextSibling.className)) {
				self.monthNav.removeChild(nav.nextSibling);
			}
		} else if (delta > 0) {
			while (nav.previousSibling && /curr/.test(nav.previousSibling.className)) {
				self.monthNav.removeChild(nav.previousSibling);
			}
		}

		self.oldCurMonth = self.navigationCurrentMonth;

		self.navigationCurrentMonth = self.monthNav.insertBefore(self.oldCurMonth.cloneNode(true), delta > 0 ? self.oldCurMonth.nextSibling : self.oldCurMonth);

		if (delta > 0) {
			self.daysContainer.firstChild.classList.add("slideLeft");
			self.daysContainer.lastChild.classList.add("slideLeftNew");

			self.oldCurMonth.classList.add("slideLeft");
			self.navigationCurrentMonth.classList.add("slideLeftNew");
		} else if (delta < 0) {
			self.daysContainer.firstChild.classList.add("slideRightNew");
			self.daysContainer.lastChild.classList.add("slideRight");

			self.oldCurMonth.classList.add("slideRight");
			self.navigationCurrentMonth.classList.add("slideRightNew");
		}

		self.currentMonthElement = self.navigationCurrentMonth.firstChild;
		self.currentYearElement = self.navigationCurrentMonth.lastChild.childNodes[0];

		updateNavigationCurrentMonth();
		self.oldCurMonth.firstChild.textContent = self.utils.monthToStr(self.currentMonth - delta);

		triggerEvent("MonthChange");

		if (self._.daysAnimDuration === undefined) {
			var compStyle = window.getComputedStyle(self.daysContainer.lastChild);

			var duration = compStyle.getPropertyValue("animation-duration") || compStyle.getPropertyValue("-webkit-animation-duration");

			self._.daysAnimDuration = parseInt(/(\d+)s/.exec(duration)[1]);
		}
	}

	function clear(triggerChangeEvent) {
		self.input.value = "";

		if (self.altInput) self.altInput.value = "";

		if (self.mobileInput) self.mobileInput.value = "";

		self.selectedDates = [];
		self.latestSelectedDateObj = undefined;
		self.showTimeInput = false;

		self.redraw();

		if (triggerChangeEvent !== false)
			// triggerChangeEvent is true (default) or an Event
			triggerEvent("Change");
	}

	function close() {
		self.isOpen = false;

		if (!self.isMobile) {
			self.calendarContainer.classList.remove("open");
			self._input.classList.remove("active");
		}

		triggerEvent("Close");
	}

	function destroy() {
		for (var i = self._handlers.length; i--;) {
			var h = self._handlers[i];
			h.element.removeEventListener(h.event, h.handler);
		}

		self._handlers = [];

		if (self.mobileInput) {
			if (self.mobileInput.parentNode) self.mobileInput.parentNode.removeChild(self.mobileInput);
			self.mobileInput = null;
		} else if (self.calendarContainer && self.calendarContainer.parentNode) self.calendarContainer.parentNode.removeChild(self.calendarContainer);

		if (self.altInput) {
			self.input.type = "text";
			if (self.altInput.parentNode) self.altInput.parentNode.removeChild(self.altInput);
			delete self.altInput;
		}

		if (self.input) {
			self.input.type = self.input._type;
			self.input.classList.remove("flatpickr-input");
			self.input.removeAttribute("readonly");
			self.input.value = "";
		}

		["_showTimeInput", "latestSelectedDateObj", "_hideNextMonthArrow", "_hidePrevMonthArrow", "__hideNextMonthArrow", "__hidePrevMonthArrow", "isMobile", "isOpen", "selectedDateElem", "minDateHasTime", "maxDateHasTime", "days", "daysContainer", "_input", "_positionElement", "innerContainer", "rContainer", "monthNav", "todayDateElem", "calendarContainer", "weekdayContainer", "prevMonthNav", "nextMonthNav", "currentMonthElement", "currentYearElement", "navigationCurrentMonth", "selectedDateElem", "config"].forEach(function (k) {
			return delete self[k];
		});
	}

	function isCalendarElem(elem) {
		if (self.config.appendTo && self.config.appendTo.contains(elem)) return true;

		return self.calendarContainer.contains(elem);
	}

	function documentClick(e) {
		if (self.isOpen && !self.config.inline) {
			var isCalendarElement = isCalendarElem(e.target);
			var isInput = e.target === self.input || e.target === self.altInput || self.element.contains(e.target) ||
			// web components
			e.path && e.path.indexOf && (~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput));

			var lostFocus = e.type === "blur" ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget) : !isInput && !isCalendarElement;

			if (lostFocus) {
				e.preventDefault();
				self.close();

				if (self.config.mode === "range" && self.selectedDates.length === 1) {
					self.clear(false);
					self.redraw();
				}
			}
		}
	}

	function changeYear(newYear) {
		if (!newYear || self.currentYearElement.min && newYear < self.currentYearElement.min || self.currentYearElement.max && newYear > self.currentYearElement.max) return;

		var newYearNum = parseInt(newYear, 10),
		    isNewYear = self.currentYear !== newYearNum;

		self.currentYear = newYearNum || self.currentYear;

		if (self.config.maxDate && self.currentYear === self.config.maxDate.getFullYear()) {
			self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
		} else if (self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
			self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
		}

		if (isNewYear) {
			self.redraw();
			triggerEvent("YearChange");
		}
	}

	function isEnabled(date, timeless) {
		if (self.config.minDate && compareDates(date, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0 || self.config.maxDate && compareDates(date, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0) return false;

		if (!self.config.enable.length && !self.config.disable.length) return true;

		var dateToCheck = self.parseDate(date, null, true); // timeless

		var bool = self.config.enable.length > 0,
		    array = bool ? self.config.enable : self.config.disable;

		for (var i = 0, d; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) // disabled by function
				return bool;else if (d instanceof Date && d.getTime() === dateToCheck.getTime())
				// disabled by date
				return bool;else if (typeof d === "string" && self.parseDate(d, null, true).getTime() === dateToCheck.getTime())
				// disabled by date string
				return bool;else if ( // disabled by range
			(typeof d === "undefined" ? "undefined" : _typeof(d)) === "object" && d.from && d.to && dateToCheck >= d.from && dateToCheck <= d.to) return bool;
		}

		return !bool;
	}

	function onKeyDown(e) {
		var isInput = e.target === self._input;
		var calendarElem = isCalendarElem(e.target);
		var allowInput = self.config.allowInput;
		var allowKeydown = self.isOpen && (!allowInput || !isInput);
		var allowInlineKeydown = self.config.inline && isInput && !allowInput;

		if (e.key === "Enter" && allowInput && isInput) {
			self.setDate(self._input.value, true, e.target === self.altInput ? self.config.altFormat : self.config.dateFormat);
			return e.target.blur();
		} else if (calendarElem || allowKeydown || allowInlineKeydown) {
			var isTimeObj = self.timeContainer && self.timeContainer.contains(e.target);
			switch (e.key) {
				case "Enter":
					if (isTimeObj) updateValue();else selectDate(e);

					break;

				case "Escape":
					// escape
					e.preventDefault();
					self.close();
					break;

				case "ArrowLeft":
				case "ArrowRight":
					if (!isTimeObj) {
						e.preventDefault();

						if (self.daysContainer) {
							var _delta = e.key === "ArrowRight" ? 1 : -1;

							if (!e.ctrlKey) focusOnDay(e.target.$i, _delta);else {
								changeMonth(_delta, true);
								afterDayAnim(function () {
									focusOnDay(e.target.$i, 0);
								});
							}
						} else if (self.config.enableTime && !isTimeObj) self.hourElement.focus();
					}

					break;

				case "ArrowUp":
				case "ArrowDown":
					e.preventDefault();
					var delta = e.key === "ArrowDown" ? 1 : -1;

					if (self.daysContainer) {
						if (e.ctrlKey) {
							changeYear(self.currentYear - delta);
							focusOnDay(e.target.$i, 0);
						} else if (!isTimeObj) focusOnDay(e.target.$i, delta * 7);
					} else if (self.config.enableTime) {
						if (!isTimeObj) self.hourElement.focus();
						updateTime(e);
					}

					break;

				case "Tab":
					if (e.target === self.hourElement) {
						e.preventDefault();
						self.minuteElement.select();
					} else if (e.target === self.minuteElement && (self.secondElement || self.amPM)) {
						e.preventDefault();
						(self.secondElement || self.amPM).focus();
					} else if (e.target === self.secondElement) {
						e.preventDefault();
						self.amPM.focus();
					}

					break;

				case "a":
					if (e.target === self.amPM) {
						self.amPM.textContent = "AM";
						setHoursFromInputs();
						updateValue();
					}
					break;

				case "p":
					if (e.target === self.amPM) {
						self.amPM.textContent = "PM";
						setHoursFromInputs();
						updateValue();
					}
					break;

				default:
					break;

			}

			triggerEvent("KeyDown", e);
		}
	}

	function onMouseOver(elem) {
		if (self.selectedDates.length !== 1 || !elem.classList.contains("flatpickr-day")) return;

		var hoverDate = elem.dateObj,
		    initialDate = self.parseDate(self.selectedDates[0], null, true),
		    rangeStartDate = Math.min(hoverDate.getTime(), self.selectedDates[0].getTime()),
		    rangeEndDate = Math.max(hoverDate.getTime(), self.selectedDates[0].getTime()),
		    containsDisabled = false;

		for (var t = rangeStartDate; t < rangeEndDate; t += self.utils.duration.DAY) {
			if (!isEnabled(new Date(t))) {
				containsDisabled = true;
				break;
			}
		}

		var _loop = function _loop(timestamp, i) {
			var outOfRange = timestamp < self.minRangeDate.getTime() || timestamp > self.maxRangeDate.getTime(),
			    dayElem = self.days.childNodes[i];

			if (outOfRange) {
				self.days.childNodes[i].classList.add("notAllowed");
				["inRange", "startRange", "endRange"].forEach(function (c) {
					dayElem.classList.remove(c);
				});
				return "continue";
			} else if (containsDisabled && !outOfRange) return "continue";

			["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
				dayElem.classList.remove(c);
			});

			var minRangeDate = Math.max(self.minRangeDate.getTime(), rangeStartDate),
			    maxRangeDate = Math.min(self.maxRangeDate.getTime(), rangeEndDate);

			elem.classList.add(hoverDate < self.selectedDates[0] ? "startRange" : "endRange");

			if (initialDate < hoverDate && timestamp === initialDate.getTime()) dayElem.classList.add("startRange");else if (initialDate > hoverDate && timestamp === initialDate.getTime()) dayElem.classList.add("endRange");

			if (timestamp >= minRangeDate && timestamp <= maxRangeDate) dayElem.classList.add("inRange");
		};

		for (var timestamp = self.days.childNodes[0].dateObj.getTime(), i = 0; i < 42; i++, timestamp += self.utils.duration.DAY) {
			var _ret = _loop(timestamp, i);

			if (_ret === "continue") continue;
		}
	}

	function onResize() {
		if (self.isOpen && !self.config.static && !self.config.inline) positionCalendar();
	}

	function open(e) {
		if (self.isMobile) {
			if (e) {
				e.preventDefault();
				e.target.blur();
			}

			setTimeout(function () {
				self.mobileInput.click();
			}, 0);

			triggerEvent("Open");
			return;
		}

		if (self.isOpen || self._input.disabled || self.config.inline) return;

		self.isOpen = true;
		self.calendarContainer.classList.add("open");
		positionCalendar();
		self._input.classList.add("active");

		triggerEvent("Open");
	}

	function minMaxDateSetter(type) {
		return function (date) {
			var dateObj = self.config["_" + type + "Date"] = self.parseDate(date);

			var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
			var isValidDate = date && dateObj instanceof Date;

			if (isValidDate) {
				self[type + "DateHasTime"] = dateObj.getHours() || dateObj.getMinutes() || dateObj.getSeconds();
			}

			if (self.selectedDates) {
				self.selectedDates = self.selectedDates.filter(function (d) {
					return isEnabled(d);
				});
				if (!self.selectedDates.length && type === "min") setHoursFromDate(dateObj);
				updateValue();
			}

			if (self.daysContainer) {
				redraw();

				if (isValidDate) self.currentYearElement[type] = dateObj.getFullYear();else self.currentYearElement.removeAttribute(type);

				self.currentYearElement.disabled = inverseDateObj && dateObj && inverseDateObj.getFullYear() === dateObj.getFullYear();
			}
		};
	}

	function parseConfig() {
		var boolOpts = ["utc", "wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"];

		var hooks = ["onChange", "onClose", "onDayCreate", "onKeyDown", "onMonthChange", "onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange"];

		self.config = Object.create(Flatpickr.defaultConfig);

		var userConfig = _extends({}, self.instanceConfig, JSON.parse(JSON.stringify(self.element.dataset || {})));

		self.config.parseDate = userConfig.parseDate;
		self.config.formatDate = userConfig.formatDate;

		_extends(self.config, userConfig);

		if (!userConfig.dateFormat && userConfig.enableTime) {
			self.config.dateFormat = self.config.noCalendar ? "H:i" + (self.config.enableSeconds ? ":S" : "") : Flatpickr.defaultConfig.dateFormat + " H:i" + (self.config.enableSeconds ? ":S" : "");
		}

		if (userConfig.altInput && userConfig.enableTime && !userConfig.altFormat) {
			self.config.altFormat = self.config.noCalendar ? "h:i" + (self.config.enableSeconds ? ":S K" : " K") : Flatpickr.defaultConfig.altFormat + (" h:i" + (self.config.enableSeconds ? ":S" : "") + " K");
		}

		Object.defineProperty(self.config, "minDate", {
			get: function get() {
				return this._minDate;
			},
			set: minMaxDateSetter("min")
		});

		Object.defineProperty(self.config, "maxDate", {
			get: function get() {
				return this._maxDate;
			},
			set: minMaxDateSetter("max")
		});

		self.config.minDate = userConfig.minDate;
		self.config.maxDate = userConfig.maxDate;

		for (var i = 0; i < boolOpts.length; i++) {
			self.config[boolOpts[i]] = self.config[boolOpts[i]] === true || self.config[boolOpts[i]] === "true";
		}for (var _i = hooks.length; _i--;) {
			if (self.config[hooks[_i]] !== undefined) {
				self.config[hooks[_i]] = arrayify(self.config[hooks[_i]] || []).map(bindToInstance);
			}
		}

		for (var _i2 = 0; _i2 < self.config.plugins.length; _i2++) {
			var pluginConf = self.config.plugins[_i2](self) || {};
			for (var key in pluginConf) {

				if (self.config[key] instanceof Array || ~hooks.indexOf(key)) {
					self.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self.config[key]);
				} else if (typeof userConfig[key] === "undefined") self.config[key] = pluginConf[key];
			}
		}

		triggerEvent("ParseConfig");
	}

	function setupLocale() {
		if (_typeof(self.config.locale) !== "object" && typeof Flatpickr.l10ns[self.config.locale] === "undefined") console.warn("flatpickr: invalid locale " + self.config.locale);

		self.l10n = _extends(Object.create(Flatpickr.l10ns.default), _typeof(self.config.locale) === "object" ? self.config.locale : self.config.locale !== "default" ? Flatpickr.l10ns[self.config.locale] || {} : {});
	}

	function positionCalendar() {
		if (self.calendarContainer === undefined) return;

		var calendarHeight = self.calendarContainer.offsetHeight,
		    calendarWidth = self.calendarContainer.offsetWidth,
		    configPos = self.config.position,
		    inputBounds = self._positionElement.getBoundingClientRect(),
		    distanceFromBottom = window.innerHeight - inputBounds.bottom,
		    showOnTop = configPos === "above" || configPos !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;

		var top = window.pageYOffset + inputBounds.top + (!showOnTop ? self._positionElement.offsetHeight + 2 : -calendarHeight - 2);

		toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
		toggleClass(self.calendarContainer, "arrowBottom", showOnTop);

		if (self.config.inline) return;

		var left = window.pageXOffset + inputBounds.left;
		var right = window.document.body.offsetWidth - inputBounds.right;
		var rightMost = left + calendarWidth > window.document.body.offsetWidth;

		toggleClass(self.calendarContainer, "rightMost", rightMost);

		if (self.config.static) return;

		self.calendarContainer.style.top = top + "px";

		if (!rightMost) {
			self.calendarContainer.style.left = left + "px";
			self.calendarContainer.style.right = "auto";
		} else {
			self.calendarContainer.style.left = "auto";
			self.calendarContainer.style.right = right + "px";
		}
	}

	function redraw() {
		if (self.config.noCalendar || self.isMobile) return;

		buildWeekdays();
		updateNavigationCurrentMonth();
		buildDays();
	}

	function selectDate(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!e.target.classList.contains("flatpickr-day") || e.target.classList.contains("disabled") || e.target.classList.contains("notAllowed")) return;

		var selectedDate = self.latestSelectedDateObj = new Date(e.target.dateObj.getTime());

		var shouldChangeMonth = selectedDate.getMonth() !== self.currentMonth && self.config.mode !== "range";

		self.selectedDateElem = e.target;

		if (self.config.mode === "single") self.selectedDates = [selectedDate];else if (self.config.mode === "multiple") {
			var selectedIndex = isDateSelected(selectedDate);
			if (selectedIndex) self.selectedDates.splice(selectedIndex, 1);else self.selectedDates.push(selectedDate);
		} else if (self.config.mode === "range") {
			if (self.selectedDates.length === 2) self.clear();

			self.selectedDates.push(selectedDate);

			// unless selecting same date twice, sort ascendingly
			if (compareDates(selectedDate, self.selectedDates[0], true) !== 0) self.selectedDates.sort(function (a, b) {
				return a.getTime() - b.getTime();
			});
		}

		setHoursFromInputs();

		if (shouldChangeMonth) {
			var isNewYear = self.currentYear !== selectedDate.getFullYear();
			self.currentYear = selectedDate.getFullYear();
			self.currentMonth = selectedDate.getMonth();

			if (isNewYear) triggerEvent("YearChange");

			triggerEvent("MonthChange");
		}

		buildDays();

		if (self.minDateHasTime && self.config.enableTime && compareDates(selectedDate, self.config.minDate) === 0) setHoursFromDate(self.config.minDate);

		updateValue();

		if (self.config.enableTime) setTimeout(function () {
			return self.showTimeInput = true;
		}, 50);

		if (self.config.mode === "range") {
			if (self.selectedDates.length === 1) {
				onMouseOver(e.target);

				self._hidePrevMonthArrow = self._hidePrevMonthArrow || self.minRangeDate > self.days.childNodes[0].dateObj;

				self._hideNextMonthArrow = self._hideNextMonthArrow || self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
			} else updateNavigationCurrentMonth();
		}

		triggerEvent("Change");

		// maintain focus
		if (!shouldChangeMonth) focusOnDay(e.target.$i, 0);else afterDayAnim(function () {
			return self.selectedDateElem.focus();
		});

		if (self.config.enableTime) setTimeout(function () {
			return self.hourElement.select();
		}, 451);

		if (self.config.mode !== "multiple" && !self.config.enableTime && self.config.closeOnSelect) self.close();
	}

	function set(option, value) {
		self.config[option] = value;
		self.redraw();
		jumpToDate();
	}

	function setSelectedDate(inputDate, format) {
		if (inputDate instanceof Array) self.selectedDates = inputDate.map(function (d) {
			return self.parseDate(d, format);
		});else if (inputDate instanceof Date || !isNaN(inputDate)) self.selectedDates = [self.parseDate(inputDate, format)];else if (inputDate && inputDate.substring) {
			switch (self.config.mode) {
				case "single":
					self.selectedDates = [self.parseDate(inputDate, format)];
					break;

				case "multiple":
					self.selectedDates = inputDate.split("; ").map(function (date) {
						return self.parseDate(date, format);
					});
					break;

				case "range":
					self.selectedDates = inputDate.split(self.l10n.rangeSeparator).map(function (date) {
						return self.parseDate(date, format);
					});

					break;

				default:
					break;
			}
		}

		self.selectedDates = self.selectedDates.filter(function (d) {
			return d instanceof Date && isEnabled(d, false);
		});

		self.selectedDates.sort(function (a, b) {
			return a.getTime() - b.getTime();
		});
	}

	function setDate(date, triggerChange, format) {
		if (!date) return self.clear(triggerChange);

		setSelectedDate(date, format);

		self.showTimeInput = self.selectedDates.length > 0;
		self.latestSelectedDateObj = self.selectedDates[0];

		self.redraw();
		jumpToDate();

		setHoursFromDate();
		updateValue(triggerChange);

		if (triggerChange) triggerEvent("Change");
	}

	function setupDates() {
		function parseDateRules(arr) {
			for (var i = arr.length; i--;) {
				if (typeof arr[i] === "string" || +arr[i]) arr[i] = self.parseDate(arr[i], null, true);else if (arr[i] && arr[i].from && arr[i].to) {
					arr[i].from = self.parseDate(arr[i].from);
					arr[i].to = self.parseDate(arr[i].to);
				}
			}

			return arr.filter(function (x) {
				return x;
			}); // remove falsy values
		}

		self.selectedDates = [];
		self.now = new Date();

		if (self.config.disable.length) self.config.disable = parseDateRules(self.config.disable);

		if (self.config.enable.length) self.config.enable = parseDateRules(self.config.enable);

		var preloadedDate = self.config.defaultDate || self.input.value;
		if (preloadedDate) setSelectedDate(preloadedDate, self.config.dateFormat);

		var initialDate = self.selectedDates.length ? self.selectedDates[0] : self.config.minDate && self.config.minDate.getTime() > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate.getTime() < self.now ? self.config.maxDate : self.now;

		self.currentYear = initialDate.getFullYear();
		self.currentMonth = initialDate.getMonth();

		if (self.selectedDates.length) self.latestSelectedDateObj = self.selectedDates[0];

		self.minDateHasTime = self.config.minDate && (self.config.minDate.getHours() || self.config.minDate.getMinutes() || self.config.minDate.getSeconds());

		self.maxDateHasTime = self.config.maxDate && (self.config.maxDate.getHours() || self.config.maxDate.getMinutes() || self.config.maxDate.getSeconds());

		Object.defineProperty(self, "latestSelectedDateObj", {
			get: function get() {
				return self._selectedDateObj || self.selectedDates[self.selectedDates.length - 1];
			},
			set: function set(date) {
				self._selectedDateObj = date;
			}
		});

		if (!self.isMobile) {
			Object.defineProperty(self, "showTimeInput", {
				get: function get() {
					return self._showTimeInput;
				},
				set: function set(bool) {
					self._showTimeInput = bool;
					if (self.calendarContainer) toggleClass(self.calendarContainer, "showTimeInput", bool);
					positionCalendar();
				}
			});
		}
	}

	function setupHelperFunctions() {
		self.utils = {
			duration: {
				DAY: 86400000
			},
			getDaysinMonth: function getDaysinMonth(month, yr) {
				month = typeof month === "undefined" ? self.currentMonth : month;

				yr = typeof yr === "undefined" ? self.currentYear : yr;

				if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0)) return 29;

				return self.l10n.daysInMonth[month];
			},
			monthToStr: function monthToStr(monthNumber, shorthand) {
				shorthand = typeof shorthand === "undefined" ? self.config.shorthandCurrentMonth : shorthand;

				return self.l10n.months[(shorthand ? "short" : "long") + "hand"][monthNumber];
			}
		};
	}

	/* istanbul ignore next */
	function setupFormats() {
		["D", "F", "J", "M", "W", "l"].forEach(function (f) {
			self.formats[f] = Flatpickr.prototype.formats[f].bind(self);
		});

		self.revFormat.F = Flatpickr.prototype.revFormat.F.bind(self);
		self.revFormat.M = Flatpickr.prototype.revFormat.M.bind(self);
	}

	function setupInputs() {
		self.input = self.config.wrap ? self.element.querySelector("[data-input]") : self.element;

		/* istanbul ignore next */
		if (!self.input) return console.warn("Error: invalid input element specified", self.input);

		self.input._type = self.input.type;
		self.input.type = "text";

		self.input.classList.add("flatpickr-input");
		self._input = self.input;

		if (self.config.altInput) {
			// replicate self.element
			self.altInput = createElement(self.input.nodeName, self.input.className + " " + self.config.altInputClass);
			self._input = self.altInput;
			self.altInput.placeholder = self.input.placeholder;
			self.altInput.type = "text";
			self.input.type = "hidden";

			if (!self.config.static && self.input.parentNode) self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
		}

		if (!self.config.allowInput) self._input.setAttribute("readonly", "readonly");

		self._positionElement = self.config.positionElement || self._input;
	}

	function setupMobile() {
		var inputType = self.config.enableTime ? self.config.noCalendar ? "time" : "datetime-local" : "date";

		self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
		self.mobileInput.step = "any";
		self.mobileInput.tabIndex = 1;
		self.mobileInput.type = inputType;
		self.mobileInput.disabled = self.input.disabled;
		self.mobileInput.placeholder = self.input.placeholder;

		self.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";

		if (self.selectedDates.length) {
			self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
		}

		if (self.config.minDate) self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");

		if (self.config.maxDate) self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");

		self.input.type = "hidden";
		if (self.config.altInput) self.altInput.type = "hidden";

		try {
			self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
		} catch (e) {
			//
		}

		self.mobileInput.addEventListener("change", function (e) {
			self.setDate(e.target.value, false, self.mobileFormatStr);
			triggerEvent("Change");
			triggerEvent("Close");
		});
	}

	function toggle() {
		if (self.isOpen) return self.close();
		self.open();
	}

	function triggerEvent(event, data) {
		var hooks = self.config["on" + event];

		if (hooks !== undefined && hooks.length > 0) {
			for (var i = 0; hooks[i] && i < hooks.length; i++) {
				hooks[i](self.selectedDates, self._input.value, self, data);
			}
		}

		if (event === "Change") {
			self.input.dispatchEvent(createEvent("change"));

			// many front-end frameworks bind to the input event
			self.input.dispatchEvent(createEvent("input"));
		}
	}

	/**
  * Creates an Event, normalized across browsers
  * @param {String} name the event name, e.g. "click"
  * @return {Event} the created event
  */
	function createEvent(name) {
		if (self._supportsEvents) return new Event(name, { bubbles: true });

		self._[name + "Event"] = document.createEvent("Event");
		self._[name + "Event"].initEvent(name, true, true);
		return self._[name + "Event"];
	}

	function isDateSelected(date) {
		for (var i = 0; i < self.selectedDates.length; i++) {
			if (compareDates(self.selectedDates[i], date) === 0) return "" + i;
		}

		return false;
	}

	function isDateInRange(date) {
		if (self.config.mode !== "range" || self.selectedDates.length < 2) return false;
		return compareDates(date, self.selectedDates[0]) >= 0 && compareDates(date, self.selectedDates[1]) <= 0;
	}

	function updateNavigationCurrentMonth() {
		if (self.config.noCalendar || self.isMobile || !self.monthNav) return;

		self.currentMonthElement.textContent = self.utils.monthToStr(self.currentMonth) + " ";
		self.currentYearElement.value = self.currentYear;

		self._hidePrevMonthArrow = self.config.minDate && (self.currentYear === self.config.minDate.getFullYear() ? self.currentMonth <= self.config.minDate.getMonth() : self.currentYear < self.config.minDate.getFullYear());

		self._hideNextMonthArrow = self.config.maxDate && (self.currentYear === self.config.maxDate.getFullYear() ? self.currentMonth + 1 > self.config.maxDate.getMonth() : self.currentYear > self.config.maxDate.getFullYear());
	}

	/**
  * Updates the values of inputs associated with the calendar
  * @return {void}
  */
	function updateValue(triggerChange) {
		if (!self.selectedDates.length) return self.clear(triggerChange);

		if (self.isMobile) {
			self.mobileInput.value = self.selectedDates.length ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr) : "";
		}

		var joinChar = self.config.mode !== "range" ? "; " : self.l10n.rangeSeparator;

		self.input.value = self.selectedDates.map(function (dObj) {
			return self.formatDate(dObj, self.config.dateFormat);
		}).join(joinChar);

		if (self.config.altInput) {
			self.altInput.value = self.selectedDates.map(function (dObj) {
				return self.formatDate(dObj, self.config.altFormat);
			}).join(joinChar);
		}
		triggerEvent("ValueUpdate");
	}

	function mouseDelta(e) {
		return Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
	}

	function onMonthNavScroll(e) {
		e.preventDefault();
		var isYear = self.currentYearElement.parentNode.contains(e.target);

		if (e.target === self.currentMonthElement || isYear) {

			var delta = mouseDelta(e);

			if (isYear) {
				changeYear(self.currentYear + delta);
				e.target.value = self.currentYear;
			} else self.changeMonth(delta, true, false);
		}
	}

	function onMonthNavClick(e) {
		var isPrevMonth = self.prevMonthNav.contains(e.target);
		var isNextMonth = self.nextMonthNav.contains(e.target);

		if (isPrevMonth || isNextMonth) changeMonth(isPrevMonth ? -1 : 1);else if (e.target === self.currentYearElement) {
			e.preventDefault();
			self.currentYearElement.select();
		} else if (e.target.className === "arrowUp") self.changeYear(self.currentYear + 1);else if (e.target.className === "arrowDown") self.changeYear(self.currentYear - 1);
	}

	/**
  * Creates an HTMLElement with given tag, class, and textual content
  * @param {String} tag the HTML tag
  * @param {String} className the new element's class name
  * @param {String} content The new element's text content
  * @return {HTMLElement} the created HTML element
  */
	function createElement(tag, className, content) {
		var e = window.document.createElement(tag);
		className = className || "";
		content = content || "";

		e.className = className;

		if (content !== undefined) e.textContent = content;

		return e;
	}

	function arrayify(obj) {
		if (obj instanceof Array) return obj;
		return [obj];
	}

	function toggleClass(elem, className, bool) {
		if (bool) return elem.classList.add(className);
		elem.classList.remove(className);
	}

	/* istanbul ignore next */
	function debounce(func, wait, immediate) {
		var timeout = void 0;
		return function () {
			var context = this,
			    args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	/**
  * Compute the difference in dates, measured in ms
  * @param {Date} date1
  * @param {Date} date2
  * @param {Boolean} timeless whether to reset times of both dates to 00:00
  * @return {Number} the difference in ms
  */
	function compareDates(date1, date2, timeless) {
		if (!(date1 instanceof Date) || !(date2 instanceof Date)) return false;

		if (timeless !== false) {
			return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
		}

		return date1.getTime() - date2.getTime();
	}

	function timeWrapper(e) {
		e.preventDefault();

		var isKeyDown = e.type === "keydown",
		    isWheel = e.type === "wheel",
		    isIncrement = e.type === "increment",
		    input = e.target;

		if (self.amPM && e.target === self.amPM) return e.target.textContent = ["AM", "PM"][e.target.textContent === "AM" | 0];

		var min = Number(input.min),
		    max = Number(input.max),
		    step = Number(input.step),
		    curValue = parseInt(input.value, 10),
		    delta = e.delta || (!isKeyDown ? Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)) || 0 : e.which === 38 ? 1 : -1);

		var newValue = curValue + step * delta;

		if (typeof input.value !== "undefined" && input.value.length === 2) {
			var isHourElem = input === self.hourElement,
			    isMinuteElem = input === self.minuteElement;

			if (newValue < min) {
				newValue = max + newValue + !isHourElem + (isHourElem && !self.amPM);

				if (isMinuteElem) incrementNumInput(null, -1, self.hourElement);
			} else if (newValue > max) {
				newValue = input === self.hourElement ? newValue - max - !self.amPM : min;

				if (isMinuteElem) incrementNumInput(null, 1, self.hourElement);
			}

			if (self.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) self.amPM.textContent = self.amPM.textContent === "PM" ? "AM" : "PM";

			input.value = self.pad(newValue);
		}
	}

	init();
	return self;
}

/* istanbul ignore next */
Flatpickr.defaultConfig = {
	mode: "single",

	position: "auto",

	animate: window.navigator.userAgent.indexOf("MSIE") === -1,

	/* if true, dates will be parsed, formatted, and displayed in UTC.
 preloading date strings w/ timezones is recommended but not necessary */
	utc: false,

	// wrap: see https://chmln.github.io/flatpickr/examples/#flatpickr-external-elements
	wrap: false,

	// enables week numbers
	weekNumbers: false,

	// allow manual datetime input
	allowInput: false,

	/*
 	clicking on input opens the date(time)picker.
 	disable if you wish to open the calendar manually with .open()
 */
	clickOpens: true,

	/*
 	closes calendar after date selection,
 	unless 'mode' is 'multiple' or enableTime is true
 */
	closeOnSelect: true,

	// display time picker in 24 hour mode
	time_24hr: false,

	// enables the time picker functionality
	enableTime: false,

	// noCalendar: true will hide the calendar. use for a time picker along w/ enableTime
	noCalendar: false,

	// more date format chars at https://chmln.github.io/flatpickr/#dateformat
	dateFormat: "Y-m-d",

	// date format used in aria-label for days
	ariaDateFormat: "F j, Y",

	// altInput - see https://chmln.github.io/flatpickr/#altinput
	altInput: false,

	// the created altInput element will have this class.
	altInputClass: "form-control input",

	// same as dateFormat, but for altInput
	altFormat: "F j, Y", // defaults to e.g. June 10, 2016

	// defaultDate - either a datestring or a date object. used for datetimepicker"s initial value
	defaultDate: null,

	// the minimum date that user can pick (inclusive)
	minDate: null,

	// the maximum date that user can pick (inclusive)
	maxDate: null,

	// dateparser that transforms a given string to a date object
	parseDate: null,

	// dateformatter that transforms a given date object to a string, according to passed format
	formatDate: null,

	getWeek: function getWeek(givenDate) {
		var date = new Date(givenDate.getTime());
		var onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
	},

	// see https://chmln.github.io/flatpickr/#disable
	enable: [],

	// see https://chmln.github.io/flatpickr/#disable
	disable: [],

	// display the short version of month names - e.g. Sep instead of September
	shorthandCurrentMonth: false,

	// displays calendar inline. see https://chmln.github.io/flatpickr/#inline-calendar
	inline: false,

	// position calendar inside wrapper and next to the input element
	// leave at false unless you know what you"re doing
	"static": false,

	// DOM node to append the calendar to in *static* mode
	appendTo: null,

	// code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
	prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
	nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",

	// enables seconds in the time picker
	enableSeconds: false,

	// step size used when scrolling/incrementing the hour element
	hourIncrement: 1,

	// step size used when scrolling/incrementing the minute element
	minuteIncrement: 5,

	// initial value in the hour element
	defaultHour: 12,

	// initial value in the minute element
	defaultMinute: 0,

	// disable native mobile datetime input support
	disableMobile: false,

	// default locale
	locale: "default",

	plugins: [],

	// called every time calendar is closed
	onClose: undefined, // function (dateObj, dateStr) {}

	// onChange callback when user selects a date or time
	onChange: undefined, // function (dateObj, dateStr) {}

	// called for every day element
	onDayCreate: undefined,

	// called every time the month is changed
	onMonthChange: undefined,

	// called every time calendar is opened
	onOpen: undefined, // function (dateObj, dateStr) {}

	// called after the configuration has been parsed
	onParseConfig: undefined,

	// called after calendar is ready
	onReady: undefined, // function (dateObj, dateStr) {}

	// called after input value updated
	onValueUpdate: undefined,

	// called every time the year is changed
	onYearChange: undefined,

	onKeyDown: undefined
};

/* istanbul ignore next */
Flatpickr.l10ns = {
	en: {
		weekdays: {
			shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		},
		months: {
			shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		},
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		firstDayOfWeek: 0,
		ordinal: function ordinal(nth) {
			var s = nth % 100;
			if (s > 3 && s < 21) return "th";
			switch (s % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		},
		rangeSeparator: " to ",
		weekAbbreviation: "Wk",
		scrollTitle: "Scroll to increment",
		toggleTitle: "Click to toggle"
	}
};

Flatpickr.l10ns.default = Object.create(Flatpickr.l10ns.en);
Flatpickr.localize = function (l10n) {
	return _extends(Flatpickr.l10ns.default, l10n || {});
};
Flatpickr.setDefaults = function (config) {
	return _extends(Flatpickr.defaultConfig, config || {});
};

Flatpickr.prototype = {
	formats: {
		// get the date in UTC
		Z: function Z(date) {
			return date.toISOString();
		},

		// weekday name, short, e.g. Thu
		D: function D(date) {
			return this.l10n.weekdays.shorthand[this.formats.w(date)];
		},

		// full month name e.g. January
		F: function F(date) {
			return this.utils.monthToStr(this.formats.n(date) - 1, false);
		},

		// hours with leading zero e.g. 03
		H: function H(date) {
			return Flatpickr.prototype.pad(date.getHours());
		},

		// day (1-30) with ordinal suffix e.g. 1st, 2nd
		J: function J(date) {
			return date.getDate() + this.l10n.ordinal(date.getDate());
		},

		// AM/PM
		K: function K(date) {
			return date.getHours() > 11 ? "PM" : "AM";
		},

		// shorthand month e.g. Jan, Sep, Oct, etc
		M: function M(date) {
			return this.utils.monthToStr(date.getMonth(), true);
		},

		// seconds 00-59
		S: function S(date) {
			return Flatpickr.prototype.pad(date.getSeconds());
		},

		// unix timestamp
		U: function U(date) {
			return date.getTime() / 1000;
		},

		W: function W(date) {
			return this.config.getWeek(date);
		},

		// full year e.g. 2016
		Y: function Y(date) {
			return date.getFullYear();
		},

		// day in month, padded (01-30)
		d: function d(date) {
			return Flatpickr.prototype.pad(date.getDate());
		},

		// hour from 1-12 (am/pm)
		h: function h(date) {
			return date.getHours() % 12 ? date.getHours() % 12 : 12;
		},

		// minutes, padded with leading zero e.g. 09
		i: function i(date) {
			return Flatpickr.prototype.pad(date.getMinutes());
		},

		// day in month (1-30)
		j: function j(date) {
			return date.getDate();
		},

		// weekday name, full, e.g. Thursday
		l: function l(date) {
			return this.l10n.weekdays.longhand[date.getDay()];
		},

		// padded month number (01-12)
		m: function m(date) {
			return Flatpickr.prototype.pad(date.getMonth() + 1);
		},

		// the month number (1-12)
		n: function n(date) {
			return date.getMonth() + 1;
		},

		// seconds 0-59
		s: function s(date) {
			return date.getSeconds();
		},

		// number of the day of the week
		w: function w(date) {
			return date.getDay();
		},

		// last two digits of year e.g. 16 for 2016
		y: function y(date) {
			return String(date.getFullYear()).substring(2);
		}
	},

	/**
  * Formats a given Date object into a string based on supplied format
  * @param {Date} dateObj the date object
  * @param {String} frmt a string composed of formatting tokens e.g. "Y-m-d"
  * @return {String} The textual representation of the date e.g. 2017-02-03
  */
	formatDate: function formatDate(dateObj, frmt) {
		var _this = this;

		if (this.config !== undefined && this.config.formatDate !== undefined) return this.config.formatDate(dateObj, frmt);

		return frmt.split("").map(function (c, i, arr) {
			return _this.formats[c] && arr[i - 1] !== "\\" ? _this.formats[c](dateObj) : c !== "\\" ? c : "";
		}).join("");
	},

	revFormat: {
		D: function D() {},
		F: function F(dateObj, monthName) {
			dateObj.setMonth(this.l10n.months.longhand.indexOf(monthName));
		},
		H: function H(dateObj, hour) {
			dateObj.setHours(parseFloat(hour));
		},
		J: function J(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		K: function K(dateObj, amPM) {
			var hours = dateObj.getHours();

			if (hours !== 12) dateObj.setHours(hours % 12 + 12 * /pm/i.test(amPM));
		},
		M: function M(dateObj, shortMonth) {
			dateObj.setMonth(this.l10n.months.shorthand.indexOf(shortMonth));
		},
		S: function S(dateObj, seconds) {
			dateObj.setSeconds(seconds);
		},
		U: function U(dateObj, unixSeconds) {
			return new Date(parseFloat(unixSeconds) * 1000);
		},

		W: function W(dateObj, weekNumber) {
			weekNumber = parseInt(weekNumber);
			return new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0, 0);
		},
		Y: function Y(dateObj, year) {
			dateObj.setFullYear(year);
		},
		Z: function Z(dateObj, ISODate) {
			return new Date(ISODate);
		},

		d: function d(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		h: function h(dateObj, hour) {
			dateObj.setHours(parseFloat(hour));
		},
		i: function i(dateObj, minutes) {
			dateObj.setMinutes(parseFloat(minutes));
		},
		j: function j(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		l: function l() {},
		m: function m(dateObj, month) {
			dateObj.setMonth(parseFloat(month) - 1);
		},
		n: function n(dateObj, month) {
			dateObj.setMonth(parseFloat(month) - 1);
		},
		s: function s(dateObj, seconds) {
			dateObj.setSeconds(parseFloat(seconds));
		},
		w: function w() {},
		y: function y(dateObj, year) {
			dateObj.setFullYear(2000 + parseFloat(year));
		}
	},

	tokenRegex: {
		D: "(\\w+)",
		F: "(\\w+)",
		H: "(\\d\\d|\\d)",
		J: "(\\d\\d|\\d)\\w+",
		K: "(\\w+)",
		M: "(\\w+)",
		S: "(\\d\\d|\\d)",
		U: "(.+)",
		W: "(\\d\\d|\\d)",
		Y: "(\\d{4})",
		Z: "(.+)",
		d: "(\\d\\d|\\d)",
		h: "(\\d\\d|\\d)",
		i: "(\\d\\d|\\d)",
		j: "(\\d\\d|\\d)",
		l: "(\\w+)",
		m: "(\\d\\d|\\d)",
		n: "(\\d\\d|\\d)",
		s: "(\\d\\d|\\d)",
		w: "(\\d\\d|\\d)",
		y: "(\\d{2})"
	},

	pad: function pad(number) {
		return ("0" + number).slice(-2);
	},

	/**
  * Parses a date(+time) string into a Date object
  * @param {String} date the date string, e.g. 2017-02-03 14:45
  * @param {String} givenFormat the date format, e.g. Y-m-d H:i
  * @param {Boolean} timeless whether to reset the time of Date object
  * @return {Date} the parsed Date object
  */
	parseDate: function parseDate(date, givenFormat, timeless) {
		if (!date) return null;

		var date_orig = date;

		if (date instanceof Date) {
			date = new Date(date.getTime()); // create a copy
			date.fp_isUTC = date_orig.fp_isUTC;
		} else if (date.toFixed !== undefined) // timestamp
			date = new Date(date);else {
			// date string
			var format = givenFormat || (this.config || Flatpickr.defaultConfig).dateFormat;
			date = String(date).trim();

			if (date === "today") {
				date = new Date();
				timeless = true;
			} else if (/Z$/.test(date) || /GMT$/.test(date)) // datestrings w/ timezone
				date = new Date(date);else if (this.config && this.config.parseDate) date = this.config.parseDate(date, format);else {
				var parsedDate = !this.config || !this.config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));

				var matched = void 0;

				for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
					var token = format[i];
					var isBackSlash = token === "\\";
					var escaped = format[i - 1] === "\\" || isBackSlash;

					if (this.tokenRegex[token] && !escaped) {
						regexStr += this.tokenRegex[token];
						var match = new RegExp(regexStr).exec(date);
						if (match && (matched = true)) {
							parsedDate = this.revFormat[token](parsedDate, match[++matchIndex]) || parsedDate;
						}
					} else if (!isBackSlash) regexStr += "."; // don't really care
				}

				date = matched ? parsedDate : null;
			}
		}

		/* istanbul ignore next */
		if (!(date instanceof Date)) {
			console.warn("flatpickr: invalid date " + date_orig);
			console.info(this.element);
			return null;
		}

		if (this.config && this.config.utc && !date.fp_isUTC) date = date.fp_toUTC();

		if (timeless === true) date.setHours(0, 0, 0, 0);

		return date;
	}
};

/* istanbul ignore next */
function _flatpickr(nodeList, config) {
	var nodes = Array.prototype.slice.call(nodeList); // static list
	var instances = [];
	for (var i = 0; i < nodes.length; i++) {
		try {
			nodes[i]._flatpickr = new Flatpickr(nodes[i], config || {});
			instances.push(nodes[i]._flatpickr);
		} catch (e) {
			console.warn(e, e.stack);
		}
	}

	return instances.length === 1 ? instances[0] : instances;
}

/* istanbul ignore next */
if (typeof HTMLElement !== "undefined") {
	// browser env
	HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
		return _flatpickr(this, config);
	};

	HTMLElement.prototype.flatpickr = function (config) {
		return _flatpickr([this], config);
	};
}

/* istanbul ignore next */
function flatpickr(selector, config) {
	return _flatpickr(window.document.querySelectorAll(selector), config);
}

/* istanbul ignore next */
if (typeof jQuery !== "undefined") {
	jQuery.fn.flatpickr = function (config) {
		return _flatpickr(this, config);
	};
}

Date.prototype.fp_incr = function (days) {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate() + parseInt(days, 10));
};

Date.prototype.fp_isUTC = false;
Date.prototype.fp_toUTC = function () {
	var newDate = new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());

	newDate.fp_isUTC = true;
	return newDate;
};

if (typeof module !== "undefined") module.exports = Flatpickr;
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (base) {

    base.notifier = function () {

        // @private property object icons
        var icons = {
            success: 'fa fa-check',
            info: 'fa fa-info',
            warning: 'fa fa-exclamation',
            error: 'fa fa-times'
        };

        // @private method hide
        var _show = function show() {};

        // @private method hide
        var _hide = function hide() {};

        // @private property number hideAfter
        var hideAfter = 5000;

        // @private object notification
        var notification = function () {
            return {
                globalWrapper: 'body',
                wrapper: 'notifications',
                selector: 'notification',
                init: function init() {
                    var $globalWrapper = $(this.globalWrapper);

                    $globalWrapper.append('<div class="' + this.wrapper + '"></div>');
                },
                exists: function exists() {
                    return $('.' + this.wrapper).length > 0;
                },
                getCallbacks: function getCallbacks(callbacks) {
                    callbacks = (typeof callbacks === 'undefined' ? 'undefined' : _typeof(callbacks)) === 'object' ? callbacks : {};
                    callbacks.show = this.getCallback(callbacks['show']);
                    callbacks.hide = this.getCallback(callbacks['hide']);

                    return callbacks;
                },
                getCallback: function getCallback(callback) {
                    return typeof callback === 'function' ? callback : function () {};
                },
                getTemplate: function getTemplate(settings) {
                    return '<div class="' + this.selector + ' ' + settings.type + '" data-index="' + settings.index + '"><a href="#" class="trigger close-notification"><span class="fa fa-close"></span></a><span class="icon"><span class="' + settings.type + ' ' + icons[settings.type] + '"></span></span><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p></div>';
                },
                getNotifyConfirmTemplate: function getNotifyConfirmTemplate(settings) {
                    return '<div class="notify-and-confirm ' + this.selector + ' ' + settings.type + '" data-index="' + settings.index + '"><span class="icon"><span class="' + settings.type + ' ' + icons[settings.type] + '"></span></span><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="confirmation-buttons" ><a href="#" class="notifier-btn-confirm">Confirm</a><a href="#" class="notifier-btn-cancel">Cancel</a></div></div>';
                },
                show: function show(args) {

                    // get type
                    var type = args.type;

                    // get callbacks
                    var callbacks = this.getCallbacks(args.callbacks);

                    // set local hideAfter
                    var hideDelay = typeof args.hideAfter === 'number' ? args.hideAfter : hideAfter;

                    // initialize, if not initialized already
                    if (!this.exists()) {
                        this.init();
                    }

                    // set default notification type
                    if (!icons.hasOwnProperty(type)) {
                        type = 'info';
                    }

                    // set notification settings
                    var settings = {
                        args: {
                            title: args.title,
                            subtitle: args.subtitle
                        },
                        type: type,
                        icon: icons[type],
                        index: $('.' + this.selector).length
                    };

                    // get notification html
                    var html = this.getTemplate(settings);

                    // append notification to wrapper
                    $('.' + this.wrapper).append(html);

                    // show notification
                    var $notification = $('.' + this.selector + '[data-index="' + settings.index + '"]');
                    $notification.show();

                    // execute global show
                    _show();

                    // execute local show
                    callbacks.show();

                    // call hide action
                    this.hide(settings.index, callbacks.hide, hideDelay);

                    this.initActionHandlers($notification, callbacks.hide);
                },
                notifyAndConfirm: function notifyAndConfirm(args) {

                    // get type
                    var type = args.type || 'info';

                    // get callbacks
                    var callbacks = this.getCallbacks(args.callbacks);

                    // set local hideAfter
                    var hideDelay = typeof args.hideAfter === 'number' ? args.hideAfter : hideAfter;

                    // initialize, if not initialized already
                    if (!this.exists()) {
                        this.init();
                    }

                    // set default notification type
                    if (!icons.hasOwnProperty(type)) {
                        type = 'info';
                    }

                    // set notification settings
                    var settings = {
                        args: {
                            title: args.title,
                            subtitle: args.subtitle
                        },
                        type: type,
                        icon: icons[type],
                        index: $('.' + this.selector).length
                    };

                    // get notification html
                    var html = this.getNotifyConfirmTemplate(settings);

                    // append notification to wrapper
                    $('.' + this.wrapper).append(html);

                    // show notification
                    var $notification = $('.' + this.selector + '[data-index="' + settings.index + '"]');
                    $notification.show();

                    // execute global show
                    _show();

                    // execute local show
                    callbacks.show();

                    // assign event handler
                    $notification.find('.notifier-btn-confirm').on('click', function (e) {
                        e.preventDefault();
                        // hide confirmation
                        $notification.hide();
                        $notification.remove();

                        // execute onConfirm callback
                        callbacks.onConfirm();
                    });

                    // assign event handler
                    $notification.find('.notifier-btn-cancel').on('click', function (e) {
                        // prevent default action
                        e.preventDefault();

                        // hide confirmation
                        $notification.hide();
                        $notification.remove();

                        // execute onCancel callback
                        callbacks.onCancel();
                    });
                },
                hide: function hide(index, callback, hideDelay) {
                    var that = this;

                    setTimeout(function () {
                        if ($('.' + that.selector + '[data-index="' + index + '"]:hover').length != 0) {

                            // call hide recursively
                            that.hide(index, callback);
                        } else {

                            // hide notification
                            var $notification = $('.' + that.selector + '[data-index="' + index + '"]');

                            $notification.hide();

                            // execute global hide
                            _hide();

                            // execute local hide
                            callback();
                        }
                    }, hideDelay);
                },
                initActionHandlers: function initActionHandlers($notification, callback) {
                    $notification.on('click', '.trigger.close-notification', function (e) {
                        e.preventDefault();
                        $notification.hide();

                        // execute global hide
                        _hide();

                        // execute local hide
                        callback();
                    });
                }
            };
        }();

        // @private confirmation
        var confirmation = function () {
            var obj = {};
            $.extend(obj, notification);

            obj.btnCancelSelector = 'notifier-btn-cancel';
            obj.btnConfirmSelector = 'notifier-btn-confirm';
            obj.confirmWrapper = 'confirmations';
            obj.confirmSelector = 'confirmation';

            obj.init = function () {
                var $globalWrapper = $(this.globalWrapper);
                $globalWrapper.css({ position: 'relative' });
                $globalWrapper.append('<div class="' + this.confirmWrapper + '"></div>');
            };

            obj.getConfirmTemplate = function (settings) {
                return '<div class="' + this.confirmSelector + ' ' + settings.type + '" data-index="' + settings.index + '"><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="confirmation-buttons" ><a href="#" class="' + obj.btnConfirmSelector + '">Confirm</a><a href="#" class="' + obj.btnCancelSelector + '">Cancel</a></div></div>';
            };

            obj.initActionHandlers = function ($confirmWrapper, $notification, onConfirm, onCancel) {

                $('.' + obj.btnConfirmSelector).on('click', function (e) {
                    e.preventDefault();
                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onConfirm callback
                    onConfirm();
                });

                $('.' + obj.btnCancelSelector).on('click', function (e) {
                    // prevent default action
                    e.preventDefault();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onCancel callback
                    onCancel();
                });
            };

            obj.confirm = function (args) {
                icons.confirm = icons.warning;

                // get type
                var type = 'confirm';

                // get callbacks
                var onConfirm = this.getCallback(args.onConfirm);

                var onCancel = this.getCallback(args.onCancel);

                // initialize, if not initialized already
                this.init();

                // set notification settings
                var settings = {
                    args: {
                        title: args.title,
                        subtitle: args.subtitle
                    },
                    type: type,
                    icon: icons[type],
                    index: $('.' + this.confirmSelector).length
                };

                var $confirmWrapper = $('.' + this.confirmWrapper);

                // get notification html
                var html = this.getConfirmTemplate(settings);

                // remove existing confirm messages
                $confirmWrapper.empty();

                // append notification to wrapper
                $confirmWrapper.append(html);

                // show notification
                var $notification = $('.' + this.confirmSelector + '[data-index="' + settings.index + '"]');

                if (args.selector) {
                    $notification.addClass(args.selector);
                }

                $notification.show();

                this.initActionHandlers($confirmWrapper, $notification, onConfirm, onCancel);
            };

            return obj;
        }();

        // @private confirmData
        var confirmationData = function () {
            var obj = {};
            $.extend(obj, confirmation);

            obj.formWrapper = 'notifier-form';
            obj.input = 'notifier-input';

            obj.getConfirmTemplate = function (settings) {
                return '<div class="' + this.confirmSelector + ' ' + settings.type + '" data-index="' + settings.index + '"><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="notifier-form-wrapper"><form class="' + obj.formWrapper + '"><input class="' + obj.input + '" type="text"/></form></div><div class="confirmation-buttons" class="' + obj.btnConfirmSelector + '">Confirm</a><a href="#" class="' + obj.btnCancelSelector + '">Cancel</a></div></div>';
            };

            obj.initActionHandlers = function ($confirmWrapper, $notification, onConfirm, onCancel) {

                $('.' + obj.btnConfirmSelector).on('click', function (e) {
                    e.preventDefault();
                    var userInput = $('.notifier-form').find('input').val();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onConfirm callback
                    onConfirm(userInput);
                });

                $('.' + obj.btnCancelSelector).on('click', function (e) {
                    // prevent default action
                    e.preventDefault();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    onCancel();
                });
            };

            return obj;
        }();

        // @public notify
        var notify = function notify(args) {

            // set args
            args = (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification on event, if client has defined an event
            if (typeof args.showOnEvent !== 'undefined' && args.showOnEvent.length > 0) {
                $(document).on(args.showOnEvent, function () {
                    // show notification with delay
                    setTimeout(function () {
                        notification.show(args);
                    }, delay);
                });
            } else {
                // show notification with delay
                setTimeout(function () {
                    notification.show(args);
                }, delay);
            }

            // enable cascade
            return this;
        };

        // @public confirm
        var confirm = function confirm(args) {

            // set args
            args = (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function () {
                confirmation.confirm(args);
            }, delay);

            // enable cascade
            return this;
        };

        // @public notifyAndConfirm
        var notifyAndConfirm = function notifyAndConfirm(args) {

            // set args
            args = (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function () {
                notification.notifyAndConfirm(args);
            }, delay);

            // enable cascade
            return this;
        };

        // @public confirmData
        var confirmData = function confirmData(args) {

            // set args
            args = (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function () {
                confirmationData.confirm(args);
            }, delay);

            // enable cascade
            return this;
        };

        // @public init
        var init = function init(args) {

            // configure args
            args = (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' ? args : {};

            // update show callback, if the client has provided one
            if (typeof args.show === 'function') {
                _show = args.show;
            }

            // update hide callback, if the client has provided one
            if (typeof args.hide === 'function') {
                _hide = args.hide;
            }

            // update icons, if the client has provided icons
            if (_typeof(args.icons) === 'object') {
                icons = args.icons;
            }

            // update hideAfter, if the client has provided one
            if (typeof args.hideAfter === 'number') {
                hideAfter = args.hideAfter;
            }

            // enable cascade
            return this;
        };

        // notify
        return {
            init: init,
            notify: notify,
            confirm: confirm,
            notifyAndConfirm: notifyAndConfirm
        };
    }();
})(window);
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory();
})(window, function () {
    'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function some(fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    var some$1 = some;

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);

            if (m._strict) {
                isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (_typeof(arguments[i]) === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function keys(obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var keys$1 = keys;

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({ unit: u, priority: priorities[u] });
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if ((typeof units === 'undefined' ? 'undefined' : _typeof(units)) === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function func() {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1 = /\d/; //       0 - 9
    var match2 = /\d\d/; //      00 - 99
    var match3 = /\d{3}/; //     000 - 999
    var match4 = /\d{4}/; //    0000 - 9999
    var match6 = /[+-]?\d{6}/; // -999999 - 999999
    var match1to2 = /\d\d?/; //       0 - 99
    var match3to4 = /\d\d\d\d?/; //     999 - 9999
    var match5to6 = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3 = /\d{1,3}/; //       0 - 999
    var match1to4 = /\d{1,4}/; //       0 - 9999
    var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

    var matchUnsigned = /\d+/; //       0 - inf
    var matchSigned = /[+-]?\d+/; //    -inf - inf

    var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return isStrict && strictRegex ? strictRegex : regex;
        };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function func(input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function indexOf(o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    var indexOf$1 = indexOf;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months) ? this._months : this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,

        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays(m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays : this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] : this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort(m) {
        return m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin(m) {
        return m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // months
    // week
    // weekdays
    // meridiem
    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    if (!localeFamilies[config.parentLocale]) {
                        localeFamilies[config.parentLocale] = [];
                    }
                    localeFamilies[config.parentLocale].push({
                        name: name,
                        config: config
                    });
                    return null;
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys$1(locales);
    }

    function checkOverflow(m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/]];

    // iso time formats and regexes
    var isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var string, match, dayFormat, dateFormat, timeFormat, tzFormat;
        var timezones = {
            ' GMT': ' +0000',
            ' EDT': ' -0400',
            ' EST': ' -0500',
            ' CDT': ' -0500',
            ' CST': ' -0600',
            ' MDT': ' -0600',
            ' MST': ' -0700',
            ' PDT': ' -0700',
            ' PST': ' -0800'
        };
        var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
        var timezone, timezoneIndex;

        string = config._i.replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
        match = basicRfcRegex.exec(string);

        if (match) {
            dayFormat = match[1] ? 'ddd' + (match[1].length === 5 ? ', ' : ' ') : '';
            dateFormat = 'D MMM ' + (match[2].length > 10 ? 'YYYY ' : 'YY ');
            timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            if (match[1]) {
                // day of week given
                var momentDate = new Date(match[2]);
                var momentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][momentDate.getDay()];

                if (match[1].substr(0, 3) !== momentDay) {
                    getParsingFlags(config).weekdayMismatch = true;
                    config._isValid = false;
                    return;
                }
            }

            switch (match[5].length) {
                case 2:
                    // military
                    if (timezoneIndex === 0) {
                        timezone = ' +0000';
                    } else {
                        timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                        timezone = (timezoneIndex < 0 ? ' -' : ' +') + ('' + timezoneIndex).replace(/^-?/, '0').match(/..$/)[0] + '00';
                    }
                    break;
                case 4:
                    // Zone
                    timezone = timezones[match[5]];
                    break;
                default:
                    // UT or +/-9999
                    timezone = timezones[' GMT'];
            }
            match[5] = timezone;
            config._i = match.splice(1).join('');
            tzFormat = ' ZZ';
            config._f = dayFormat + dateFormat + timeFormat + tzFormat;
            configFromStringAndFormat(config);
            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged and will be removed in an upcoming major release. Please refer to ' + 'http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    });

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || format === undefined && input === '') {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    });

    var prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function now() {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,

        // matching against regexp is expensive, do it on demand
        match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign)
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if ((typeof duration === 'undefined' ? 'undefined' : _typeof(duration)) === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = { milliseconds: 0, months: 0 };

        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val;val = period;period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1(time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) && (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),

        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString() {
        if (!this.isValid()) {
            return null;
        }
        var m = this.clone().utc();
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            return this.toDate().toISOString();
        }
        return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
            return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
            return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    });

    function localeData() {
        return this._locale;
    }

    function startOf(units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
            /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
            /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
            /* falls through */
            case 'hour':
                this.minutes(0);
            /* falls through */
            case 'minute':
                this.seconds(0);
            /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIOROITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;

    // Year
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;

    // Week Year
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    proto.quarter = proto.quarters = getSetQuarter;

    // Month
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;

    // Week
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;

    // Hour
    proto.hour = proto.hours = getSetHour;

    // Minute
    proto.minute = proto.minutes = getSetMinute;

    // Second
    proto.second = proto.seconds = getSetSecond;

    // Millisecond
    proto.millisecond = proto.milliseconds = getSetMillisecond;

    // Offset
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;

    // Timezone
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;

    // Deprecations
    proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;

    // Month
    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;

    // Week
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    // Hours
    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function ordinal(number) {
            var b = number % 10,
                output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds = makeAs('s');
    var asMinutes = makeAs('m');
    var asHours = makeAs('h');
    var asDays = makeAs('d');
    var asWeeks = makeAs('w');
    var asMonths = makeAs('M');
    var asYears = makeAs('y');

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds = makeGetter('seconds');
    var minutes = makeGetter('minutes');
    var hours = makeGetter('hours');
    var days = makeGetter('days');
    var months = makeGetter('months');
    var years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44, // a few seconds to seconds
        s: 45, // seconds to minute
        m: 45, // minutes to hour
        h: 22, // hours to day
        d: 26, // days to month
        M: 11 // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days] || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days = abs$1(this._days);
        var months = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + (h || m || s ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    // Deprecations
    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.18.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    return hooks;
});
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! rangeslider.js - v2.3.0 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    'use strict';

    // Polyfill Number.isNaN(value)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN

    Number.isNaN = Number.isNaN || function (value) {
        return typeof value === 'number' && value !== value;
    };

    /**
     * Range feature detection
     * @return {Boolean}
     */
    function supportsRange() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type !== 'text';
    }

    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        hasInputRangeSupport = supportsRange(),
        defaults = {
        polyfill: true,
        orientation: 'horizontal',
        rangeClass: 'rangeslider',
        disabledClass: 'rangeslider--disabled',
        activeClass: 'rangeslider--active',
        horizontalClass: 'rangeslider--horizontal',
        verticalClass: 'rangeslider--vertical',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        startEvent: ['mousedown', 'touchstart', 'pointerdown'],
        moveEvent: ['mousemove', 'touchmove', 'pointermove'],
        endEvent: ['mouseup', 'touchend', 'pointerup']
    },
        constants = {
        orientation: {
            horizontal: {
                dimension: 'width',
                direction: 'left',
                directionStyle: 'left',
                coordinate: 'x'
            },
            vertical: {
                dimension: 'height',
                direction: 'top',
                directionStyle: 'bottom',
                coordinate: 'y'
            }
        }
    };

    /**
     * Delays a function for the given number of milliseconds, and then calls
     * it with the arguments supplied.
     *
     * @param  {Function} fn   [description]
     * @param  {Number}   wait [description]
     * @return {Function}
     */
    function delay(fn, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function () {
            return fn.apply(null, args);
        }, wait);
    }

    /**
     * Returns a debounced function that will make sure the given
     * function is not triggered too much.
     *
     * @param  {Function} fn Function to debounce.
     * @param  {Number}   debounceDuration OPTIONAL. The amount of time in milliseconds for which we will debounce the function. (defaults to 100ms)
     * @return {Function}
     */
    function debounce(fn, debounceDuration) {
        debounceDuration = debounceDuration || 100;
        return function () {
            if (!fn.debouncing) {
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function () {
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return element && (element.offsetWidth === 0 || element.offsetHeight === 0 ||
        // Also Consider native `<details>` elements.
        element.open === false);
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle = [],
            dimension = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = element.open ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    /**
     * Returns the parsed float or the default if it failed.
     *
     * @param  {String}  str
     * @param  {Number}  defaultValue
     * @return {Number}
     */
    function tryParseFloat(str, defaultValue) {
        var value = parseFloat(str);
        return Number.isNaN(value) ? defaultValue : value;
    }

    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.$window = $(window);
        this.$document = $(document);
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this.polyfill = this.options.polyfill;
        this.orientation = this.$element[0].getAttribute('data-orientation') || this.options.orientation;
        this.onInit = this.options.onInit;
        this.onSlide = this.options.onSlide;
        this.onSlideEnd = this.options.onSlideEnd;
        this.DIMENSION = constants.orientation[this.orientation].dimension;
        this.DIRECTION = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE = constants.orientation[this.orientation].coordinate;

        // Plugin should only be used as a polyfill
        if (this.polyfill) {
            // Input range support?
            if (hasInputRangeSupport) {
                return false;
            }
        }

        this.identifier = 'js-' + pluginName + '-' + pluginIdentifier++;
        this.startEvent = this.options.startEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.moveEvent = this.options.moveEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.endEvent = this.options.endEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.toFixed = (this.step + '').replace('.', '').length - 1;
        this.$fill = $('<div class="' + this.options.fillClass + '" />');
        this.$handle = $('<div class="' + this.options.handleClass + '" />');
        this.$range = $('<div class="' + this.options.rangeClass + ' ' + this.options[this.orientation + 'Class'] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle);

        // visually hide the input
        this.$element.css({
            'position': 'absolute',
            'width': '1px',
            'height': '1px',
            'overflow': 'hidden',
            'opacity': '0'
        });

        // Store context
        this.handleDown = $.proxy(this.handleDown, this);
        this.handleMove = $.proxy(this.handleMove, this);
        this.handleEnd = $.proxy(this.handleEnd, this);

        this.init();

        // Attach Events
        var _this = this;
        this.$window.on('resize.' + this.identifier, debounce(function () {
            // Simulate resizeEnd event.
            delay(function () {
                _this.update(false, false);
            }, 300);
        }, 20));

        this.$document.on(this.startEvent, '#' + this.identifier + ':not(.' + this.options.disabledClass + ')', this.handleDown);

        // Listen to programmatic value changes
        this.$element.on('change.' + this.identifier, function (e, data) {
            if (data && data.origin === _this.identifier) {
                return;
            }

            var value = e.target.value,
                pos = _this.getPositionFromValue(value);
            _this.setPosition(pos);
        });
    }

    Plugin.prototype.init = function () {
        this.update(true, false);

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.update = function (updateAttributes, triggerSlide) {
        updateAttributes = updateAttributes || false;

        if (updateAttributes) {
            this.min = tryParseFloat(this.$element[0].getAttribute('min'), 0);
            this.max = tryParseFloat(this.$element[0].getAttribute('max'), 100);
            this.value = tryParseFloat(this.$element[0].value, Math.round(this.min + (this.max - this.min) / 2));
            this.step = tryParseFloat(this.$element[0].getAttribute('step'), 1);
        }

        this.handleDimension = getDimension(this.$handle[0], 'offset' + ucfirst(this.DIMENSION));
        this.rangeDimension = getDimension(this.$range[0], 'offset' + ucfirst(this.DIMENSION));
        this.maxHandlePos = this.rangeDimension - this.handleDimension;
        this.grabPos = this.handleDimension / 2;
        this.position = this.getPositionFromValue(this.value);

        // Consider disabled state
        if (this.$element[0].disabled) {
            this.$range.addClass(this.options.disabledClass);
        } else {
            this.$range.removeClass(this.options.disabledClass);
        }

        this.setPosition(this.position, triggerSlide);
    };

    Plugin.prototype.handleDown = function (e) {
        e.preventDefault();
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);

        // add active class because Firefox is ignoring
        // the handle:active pseudo selector because of `e.preventDefault();`
        this.$range.addClass(this.options.activeClass);

        // If we click on the handle don't set the new position
        if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(this.options.handleClass) > -1) {
            return;
        }

        var pos = this.getRelativePosition(e),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            handlePos = this.getPositionFromNode(this.$handle[0]) - rangePos,
            setPos = this.orientation === 'vertical' ? this.maxHandlePos - (pos - this.grabPos) : pos - this.grabPos;

        this.setPosition(setPos);

        if (pos >= handlePos && pos < handlePos + this.handleDimension) {
            this.grabPos = pos - handlePos;
        }
    };

    Plugin.prototype.handleMove = function (e) {
        e.preventDefault();
        var pos = this.getRelativePosition(e);
        var setPos = this.orientation === 'vertical' ? this.maxHandlePos - (pos - this.grabPos) : pos - this.grabPos;
        this.setPosition(setPos);
    };

    Plugin.prototype.handleEnd = function (e) {
        e.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);

        this.$range.removeClass(this.options.activeClass);

        // Ok we're done fire the change event
        this.$element.trigger('change', { origin: this.identifier });

        if (this.onSlideEnd && typeof this.onSlideEnd === 'function') {
            this.onSlideEnd(this.position, this.value);
        }
    };

    Plugin.prototype.cap = function (pos, min, max) {
        if (pos < min) {
            return min;
        }
        if (pos > max) {
            return max;
        }
        return pos;
    };

    Plugin.prototype.setPosition = function (pos, triggerSlide) {
        var value, newPos;

        if (triggerSlide === undefined) {
            triggerSlide = true;
        }

        // Snapping steps
        value = this.getValueFromPosition(this.cap(pos, 0, this.maxHandlePos));
        newPos = this.getPositionFromValue(value);

        // Update ui
        this.$fill[0].style[this.DIMENSION] = newPos + this.grabPos + 'px';
        this.$handle[0].style[this.DIRECTION_STYLE] = newPos + 'px';
        this.setValue(value);

        // Update globals
        this.position = newPos;
        this.value = value;

        if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
            this.onSlide(newPos, value);
        }
    };

    // Returns element position relative to the parent
    Plugin.prototype.getPositionFromNode = function (node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };

    Plugin.prototype.getRelativePosition = function (e) {
        // Get the offset DIRECTION relative to the viewport
        var ucCoordinate = ucfirst(this.COORDINATE),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            pageCoordinate = 0;

        if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent['client' + ucCoordinate];
        } else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
        } else if (e.currentPoint && typeof e.currentPoint[this.COORDINATE] !== 'undefined') {
            pageCoordinate = e.currentPoint[this.COORDINATE];
        }

        return pageCoordinate - rangePos;
    };

    Plugin.prototype.getPositionFromValue = function (value) {
        var percentage, pos;
        percentage = (value - this.min) / (this.max - this.min);
        pos = !Number.isNaN(percentage) ? percentage * this.maxHandlePos : 0;
        return pos;
    };

    Plugin.prototype.getValueFromPosition = function (pos) {
        var percentage, value;
        percentage = pos / (this.maxHandlePos || 1);
        value = this.step * Math.round(percentage * (this.max - this.min) / this.step) + this.min;
        return Number(value.toFixed(this.toFixed));
    };

    Plugin.prototype.setValue = function (value) {
        if (value === this.value && this.$element[0].value !== '') {
            return;
        }

        // Set the new value and fire the `input` event
        this.$element.val(value).trigger('input', { origin: this.identifier });
    };

    Plugin.prototype.destroy = function () {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$element.off('.' + this.identifier).removeAttr('style').removeData('plugin_' + pluginName);

        // Remove the generated markup
        if (this.$range && this.$range.length) {
            this.$range[0].parentNode.removeChild(this.$range[0]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                data = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, data = new Plugin(this, options));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    return 'rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);';
});
;"use strict";

// Sequence
// Exposes methods for synchronous distribution of asynchronous functions

(function (base) {
    "use strict";

    base.sequence = function () {
        return function () {
            var chained = [];
            var value = void 0;
            var error = void 0;

            var chain = function chain(func) {
                if (chained) {
                    chained.push(func);
                }
                return this;
            };

            var execute = function execute(index) {
                var callback = void 0;
                index = typeof index === "number" ? index : 0;
                if (!chained || index >= chained.length) {
                    return true;
                }

                callback = chained[index];
                callback({
                    resolve: function resolve(_value) {
                        value = _value;
                        execute(++index);
                    },
                    reject: function reject(_error) {
                        error = _error;
                        execute(++index);
                    },
                    response: {
                        value: value,
                        error: error
                    }
                });
            };

            return {
                chain: chain,
                execute: execute
            };
        };
    }();
})(window);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (base) {
    /**
     * Plugin: Slick Modal
     * Author: Neven Dyulgerov
     * v1.0.0
     *
     * Provides modal functionality, available via the global function slickModal()
     * Dependencies: jQuery, Initialzr
     * Released under the MIT license
     *
     * slickModal takes an options object, which should contain:
     * @prop title {string}{optional}
     * @prop content {string}{optional}
     * @prop cancelText {string}{optional}
     * @prop confirmText {string}{optional}
     * @prop easyClose {boolean}{optional} - enables close via click outside of modal
     * @prop asyncConfirm {boolean}{optional} - enables async checks, fired via beforeConfirm callback
     *
     * @prop callbacks {object}{optional}
     *  @callback show {void} - triggers on show
     *  @callback cancel {void} - triggers on cancel
     *  @callback confirm {void} - triggers on confirm
     *  @callback beforeConfirm {return boolean} - triggers before confirm, validates if the modal can be closed
     */

    var slick = initialzr().schema('default');

    slick.configure("events").node("onCancel", function (clb) {
        $('.slick-modal').find('.cancel').on('click', clb);
    }).node("onConfirm", function (clb) {
        $('.slick-modal').find('.confirm').on('click', clb);
    }).node("onClose", function (clb) {
        $('.slick-modal').find('.close').on('click', clb);
    }).node("onToggleFullscreen", function (clb) {
        $('.slick-modal').find('.trigger.fullscreen').on('click', clb);
    }).node("onAnyClick", function (clb) {
        $(document).on('click', clb);
    });

    slick.configure("renderers").node("append", function (slickEl) {
        var $body = $('body'),
            $slick = $('.slick-modal');
        if ($slick.length > 0) {
            $slick.remove();
        }
        $body.append(slickEl);
        if ($body.find('.slick-modal-overlay').length === 0) {
            $body.append('<div class="slick-modal-overlay"></div>');
        }
    }).node("show", function (clb) {
        var $body = $('body');
        $body.find('.slick-modal-overlay').addClass('active');
        $body.find('.slick-modal').addClass('active');
        clb();
    }).node("hide", function (clb) {
        var $body = $('body');
        $body.find('.slick-modal-overlay').removeClass('active');
        $body.find('.slick-modal').removeClass('active');
        clb();
    });

    slick.configure("actions").node("createSlick", function (opts) {
        var templ = '' + '<div class="slick-modal {selector}">' + '<div class="modal-header"><div class="title"><h2>{title}</h2></div>{fullscreen}<a href="#" class="trigger close" title="Close window"><span class="icon">+</span></a></div>' + '<div class="modal-body"><div class="modal-content">{content}</div></div>' + '<div class="modal-footer">{cancelBtn}{confirmBtn}</div>' + '</div>';
        return templ.replace("{selector}", opts.selector).replace("{title}", opts.title).replace("{fullscreen}", opts.hasFullscreen ? '<a href="#" class="trigger fullscreen" title="Toggle fullscreen"><span class="icon"></span></a>' : '').replace("{content}", opts.content).replace("{cancelBtn}", opts.cancelText ? '<a href="#" class="trigger cancel">' + opts.cancelText + '</a>' : '').replace("{confirmBtn}", opts.confirmText ? '<a href="#" class="trigger confirm">' + opts.confirmText + '</a>' : '');
    }).node("toggleBody", function () {
        "use strict";

        var bodyStyle = $('body')[0].style;
        return function (isOn) {
            bodyStyle.overflowY = isOn ? 'auto' : 'hidden';
        };
    }).node("init", function (options) {
        var app = slick.getNodes();
        var opts = {};
        var $slick = void 0;
        var toggleBody = app.actions.toggleBody();
        opts.title = options.title || "";
        opts.content = options.content || "";
        opts.selector = options.selector || "";
        opts.cancelText = options.cancelText;
        opts.confirmText = options.confirmText;
        opts.hasClbs = _typeof(options.callbacks) === "object";
        opts.hasFullscreen = typeof options.fullscreen === "boolean" && options.fullscreen;
        opts.isEasyCls = typeof options.easyClose === "boolean" && options.easyClose;
        opts.isAsyncConfirm = typeof options.asyncConfirm === "boolean" && options.asyncConfirm;
        opts.clbs = {
            show: opts.hasClbs && typeof options.callbacks.show === "function" ? options.callbacks.show : function () {},
            cancel: opts.hasClbs && typeof options.callbacks.cancel === "function" ? options.callbacks.cancel : function () {},
            confirm: opts.hasClbs && typeof options.callbacks.confirm === "function" ? options.callbacks.confirm : function () {},
            beforeConfirm: opts.hasClbs && typeof options.callbacks.beforeConfirm === "function" ? options.callbacks.beforeConfirm : function () {
                return true;
            }
        };

        app.renderers.append(app.actions.createSlick(opts));
        $slick = $('.slick-modal');
        app.renderers.show(function () {
            opts.clbs.show();
            toggleBody(false);
        });

        app.events.onCancel(function (e) {
            e.preventDefault();
            app.renderers.hide(opts.clbs.cancel);
            toggleBody(true);
        });

        app.events.onConfirm(function (e) {
            e.preventDefault();

            if (opts.isAsyncConfirm) {
                return opts.clbs.beforeConfirm(function (canHide) {
                    if (canHide) {
                        app.renderers.hide(opts.clbs.confirm);
                        toggleBody(true);
                    }
                });
            }

            if (opts.clbs.beforeConfirm()) {
                app.renderers.hide(opts.clbs.confirm);
                toggleBody(true);
            }
        });

        app.events.onClose(function (e) {
            e.preventDefault();
            app.renderers.hide(opts.clbs.cancel);
            toggleBody(true);
        });

        app.events.onToggleFullscreen(function (e) {
            e.preventDefault();
            if ($slick.hasClass('fullscreen')) {
                $slick.removeClass('fullscreen');
            } else {
                $slick.addClass('fullscreen');
            }
        });

        if (opts.isEasyCls) {
            app.events.onAnyClick(function () {
                if ($slick.hasClass('active') && $slick.filter(':hover').length === 0) {
                    app.renderers.hide(opts.clbs.cancel);
                    toggleBody(true);
                }
            });
        }
    });

    base.slickModal = slick.getNode("actions", "init");
})(window);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (base) {
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

    base.storage = function (key) {
        var storage;

        if (typeof key !== "string") {
            return new Error("[Storage] Invalid storage key. Provide a key{string}.");
        }

        /**
         * Private
         * Storage Templates
         */
        var storageTemplates = {
            localStorage: {
                getStorage: function getStorage() {
                    return localStorage;
                },
                setStorageItem: function setStorageItem(key, value) {
                    this.getStorage().setItem(key, value);
                },
                getStorageItem: function getStorageItem(key) {
                    return this.getStorage().getItem(key);
                },
                removeStorageItem: function removeStorageItem(key) {
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
        var _getData = function _getData(key) {
            return decodeData(storage.getStorageItem(key));
        };

        /**
         * Private
         * Set Data
         * @param key
         * @param data
         */
        var _setData = function _setData(key, data) {
            storage.setStorageItem(key, encodeData(data));
        };

        /**
         * Private
         * Remove Data
         * @param key
         */
        var _removeData = function _removeData(key) {
            storage.removeStorageItem(key);
        };

        /**
         * Private
         * Decode Data
         * @param data
         */
        var decodeData = function decodeData(data) {
            return JSON.parse(data);
        };

        /**
         * Private
         * Encode Data
         * @param data
         */
        var encodeData = function encodeData(data) {
            return JSON.stringify(data);
        };

        /**
         * Public API
         */
        return {
            setTemplate: function setTemplate(template, storageApi) {
                if (typeof template !== "string") {
                    return new Error("[Storage] Invalid template name. Provide a name{string}.");
                }
                if ((typeof storageApi === "undefined" ? "undefined" : _typeof(storageApi)) !== "object" || typeof storageApi.setStorageItem !== "function" || typeof storageApi.getStorageItem !== "function" || typeof storageApi.removeStorageItem !== "function") {
                    return new Error("[Storage] Invalid storage API. Provide an API, containing getStorageItem{function}, setStorageItem{function}, removeStorageItem{function}.");
                }
                storageTemplates[template] = storageApi;
                storage = storageApi;
                return this;
            },
            getData: function getData() {
                var data = _getData(key);
                return data !== null ? _getData(key) : undefined;
            },
            setData: function setData(newData) {
                _setData(key, newData);
                return this;
            },
            removeData: function removeData() {
                _removeData(key);
                return this;
            },
            getItem: function getItem(itemKey) {
                var data = this.getData();
                return data[itemKey];
            },
            setItem: function setItem(itemKey, itemValue) {
                var data = this.getData();
                data[itemKey] = itemValue;
                _setData(key, data);
                return this;
            },
            removeItem: function removeItem(itemKey) {
                var data = this.getData();
                data[itemKey] = undefined;
                _setData(key, data);
                return this;
            }
        };
    };
})(window);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if ("function" == typeof define && define.amd) define([], e);else {
    var r;r = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, r.Trianglify = e();
  }
}(function () {
  var e;return function r(e, n, t) {
    function f(a, i) {
      if (!n[a]) {
        if (!e[a]) {
          var u = "function" == typeof require && require;if (!i && u) return u(a, !0);if (o) return o(a, !0);var c = new Error("Cannot find module '" + a + "'");throw c.code = "MODULE_NOT_FOUND", c;
        }var s = n[a] = { exports: {} };e[a][0].call(s.exports, function (r) {
          var n = e[a][1][r];return f(n ? n : r);
        }, s, s.exports, r, e, n, t);
      }return n[a].exports;
    }for (var o = "function" == typeof require && require, a = 0; a < t.length; a++) {
      f(t[a]);
    }return f;
  }({ "./lib/trianglify.js": [function (e, r) {
      function n(e) {
        function r(e, r, n) {
          return (e - r[0]) * (n[1] - n[0]) / (r[1] - r[0]) + n[0];
        }function n(e) {
          return { x: (e[0][0] + e[1][0] + e[2][0]) / 3, y: (e[0][1] + e[1][1] + e[2][1]) / 3 };
        }function a() {
          if (e.palette instanceof Array) return e.palette[Math.floor(d() * e.palette.length)];var r = Object.keys(e.palette);return e.palette[r[Math.floor(d() * r.length)]];
        }function s(e, r) {
          var n = {};for (var t in e) {
            n[t] = e[t];
          }for (t in r) {
            if (!e.hasOwnProperty(t)) throw new Error(t + " is not a configuration option for Trianglify. Check your spelling?");n[t] = r[t];
          }return n;
        }var d;if (e = s(c, e), d = f(e.seed), "random" === e.x_colors && (e.x_colors = a()), "random" === e.y_colors && (e.y_colors = a()), "match_x" === e.y_colors && (e.y_colors = e.x_colors), !(e.width > 0 && e.height > 0)) throw new Error("Width and height must be numbers greater than 0");if (e.cell_size < 2) throw new Error("Cell size must be greater than 2.");var l;if (e.color_function) l = function l(r, n) {
          return o(e.color_function(r, n));
        };else {
          var b = o.scale(e.x_colors).mode(e.color_space),
              h = o.scale(e.y_colors).mode(e.color_space);l = function l(r, n) {
            return o.interpolate(b(r), h(n), .5, e.color_space);
          };
        }for (var g = e.width, p = e.height, m = Math.floor((g + 4 * e.cell_size) / e.cell_size), y = Math.floor((p + 4 * e.cell_size) / e.cell_size), v = (m * e.cell_size - g) / 2, w = (y * e.cell_size - p) / 2, x = e.cell_size * e.variance / 2, _ = function _(e) {
          return r(e, [-v, g + v], [0, 1]);
        }, k = function k(e) {
          return r(e, [-w, p + w], [0, 1]);
        }, j = e.points || i(g, p, v, w, e.cell_size, x, d), M = t.triangulate(j), q = [], C = function C(e) {
          return j[e];
        }, N = 0; N < M.length; N += 3) {
          var U = [M[N], M[N + 1], M[N + 2]].map(C),
              A = n(U),
              P = l(_(A.x), k(A.y)).hex();q.push([P, U]);
        }return u(q, e);
      }var t = e("delaunay-fast"),
          f = e("seedrandom"),
          o = e("chroma-js"),
          a = e("./colorbrewer"),
          i = e("./points"),
          u = e("./pattern"),
          c = { width: 600, height: 400, cell_size: 75, variance: .75, seed: null, x_colors: "random", y_colors: "match_x", palette: a, color_space: "lab", color_function: null, stroke_width: 1.51, points: void 0 };n.colorbrewer = a, n.defaults = c, r.exports = n;
    }, { "./colorbrewer": "/Users/qrohlf/Code/trianglify/lib/colorbrewer.js", "./pattern": "/Users/qrohlf/Code/trianglify/lib/pattern.js", "./points": "/Users/qrohlf/Code/trianglify/lib/points.js", "chroma-js": "/Users/qrohlf/Code/trianglify/node_modules/chroma-js/chroma.js", "delaunay-fast": "/Users/qrohlf/Code/trianglify/node_modules/delaunay-fast/delaunay.js", seedrandom: "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/index.js" }], "/Users/qrohlf/Code/trianglify/lib/colorbrewer.js": [function (e, r) {
      r.exports = { YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"], YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"], BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"], PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"], PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"], BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"], RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"], PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"], OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"], YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"], YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"], Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"], Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"], Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"], Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"], Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"], Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"], PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"], BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"], PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"], PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"], RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"], RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"], RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"], Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"], RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"] };
    }, {}], "/Users/qrohlf/Code/trianglify/lib/pattern.js": [function (e, r) {
      (function (n) {
        function t(r, t) {
          function o(e) {
            var n = f.createElementNS("http://www.w3.org/2000/svg", "svg");return n.setAttribute("width", t.width), n.setAttribute("height", t.height), e && e.includeNamespace && n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), r.forEach(function (e) {
              var r = f.createElementNS("http://www.w3.org/2000/svg", "path");r.setAttribute("d", "M" + e[1].join("L") + "Z"), r.setAttribute("fill", e[0]), r.setAttribute("stroke", e[0]), r.setAttribute("stroke-width", t.stroke_width), n.appendChild(r);
            }), n;
          }function a(o) {
            var a;if ("undefined" != typeof n) try {
              e("canvas");
            } catch (i) {
              throw Error("The optional node-canvas dependency is needed for Trianglify to render using canvas in node.");
            }return o || (o = f.createElement("canvas")), o.setAttribute("width", t.width), o.setAttribute("height", t.height), a = o.getContext("2d"), a.canvas.width = t.width, a.canvas.height = t.height, r.forEach(function (e) {
              a.fillStyle = a.strokeStyle = e[0], a.lineWidth = t.stroke_width, a.beginPath(), a.moveTo.apply(a, e[1][0]), a.lineTo.apply(a, e[1][1]), a.lineTo.apply(a, e[1][2]), a.fill(), a.stroke();
            }), o;
          }function i() {
            return a().toDataURL("image/png");
          }return { polys: r, opts: t, svg: o, canvas: a, png: i };
        }var f = "undefined" != typeof document ? document : e("jsdom").jsdom("<html/>");r.exports = t;
      }).call(this, e("_process"));
    }, { _process: "/Users/qrohlf/Code/trianglify/node_modules/process/browser.js", canvas: "/Users/qrohlf/Code/trianglify/node_modules/browser-resolve/empty.js", jsdom: "/Users/qrohlf/Code/trianglify/node_modules/browser-resolve/empty.js" }], "/Users/qrohlf/Code/trianglify/lib/points.js": [function (e, r) {
      function n(e, r, n, t, f, o, a) {
        for (var i = e + n, u = r + t, c = .5 * f, s = 2 * o, d = -o, l = [], b = -n; i > b; b += f) {
          for (var h = -t; u > h; h += f) {
            var g = b + c + (a() * s + d),
                p = h + c + (a() * s + d);l.push([Math.floor(g), Math.floor(p)]);
          }
        }return l;
      }r.exports = n;
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/browser-resolve/empty.js": [function () {}, {}], "/Users/qrohlf/Code/trianglify/node_modules/chroma-js/chroma.js": [function (r, n, t) {
      (function () {
        var r, f, o, a, i, u, c, _s, d, l, b, h, g, p, m, y, v, w, x, _, k, j, M, q, C, N, U, A, P, G, E, z, B, I, R, S, O, T, Y;l = function l(e, n, t, f) {
          return new r(e, n, t, f);
        }, "undefined" != typeof n && null !== n && null != n.exports && (n.exports = l), "function" == typeof e && e.amd ? e([], function () {
          return l;
        }) : (I = "undefined" != typeof t && null !== t ? t : this, I.chroma = l), l.color = function (e, n, t, f) {
          return new r(e, n, t, f);
        }, l.hsl = function (e, n, t, f) {
          return new r(e, n, t, f, "hsl");
        }, l.hsv = function (e, n, t, f) {
          return new r(e, n, t, f, "hsv");
        }, l.rgb = function (e, n, t, f) {
          return new r(e, n, t, f, "rgb");
        }, l.hex = function (e) {
          return new r(e);
        }, l.css = function (e) {
          return new r(e);
        }, l.lab = function (e, n, t) {
          return new r(e, n, t, "lab");
        }, l.lch = function (e, n, t) {
          return new r(e, n, t, "lch");
        }, l.hsi = function (e, n, t) {
          return new r(e, n, t, "hsi");
        }, l.gl = function (e, n, t, f) {
          return new r(255 * e, 255 * n, 255 * t, f, "gl");
        }, l.interpolate = function (e, n, t, f) {
          return null == e || null == n ? "#000" : ("string" === R(e) && (e = new r(e)), "string" === R(n) && (n = new r(n)), e.interpolate(t, n, f));
        }, l.mix = l.interpolate, l.contrast = function (e, n) {
          var t, f;return "string" === R(e) && (e = new r(e)), "string" === R(n) && (n = new r(n)), t = e.luminance(), f = n.luminance(), t > f ? (t + .05) / (f + .05) : (f + .05) / (t + .05);
        }, l.luminance = function (e) {
          return l(e).luminance();
        }, l._Color = r, r = function () {
          function e() {
            var e, r, n, t, f, o, a, i, u, c, s, d, l, h, g, p;for (f = this, n = [], c = 0, s = arguments.length; s > c; c++) {
              r = arguments[c], null != r && n.push(r);
            }if (0 === n.length) d = [255, 0, 255, 1, "rgb"], a = d[0], i = d[1], u = d[2], e = d[3], t = d[4];else if ("array" === R(n[0])) {
              if (3 === n[0].length) l = n[0], a = l[0], i = l[1], u = l[2], e = 1;else {
                if (4 !== n[0].length) throw "unknown input argument";h = n[0], a = h[0], i = h[1], u = h[2], e = h[3];
              }t = null != (g = n[1]) ? g : "rgb";
            } else "string" === R(n[0]) ? (a = n[0], t = "hex") : "object" === R(n[0]) ? (p = n[0]._rgb, a = p[0], i = p[1], u = p[2], e = p[3], t = "rgb") : n.length >= 3 && (a = n[0], i = n[1], u = n[2]);3 === n.length ? (t = "rgb", e = 1) : 4 === n.length ? "string" === R(n[3]) ? (t = n[3], e = 1) : "number" === R(n[3]) && (t = "rgb", e = n[3]) : 5 === n.length && (e = n[3], t = n[4]), null == e && (e = 1), "rgb" === t ? f._rgb = [a, i, u, e] : "gl" === t ? f._rgb = [255 * a, 255 * i, 255 * u, e] : "hsl" === t ? (f._rgb = v(a, i, u), f._rgb[3] = e) : "hsv" === t ? (f._rgb = w(a, i, u), f._rgb[3] = e) : "hex" === t ? f._rgb = m(a) : "lab" === t ? (f._rgb = _(a, i, u), f._rgb[3] = e) : "lch" === t ? (f._rgb = M(a, i, u), f._rgb[3] = e) : "hsi" === t && (f._rgb = y(a, i, u), f._rgb[3] = e), o = b(f._rgb);
          }return e.prototype.rgb = function () {
            return this._rgb.slice(0, 3);
          }, e.prototype.rgba = function () {
            return this._rgb;
          }, e.prototype.hex = function () {
            return U(this._rgb);
          }, e.prototype.toString = function () {
            return this.name();
          }, e.prototype.hsl = function () {
            return P(this._rgb);
          }, e.prototype.hsv = function () {
            return G(this._rgb);
          }, e.prototype.lab = function () {
            return E(this._rgb);
          }, e.prototype.lch = function () {
            return z(this._rgb);
          }, e.prototype.hsi = function () {
            return A(this._rgb);
          }, e.prototype.gl = function () {
            return [this._rgb[0] / 255, this._rgb[1] / 255, this._rgb[2] / 255, this._rgb[3]];
          }, e.prototype.luminance = function (r, n) {
            var t, f, o, _a;return null == n && (n = "rgb"), arguments.length ? (0 === r && (this._rgb = [0, 0, 0, this._rgb[3]]), 1 === r && (this._rgb = [255, 255, 255, this._rgb[3]]), t = C(this._rgb), f = 1e-7, o = 20, _a = function a(e, t) {
              var i, u;return u = e.interpolate(.5, t, n), i = u.luminance(), Math.abs(r - i) < f || !o-- ? u : i > r ? _a(e, u) : _a(u, t);
            }, this._rgb = (t > r ? _a(new e("black"), this) : _a(this, new e("white"))).rgba(), this) : C(this._rgb);
          }, e.prototype.name = function () {
            var e, r;e = this.hex();for (r in l.colors) {
              if (e === l.colors[r]) return r;
            }return e;
          }, e.prototype.alpha = function (e) {
            return arguments.length ? (this._rgb[3] = e, this) : this._rgb[3];
          }, e.prototype.css = function (e) {
            var r, n, t, f;return null == e && (e = "rgb"), n = this, t = n._rgb, 3 === e.length && t[3] < 1 && (e += "a"), "rgb" === e ? e + "(" + t.slice(0, 3).map(Math.round).join(",") + ")" : "rgba" === e ? e + "(" + t.slice(0, 3).map(Math.round).join(",") + "," + t[3] + ")" : "hsl" === e || "hsla" === e ? (r = n.hsl(), f = function f(e) {
              return Math.round(100 * e) / 100;
            }, r[0] = f(r[0]), r[1] = f(100 * r[1]) + "%", r[2] = f(100 * r[2]) + "%", 4 === e.length && (r[3] = t[3]), e + "(" + r.join(",") + ")") : void 0;
          }, e.prototype.interpolate = function (r, n, t) {
            var f, o, a, i, u, c, s, d, l, b, h, g, p, m;if (d = this, null == t && (t = "rgb"), "string" === R(n) && (n = new e(n)), "hsl" === t || "hsv" === t || "lch" === t || "hsi" === t) "hsl" === t ? (p = d.hsl(), m = n.hsl()) : "hsv" === t ? (p = d.hsv(), m = n.hsv()) : "hsi" === t ? (p = d.hsi(), m = n.hsi()) : "lch" === t && (p = d.lch(), m = n.lch()), "h" === t.substr(0, 1) ? (a = p[0], h = p[1], c = p[2], i = m[0], g = m[1], s = m[2]) : (c = p[0], h = p[1], a = p[2], s = m[0], g = m[1], i = m[2]), isNaN(a) || isNaN(i) ? isNaN(a) ? isNaN(i) ? o = Number.NaN : (o = i, 1 !== c && 0 !== c || "hsv" === t || (b = g)) : (o = a, 1 !== s && 0 !== s || "hsv" === t || (b = h)) : (f = i > a && i - a > 180 ? i - (a + 360) : a > i && a - i > 180 ? i + 360 - a : i - a, o = a + r * f), null == b && (b = h + r * (g - h)), u = c + r * (s - c), l = "h" === t.substr(0, 1) ? new e(o, b, u, t) : new e(u, b, o, t);else if ("rgb" === t) p = d._rgb, m = n._rgb, l = new e(p[0] + r * (m[0] - p[0]), p[1] + r * (m[1] - p[1]), p[2] + r * (m[2] - p[2]), t);else {
              if ("lab" !== t) throw "color mode " + t + " is not supported";p = d.lab(), m = n.lab(), l = new e(p[0] + r * (m[0] - p[0]), p[1] + r * (m[1] - p[1]), p[2] + r * (m[2] - p[2]), t);
            }return l.alpha(d.alpha() + r * (n.alpha() - d.alpha())), l;
          }, e.prototype.premultiply = function () {
            var e, r;return r = this.rgb(), e = this.alpha(), l(r[0] * e, r[1] * e, r[2] * e, e);
          }, e.prototype.darken = function (e) {
            var r, n;return null == e && (e = 20), n = this, r = n.lch(), r[0] -= e, l.lch(r).alpha(n.alpha());
          }, e.prototype.darker = function (e) {
            return this.darken(e);
          }, e.prototype.brighten = function (e) {
            return null == e && (e = 20), this.darken(-e);
          }, e.prototype.brighter = function (e) {
            return this.brighten(e);
          }, e.prototype.saturate = function (e) {
            var r, n;return null == e && (e = 20), n = this, r = n.lch(), r[1] += e, l.lch(r).alpha(n.alpha());
          }, e.prototype.desaturate = function (e) {
            return null == e && (e = 20), this.saturate(-e);
          }, e;
        }(), b = function b(e) {
          var r;for (r in e) {
            3 > r ? (e[r] < 0 && (e[r] = 0), e[r] > 255 && (e[r] = 255)) : 3 === r && (e[r] < 0 && (e[r] = 0), e[r] > 1 && (e[r] = 1));
          }return e;
        }, p = function p(e) {
          var r, n, t, f, o, a, i, u;if (e = e.toLowerCase(), null != l.colors && l.colors[e]) return m(l.colors[e]);if (t = e.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
            for (f = t.slice(1, 4), n = o = 0; 2 >= o; n = ++o) {
              f[n] = +f[n];
            }f[3] = 1;
          } else if (t = e.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) for (f = t.slice(1, 5), n = a = 0; 3 >= a; n = ++a) {
            f[n] = +f[n];
          } else if (t = e.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
            for (f = t.slice(1, 4), n = i = 0; 2 >= i; n = ++i) {
              f[n] = Math.round(2.55 * f[n]);
            }f[3] = 1;
          } else if (t = e.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
            for (f = t.slice(1, 5), n = u = 0; 2 >= u; n = ++u) {
              f[n] = Math.round(2.55 * f[n]);
            }f[3] = +f[3];
          } else (t = e.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) ? (r = t.slice(1, 4), r[1] *= .01, r[2] *= .01, f = v(r), f[3] = 1) : (t = e.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) && (r = t.slice(1, 4), r[1] *= .01, r[2] *= .01, f = v(r), f[3] = +t[4]);return f;
        }, m = function m(e) {
          var r, n, t, f, o, a;if (e.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) return (4 === e.length || 7 === e.length) && (e = e.substr(1)), 3 === e.length && (e = e.split(""), e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), a = parseInt(e, 16), f = a >> 16, t = a >> 8 & 255, n = 255 & a, [f, t, n, 1];if (e.match(/^#?([A-Fa-f0-9]{8})$/)) return 9 === e.length && (e = e.substr(1)), a = parseInt(e, 16), f = a >> 24 & 255, t = a >> 16 & 255, n = a >> 8 & 255, r = 255 & a, [f, t, n, r];if (o = p(e)) return o;throw "unknown color: " + e;
        }, y = function y(e, r, n) {
          var t, f, i, u;return u = S(arguments), e = u[0], r = u[1], n = u[2], e /= 360, 1 / 3 > e ? (t = (1 - r) / 3, i = (1 + r * g(a * e) / g(o - a * e)) / 3, f = 1 - (t + i)) : 2 / 3 > e ? (e -= 1 / 3, i = (1 - r) / 3, f = (1 + r * g(a * e) / g(o - a * e)) / 3, t = 1 - (i + f)) : (e -= 2 / 3, f = (1 - r) / 3, t = (1 + r * g(a * e) / g(o - a * e)) / 3, i = 1 - (f + t)), i = q(n * i * 3), f = q(n * f * 3), t = q(n * t * 3), [255 * i, 255 * f, 255 * t];
        }, v = function v() {
          var e, r, n, t, f, o, a, i, u, c, s, d, l, b;if (l = S(arguments), t = l[0], i = l[1], o = l[2], 0 === i) a = n = e = 255 * o;else {
            for (s = [0, 0, 0], r = [0, 0, 0], c = .5 > o ? o * (1 + i) : o + i - o * i, u = 2 * o - c, t /= 360, s[0] = t + 1 / 3, s[1] = t, s[2] = t - 1 / 3, f = d = 0; 2 >= d; f = ++d) {
              s[f] < 0 && (s[f] += 1), s[f] > 1 && (s[f] -= 1), r[f] = 6 * s[f] < 1 ? u + 6 * (c - u) * s[f] : 2 * s[f] < 1 ? c : 3 * s[f] < 2 ? u + (c - u) * (2 / 3 - s[f]) * 6 : u;
            }b = [Math.round(255 * r[0]), Math.round(255 * r[1]), Math.round(255 * r[2])], a = b[0], n = b[1], e = b[2];
          }return [a, n, e];
        }, w = function w() {
          var e, r, n, t, f, o, a, i, u, c, s, d, l, b, h, g, p, m;if (d = S(arguments), t = d[0], u = d[1], s = d[2], s *= 255, 0 === u) i = n = e = s;else switch (360 === t && (t = 0), t > 360 && (t -= 360), 0 > t && (t += 360), t /= 60, f = Math.floor(t), r = t - f, o = s * (1 - u), a = s * (1 - u * r), c = s * (1 - u * (1 - r)), f) {case 0:
              l = [s, c, o], i = l[0], n = l[1], e = l[2];break;case 1:
              b = [a, s, o], i = b[0], n = b[1], e = b[2];break;case 2:
              h = [o, s, c], i = h[0], n = h[1], e = h[2];break;case 3:
              g = [o, a, s], i = g[0], n = g[1], e = g[2];break;case 4:
              p = [c, o, s], i = p[0], n = p[1], e = p[2];break;case 5:
              m = [s, o, a], i = m[0], n = m[1], e = m[2];}return i = Math.round(i), n = Math.round(n), e = Math.round(e), [i, n, e];
        }, f = 18, i = .95047, u = 1, c = 1.08883, x = function x() {
          var e, r, n, t, f, o;return o = S(arguments), f = o[0], e = o[1], r = o[2], n = Math.sqrt(e * e + r * r), t = Math.atan2(r, e) / Math.PI * 180, [f, n, t];
        }, _ = function _(e, r, n) {
          var t, f, o, a, s, d, l;return void 0 !== e && 3 === e.length && (d = e, e = d[0], r = d[1], n = d[2]), void 0 !== e && 3 === e.length && (l = e, e = l[0], r = l[1], n = l[2]), a = (e + 16) / 116, o = a + r / 500, s = a - n / 200, o = k(o) * i, a = k(a) * u, s = k(s) * c, f = T(3.2404542 * o - 1.5371385 * a - .4985314 * s), t = T(-.969266 * o + 1.8760108 * a + .041556 * s), n = T(.0556434 * o - .2040259 * a + 1.0572252 * s), [q(f, 0, 255), q(t, 0, 255), q(n, 0, 255), 1];
        }, k = function k(e) {
          return e > .206893034 ? e * e * e : (e - 4 / 29) / 7.787037;
        }, T = function T(e) {
          return Math.round(255 * (.00304 >= e ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - .055));
        }, j = function j() {
          var e, r, n, t;return t = S(arguments), n = t[0], e = t[1], r = t[2], r = r * Math.PI / 180, [n, Math.cos(r) * e, Math.sin(r) * e];
        }, M = function M(e, r, n) {
          var t, f, o, a, i, u, c;return u = j(e, r, n), t = u[0], f = u[1], o = u[2], c = _(t, f, o), i = c[0], a = c[1], o = c[2], [q(i, 0, 255), q(a, 0, 255), q(o, 0, 255)];
        }, C = function C(e, r, n) {
          var t;return t = S(arguments), e = t[0], r = t[1], n = t[2], e = N(e), r = N(r), n = N(n), .2126 * e + .7152 * r + .0722 * n;
        }, N = function N(e) {
          return e /= 255, .03928 >= e ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4);
        }, U = function U() {
          var e, r, n, t, f, o;return o = S(arguments), n = o[0], r = o[1], e = o[2], f = n << 16 | r << 8 | e, t = "000000" + f.toString(16), "#" + t.substr(t.length - 6);
        }, A = function A() {
          var e, r, n, t, f, o, a, i, u;return u = S(arguments), a = u[0], n = u[1], r = u[2], e = 2 * Math.PI, a /= 255, n /= 255, r /= 255, o = Math.min(a, n, r), f = (a + n + r) / 3, i = 1 - o / f, 0 === i ? t = 0 : (t = (a - n + (a - r)) / 2, t /= Math.sqrt((a - n) * (a - n) + (a - r) * (n - r)), t = Math.acos(t), r > n && (t = e - t), t /= e), [360 * t, i, f];
        }, P = function P(e, r, n) {
          var t, f, o, a, i, u;return void 0 !== e && e.length >= 3 && (u = e, e = u[0], r = u[1], n = u[2]), e /= 255, r /= 255, n /= 255, a = Math.min(e, r, n), o = Math.max(e, r, n), f = (o + a) / 2, o === a ? (i = 0, t = Number.NaN) : i = .5 > f ? (o - a) / (o + a) : (o - a) / (2 - o - a), e === o ? t = (r - n) / (o - a) : r === o ? t = 2 + (n - e) / (o - a) : n === o && (t = 4 + (e - r) / (o - a)), t *= 60, 0 > t && (t += 360), [t, i, f];
        }, G = function G() {
          var e, r, n, t, f, o, a, i, u, c;return c = S(arguments), a = c[0], n = c[1], e = c[2], o = Math.min(a, n, e), f = Math.max(a, n, e), r = f - o, u = f / 255, 0 === f ? (t = Number.NaN, i = 0) : (i = r / f, a === f && (t = (n - e) / r), n === f && (t = 2 + (e - a) / r), e === f && (t = 4 + (a - n) / r), t *= 60, 0 > t && (t += 360)), [t, i, u];
        }, E = function E() {
          var e, r, n, t, f, o, a;return a = S(arguments), n = a[0], r = a[1], e = a[2], n = B(n), r = B(r), e = B(e), t = O((.4124564 * n + .3575761 * r + .1804375 * e) / i), f = O((.2126729 * n + .7151522 * r + .072175 * e) / u), o = O((.0193339 * n + .119192 * r + .9503041 * e) / c), [116 * f - 16, 500 * (t - f), 200 * (f - o)];
        }, B = function B(e) {
          return (e /= 255) <= .04045 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4);
        }, O = function O(e) {
          return e > .008856 ? Math.pow(e, 1 / 3) : 7.787037 * e + 4 / 29;
        }, z = function z() {
          var e, r, n, t, f, o, a;return o = S(arguments), f = o[0], n = o[1], r = o[2], a = E(f, n, r), t = a[0], e = a[1], r = a[2], x(t, e, r);
        }, l.scale = function (e, r) {
          var n, t, f, o, a, i, u, c, s, d, b, h, g, p, m, y, v, w, x, _, k;return y = "rgb", v = l("#ccc"), k = 0, g = !1, h = [0, 1], d = [], x = !1, _ = [], m = 0, p = 1, b = !1, w = 0, s = {}, i = function i(e, r) {
            var n, t, f, o, i, u, c;if (null == e && (e = ["#ddd", "#222"]), null != e && "string" === R(e) && null != (null != (i = l.brewer) ? i[e] : void 0) && (e = l.brewer[e]), "array" === R(e)) {
              for (e = e.slice(0), n = f = 0, u = e.length - 1; u >= 0 ? u >= f : f >= u; n = u >= 0 ? ++f : --f) {
                t = e[n], "string" === R(t) && (e[n] = l(t));
              }if (null != r) _ = r;else for (_ = [], n = o = 0, c = e.length - 1; c >= 0 ? c >= o : o >= c; n = c >= 0 ? ++o : --o) {
                _.push(n / (e.length - 1));
              }
            }return a(), d = e;
          }, u = function u(e) {
            return null == e && (e = []), h = e, m = e[0], p = e[e.length - 1], a(), w = 2 === e.length ? 0 : e.length - 1;
          }, f = function f(e) {
            var r, n;if (null != h) {
              for (n = h.length - 1, r = 0; n > r && e >= h[r];) {
                r++;
              }return r - 1;
            }return 0;
          }, c = function c(e) {
            return e;
          }, n = function n(e) {
            var r, n, t, o, a;return a = e, h.length > 2 && (o = h.length - 1, r = f(e), t = h[0] + (h[1] - h[0]) * (0 + .5 * k), n = h[o - 1] + (h[o] - h[o - 1]) * (1 - .5 * k), a = m + (h[r] + .5 * (h[r + 1] - h[r]) - t) / (n - t) * (p - m)), a;
          }, o = function o(e, r) {
            var n, t, o, a, i, u, b, g, x;if (null == r && (r = !1), isNaN(e)) return v;if (r ? b = e : h.length > 2 ? (n = f(e), b = n / (w - 1)) : (b = o = m !== p ? (e - m) / (p - m) : 0, b = o = (e - m) / (p - m), b = Math.min(1, Math.max(0, b))), r || (b = c(b)), i = Math.floor(1e4 * b), s[i]) t = s[i];else {
              if ("array" === R(d)) for (a = g = 0, x = _.length - 1; x >= 0 ? x >= g : g >= x; a = x >= 0 ? ++g : --g) {
                if (u = _[a], u >= b) {
                  t = d[a];break;
                }if (b >= u && a === _.length - 1) {
                  t = d[a];break;
                }if (b > u && b < _[a + 1]) {
                  b = (b - u) / (_[a + 1] - u), t = l.interpolate(d[a], d[a + 1], b, y);break;
                }
              } else "function" === R(d) && (t = d(b));s[i] = t;
            }return t;
          }, a = function a() {
            return s = {};
          }, i(e, r), t = function t(e) {
            var r;return r = o(e), x && r[x] ? r[x]() : r;
          }, t.domain = function (e, r, n, f) {
            var o;return null == n && (n = "e"), arguments.length ? (null != r && (o = l.analyze(e, f), e = 0 === r ? [o.min, o.max] : l.limits(o, n, r)), u(e), t) : h;
          }, t.mode = function (e) {
            return arguments.length ? (y = e, a(), t) : y;
          }, t.range = function (e, r) {
            return i(e, r), t;
          }, t.out = function (e) {
            return x = e, t;
          }, t.spread = function (e) {
            return arguments.length ? (k = e, t) : k;
          }, t.correctLightness = function (e) {
            return arguments.length ? (b = e, a(), c = b ? function (e) {
              var r, n, t, f, a, i, u, c, s;for (r = o(0, !0).lab()[0], n = o(1, !0).lab()[0], u = r > n, t = o(e, !0).lab()[0], a = r + (n - r) * e, f = t - a, c = 0, s = 1, i = 20; Math.abs(f) > .01 && i-- > 0;) {
                !function () {
                  return u && (f *= -1), 0 > f ? (c = e, e += .5 * (s - e)) : (s = e, e += .5 * (c - e)), t = o(e, !0).lab()[0], f = t - a;
                }();
              }return e;
            } : function (e) {
              return e;
            }, t) : b;
          }, t.colors = function (r) {
            var n, f, o, a, i, u;if (null == r && (r = "hex"), e = [], f = [], h.length > 2) for (n = o = 1, u = h.length; u >= 1 ? u > o : o > u; n = u >= 1 ? ++o : --o) {
              f.push(.5 * (h[n - 1] + h[n]));
            } else f = h;for (a = 0, i = f.length; i > a; a++) {
              n = f[a], e.push(t(n)[r]());
            }return e;
          }, t;
        }, null == (Y = l.scales) && (l.scales = {}), l.scales.cool = function () {
          return l.scale([l.hsl(180, 1, .9), l.hsl(250, .7, .4)]);
        }, l.scales.hot = function () {
          return l.scale(["#000", "#f00", "#ff0", "#fff"], [0, .25, .75, 1]).mode("rgb");
        }, l.analyze = function (e, r, n) {
          var t, f, o, a, i, u, c;if (o = { min: Number.MAX_VALUE, max: -1 * Number.MAX_VALUE, sum: 0, values: [], count: 0 }, null == n && (n = function n() {
            return !0;
          }), t = function t(e) {
            null == e || isNaN(e) || (o.values.push(e), o.sum += e, e < o.min && (o.min = e), e > o.max && (o.max = e), o.count += 1);
          }, i = function i(e, f) {
            return n(e, f) ? null != r && "function" === R(r) ? t(r(e)) : null != r && "string" === R(r) || "number" === R(r) ? t(e[r]) : t(e) : void 0;
          }, "array" === R(e)) for (u = 0, c = e.length; c > u; u++) {
            a = e[u], i(a);
          } else for (f in e) {
            a = e[f], i(a, f);
          }return o.domain = [o.min, o.max], o.limits = function (e, r) {
            return l.limits(o, e, r);
          }, o;
        }, l.limits = function (e, r, n) {
          var t, f, o, a, i, u, c, s, d, b, h, g, p, m, y, v, w, x, _, k, j, M, q, C, N, U, A, P, G, E, z, B, I, S, O, T, Y, L, F, D, V, X, W, $, Z, H, J, K, Q, er, rr, nr, tr, fr, or, ar;if (null == r && (r = "equal"), null == n && (n = 7), "array" === R(e) && (e = l.analyze(e)), p = e.min, h = e.max, q = e.sum, U = e.values.sort(function (e, r) {
            return e - r;
          }), b = [], "c" === r.substr(0, 1) && (b.push(p), b.push(h)), "e" === r.substr(0, 1)) {
            for (b.push(p), c = A = 1, Y = n - 1; Y >= 1 ? Y >= A : A >= Y; c = Y >= 1 ? ++A : --A) {
              b.push(p + c / n * (h - p));
            }b.push(h);
          } else if ("l" === r.substr(0, 1)) {
            if (0 >= p) throw "Logarithmic scales are only possible for values > 0";for (m = Math.LOG10E * Math.log(p), g = Math.LOG10E * Math.log(h), b.push(p), c = P = 1, $ = n - 1; $ >= 1 ? $ >= P : P >= $; c = $ >= 1 ? ++P : --P) {
              b.push(Math.pow(10, m + c / n * (g - m)));
            }b.push(h);
          } else if ("q" === r.substr(0, 1)) {
            for (b.push(p), c = G = 1, Z = n - 1; Z >= 1 ? Z >= G : G >= Z; c = Z >= 1 ? ++G : --G) {
              _ = U.length * c / n, k = Math.floor(_), k === _ ? b.push(U[k]) : (j = _ - k, b.push(U[k] * j + U[k + 1] * (1 - j)));
            }b.push(h);
          } else if ("k" === r.substr(0, 1)) {
            for (v = U.length, t = new Array(v), i = new Array(n), M = !0, w = 0, o = null, o = [], o.push(p), c = E = 1, H = n - 1; H >= 1 ? H >= E : E >= H; c = H >= 1 ? ++E : --E) {
              o.push(p + c / n * (h - p));
            }for (o.push(h); M;) {
              for (s = z = 0, J = n - 1; J >= 0 ? J >= z : z >= J; s = J >= 0 ? ++z : --z) {
                i[s] = 0;
              }for (c = B = 0, K = v - 1; K >= 0 ? K >= B : B >= K; c = K >= 0 ? ++B : --B) {
                for (N = U[c], y = Number.MAX_VALUE, s = I = 0, Q = n - 1; Q >= 0 ? Q >= I : I >= Q; s = Q >= 0 ? ++I : --I) {
                  u = Math.abs(o[s] - N), y > u && (y = u, f = s);
                }i[f]++, t[c] = f;
              }for (x = new Array(n), s = S = 0, er = n - 1; er >= 0 ? er >= S : S >= er; s = er >= 0 ? ++S : --S) {
                x[s] = null;
              }for (c = O = 0, rr = v - 1; rr >= 0 ? rr >= O : O >= rr; c = rr >= 0 ? ++O : --O) {
                a = t[c], null === x[a] ? x[a] = U[c] : x[a] += U[c];
              }for (s = T = 0, L = n - 1; L >= 0 ? L >= T : T >= L; s = L >= 0 ? ++T : --T) {
                x[s] *= 1 / i[s];
              }for (M = !1, s = nr = 0, F = n - 1; F >= 0 ? F >= nr : nr >= F; s = F >= 0 ? ++nr : --nr) {
                if (x[s] !== o[c]) {
                  M = !0;break;
                }
              }o = x, w++, w > 200 && (M = !1);
            }for (d = {}, s = tr = 0, D = n - 1; D >= 0 ? D >= tr : tr >= D; s = D >= 0 ? ++tr : --tr) {
              d[s] = [];
            }for (c = fr = 0, V = v - 1; V >= 0 ? V >= fr : fr >= V; c = V >= 0 ? ++fr : --fr) {
              a = t[c], d[a].push(U[c]);
            }for (C = [], s = or = 0, X = n - 1; X >= 0 ? X >= or : or >= X; s = X >= 0 ? ++or : --or) {
              C.push(d[s][0]), C.push(d[s][d[s].length - 1]);
            }for (C = C.sort(function (e, r) {
              return e - r;
            }), b.push(C[0]), c = ar = 1, W = C.length - 1; W >= ar; c = ar += 2) {
              isNaN(C[c]) || b.push(C[c]);
            }
          }return b;
        }, l.brewer = d = { OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"], PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"], BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"], Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"], BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"], YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"], YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"], Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"], RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"], Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"], YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"], GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"], Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"], YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"], PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"], Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"], PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"], Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"], RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"], RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"], PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"], PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"], RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"], BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"], RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"], PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"], Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"], Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"], Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"], Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"], Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"], Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"], Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"], Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"] }, l.colors = h = { indigo: "#4b0082", gold: "#ffd700", hotpink: "#ff69b4", firebrick: "#b22222", indianred: "#cd5c5c", yellow: "#ffff00", mistyrose: "#ffe4e1", darkolivegreen: "#556b2f", olive: "#808000", darkseagreen: "#8fbc8f", pink: "#ffc0cb", tomato: "#ff6347", lightcoral: "#f08080", orangered: "#ff4500", navajowhite: "#ffdead", lime: "#00ff00", palegreen: "#98fb98", darkslategrey: "#2f4f4f", greenyellow: "#adff2f", burlywood: "#deb887", seashell: "#fff5ee", mediumspringgreen: "#00fa9a", fuchsia: "#ff00ff", papayawhip: "#ffefd5", blanchedalmond: "#ffebcd", chartreuse: "#7fff00", dimgray: "#696969", black: "#000000", peachpuff: "#ffdab9", springgreen: "#00ff7f", aquamarine: "#7fffd4", white: "#ffffff", orange: "#ffa500", lightsalmon: "#ffa07a", darkslategray: "#2f4f4f", brown: "#a52a2a", ivory: "#fffff0", dodgerblue: "#1e90ff", peru: "#cd853f", lawngreen: "#7cfc00", chocolate: "#d2691e", crimson: "#dc143c", forestgreen: "#228b22", darkgrey: "#a9a9a9", lightseagreen: "#20b2aa", cyan: "#00ffff", mintcream: "#f5fffa", silver: "#c0c0c0", antiquewhite: "#faebd7", mediumorchid: "#ba55d3", skyblue: "#87ceeb", gray: "#808080", darkturquoise: "#00ced1", goldenrod: "#daa520", darkgreen: "#006400", floralwhite: "#fffaf0", darkviolet: "#9400d3", darkgray: "#a9a9a9", moccasin: "#ffe4b5", saddlebrown: "#8b4513", grey: "#808080", darkslateblue: "#483d8b", lightskyblue: "#87cefa", lightpink: "#ffb6c1", mediumvioletred: "#c71585", slategrey: "#708090", red: "#ff0000", deeppink: "#ff1493", limegreen: "#32cd32", darkmagenta: "#8b008b", palegoldenrod: "#eee8aa", plum: "#dda0dd", turquoise: "#40e0d0", lightgrey: "#d3d3d3", lightgoldenrodyellow: "#fafad2", darkgoldenrod: "#b8860b", lavender: "#e6e6fa", maroon: "#800000", yellowgreen: "#9acd32", sandybrown: "#f4a460", thistle: "#d8bfd8", violet: "#ee82ee", navy: "#000080", magenta: "#ff00ff", dimgrey: "#696969", tan: "#d2b48c", rosybrown: "#bc8f8f", olivedrab: "#6b8e23", blue: "#0000ff", lightblue: "#add8e6", ghostwhite: "#f8f8ff", honeydew: "#f0fff0", cornflowerblue: "#6495ed", slateblue: "#6a5acd", linen: "#faf0e6", darkblue: "#00008b", powderblue: "#b0e0e6", seagreen: "#2e8b57", darkkhaki: "#bdb76b", snow: "#fffafa", sienna: "#a0522d", mediumblue: "#0000cd", royalblue: "#4169e1", lightcyan: "#e0ffff", green: "#008000", mediumpurple: "#9370db", midnightblue: "#191970", cornsilk: "#fff8dc", paleturquoise: "#afeeee", bisque: "#ffe4c4", slategray: "#708090", darkcyan: "#008b8b", khaki: "#f0e68c", wheat: "#f5deb3", teal: "#008080", darkorchid: "#9932cc", deepskyblue: "#00bfff", salmon: "#fa8072", darkred: "#8b0000", steelblue: "#4682b4", palevioletred: "#db7093", lightslategray: "#778899", aliceblue: "#f0f8ff", lightslategrey: "#778899", lightgreen: "#90ee90", orchid: "#da70d6", gainsboro: "#dcdcdc", mediumseagreen: "#3cb371", lightgray: "#d3d3d3", mediumturquoise: "#48d1cc", lemonchiffon: "#fffacd", cadetblue: "#5f9ea0", lightyellow: "#ffffe0", lavenderblush: "#fff0f5", coral: "#ff7f50", purple: "#800080", aqua: "#00ffff", whitesmoke: "#f5f5f5", mediumslateblue: "#7b68ee", darkorange: "#ff8c00", mediumaquamarine: "#66cdaa", darksalmon: "#e9967a", beige: "#f5f5dc", blueviolet: "#8a2be2", azure: "#f0ffff", lightsteelblue: "#b0c4de", oldlace: "#fdf5e6" }, R = function () {
          var e, r, n, t, f;for (e = {}, f = "Boolean Number String Function Array Date RegExp Undefined Null".split(" "), n = 0, t = f.length; t > n; n++) {
            r = f[n], e["[object " + r + "]"] = r.toLowerCase();
          }return function (r) {
            var n;return n = Object.prototype.toString.call(r), e[n] || "object";
          };
        }(), q = function q(e, r, n) {
          return null == r && (r = 0), null == n && (n = 1), r > e && (e = r), e > n && (e = n), e;
        }, S = function S(e) {
          return e.length >= 3 ? e : e[0];
        }, a = 2 * Math.PI, o = Math.PI / 3, g = Math.cos, _s = function s(e) {
          var r, n, t, f, o, a, i, u, c, d, b;return e = function () {
            var r, n, t;for (t = [], r = 0, n = e.length; n > r; r++) {
              f = e[r], t.push(l(f));
            }return t;
          }(), 2 === e.length ? (c = function () {
            var r, n, t;for (t = [], r = 0, n = e.length; n > r; r++) {
              f = e[r], t.push(f.lab());
            }return t;
          }(), o = c[0], a = c[1], r = function r(e) {
            var r, n;return n = function () {
              var n, t;for (t = [], r = n = 0; 2 >= n; r = ++n) {
                t.push(o[r] + e * (a[r] - o[r]));
              }return t;
            }(), l.lab.apply(l, n);
          }) : 3 === e.length ? (d = function () {
            var r, n, t;for (t = [], r = 0, n = e.length; n > r; r++) {
              f = e[r], t.push(f.lab());
            }return t;
          }(), o = d[0], a = d[1], i = d[2], r = function r(e) {
            var r, n;return n = function () {
              var n, t;for (t = [], r = n = 0; 2 >= n; r = ++n) {
                t.push((1 - e) * (1 - e) * o[r] + 2 * (1 - e) * e * a[r] + e * e * i[r]);
              }return t;
            }(), l.lab.apply(l, n);
          }) : 4 === e.length ? (b = function () {
            var r, n, t;for (t = [], r = 0, n = e.length; n > r; r++) {
              f = e[r], t.push(f.lab());
            }return t;
          }(), o = b[0], a = b[1], i = b[2], u = b[3], r = function r(e) {
            var r, n;return n = function () {
              var n, t;for (t = [], r = n = 0; 2 >= n; r = ++n) {
                t.push((1 - e) * (1 - e) * (1 - e) * o[r] + 3 * (1 - e) * (1 - e) * e * a[r] + 3 * (1 - e) * e * e * i[r] + e * e * e * u[r]);
              }return t;
            }(), l.lab.apply(l, n);
          }) : 5 === e.length && (n = _s(e.slice(0, 3)), t = _s(e.slice(2, 5)), r = function r(e) {
            return .5 > e ? n(2 * e) : t(2 * (e - .5));
          }), r;
        }, l.interpolate.bezier = _s;
      }).call(this);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/delaunay-fast/delaunay.js": [function (e, r) {
      var n;!function () {
        "use strict";
        function e(e) {
          var r,
              n,
              t,
              f,
              o,
              a,
              i = Number.POSITIVE_INFINITY,
              u = Number.POSITIVE_INFINITY,
              c = Number.NEGATIVE_INFINITY,
              s = Number.NEGATIVE_INFINITY;for (r = e.length; r--;) {
            e[r][0] < i && (i = e[r][0]), e[r][0] > c && (c = e[r][0]), e[r][1] < u && (u = e[r][1]), e[r][1] > s && (s = e[r][1]);
          }return n = c - i, t = s - u, f = Math.max(n, t), o = i + .5 * n, a = u + .5 * t, [[o - 20 * f, a - f], [o, a + 20 * f], [o + 20 * f, a - f]];
        }function t(e, r, n, t) {
          var f,
              a,
              i,
              u,
              c,
              s,
              d,
              l,
              b,
              h,
              g = e[r][0],
              p = e[r][1],
              m = e[n][0],
              y = e[n][1],
              v = e[t][0],
              w = e[t][1],
              x = Math.abs(p - y),
              _ = Math.abs(y - w);if (o > x && o > _) throw new Error("Eek! Coincident points!");return o > x ? (u = -((v - m) / (w - y)), s = (m + v) / 2, l = (y + w) / 2, f = (m + g) / 2, a = u * (f - s) + l) : o > _ ? (i = -((m - g) / (y - p)), c = (g + m) / 2, d = (p + y) / 2, f = (v + m) / 2, a = i * (f - c) + d) : (i = -((m - g) / (y - p)), u = -((v - m) / (w - y)), c = (g + m) / 2, s = (m + v) / 2, d = (p + y) / 2, l = (y + w) / 2, f = (i * c - u * s + l - d) / (i - u), a = x > _ ? i * (f - c) + d : u * (f - s) + l), b = m - f, h = y - a, { i: r, j: n, k: t, x: f, y: a, r: b * b + h * h };
        }function f(e) {
          var r, n, t, f, o, a;for (n = e.length; n;) {
            for (f = e[--n], t = e[--n], r = n; r;) {
              if (a = e[--r], o = e[--r], t === o && f === a || t === a && f === o) {
                e.splice(n, 2), e.splice(r, 2);break;
              }
            }
          }
        }var o = 1 / 1048576;n = { triangulate: function triangulate(r, n) {
            var a,
                i,
                u,
                c,
                s,
                d,
                l,
                b,
                h,
                g,
                p,
                m,
                y = r.length;if (3 > y) return [];if (r = r.slice(0), n) for (a = y; a--;) {
              r[a] = r[a][n];
            }for (u = new Array(y), a = y; a--;) {
              u[a] = a;
            }for (u.sort(function (e, n) {
              return r[n][0] - r[e][0];
            }), c = e(r), r.push(c[0], c[1], c[2]), s = [t(r, y + 0, y + 1, y + 2)], d = [], l = [], a = u.length; a--; l.length = 0) {
              for (m = u[a], i = s.length; i--;) {
                b = r[m][0] - s[i].x, b > 0 && b * b > s[i].r ? (d.push(s[i]), s.splice(i, 1)) : (h = r[m][1] - s[i].y, b * b + h * h - s[i].r > o || (l.push(s[i].i, s[i].j, s[i].j, s[i].k, s[i].k, s[i].i), s.splice(i, 1)));
              }for (f(l), i = l.length; i;) {
                p = l[--i], g = l[--i], s.push(t(r, g, p, m));
              }
            }for (a = s.length; a--;) {
              d.push(s[a]);
            }for (s.length = 0, a = d.length; a--;) {
              d[a].i < y && d[a].j < y && d[a].k < y && s.push(d[a].i, d[a].j, d[a].k);
            }return s;
          }, contains: function contains(e, r) {
            if (r[0] < e[0][0] && r[0] < e[1][0] && r[0] < e[2][0] || r[0] > e[0][0] && r[0] > e[1][0] && r[0] > e[2][0] || r[1] < e[0][1] && r[1] < e[1][1] && r[1] < e[2][1] || r[1] > e[0][1] && r[1] > e[1][1] && r[1] > e[2][1]) return null;var n = e[1][0] - e[0][0],
                t = e[2][0] - e[0][0],
                f = e[1][1] - e[0][1],
                o = e[2][1] - e[0][1],
                a = n * o - t * f;if (0 === a) return null;var i = (o * (r[0] - e[0][0]) - t * (r[1] - e[0][1])) / a,
                u = (n * (r[1] - e[0][1]) - f * (r[0] - e[0][0])) / a;return 0 > i || 0 > u || i + u > 1 ? null : [i, u];
          } }, "undefined" != typeof r && (r.exports = n);
      }();
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/process/browser.js": [function (e, r) {
      function n() {
        if (!a) {
          a = !0;for (var e, r = o.length; r;) {
            e = o, o = [];for (var n = -1; ++n < r;) {
              e[n]();
            }r = o.length;
          }a = !1;
        }
      }function t() {}var f = r.exports = {},
          o = [],
          a = !1;f.nextTick = function (e) {
        o.push(e), a || setTimeout(n, 0);
      }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = t, f.addListener = t, f.once = t, f.off = t, f.removeListener = t, f.removeAllListeners = t, f.emit = t, f.binding = function () {
        throw new Error("process.binding is not supported");
      }, f.cwd = function () {
        return "/";
      }, f.chdir = function () {
        throw new Error("process.chdir is not supported");
      }, f.umask = function () {
        return 0;
      };
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/index.js": [function (e, r) {
      var n = e("./lib/alea"),
          t = e("./lib/xor128"),
          f = e("./lib/xorwow"),
          o = e("./lib/xorshift7"),
          a = e("./lib/xor4096"),
          i = e("./lib/tychei"),
          u = e("./seedrandom");u.alea = n, u.xor128 = t, u.xorwow = f, u.xorshift7 = o, u.xor4096 = a, u.tychei = i, r.exports = u;
    }, { "./lib/alea": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/alea.js", "./lib/tychei": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/tychei.js", "./lib/xor128": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor128.js", "./lib/xor4096": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor4096.js", "./lib/xorshift7": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorshift7.js", "./lib/xorwow": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorwow.js", "./seedrandom": "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/seedrandom.js" }], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/alea.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          var r = this,
              n = a();r.next = function () {
            var e = 2091639 * r.s0 + 2.3283064365386963e-10 * r.c;return r.s0 = r.s1, r.s1 = r.s2, r.s2 = e - (r.c = 0 | e);
          }, r.c = 1, r.s0 = n(" "), r.s1 = n(" "), r.s2 = n(" "), r.s0 -= n(e), r.s0 < 0 && (r.s0 += 1), r.s1 -= n(e), r.s1 < 0 && (r.s1 += 1), r.s2 -= n(e), r.s2 < 0 && (r.s2 += 1), n = null;
        }function f(e, r) {
          return r.c = e.c, r.s0 = e.s0, r.s1 = e.s1, r.s2 = e.s2, r;
        }function o(e, r) {
          var n = new t(e),
              o = r && r.state,
              a = n.next;return a.int32 = function () {
            return 4294967296 * n.next() | 0;
          }, a.double = function () {
            return a() + 1.1102230246251565e-16 * (2097152 * a() | 0);
          }, a.quick = a, o && ("object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }function a() {
          var e = 4022871197,
              r = function r(_r) {
            _r = _r.toString();for (var n = 0; n < _r.length; n++) {
              e += _r.charCodeAt(n);var t = .02519603282416938 * e;e = t >>> 0, t -= e, t *= e, e = t >>> 0, t -= e, e += 4294967296 * t;
            }return 2.3283064365386963e-10 * (e >>> 0);
          };return r;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.alea = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/tychei.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          var r = this,
              n = "";r.next = function () {
            var e = r.b,
                n = r.c,
                t = r.d,
                f = r.a;return e = e << 25 ^ e >>> 7 ^ n, n = n - t | 0, t = t << 24 ^ t >>> 8 ^ f, f = f - e | 0, r.b = e = e << 20 ^ e >>> 12 ^ n, r.c = n = n - t | 0, r.d = t << 16 ^ n >>> 16 ^ f, r.a = f - e | 0;
          }, r.a = 0, r.b = 0, r.c = -1640531527, r.d = 1367130551, e === Math.floor(e) ? (r.a = e / 4294967296 | 0, r.b = 0 | e) : n += e;for (var t = 0; t < n.length + 20; t++) {
            r.b ^= 0 | n.charCodeAt(t), r.next();
          }
        }function f(e, r) {
          return r.a = e.a, r.b = e.b, r.c = e.c, r.d = e.d, r;
        }function o(e, r) {
          var n = new t(e),
              o = r && r.state,
              a = function a() {
            return (n.next() >>> 0) / 4294967296;
          };return a.double = function () {
            do {
              var e = n.next() >>> 11,
                  r = (n.next() >>> 0) / 4294967296,
                  t = (e + r) / (1 << 21);
            } while (0 === t);return t;
          }, a.int32 = n.next, a.quick = a, o && ("object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.tychei = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor128.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          var r = this,
              n = "";r.x = 0, r.y = 0, r.z = 0, r.w = 0, r.next = function () {
            var e = r.x ^ r.x << 11;return r.x = r.y, r.y = r.z, r.z = r.w, r.w ^= r.w >>> 19 ^ e ^ e >>> 8;
          }, e === (0 | e) ? r.x = e : n += e;for (var t = 0; t < n.length + 64; t++) {
            r.x ^= 0 | n.charCodeAt(t), r.next();
          }
        }function f(e, r) {
          return r.x = e.x, r.y = e.y, r.z = e.z, r.w = e.w, r;
        }function o(e, r) {
          var n = new t(e),
              o = r && r.state,
              a = function a() {
            return (n.next() >>> 0) / 4294967296;
          };return a.double = function () {
            do {
              var e = n.next() >>> 11,
                  r = (n.next() >>> 0) / 4294967296,
                  t = (e + r) / (1 << 21);
            } while (0 === t);return t;
          }, a.int32 = n.next, a.quick = a, o && ("object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.xor128 = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor4096.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          function r(e, r) {
            var n,
                t,
                f,
                o,
                a,
                i = [],
                u = 128;for (r === (0 | r) ? (t = r, r = null) : (r += "\x00", t = 0, u = Math.max(u, r.length)), f = 0, o = -32; u > o; ++o) {
              r && (t ^= r.charCodeAt((o + 32) % r.length)), 0 === o && (a = t), t ^= t << 10, t ^= t >>> 15, t ^= t << 4, t ^= t >>> 13, o >= 0 && (a = a + 1640531527 | 0, n = i[127 & o] ^= t + a, f = 0 == n ? f + 1 : 0);
            }for (f >= 128 && (i[127 & (r && r.length || 0)] = -1), f = 127, o = 512; o > 0; --o) {
              t = i[f + 34 & 127], n = i[f = f + 1 & 127], t ^= t << 13, n ^= n << 17, t ^= t >>> 15, n ^= n >>> 12, i[f] = t ^ n;
            }e.w = a, e.X = i, e.i = f;
          }var n = this;n.next = function () {
            var e,
                r,
                t = n.w,
                f = n.X,
                o = n.i;return n.w = t = t + 1640531527 | 0, r = f[o + 34 & 127], e = f[o = o + 1 & 127], r ^= r << 13, e ^= e << 17, r ^= r >>> 15, e ^= e >>> 12, r = f[o] = r ^ e, n.i = o, r + (t ^ t >>> 16) | 0;
          }, r(n, e);
        }function f(e, r) {
          return r.i = e.i, r.w = e.w, r.X = e.X.slice(), r;
        }function o(e, r) {
          null == e && (e = +new Date());var n = new t(e),
              o = r && r.state,
              a = function a() {
            return (n.next() >>> 0) / 4294967296;
          };return a.double = function () {
            do {
              var e = n.next() >>> 11,
                  r = (n.next() >>> 0) / 4294967296,
                  t = (e + r) / (1 << 21);
            } while (0 === t);return t;
          }, a.int32 = n.next, a.quick = a, o && (o.X && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.xor4096 = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorshift7.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          function r(e, r) {
            var n,
                t,
                f = [];if (r === (0 | r)) t = f[0] = r;else for (r = "" + r, n = 0; n < r.length; ++n) {
              f[7 & n] = f[7 & n] << 15 ^ r.charCodeAt(n) + f[n + 1 & 7] << 13;
            }for (; f.length < 8;) {
              f.push(0);
            }for (n = 0; 8 > n && 0 === f[n]; ++n) {}for (t = 8 == n ? f[7] = -1 : f[n], e.x = f, e.i = 0, n = 256; n > 0; --n) {
              e.next();
            }
          }var n = this;n.next = function () {
            var e,
                r,
                t = n.x,
                f = n.i;return e = t[f], e ^= e >>> 7, r = e ^ e << 24, e = t[f + 1 & 7], r ^= e ^ e >>> 10, e = t[f + 3 & 7], r ^= e ^ e >>> 3, e = t[f + 4 & 7], r ^= e ^ e << 7, e = t[f + 7 & 7], e ^= e << 13, r ^= e ^ e << 9, t[f] = r, n.i = f + 1 & 7, r;
          }, r(n, e);
        }function f(e, r) {
          return r.x = e.x.slice(), r.i = e.i, r;
        }function o(e, r) {
          null == e && (e = +new Date());var n = new t(e),
              o = r && r.state,
              a = function a() {
            return (n.next() >>> 0) / 4294967296;
          };return a.double = function () {
            do {
              var e = n.next() >>> 11,
                  r = (n.next() >>> 0) / 4294967296,
                  t = (e + r) / (1 << 21);
            } while (0 === t);return t;
          }, a.int32 = n.next, a.quick = a, o && (o.x && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.xorshift7 = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorwow.js": [function (r, n) {
      !function (e, r, n) {
        function t(e) {
          var r = this,
              n = "";r.next = function () {
            var e = r.x ^ r.x >>> 2;return r.x = r.y, r.y = r.z, r.z = r.w, r.w = r.v, (r.d = r.d + 362437 | 0) + (r.v = r.v ^ r.v << 4 ^ (e ^ e << 1)) | 0;
          }, r.x = 0, r.y = 0, r.z = 0, r.w = 0, r.v = 0, e === (0 | e) ? r.x = e : n += e;for (var t = 0; t < n.length + 64; t++) {
            r.x ^= 0 | n.charCodeAt(t), t == n.length && (r.d = r.x << 10 ^ r.x >>> 4), r.next();
          }
        }function f(e, r) {
          return r.x = e.x, r.y = e.y, r.z = e.z, r.w = e.w, r.v = e.v, r.d = e.d, r;
        }function o(e, r) {
          var n = new t(e),
              o = r && r.state,
              a = function a() {
            return (n.next() >>> 0) / 4294967296;
          };return a.double = function () {
            do {
              var e = n.next() >>> 11,
                  r = (n.next() >>> 0) / 4294967296,
                  t = (e + r) / (1 << 21);
            } while (0 === t);return t;
          }, a.int32 = n.next, a.quick = a, o && ("object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && f(o, n), a.state = function () {
            return f(n, {});
          }), a;
        }r && r.exports ? r.exports = o : n && n.amd ? n(function () {
          return o;
        }) : this.xorwow = o;
      }(this, "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n, "function" == typeof e && e);
    }, {}], "/Users/qrohlf/Code/trianglify/node_modules/seedrandom/seedrandom.js": [function (r, n) {
      !function (t, f) {
        function o(e, r, n) {
          var o = [];r = 1 == r ? { entropy: !0 } : r || {};var l = c(u(r.entropy ? [e, d(t)] : null == e ? s() : e, 3), o),
              b = new a(o),
              p = function p() {
            for (var e = b.g(g), r = y, n = 0; v > e;) {
              e = (e + n) * h, r *= h, n = b.g(1);
            }for (; e >= w;) {
              e /= 2, r /= 2, n >>>= 1;
            }return (e + n) / r;
          };return p.int32 = function () {
            return 0 | b.g(4);
          }, p.quick = function () {
            return b.g(4) / 4294967296;
          }, p.double = p, c(d(b.S), t), (r.pass || n || function (e, r, n, t) {
            return t && (t.S && i(t, b), e.state = function () {
              return i(b, {});
            }), n ? (f[m] = e, r) : e;
          })(p, l, "global" in r ? r.global : this == f, r.state);
        }function a(e) {
          var r,
              n = e.length,
              t = this,
              f = 0,
              o = t.i = t.j = 0,
              a = t.S = [];for (n || (e = [n++]); h > f;) {
            a[f] = f++;
          }for (f = 0; h > f; f++) {
            a[f] = a[o = x & o + e[f % n] + (r = a[f])], a[o] = r;
          }(t.g = function (e) {
            for (var r, n = 0, f = t.i, o = t.j, a = t.S; e--;) {
              r = a[f = x & f + 1], n = n * h + a[x & (a[f] = a[o = x & o + r]) + (a[o] = r)];
            }return t.i = f, t.j = o, n;
          })(h);
        }function i(e, r) {
          return r.i = e.i, r.j = e.j, r.S = e.S.slice(), r;
        }function u(e, r) {
          var n,
              t = [],
              f = typeof e === "undefined" ? "undefined" : _typeof(e);if (r && "object" == f) for (n in e) {
            try {
              t.push(u(e[n], r - 1));
            } catch (o) {}
          }return t.length ? t : "string" == f ? e : e + "\x00";
        }function c(e, r) {
          for (var n, t = e + "", f = 0; f < t.length;) {
            r[x & f] = x & (n ^= 19 * r[x & f]) + t.charCodeAt(f++);
          }return d(r);
        }function s() {
          try {
            if (l) return d(l.randomBytes(h));var e = new Uint8Array(h);return (b.crypto || b.msCrypto).getRandomValues(e), d(e);
          } catch (r) {
            var b = window;var n = b.navigator,
                f = n && n.plugins;return [+new Date(), b, f, b.screen, d(t)];
          }
        }function d(e) {
          return String.fromCharCode.apply(0, e);
        }var l,
            b = this,
            h = 256,
            g = 6,
            p = 52,
            m = "random",
            y = f.pow(h, g),
            v = f.pow(2, p),
            w = 2 * v,
            x = h - 1;if (f["seed" + m] = o, c(f.random(), t), "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n.exports) {
          n.exports = o;try {
            l = r("crypto");
          } catch (_) {}
        } else "function" == typeof e && e.amd && e(function () {
          return o;
        });
      }([], Math);
    }, { crypto: !1 }] }, {}, ["./lib/trianglify.js"])("./lib/trianglify.js");
});
;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function Ctor() {};

    // Create a safe reference to the Underscore object for use below.
    var _ = function _(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.3';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function optimizeCb(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 2:
                return function (value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result � either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function cb(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    // An internal function for creating assigner functions.
    var createAssigner = function createAssigner(keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function baseCreate(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor();
        Ctor.prototype = null;
        return result;
    };

    var property = function property(key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function isArrayLike(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Create a reducing function iterating left or right.
    function createReduce(dir) {
        // Optimized iterator function as using arguments.length
        // in the main function will deoptimize the, see #1991.
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }

        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // Determine the initial value if none is provided.
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
        };
    }

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
        } else {
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1) return obj[key];
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
        var result = -Infinity,
            lastComputed = -Infinity,
            value,
            computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
        var result = Infinity,
            lastComputed = Infinity,
            value,
            computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    // Shuffle a collection, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher�Yates_shuffle).
    _.shuffle = function (obj) {
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = _.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    };

    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function group(behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key].push(value);else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
        if (_.has(result, key)) result[key]++;else result[key] = 1;
    });

    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [],
            fail = [];
        _.each(obj, function (value, key, obj) {
            (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [pass, fail];
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function (array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function flatten(input, shallow, strict, startIndex) {
        var output = [],
            idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                //flatten current level of array or arguments object
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0,
                    len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                if (!i || seen !== computed) result.push(value);
                seen = computed;
            } else if (iteratee) {
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                result.push(value);
            }
        }
        return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
        return _.uniq(flatten(arguments, true, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if (_.contains(result, item)) continue;
            for (var j = 1; j < argsLength; j++) {
                if (!_.contains(arguments[j], item)) break;
            }
            if (j === argsLength) result.push(item);
        }
        return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
        var rest = flatten(arguments, true, true, 1);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function () {
        return _.unzip(arguments);
    };

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices
    _.unzip = function (array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // Generator function to create the findIndex and findLastIndex functions
    function createPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    }

    // Returns the first index on an array-like that passes a predicate test
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0,
            high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
        }
        return low;
    };

    // Generator function to create the indexOf and lastIndexOf functions
    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0,
                length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        };
    }

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments
    var executeBound = function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var args = slice.call(arguments, 2);
        var bound = function bound() {
            return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
        };
        return bound;
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function bound() {
            var position = 0,
                length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) {
                args.push(arguments[position++]);
            }return executeBound(func, bound, this, this, args);
        };
        return bound;
    };

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function (obj) {
        var i,
            length = arguments.length,
            key;
        if (length <= 1) throw new Error('bindAll must be passed function names');
        for (i = 1; i < length; i++) {
            key = arguments[i];
            obj[key] = _.bind(obj[key], obj);
        }
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
        var memoize = function memoize(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function later() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function later() {
            var last = _.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) {
                result = args[i].call(this, result);
            }return result;
        };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    // Object Functions
    // ----------------

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) {
            if (_.has(obj, key)) keys.push(key);
        } // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        } // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Returns the results of applying the iteratee to each element of the object
    // In contrast to _.map it returns an object
    _.mapObject = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {},
            currentKey;
        for (var index = 0; index < length; index++) {
            currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);

    // Assigns a given object with all the own properties in the passed-in object(s)
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);

    // Returns the first key on an object that passes a predicate test
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj),
            key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (object, oiteratee, context) {
        var result = {},
            obj = object,
            iteratee,
            keys;
        if (obj == null) return result;
        if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function iteratee(value, key, obj) {
                return key in obj;
            };
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj, iteratee, context) {
        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            var keys = _.map(flatten(arguments, false, false, 1), String);
            iteratee = function iteratee(value, key) {
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    };

    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function (prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs),
            length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq = function eq(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) != 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) != 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = _.keys(a),
                key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
        return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
        var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return _.has(obj, 'callee');
        };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ != 'function' && (typeof Int8Array === 'undefined' ? 'undefined' : _typeof(Int8Array)) != 'object') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj !== +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
        return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.noop = function () {};

    _.property = property;

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function (obj) {
        return obj == null ? function () {} : function (key) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        };
    };

    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) {
            accum[i] = iteratee(i);
        }return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
        return new Date().getTime();
    };

    // List of HTML entities for escaping.
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function createEscaper(map) {
        var escaper = function escaper(match) {
            return map[match];
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, property, fallback) {
        var value = object == null ? void 0 : object[property];
        if (value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function escapeChar(match) {
        return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, escapeChar);
            index = offset + match.length;

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            } else if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        var template = function template(data) {
            return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function result(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result(this, func.apply(_, args));
            };
        });
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
            return result(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments));
        };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return '' + this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}).call(window);
;"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Utilities JavaScript Belt
 * v1.0.0
 *
 * Provides general-purpose utility methods
 * Author: Neven Dyulgerov
 * Released under the MIT license
 */

(function (base) {
    base.utils = function () {

        /**
         * Public
         * Is Object
         * @param val
         * @returns {boolean}
         */
        var isO = function isO(val) {
            return (typeof val === "undefined" ? "undefined" : _typeof(val)) === "object" && !isA(val) && val !== null;
        };

        /**
         * Public
         * Is Number
         * @param val
         * @returns {boolean}
         */
        var isN = function isN(val) {
            return typeof val === "number" && !isNaN(val);
        };

        /**
         * Public
         * Is Function
         * @param val
         * @returns {boolean}
         */
        var isF = function isF(val) {
            return typeof val === "function";
        };

        /**
         * Public
         * Is Array
         * @param val
         * @returns {boolean}
         */
        var isA = function isA(val) {
            return Array.isArray(val);
        };

        /**
         * Public
         * Is String
         * @param val
         * @returns {boolean}
         */
        var isS = function isS(val) {
            return typeof val === "string";
        };

        /**
         * Public
         * Is Undefined
         * @param val
         * @returns {boolean}
         */
        var isU = function isU(val) {
            return typeof val === "undefined";
        };

        /**
         * Public
         * Is Boolean
         * @param val
         * @returns {boolean}
         */
        var isB = function isB(val) {
            return typeof val === "boolean";
        };

        /**
         * Public
         * To Number
         * @param val
         * @returns {Number}
         */
        var toN = function toN(val) {
            return parseInt(val, 10);
        };

        /**
         * Public
         * To Boolean
         * @param val
         * @returns {boolean}
         */
        var toB = function toB(val) {
            return val.toLowerCase() == "true";
        };

        /**
         * Public
         * Has Method
         * @param obj
         * @param method
         * @returns {boolean}
         */
        var hasM = function hasM(obj, method) {
            return hasP(obj, method) && isF(method);
        };

        /**
         * Public
         * Run Methods
         * @param obj
         */
        var runM = function runM(obj) {
            for (var i in obj) {
                var prop = obj[i];
                if (hasP(obj, i) && isF(prop)) {
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
        var runExclM = function runExclM(obj, excludes) {
            var excl = isA(excludes) ? excludes : [];

            for (var i in obj) {
                var prop = obj[i];
                if (hasP(obj, i) && isF(prop) && excl.indexOf(i) === -1) {
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
        var hasP = function hasP(obj, prop) {
            return obj.hasOwnProperty(prop);
        };

        /**
         * Get Property
         * @param obj
         * @param prop
         * @returns {*}
         */
        var getP = function getP(obj, prop) {
            return hasP(obj, prop) ? obj[prop] : "";
        };

        /**
         * Public
         * Has Key
         * @param obj
         * @param key
         * @returns {boolean}
         */
        var hasK = function hasK(obj, key) {
            return getK(obj).indexOf(key) > -1;
        };

        /**
         * Public
         * Get Keys
         * @param obj
         * @returns {Array}
         */
        var getK = function getK(obj) {
            return Object.keys(obj);
        };

        /**
         * Public
         * Get Shallow Copy
         * @param obj
         */
        var getSC = function getSC(obj) {
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
        var recurIter = function recurIter(handler, complete, index) {
            index = index || 0;
            handler(index, function (canRecur) {
                if (!canRecur) {
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
        var poll = function poll(handler, complete, interval) {
            setTimeout(function () {
                handler(function (canPoll) {
                    if (canPoll) {
                        return poll(handler, complete, interval);
                    }
                    complete();
                });
            }, interval);
        };

        /**
         * Buffer
         */
        var buffer = function buffer() {
            var timers = {};
            return function (id, ms, clb) {
                if (!id) {
                    timers[id] = '0';
                }
                if (timers[id]) {
                    clearTimeout(timers[id]);
                }
                timers[id] = setTimeout(clb, ms);
            };
        };

        var getUrlParam = function getUrlParam(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        };

        var jsonCopy = function jsonCopy(obj) {
            return JSON.parse(JSON.stringify(obj));
        };

        var exportToCsv = function exportToCsv(filename, rows) {
            var processRow = function processRow(row) {
                var finalVal = '';
                for (var j = 0; j < row.length; j++) {
                    var innerValue = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) {
                        innerValue = row[j].toLocaleString();
                    }
                    var result = innerValue.replace(/"/g, '""');
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

            var csvFile = "\uFEFF";
            for (var i = 0; i < rows.length; i++) {
                csvFile += processRow(rows[i]);
            }

            var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) {
                // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };

        var numberWithCommas = function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        var capitalize = function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        /**
         * Public API
         */
        return {
            isS: isS,
            isN: isN,
            isB: isB,
            isO: isO,
            isA: isA,
            isF: isF,
            isU: isU,
            toN: toN,
            toB: toB,
            hasM: hasM,
            runM: runM,
            runExclM: runExclM,
            hasP: hasP,
            getP: getP,
            hasK: hasK,
            getK: getK,
            getSC: getSC,
            recurIter: recurIter,
            buffer: buffer,
            poll: poll,
            getUrlParam: getUrlParam,
            jsonCopy: jsonCopy,
            exportToCsv: exportToCsv,
            numberWithCommas: numberWithCommas,
            capitalize: capitalize
        };
    }();
})(window);
;"use strict";

(function (base) {

    base.validator = function () {
        return {
            email: function email(val) {
                return (/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(val)
                );
            },
            pass: function pass(options, val) {
                if (options.upperCaseLetter && !/[A-Z]+/.test(val)) {
                    return false;
                }
                if (options.specialChar && !/[!@#\$%\^\&*\)\(+=._-]+/.test(val)) {
                    return false;
                }
                if (options.digit && !/[\d]+/.test(val)) {
                    return false;
                }
                if (options.passLength && val.length < options.passLength) {
                    return false;
                }
                return true;
            },
            phone: function phone(val) {
                return (/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(val)
                );
            },
            checkbox: function checkbox(val) {
                return val.val() === "on";
            }
        };
    }();
})(window);
;"use strict";
/*globals questnr, $, initialzr, storage, sequence */

/**
 * Initialize global app
 */

(function (i) {
    i({ name: "questnr", global: true });
})(initialzr);

/**
 * Configure global app
 */
questnr.schema('app').configure('events')

/**
 * Ready event
 * App's entrypoint
 */
.node('onReady', function (clb) {
    $(document).ready(clb);
}).configure('core')

/**
 * Ajax
 * Global ajax API
 */
.node('ajax', function (opts) {
    $.ajax({
        type: opts.type || "POST",
        url: opts.url || "",
        data: opts.data || {},
        dataType: opts.dataType || "JSON",
        success: function success(res) {
            if (opts.callback) {
                opts.callback(null, res);
            }
        },
        error: function error(xhr, status, err) {
            if (opts.callback) {
                opts.callback(err, null);
            }
        }
    });
})

/**
 * Storage key
 * Global key for referencing the app's storage
 */
.node('storeKey', function () {
    return $('body').data('app-name').split(' ').map(function (a) {
        return a.toLowerCase();
    }).join('_') + '_settings';
})

/**
 * Settings
 * Retrieves global app settings available via storage
 */
.node('settings', function (clb) {
    var app = questnr.getNodes('core');
    var store = storage(app.storeKey());
    app.ajax({
        url: '/api/settings',
        callback: function callback(err, res) {
            if (err || res && res.status === "error") {
                console.error(err);
            }
            if (res.status === "success") {
                store.setData($.extend(store.getData(), res.data));
                clb();
            }
        }
    });
})

/**
 * Node manager
 * Acts as router - captures all defined 'modules' on the current page and calls their js nodes
 */
.node('nodeManager', function () {
    var app = questnr.getNodes();
    return {
        callModules: function callModules(selector) {
            var $modules = $(selector || '[data-module]');
            $modules.each(function (i, e) {
                var m = $(e).data('module');
                if (app.modules.hasOwnProperty(m) && typeof app.modules[m] === "function") {
                    app.modules[m]($(e), initialzr().schema('default'));
                }
            });
            return this;
        },
        callCommon: function callCommon() {
            Object.keys(app.common).forEach(function (a) {
                app.common[a](initialzr().schema('default'));
            });
            return this;
        }
    };
}).configure('actions')

/**
 * Initialization
 */
.node('init', function () {
    var app = questnr.getNodes();
    sequence().chain(function (seq) {
        app.events.onReady(seq.resolve);
    }).chain(function (seq) {
        app.core.settings(seq.resolve);
    }).chain(function () {
        app.core.nodeManager().callCommon().callModules();
    }).execute();
});

questnr.callNode('actions', 'init');
;"use strict";

/* globals questnr */
/**
 * Common: Header
 */

questnr.addNode("common", "header", function (module) {
    "use strict";

    module.configure('events').node('onMenuToggle', function (clb) {
        $('.trigger.toggle-mobile-menu').on('click', clb);
    }).node('onOverlayClick', function (clb) {
        $('.main-overlay').on('click', clb);
    }).node('onProfileClick', function (clb) {
        $('.main-navigation').on('click', '.profile', clb);
    });

    module.configure('actions').node('rndGradient', function ($target, multiplier) {
        var randomGradient = function randomGradient() {
            var c1 = {
                r: Math.floor(Math.random() * multiplier),
                g: Math.floor(Math.random() * multiplier),
                b: Math.floor(Math.random() * multiplier)
            };
            var c2 = {
                r: Math.floor(Math.random() * multiplier),
                g: Math.floor(Math.random() * multiplier),
                b: Math.floor(Math.random() * multiplier)
            };
            c1.rgb = 'rgb(' + c1.r + ',' + c1.g + ',' + c1.b + ')';
            c2.rgb = 'rgb(' + c2.r + ',' + c2.g + ',' + c2.b + ')';
            return 'radial-gradient(at top left, ' + c1.rgb + ', ' + c2.rgb + ')';
        };
        $target.css({ 'background': randomGradient() });
    }).node('polygonBg', function ($target, $targetResize, options) {
        var targetStyle = $target[0].style;
        var $polygonCanvas = void 0;
        var pattern = void 0;
        var buffer = utils.buffer();

        var destroyPreviousPolygon = function destroyPreviousPolygon() {
            var $previousCanvas = $target.find('canvas');
            if ($previousCanvas.length > 0) {
                $previousCanvas.remove();
            }
        };

        var initPolygon = function initPolygon() {
            var settings = {
                x_colors: options.x_colors,
                variance: options.variance,
                cell_size: options.cell_size,
                width: $target.width(),
                height: $target.height()
            };

            pattern = Trianglify(settings);
            $polygonCanvas = $target.find('.polygon-canvas');

            if ($polygonCanvas.length <= 0) {
                return console.warn("[polygonBackground]: Cannot find canvas wrapper. Make sure to define the wrapper in your html first.");
            }

            $target.find('.polygon-canvas').append(pattern.canvas());
        };

        var initActions = function initActions() {
            $(window).resize(function () {
                buffer($target.attr('class'), 300, function () {
                    targetStyle.width = $targetResize.width() + "px";
                    init();
                });
            });
        };

        var init = function init() {
            destroyPreviousPolygon();
            initPolygon();
            initActions();
        };

        init();
    }).node('init', function () {
        var m = module.getNodes();
        var $body = $('body');
        var $nav = $('ul.main-navigation');
        var $menuIcon = $('.hamburger');
        var $overlay = $('.main-overlay');

        m.actions.polygonBg($('.header-content'), $(window), {
            x_colors: "Greens",
            variance: 0.5,
            cell_size: 60
        });

        m.actions.polygonBg($('.logo').find('.image-box'), $('.logo').find('.image-box'), {
            x_colors: "Greens",
            variance: 0.3,
            cell_size: 10
        });

        m.events.onMenuToggle(function (e) {
            e.preventDefault();
            if ($menuIcon.is('.active')) {
                $nav.attr('data-state', 'closed');
                $menuIcon.removeClass('active');
                $overlay.removeClass('active');
                $body.css({ 'overflow-y': 'auto' });
            } else {
                $nav.attr('data-state', 'opened');
                $menuIcon.addClass('active');
                $overlay.addClass('active');
                $body.css({ 'overflow-y': 'hidden' });
            }
        });

        m.events.onOverlayClick(function () {
            if ($overlay.filter(':hover').length > 0 && $nav.filter(':hover').length === 0) {
                $nav.attr('data-state', 'closed');
                $menuIcon.removeClass('active');
                $overlay.removeClass('active');
                $body.css({ 'overflow-y': 'auto' });
            }
        });

        m.events.onProfileClick(function (e) {
            e.preventDefault();
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr */

/**
 * Common: Monitor
 */

questnr.addNode("common", "monitor", function (module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');
    var store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events').node('onLogout', function (clb) {
        $(document).on('click', '.top-menu .logout a', clb);
    });

    module.configure('actions').node('monitorIdleState', function (timeout, check, clb) {
        var idleTime = 0;
        var resetTimer = function resetTimer() {
            idleTime = 0;
        };
        var incrementTimer = function incrementTimer() {
            idleTime++;
            if (idleTime > timeout) {
                if (_.isFunction(clb)) {
                    clb();
                }
            }
        };
        setInterval(incrementTimer, check);
        $(document).on('mousemove keypress', resetTimer);
    }).node('init', function () {
        var m = module.getNodes();
        var settings = store.getData();

        m.actions.monitorIdleState(15, 60000, function () {
            $('.logout').find('a').trigger('click');
        });

        if (settings.justLoggedIn) {
            store.removeItem('justLoggedIn');
            notifier.notify({
                type: 'success',
                title: 'Hi, ' + settings.user.firstName,
                subtitle: 'Welcome to ' + settings.appName + '.'
            });
        }

        if (settings.justLoggedOut) {
            store.removeItem('justLoggedOut');
            notifier.notify({
                type: 'success',
                title: 'Success',
                subtitle: 'You have successfully logged out of your ' + settings.appName + ' account.'
            });
        }

        m.events.onLogout(function (e) {
            e.preventDefault();
            ajax({
                url: '/login/logout',
                callback: function callback(err, res) {
                    if (err || res && res.status === 'error') {
                        notifier.notify({
                            type: 'error',
                            title: 'Error',
                            subtitle: res && res.status ? res.status : 'Unable to logout. Please try again.'
                        });
                    }
                    if (res.status === 'success') {
                        store.setItem('justLoggedOut', true);
                        window.location.href = res.redirect || '/';
                    }
                }
            });
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr */
/**
 * Module: Dashboard
 */

questnr.addNode("modules", "dashboard", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');
    var store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('actions').node('init', function () {
        var settings = store.getData();

        if (settings.user.role > 0) {
            var assignedCounter = 0;
            var completedCounter = 0;
            return sequence().chain(function (seq) {
                ajax({
                    url: '/dashboard/questionnaires/by-status',
                    data: {
                        token: $module.find('input[name="token"]').val(),
                        status: settings.questionnaires.statuses.completed
                    },
                    callback: function callback(err, res) {
                        completedCounter = err || res && res.status === 'error' ? 0 : res.data.length;
                        seq.resolve();
                    }
                });
            }).chain(function (seq) {
                ajax({
                    url: '/dashboard/questionnaires/by-status',
                    data: {
                        token: $module.find('input[name="token"]').val(),
                        status: settings.questionnaires.statuses.assigned
                    },
                    callback: function callback(err, res) {
                        assignedCounter = err || res && res.status === 'error' ? 0 : res.data.length;
                        seq.resolve();
                    }
                });
            }).chain(function (seq) {

                console.log(assignedCounter, completedCounter);

                var $widget = $module.find('.statistics[data-statistics="users"]');
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);

                console.log($widget);

                function drawChart() {
                    console.log('draw chart');
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Questionnaires by Status');
                    data.addColumn('number', 'Amount');
                    data.addRows([['Assigned', assignedCounter], ['Completed', completedCounter]]);
                    var options = {
                        'height': 300
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('chart-data'));
                    chart.draw(data, options);
                    $widget.addClass('active');
                }
                seq.resolve();
            }).execute();
        }
        ajax({
            url: '/dashboard/questionnaires',
            data: {
                token: $module.find('input[name="token"]').val()
            },
            callback: function callback(err, res) {
                if (res && res.status === "success") {
                    $module.find('[data-widget="questionnaires"]').attr('data-has-items', true);
                    $module.find('[data-widget="questionnaires"]').find('.counter').text(res.data.length);
                }
            }
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr, grecaptcha */

/**
 * Module: Forgot Password
 */

questnr.addNode("modules", "forgotPass", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');

    module.configure('events').node('onPassReset', function (clb) {
        $module.find('form').find('[type="submit"]').on('click', clb);
    });

    module.configure('actions').node('init', function () {
        var m = module.getNodes();

        $module.find('[name="email"]').focus();

        m.events.onPassReset(function (e) {
            e.preventDefault();
            if ($module.find('[name="email"]').val() === "") {
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your email address first"
                });
            }
            if (!validator.email($module.find('[name="email"]').val())) {
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid email address first"
                });
            }
            if (grecaptcha.getResponse() === "") {
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to check the reCaptcha first"
                });
            }

            ajax({
                url: '/forgot-password',
                data: {
                    email: $module.find('[name="email"]').val(),
                    token: $module.find('[name="token"]').val(),
                    captcha: $module.find('[name="g-recaptcha-response"]').val()
                },
                callback: function callback(err, res) {
                    grecaptcha.reset();
                    if (err || res && res.status === "error") {
                        return notifier.notify({
                            type: "error",
                            title: "Error",
                            subtitle: err ? err.toString() : res.message
                        });
                    }
                    if (res.status === "success") {
                        notifier.notify({
                            type: "success",
                            title: "Success",
                            subtitle: res.message,
                            callbacks: {
                                hide: function hide() {
                                    window.location.href = res.redirect || '/';
                                }
                            }
                        });
                    }
                }
            });
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr, grecaptcha */
/**
 * Module: Login
 */

questnr.addNode("modules", "login", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');
    var store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events').node('onLogin', function (clb) {
        $module.find('form').find('.trigger.login').on('click', clb);
    });

    module.configure('actions').node('toggleLoading', function (isOn) {
        if (isOn) {
            $module.find('.trigger.login').addClass('loading');
        } else {
            $module.find('.trigger.login').removeClass('loading');
        }
    }).node('init', function () {
        var m = module.getNodes();
        $module.find('[name="email"]').focus();

        m.events.onLogin(function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('loading')) {
                return false;
            }

            m.actions.toggleLoading(true);

            if ($module.find('[name="email"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your email first"
                });
            }
            if (!validator.email($module.find('[name="email"]').val())) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid email address"
                });
            }
            if ($module.find('[name="password"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your password first"
                });
            }
            if (!validator.pass({ upperCaseLetter: true, digit: true, passLength: 6 }, $module.find('[name="password"]').val())) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid password, containing an upper case letter and some digits. The password must be at least 6 symbols."
                });
            }
            if (grecaptcha.getResponse() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to check the reCaptcha first"
                });
            }

            ajax({
                url: '/login',
                data: {
                    email: $module.find('[name="email"]').val(),
                    password: $module.find('[name="password"]').val(),
                    token: $module.find('[name="token"]').val(),
                    captcha: $module.find('[name="g-recaptcha-response"]').val()
                },
                callback: function callback(err, res) {
                    grecaptcha.reset();
                    if (err || res && res.status === "error") {
                        m.actions.toggleLoading(false);
                        return notifier.notify({
                            type: "error",
                            title: "Error",
                            subtitle: err ? err.toString() : res.message
                        });
                    }
                    if (res.status === "success") {
                        store.setItem("justLoggedIn", true);
                        window.location.href = res.redirect || '/';
                    }
                }
            });
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr, storage, slickModal, utils */
/**
 * Module: Questionnaires
 */

questnr.addNode("modules", "questionnaires", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');
    var store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events').node('onRangeDrag', function (clb) {
        $module.on('input', '[type="range"]', clb);
    }).node('onToggleQ', function (clb) {
        $module.find('.trigger.toggle-questionnaire').add($module.find('.questionnaire-header')).on('click', clb);
    }).node('onCreateQ', function (clb) {
        $module.find('.trigger.create-questionnaire').on('click', clb);
    }).node('onAddQuestion', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.add-question', clb);
    }).node('onRemoveQuestion', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.remove-question', clb);
    }).node('onAssignUsers', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.assign-users', clb);
    }).node('onAssignBulk', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.assign-bulk', clb);
    }).node('onUserSelect', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .users-dropdown .user', clb);
    }).node('onUsersSelect', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.select-users', clb);
    }).node('onUsersClear', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.clear-users', clb);
    }).node('onUsersClose', function (clb) {
        $('body').on('click', '.slick-modal.create-questionnaire .trigger.close-users', clb);
    }).node('onSubmitQByUser', function (clb) {
        $module.find('.trigger.submit-questionnaire').on('click', clb);
    }).node('sortAsc', function (clb) {
        $module.on('click', '.trigger.sort-asc', clb);
    }).node('sortDesc', function (clb) {
        $module.on('click', '.trigger.sort-desc', clb);
    }).node('onLimitSelect', function (clb) {
        $module.find('[name="limit"]').on('change', clb);
    }).node('onFilterSelect', function (clb) {
        $module.find('[name="filter"]').on('change', clb);
    }).node('onSearch', function (clb) {
        $module.find('.trigger.search').on('click', clb);
    }).node('onClear', function (clb) {
        $module.find('.trigger.clear-results').on('click', clb);
    }).node('onSelectAll', function (clb) {
        $module.find('.all-questionnaires').find('.questionnaires-table-header').find('.questionnaire-selector').find('[type="checkbox"]').on('change', clb);
    }).node('onSelectQ', function (clb) {
        $module.find('.all-questionnaires').find('.questionnaires-table').find('.questionnaire-selector').find('[type="checkbox"]').on('change', clb);
    }).node('onViewQ', function (clb) {
        $module.on('click', '.trigger.view-questionnaire', clb);
    }).node('onBulkAction', function (clb) {
        $module.find('.trigger.trigger-bulk-action').on('click', clb);
    });

    module.configure('renderers').node('syncQuestionsIndexes', function () {
        $('.slick-modal.create-questionnaire').find('.question').each(function (i, e) {
            $(e).find('.question-index').html(i + 1);
        });
    }).node('showUsersDropdown', function (users, assignedUsers, isSelected) {
        var $dropdown = $('.slick-modal.create-questionnaire').find('.users-dropdown');
        var html = '';
        $dropdown.find('.user').remove();
        (users || []).map(function (a) {
            var selected = isSelected && isSelected(a._id, assignedUsers) ? 'selected' : '';
            html += "<div class=\"user " + selected + "\" data-id=\"" + a._id + "\" data-email=\"" + a.email + "\"><span class=\"name\">" + a.firstName + " " + a.lastName + "</span> <span class=\"email\">" + a.email + "</span></div>";
        });
        $dropdown.prepend(html);
        $dropdown.addClass('active');
    }).node('addQuestion', function (data, $target) {
        $target.append("\n            <div class=\"question\">\n                <div class=\"question-header\">\n                    <div class=\"question-index\" title=\"Question index\">" + data.index + "</div>\n                    <a href=\"#\" class=\"trigger remove-question\" title=\"Remove question\"><span class=\"icon fa fa-close\"></span></a>\n                </div>\n                <div class=\"question-body\">\n                    <div class=\"question-text\">\n                        <input type=\"text\" placeholder=\"Question text...\">\n                    </div>\n                    <div class=\"question-type\">\n                        <select>\n                            <option value=\"\" selected disabled>Question type</option>\n                            <option value=\"text\">Text</option>\n                            <option value=\"text-range\">Text with range</option>\n                            <option value=\"range\">Range</option>\n                            <option value=\"textarea\">Textarea</option>\n                        </select>\n                    </div>\n                </div>\n            </div>");
    }).node('dataSort', function (sortBy, type, sortedCol, $items, $wrapper) {
        var rows = [];
        var html = '';
        $items.each(function (i, e) {
            var $el = $(e);
            rows.push({
                html: $el,
                val: $el.find(sortedCol).find('.value').text()
            });
        });

        if (sortBy === 'a') {
            rows.sort(function (a, b) {
                if (a.val.toLowerCase() > b.val.toLowerCase()) {
                    return type === 'asc' ? 1 : -1;
                }
                if (a.val.toLowerCase() < b.val.toLowerCase()) {
                    return type === 'asc' ? -1 : 1;
                }
                return 0;
            });
        } else if (sortBy === 'n') {
            rows.sort(function (a, b) {
                if (a.val > b.val) {
                    return type === 'asc' ? 1 : -1;
                }
                if (a.val < b.val) {
                    return type === 'asc' ? -1 : 1;
                }
                return 0;
            });
        } else if (sortBy === 'd') {
            rows.sort(function (a, b) {
                return type === 'asc' ? new Date(a.val) - new Date(b.val) : new Date(b.val) - new Date(a.val);
            });
        }

        rows.forEach(function (a) {
            html += a.html[0].outerHTML;
        });
        $wrapper.empty().append(html);
    });

    module.configure('actions').node('isSelectedUser', function (userID, users) {
        var isSelected = false;
        users.map(function (a) {
            if (a.id === userID) {
                isSelected = true;
            }
        });
        return isSelected;
    }).node('getQuestions', function () {
        var questions = [];
        $('.slick-modal.create-questionnaire').find('.question').each(function (i, e) {
            questions.push({
                text: $(e).find('.question-text').find('input').val(),
                type: $(e).find('.question-type').find('select').find('option:selected').val()
            });
        });
        return questions;
    }).node('getInvalidQuestions', function (questions) {
        var invalid = [];
        questions.forEach(function (a) {
            // TODO: 5 and 200 must come from a server-side config
            if (a.text.length <= 5 || a.text.length > 200 || a.type === '') {
                invalid.push(a);
            }
        });
        return invalid;
    }).node('toggleQ', function ($q, isOn) {
        $q.find('input').attr('disabled', 'disabled');
        if (!isOn) {
            if ($q.find('input[type="text"]').length > 0) {
                $q.find('input[type="text"]').prop('disabled', true);
            }
            if ($q.find('input[type="range"]').length > 0) {
                $q.find('input[type="range"]').prop('disabled', true).data('plugin_rangeslider').update();
            }
            $q.addClass('to-be-submitted');
        } else {
            if ($q.find('input[type="text"]').length > 0) {
                $q.find('input[type="text"]').removeAttr('disabled');
            }
            if ($q.find('input[type="range"]').length > 0) {
                $q.find('.rangeslider--disabled').removeClass('rangeslider--disabled');
            }
            $q.removeClass('to-be-submitted');
        }
    }).node('getQAnswers', function ($q) {
        var answers = [];
        $q.find('.question').each(function (i, e) {
            var $qst = $(e);
            var type = $qst.attr('data-type');
            answers[i] = {};
            switch (type) {
                case 'text':
                    answers[i].text = $qst.find('input').val().trim();
                    break;
                case 'text-range':
                    answers[i].text = $qst.find('input').val().trim();
                    answers[i].range = $qst.find('[type="range"]').val();
                    break;
                case 'range':
                    answers[i].range = $qst.find('[type="range"]').val();
                    break;
                case 'textarea':
                    answers[i].text = $qst.find('textarea').val().trim();
                    break;
                default:
                    break;
            }
            answers[i].type = type;
        });
        return answers;
    }).node('validateQ', function (format, answers) {
        var isValid = true;
        answers.forEach(function (answer) {
            switch (answer.type) {
                case 'text':
                    console.log('TEXT!@#!@#');
                    answer.isValid = answer.text.length >= format.minLenShort && answer.text.length <= format.maxLenShort;
                    break;
                case 'text-range':
                    answer.isValid = answer.text.length >= format.minLenShort && answer.text.length <= format.maxLenShort;
                    break;
                case 'textarea':
                    answer.isValid = answer.text.length >= format.minLenLong && answer.text.length <= format.maxLenLong;
                    break;
                default:
                    answer.isValid = true;
                    break;
            }
        });
        answers.forEach(function (answer, i) {
            if (!answer.isValid && isValid) {
                isValid = false;
                var min = answer.type === 'textarea' ? format.minLenLong : format.minLenShort;
                var max = answer.type === 'textarea' ? format.maxLenLong : format.maxLenShort;
                var $q = $module.find('.question').eq(i);
                $q.addClass('error');
                $q.find('input, textarea').focus();
                $q.one('click keypress', function () {
                    $q.removeClass('error');
                });
                notifier.notify({
                    type: 'error',
                    title: 'Error',
                    subtitle: "Answer [" + ($q.index() + 1) + "] must be in range [" + min + " - " + max + "] symbols."
                });
            }
        });
        answers.forEach(function (answers) {
            answers.isValid = undefined;
        });
        return isValid;
    }).node('init', function () {
        var m = module.getNodes();
        var questionsCounter = 0;
        var assignedUsers = [];
        var settings = store.getData();
        var users = [];

        $module.find('input[type="range"]').rangeslider({ polyfill: false });

        m.events.onRangeDrag(function (e) {
            var $r = $(e.target);
            $r.attr('data-dragged', true);
            $r.closest('.question').find('.range-counter').html($r.val());
        });

        m.events.onToggleQ(function (e) {
            var $q = $(e.target).closest('.questionnaire');
            if ($q.is('.opened')) {
                $q.find('.questionnaire-body').slideUp(150, function () {
                    $q.removeClass('opened');
                });
            } else {
                $q.find('.questionnaire-body').slideDown(150, function () {
                    $q.addClass('opened');
                });
            }
        });

        m.events.onCreateQ(function (e) {
            e.preventDefault();
            slickModal({
                selector: 'create-questionnaire',
                title: 'Create new questionnaire',
                confirmText: 'Create',
                cancelText: 'Cancel',
                fullscreen: true,
                content: '' + '<div class="modal-action">' + '<a href="#" class="trigger add-question" title="Add question"><span class="icon fa fa-plus"></span> <span class="text">Add question</span></a>' + '<a href="#" class="trigger assign-users" title="Assign users"><span class="icon fa fa-user"></span> <span class="text">Assign users</span></a>' + '<a href="#" class="trigger assign-bulk" title="Assign bulk"><span class="icon fa fa-users"></span> <span class="text">Assign bulk</span></a>' + '<div class="assigned-user" data-id="" title="No users assigned"><span class="icon fa fa-user-circle"></span></div>' + '<div class="questions-counter" title="Questions counter">0</div>' + '<div class="users-dropdown">' + '<a href="#" class="trigger close-users">Close</a>' + '<a href="#" class="trigger clear-users">Clear</a>' + '<a href="#" class="trigger select-users">Assign</a>' + '</div>' + '</div>' + '<div class="inner-header">' + '<div class="title"><input type="text" placeholder="Questionnaire title..."></div>' + '<div class="description"><input type="text" placeholder="Questionnaire description..."></div>' + '</div>' + '<div class="questions"></div>',
                callbacks: {
                    show: function show() {
                        questionsCounter = 0;
                        assignedUsers = [];
                        $('.slick-modal.create-questionnaire').find('.inner-header').find('.title').find('input').focus();
                    },
                    beforeConfirm: function beforeConfirm() {
                        var $slick = $('.slick-modal.create-questionnaire');
                        var $title = $slick.find('.inner-header').find('.title').find('input');
                        var $description = $slick.find('.inner-header').find('.description').find('input');
                        var invalidQuestions = m.actions.getInvalidQuestions(m.actions.getQuestions());

                        if ($slick.find('.question').length === 0) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: 'No questions added. Make sure to add at least one question to the questionnaire.'
                            });
                            return false;
                        }
                        if (assignedUsers.length === 0) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: 'No users assigned. Make sure to assign at least one user to the questionnaire.'
                            });
                            return false;
                        }
                        if ($title.val().length <= 5 || $title.val().length > 100) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: 'Title does not match length. Make sure to provide a title longer than 5 symbols and shorter than 100 symbols.'
                            });
                            return false;
                        }
                        if ($description.val().length <= 5 || $description.val().length > 200) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: 'Description does not match length. Make sure to provide a description longer than 5 symbols and shorter than 200 symbols.'
                            });
                            return false;
                        }
                        if (invalidQuestions.length > 0) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: 'Some of the questions are not valid. Make sure that all questions have titles with length longer than 5 symbols and shorter than 200 symbols. Also make sure to select type for each question.',
                                hideAfter: 7500
                            });
                            return false;
                        }
                        return true;
                    },
                    confirm: function confirm() {
                        var $slick = $('.slick-modal.create-questionnaire');

                        ajax({
                            url: '/questionnaires/create',
                            data: {
                                title: $slick.find('.inner-header').find('.title').find('input').val(),
                                description: $slick.find('.inner-header').find('.description').find('input').val(),
                                questions: JSON.stringify(m.actions.getQuestions()),
                                assignedUsers: JSON.stringify(assignedUsers),
                                token: $module.find('input[name="token"]').val()
                            },
                            callback: function callback(err, res) {
                                console.log(err, res);
                                if (err || res && res.status === 'error') {}
                                if (res.status === 'success') {
                                    notifier.notify({
                                        type: 'success',
                                        title: 'Success',
                                        subtitle: res.message,
                                        callbacks: {
                                            hide: function hide() {
                                                window.location.href = res.redirect || '/questionnaires';
                                            }
                                        }
                                    });
                                }
                                assignedUsers = [];
                            }
                        });
                    }
                }
            });
        });

        m.events.onAddQuestion(function (e) {
            e.preventDefault();
            var $slick = $('.slick-modal.create-questionnaire');
            questionsCounter++;
            m.renderers.addQuestion({ index: questionsCounter }, $slick.find('.questions'));
            $slick.find('.questions-counter').text(questionsCounter);
            $slick.find('.questions-counter').addClass('active');
            setTimeout(function () {
                $slick.find('.question').last().find('.question-text').find('input').focus();
            }, 50);
            if (!$slick.find('.questions').hasClass('active')) {
                $slick.find('.questions').addClass('active');
            }
        });

        m.events.onRemoveQuestion(function (e) {
            e.preventDefault();
            var $question = $(e.target).closest('.question');
            var $slick = $('.slick-modal.create-questionnaire');
            questionsCounter--;
            $question.remove();
            m.renderers.syncQuestionsIndexes();
            $slick.find('.questions-counter').text(questionsCounter);
            if (questionsCounter === 0) {
                $slick.find('.questions-counter').removeClass('active');
                $slick.find('.questions').removeClass('active');
            }
        });

        m.events.onAssignUsers(function (e) {
            e.preventDefault();
            var $slick = $('.slick-modal.create-questionnaire');
            $slick.find('.trigger.assign-bulk').removeClass('active');
            $slick.find('.trigger.assign-users').addClass('active');

            if (users.length > 0) {
                m.renderers.showUsersDropdown(users, assignedUsers, m.actions.isSelectedUser);
            } else {
                ajax({
                    url: '/questionnaires/get-users',
                    data: {
                        role: 0,
                        token: $module.find('input[name="token"]').val()
                    },
                    callback: function callback(err, res) {
                        if (err || res && res.status === 'error') {
                            return notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: err ? err.toString() : res.message
                            });
                        }
                        if (res.status === 'success') {
                            users = res.data;
                            m.renderers.showUsersDropdown(res.data);
                        }
                    }
                });
            }
        });

        m.events.onUserSelect(function (e) {
            e.preventDefault();
            var $user = $(e.target);
            if ($user.is('.selected')) {
                $user.removeClass('selected');
                assignedUsers = _.filter(assignedUsers, function (a) {
                    return a.id !== $user.data('id');
                });
            } else {
                $user.addClass('selected');
                assignedUsers.push({
                    id: $user.data('id'),
                    name: $user.find('.name').text(),
                    email: $user.data('email')
                });
                assignedUsers = _.uniq(assignedUsers, function (a) {
                    return a.id;
                });
            }
        });

        m.events.onUsersSelect(function (e) {
            e.preventDefault();
            if (assignedUsers.length === 0) {
                return notifier.notify({
                    type: 'error',
                    title: 'Error',
                    subtitle: 'Make sure to select at least one user.'
                });
            }

            $(e.target).addClass('active');
            var $slick = $('.slick-modal.create-questionnaire');
            var userNames = [];
            $slick.find('.users-dropdown').removeClass('active');
            $slick.find('.assigned-user').addClass('active');
            assignedUsers.map(function (a) {
                userNames.push(a.name);
            });
            $slick.find('.assigned-user').attr('title', 'Assigned user' + (assignedUsers.length === 1 ? ' is ' : 's are ') + userNames.join(', '));
        });

        m.events.onAssignBulk(function (e) {
            e.preventDefault();
            var $slick = $('.slick-modal.create-questionnaire');
            var $el = $(e.target);

            if ($el.hasClass('active')) {
                $el.removeClass('active');
                assignedUsers = [];
            } else {
                $el.addClass('active');
                $slick.find('.users-dropdown').removeClass('active');
                $slick.find('.trigger.assign-users').removeClass('active');
                $slick.find('.assigned-user').addClass('active');
                $slick.find('.assigned-user').attr('title', 'All users assigned');
                users.map(function (a) {
                    assignedUsers.push({
                        id: a._id,
                        name: a.firstName + ' ' + a.lastName,
                        email: a.email
                    });
                });
                assignedUsers = _.uniq(assignedUsers, function (a) {
                    return a.id;
                });
            }
        });

        m.events.onUsersClear(function (e) {
            e.preventDefault();
            var $slick = $('.slick-modal.create-questionnaire');
            assignedUsers = [];
            $slick.find('.user').removeClass('selected');
            $slick.find('.assigned-user').removeClass('active');
            $slick.find('.assigned-user').attr('title', 'No users assigned');
        });

        m.events.onUsersClose(function (e) {
            e.preventDefault();
            $('.slick-modal.create-questionnaire').find('.users-dropdown').removeClass('active');
        });

        m.events.onSubmitQByUser(function (e) {
            e.preventDefault();
            var $q = $(e.target).closest('.questionnaire');
            var answers = m.actions.getQAnswers($q);
            if (!m.actions.validateQ(settings.questionnaires.format, answers)) {
                return false;
            }

            m.actions.toggleQ($q, false);
            notifier.notifyAndConfirm({
                type: 'warning',
                title: 'Confirm action',
                subtitle: 'Are you sure you want to submit this questionnaire? After submitting the questionnaire you cannot modify your answers.',
                callbacks: {
                    onCancel: function onCancel() {
                        m.actions.toggleQ($q, true);
                    },
                    onConfirm: function onConfirm() {
                        ajax({
                            url: '/questionnaires/complete-questionnaire',
                            data: {
                                assigneeID: $q.data('assignee-id'),
                                answers: JSON.stringify(answers),
                                token: $module.find('[name="token"]').val()
                            },
                            callback: function callback(err, res) {
                                if (err || res && res.status === 'error') {
                                    return notifier.notify({
                                        type: 'error',
                                        title: 'Error',
                                        subtitle: err ? err.toString() : res.message
                                    });
                                }
                                if (res && res.status === 'success') {
                                    m.actions.toggleQ($q, true);
                                    $q.find('.questionnaire-body').slideUp(50, function () {
                                        $q.remove();
                                        notifier.notify({
                                            type: 'success',
                                            title: 'Success',
                                            subtitle: res.message,
                                            callbacks: {
                                                hide: function hide() {
                                                    location.href = res.redirect || '/questionnaires';
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });

        m.events.sortAsc(function (e) {
            e.preventDefault();
            var $el = $(e.target);
            $module.find('.trigger.sort-asc').removeClass('selected');
            $module.find('.trigger.sort-desc').removeClass('selected');
            $el.addClass('selected');
            var target = $el.closest('[data-sort]').data('sort');
            var type = $el.closest('[data-sort-type]').data('sort-type');
            m.renderers.dataSort(type, 'asc', '.' + target, $module.find('.all-questionnaires').find('.questionnaire'), $module.find('.all-questionnaires').find('.questionnaires-table'));
        });
        m.events.sortDesc(function (e) {
            e.preventDefault();
            var $el = $(e.target);
            $module.find('.trigger.sort-asc').removeClass('selected');
            $module.find('.trigger.sort-desc').removeClass('selected');
            $el.addClass('selected');
            var target = $el.closest('[data-sort]').data('sort');
            var type = $el.closest('[data-sort-type]').data('sort-type');
            m.renderers.dataSort(type, 'desc', '.' + target, $module.find('.all-questionnaires').find('.questionnaire'), $module.find('.all-questionnaires').find('.questionnaires-table'));
        });

        m.events.onLimitSelect(function (e) {
            $(e.target).closest('form').submit();
        });

        m.events.onFilterSelect(function (e) {
            $(e.target).closest('form').submit();
        });

        m.events.onSearch(function (e) {
            e.preventDefault();
            $(e.target).closest('form').submit();
        });

        m.events.onClear(function (e) {
            e.preventDefault();
            $(e.target).closest('form').submit();
        });

        m.events.onSelectAll(function (e) {
            var $el = $(e.target);
            var $q = $module.find('.questionnaires-table').find('.questionnaire');
            console.log($q);
            if ($el.is(':checked')) {
                $q.addClass('selected');
                $q.find('[type="checkbox"]').prop('checked', true);
            } else {
                $q.removeClass('selected');
                $q.find('[type="checkbox"]').prop('checked', false);
            }
        });

        m.events.onSelectQ(function (e) {
            var $el = $(e.target);
            var $q = $el.closest('.questionnaire');
            if ($el.is(':checked')) {
                $q.addClass('selected');
            } else {
                $q.removeClass('selected');
            }
        });

        m.events.onViewQ(function (e) {
            e.preventDefault();
            var $q = $(e.target).closest('.questionnaire');
            var q = void 0;

            sequence().chain(function (seq) {
                ajax({
                    url: '/questionnaires/get-questionnaire',
                    data: {
                        id: $q.data('id'),
                        token: $module.find('input[name="token"]').val()
                    },
                    callback: function callback(err, res) {
                        q = err ? {} : res.data;
                        seq.resolve();
                    }
                });
            }).chain(function (seq) {
                slickModal({
                    selector: 'view-questionnaire',
                    title: 'View questionnaire',
                    fullscreen: true,
                    easyClose: true,
                    content: '',
                    callbacks: {
                        show: function show() {
                            var $slick = $('.slick-modal.view-questionnaire');
                            var html = "<div class=\"questionnaire opened\" data-id=\"" + q._id + "\">\n                                        <div class=\"questionnaire-header\">\n                                            <h5 class=\"title\">" + q.title + "</h5>\n                                            <p class=\"subtitle\">" + q.description + "</p>\n                                            <span class=\"status " + q.status + "\" title=\"Questionnaire status\">" + utils.capitalize(q.status) + "</span>\n                                        </div>\n                                        <div class=\"questionnaire-body\"><div class=\"answers\">";
                            if (q.status === settings.questionnaires.statuses.completed) {
                                q.answers.forEach(function (a, i) {
                                    html += "<div class=\"answer\" data-type=\"" + a.type + "\" data-index=\"" + (i + 1) + "\">\n                                            <div class=\"text\">\n                                                <span class=\"question-index\">" + (i + 1) + ".</span> " + q.questions[i].text + "\n                                            </div>";

                                    if (a.type === 'text') {
                                        html += "<input type=\"text\" placeholder=\"Insert answer...\" readonly value=\"" + a.text + "\">";
                                    }
                                    if (a.type === 'textarea') {
                                        html += "<textarea placeholder=\"Insert answer...\" readonly>" + a.text + "</textarea>";
                                    }
                                    if (a.type === 'range') {
                                        html += "<div class=\"range-counter\" title=\"Selected value\">" + a.range + "</div>";
                                    }
                                    if (a.type === 'text-range') {
                                        html += "<div class=\"range-counter\" title=\"Selected value\">" + a.range + "</div>\n                                            <input type=\"text\" placeholder=\"Insert answer...\" readonly value=\"" + a.text + "\">";
                                    }
                                    html += "</div>";
                                });
                            } else if (q.status === settings.questionnaires.statuses.assigned) {
                                q.questions.forEach(function (a, i) {
                                    html += "<div class=\"answer\" data-type=\"" + a.type + "\" data-index=\"" + (i + 1) + "\">\n                                            <div class=\"text\">\n                                                <span class=\"question-index\">" + (i + 1) + ".</span> " + a.text + "\n                                            </div>\n                                            <p>Answer not submitted yet...</p>";
                                    html += "</div>";
                                });
                            }

                            html += "</div></div>";
                            $slick.find('.modal-content').html(html);
                            seq.resolve();
                        }
                    }
                });
            }).execute();
        });

        m.events.onBulkAction(function (e) {
            e.preventDefault();
            var action = $module.find('[name="bulk-action"]').find('option:selected').val();
            if (!action || action === '') {
                return notifier.notify({
                    type: 'error',
                    title: 'Error',
                    subtitle: 'Invalid bulk action. Make sure to select a bulk action first.'
                });
            }
            var ids = [];
            $module.find('.questionnaires-table').find('.questionnaire').each(function (i, e) {
                var $el = $(e);
                if ($el.find('.questionnaire-selector').find('[type="checkbox"]').prop('checked')) {
                    ids.push($el.data('id'));
                }
            });
            if (ids.length === 0) {
                return notifier.notify({
                    type: 'error',
                    title: 'Error',
                    subtitle: 'No questionnaires selected. Make sure to select at least one questionnaire first.'
                });
            }

            if (action === 'delete') {
                ajax({
                    url: '/questionnaires/delete',
                    data: {
                        ids: JSON.stringify(ids),
                        token: $module.find('input[name="token"]').val()
                    },
                    callback: function callback(err, res) {
                        if (err) {
                            return notifier.notify({
                                type: 'error',
                                title: 'Error',
                                message: 'Unable to delete selected questionnaire(s). Please refresh the page and try again.'
                            });
                        }
                        if (res.status === 'error') {
                            return notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: res.message
                            });
                        }
                        if (res.status === 'success') {
                            notifier.notify({
                                type: 'success',
                                title: 'Success',
                                subtitle: res.message,
                                callbacks: {
                                    hide: function hide() {
                                        window.location.href = res.redirect || '/questionnaires';
                                    }
                                }
                            });
                        }
                    }
                });
            } else if (action === 'export') {
                ajax({
                    url: '/questionnaires/export',
                    data: {
                        ids: JSON.stringify(ids),
                        token: $module.find('input[name="token"]').val()
                    },
                    callback: function callback(err, res) {
                        if (err) {
                            return notifier.notify({
                                type: 'error',
                                title: 'Error',
                                message: 'Unable to export selected questionnaire(s). Please refresh the page and try again.'
                            });
                        }
                        if (res.status === 'error') {
                            return notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: res.message
                            });
                        }
                        console.log(res);
                        if (res.status === 'success') {
                            var rows = [['Title', 'Assignee Email', 'Question', 'Answer Text', 'Answer Score']];
                            res.data.map(function (q) {
                                if (q.status === settings.questionnaires.statuses.completed) {
                                    q.answers.forEach(function (a, i) {
                                        var cols = i > 0 ? ['', ''] : [q.title, q.assigneeEmail];
                                        cols.push(q.questions[i].text);
                                        cols.push(a.text ? a.text : '');
                                        cols.push(a.range ? a.range : '');
                                        rows.push(cols);
                                    });
                                } else if (q.status === settings.questionnaires.statuses.assigned) {
                                    q.questions.forEach(function (a, i) {
                                        var cols = i > 0 ? ['', ''] : [q.title, q.assigneeEmail];
                                        cols.push(q.questions[i].text);
                                        rows.push(cols);
                                    });
                                }
                            });
                            utils.exportToCsv('questionnaires.csv', rows);
                            notifier.notify({
                                type: 'success',
                                title: 'Success',
                                subtitle: res.message
                            });
                        }
                    }
                });
            }
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr, grecaptcha */
/**
 * Module: Reset Password
 */

questnr.addNode("modules", "resetPass", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');

    module.configure('events').node('onPassReset', function (clb) {
        $module.find('form').find('[type="submit"]').on('click', clb);
    });

    module.configure('actions').node('toggleLoading', function (isOn) {
        if (isOn) {
            $module.find('.trigger.signup').addClass('loading');
        } else {
            $module.find('.trigger.signup').removeClass('loading');
        }
    }).node('init', function () {
        var m = module.getNodes();

        m.events.onPassReset(function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('loading')) {
                return false;
            }
            m.actions.toggleLoading(true);

            if ($module.find('[name="password"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your password first"
                });
            }
            if (!validator.pass({ upperCaseLetter: true, digit: true, passLength: 6 }, $module.find('[name="password"]').val())) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid password, containing an upper case letter and some digits. The password must be at least 6 symbols."
                });
            }
            if ($module.find('[name="password"]').val() !== $module.find('[name="confirm_password"]').val()) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure that password and confirm password fields are equal."
                });
            }
            if (grecaptcha.getResponse() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to check the reCaptcha first"
                });
            }

            ajax({
                url: '/reset-password',
                data: {
                    email: utils.getUrlParam('email'),
                    password: $module.find('[name="password"]').val(),
                    token: $module.find('[name="token"]').val(),
                    captcha: $module.find('[name="g-recaptcha-response"]').val()
                },
                callback: function callback(err, res) {
                    grecaptcha.reset();
                    if (err || res && res.status === "error") {
                        m.actions.toggleLoading(false);
                        return notifier.notify({
                            type: "error",
                            title: "Error",
                            subtitle: err ? err.toString() : res.message
                        });
                    }
                    if (res.status === "success") {
                        notifier.notify({
                            type: "success",
                            title: "Success",
                            subtitle: res.message,
                            callbacks: {
                                hide: function hide() {
                                    window.location.href = res.redirect || '/';
                                }
                            }
                        });
                    }
                }
            });
        });
    });

    module.callNode('actions', 'init');
});
;"use strict";

/* globals questnr, grecaptcha */
/**
 * Module: Sign Up
 */

questnr.addNode("modules", "signup", function ($module, module) {
    "use strict";

    var ajax = questnr.getNode('core', 'ajax');
    var store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events').node('onSignup', function (clb) {
        $module.find('form').find('.trigger.signup').on('click', clb);
    });

    module.configure('actions').node('toggleLoading', function (isOn) {
        if (isOn) {
            $module.find('.trigger.signup').addClass('loading');
        } else {
            $module.find('.trigger.signup').removeClass('loading');
        }
    }).node('init', function () {
        var m = module.getNodes();
        var settings = store.getData();
        $module.find('[name="email"]').focus();

        m.events.onSignup(function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('loading')) {
                return false;
            }
            m.actions.toggleLoading(true);

            if ($module.find('[name="email"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your email first"
                });
            }
            if (!validator.email($module.find('[name="email"]').val())) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid email address"
                });
            }
            if ($module.find('[name="first_name"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your first name"
                });
            }
            if ($module.find('[name="last_name"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your last name"
                });
            }
            if ($module.find('[name="password"]').val() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter your password first"
                });
            }
            if (!validator.pass({ upperCaseLetter: true, digit: true, passLength: 6 }, $module.find('[name="password"]').val())) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to enter a valid password, containing an upper case letter and some digits. The password must be at least 6 symbols."
                });
            }
            if ($module.find('[name="password"]').val() !== $module.find('[name="confirm_password"]').val()) {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure that password and confirm password fields are equal."
                });
            }

            if (grecaptcha.getResponse() === "") {
                m.actions.toggleLoading(false);
                return notifier.notify({
                    type: "error",
                    title: "Error",
                    subtitle: "Make sure to check the reCaptcha first"
                });
            }

            ajax({
                url: '/signup',
                data: {
                    email: $module.find('[name="email"]').val(),
                    firstName: $module.find('[name="first_name"]').val(),
                    lastName: $module.find('[name="last_name"]').val(),
                    password: $module.find('[name="password"]').val(),
                    token: $module.find('[name="token"]').val(),
                    captcha: $module.find('[name="g-recaptcha-response"]').val()
                },
                callback: function callback(err, res) {
                    grecaptcha.reset();
                    if (err || res && res.status === "error") {
                        m.actions.toggleLoading(false);
                        return notifier.notify({
                            type: "error",
                            title: "Error",
                            subtitle: err ? err.toString() : res.message
                        });
                    }
                    if (res.status === "success") {
                        notifier.notify({
                            type: 'success',
                            title: 'Success',
                            subtitle: res.message || 'You have successfully signed up for a ' + settings.appName + ' account. You will be redirected to the login page.',
                            callbacks: {
                                hide: function hide() {
                                    window.location.href = res.redirect || '/';
                                }
                            }
                        });
                    }
                }
            });
        });
    });

    module.callNode('actions', 'init');
});
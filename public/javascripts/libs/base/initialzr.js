
(function(base) {
    "use strict";

    /**
     * Initialzr JavaScript Library
     * v1.1.0
     *
     * Provides app constructs on local and global level
     * Author: Neven Dyulgerov
     * Released under the MIT license
     */

    base.initialzr = function(config) {
        var hasConfig = false;
        var isGlobal = false;

        if ( typeof config === "object" && config !== null ) {
            hasConfig = true;
        }

        if ( hasConfig && typeof config.global === "boolean" ) {
            isGlobal = config.global;
        }

        if ( isGlobal && !hasConfig || isGlobal && hasConfig && !config.name ) {
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

        var factory = function() {
            var augment = function(nodeFamily) {
                var nodes = app.nodes;
                var families = !Array.isArray(nodeFamily) ? [""+nodeFamily] : nodeFamily;
                families.map(function (nf) {
                    if ( ! nodes.hasOwnProperty(nf) ) {
                        nodes[nf] = {};
                    }
                });
                return this;
            };

            var addSchema = function(schemaName, schema) {
                if ( ! schemas.hasOwnProperty(schemaName) && Array.isArray(schema) ) {
                    schemas[schemaName] = schema;
                }
                return this;
            };

            var schema = function(schema) {
                if ( schemas.hasOwnProperty(schema) ) {
                    augment(schemas[schema]);
                }
                return this;
            };

            var addNode = function(nodeFamily, nodeName, func) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(nodeFamily) && ! nodes[nodeFamily].hasOwnProperty(nodeName) && typeof func === "function" ) {
                    nodes[nodeFamily][nodeName] = func;
                }
                return this;
            };

            var getNode = function(nodeFamily, nodeName) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(nodeFamily) && nodes[nodeFamily].hasOwnProperty(nodeName) && typeof nodes[nodeFamily][nodeName] === "function" ) {
                    return nodes[nodeFamily][nodeName];
                } else {
                    return false;
                }
            };

            var callNode = function(nodeFamily, nodeName, params) {
                var nodeParams = typeof params !== "undefined" ? params : {};
                var node = getNode(nodeFamily, nodeName);
                if ( node ) {
                    node(nodeParams);
                }
                return this;
            };

            var getNodes = function(nodeFamily) {
                return nodeFamily && app.nodes.hasOwnProperty(nodeFamily) ? app.nodes[nodeFamily] : app.nodes;
            };

            var configure = function(nodeFamily) {
                var nodes = app.nodes;
                if ( nodes.hasOwnProperty(nodeFamily) ) {
                    return {
                        node: function(nodeName, func) {
                            addNode(nodeFamily, nodeName, func);
                            return this;
                        },
                        configure: configure
                    };
                }
                return false;
            };

            var nodeExists = function(nodeFamily, nodeName) {
                return typeof getNode(nodeFamily, nodeName) === "function";
            };

            var getConfig = function(name) {
                var config = app.config;
                if ( config.hasOwnProperty(name) ) {
                    return config[name];
                } else {
                    return false;
                }
            };

            var createInstance = function() {
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

        var setGlobal = function(instance) {
            base[app.config.name] = base[app.config.name] || instance;
        };

        if ( isGlobal ) {
            setGlobal(factory());
        } else {
            return factory();
        }
    };
})(window);
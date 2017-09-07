
// Sequence
// Exposes methods for synchronous distribution of asynchronous functions

(function(base) {
    "use strict";
    base.sequence = (function() {
        return (function() {
            let chained = [];
            let value;
            let error;

            let chain = function(func) {
                if ( chained ) {
                    chained.push(func);
                }
                return this;
            };

            let execute = function(index) {
                let callback;
                index = typeof index === "number" ? index : 0;
                if ( ! chained || index >= chained.length ) {
                    return true;
                }

                callback = chained[index];
                callback({
                    resolve: function(_value) {
                        value = _value;
                        execute(++index);
                    },
                    reject: function(_error) {
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
        });
    })();
})(window);
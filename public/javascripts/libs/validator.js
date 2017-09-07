
(function(base) {

    base.validator = (function() {
        return {
            email: (val) => {
                return /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(val);
            },
            pass: (options, val) => {
                if ( options.upperCaseLetter && ! /[A-Z]+/.test(val)) {
                    return false;
                }
                if ( options.specialChar && ! /[!@#\$%\^\&*\)\(+=._-]+/.test(val) ) {
                    return false;
                }
                if ( options.digit && ! /[\d]+/.test(val) ) {
                    return false;
                }
                if ( options.passLength && val.length < options.passLength ) {
                    return false;
                }
                return true;
            },
            phone: (val) => {
                return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(val);
            },
            checkbox: (val) => {
                return val.val() === "on";
            }
        }
    })();
})(window);
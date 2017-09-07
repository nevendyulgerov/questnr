
(function(base) {

    base.notifier = (function() {

        // @private property object icons
        var icons = {
            success: 'fa fa-check',
            info:    'fa fa-info',
            warning: 'fa fa-exclamation',
            error: 'fa fa-times'
        };

        // @private method hide
        var show  = function() {};

        // @private method hide
        var hide  = function() {};

        // @private property number hideAfter
        var hideAfter = 5000;

        // @private object notification
        var notification = (function() {
            return {
                globalWrapper: 'body',
                wrapper: 'notifications',
                selector: 'notification',
                init: function() {
                    var $globalWrapper = $(this.globalWrapper);

                    $globalWrapper.append('<div class="' + this.wrapper + '"></div>');
                },
                exists: function() {
                    return $('.' + this.wrapper).length > 0;
                },
                getCallbacks: function(callbacks) {
                    callbacks      = typeof callbacks === 'object' ? callbacks : {};
                    callbacks.show = this.getCallback(callbacks['show']);
                    callbacks.hide = this.getCallback(callbacks['hide']);

                    return callbacks;
                },
                getCallback: function(callback) {
                    return typeof callback === 'function' ? callback : function() {};
                },
                getTemplate: function(settings) {
                    return '<div class="' + this.selector + ' ' + settings.type + '" data-index="' + settings.index + '"><a href="#" class="trigger close-notification"><span class="fa fa-close"></span></a><span class="icon"><span class="'+settings.type+' '+icons[settings.type]+'"></span></span><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p></div>';
                },
                getNotifyConfirmTemplate: function(settings) {
                    return '<div class="notify-and-confirm ' + this.selector + ' ' + settings.type + '" data-index="' + settings.index + '"><span class="icon"><span class="'+settings.type+' '+icons[settings.type]+'"></span></span><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="confirmation-buttons" ><a href="#" class="notifier-btn-confirm">Confirm</a><a href="#" class="notifier-btn-cancel">Cancel</a></div></div>';
                },
                show: function(args) {

                    // get type
                    var type = args.type;

                    // get callbacks
                    var callbacks = this.getCallbacks(args.callbacks);

                    // set local hideAfter
                    var hideDelay = typeof args.hideAfter === 'number' ? args.hideAfter : hideAfter;

                    // initialize, if not initialized already
                    if ( ! this.exists() ) {
                        this.init();
                    }

                    // set default notification type
                    if ( ! icons.hasOwnProperty(type) ) {
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
                    show();

                    // execute local show
                    callbacks.show();

                    // call hide action
                    this.hide(settings.index, callbacks.hide, hideDelay);

                    this.initActionHandlers($notification, callbacks.hide);
                },
                notifyAndConfirm: function(args) {

                    // get type
                    var type = args.type || 'info';

                    // get callbacks
                    var callbacks = this.getCallbacks(args.callbacks);

                    // set local hideAfter
                    var hideDelay = typeof args.hideAfter === 'number' ? args.hideAfter : hideAfter;

                    // initialize, if not initialized already
                    if ( ! this.exists() ) {
                        this.init();
                    }

                    // set default notification type
                    if ( ! icons.hasOwnProperty(type) ) {
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
                    show();

                    // execute local show
                    callbacks.show();

                    // assign event handler
                    $notification.find('.notifier-btn-confirm').on('click', function(e) {
                        e.preventDefault();
                        // hide confirmation
                        $notification.hide();
                        $notification.remove();

                        // execute onConfirm callback
                        callbacks.onConfirm();
                    });

                    // assign event handler
                    $notification.find('.notifier-btn-cancel').on('click', function(e) {
                        // prevent default action
                        e.preventDefault();

                        // hide confirmation
                        $notification.hide();
                        $notification.remove();

                        // execute onCancel callback
                        callbacks.onCancel();
                    });
                },
                hide: function(index, callback, hideDelay) {
                    var that = this;

                    setTimeout(function() {
                        if ( $('.' + that.selector + '[data-index="' + index + '"]:hover').length != 0 ) {

                            // call hide recursively
                            that.hide(index, callback);
                        } else {

                            // hide notification
                            var $notification = $('.' + that.selector + '[data-index="' + index + '"]');

                            $notification.hide();

                            // execute global hide
                            hide();

                            // execute local hide
                            callback();
                        }
                    }, hideDelay);
                },
                initActionHandlers: function($notification, callback) {
                    $notification.on('click', '.trigger.close-notification', function(e) {
                        e.preventDefault();
                        $notification.hide();

                        // execute global hide
                        hide();

                        // execute local hide
                        callback();
                    });
                }
            }
        })();


        // @private confirmation
        var confirmation = (function() {
            var obj = {};
            $.extend(obj, notification);

            obj.btnCancelSelector     = 'notifier-btn-cancel';
            obj.btnConfirmSelector    = 'notifier-btn-confirm';
            obj.confirmWrapper        = 'confirmations';
            obj.confirmSelector       = 'confirmation';

            obj.init = function() {
                var $globalWrapper = $(this.globalWrapper);
                $globalWrapper.css({ position: 'relative' });
                $globalWrapper.append('<div class="' + this.confirmWrapper + '"></div>');
            };

            obj.getConfirmTemplate = function(settings) {
                return '<div class="' + this.confirmSelector + ' ' + settings.type + '" data-index="' + settings.index + '"><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="confirmation-buttons" ><a href="#" class="' + obj.btnConfirmSelector + '">Confirm</a><a href="#" class="' + obj.btnCancelSelector + '">Cancel</a></div></div>';
            };

            obj.initActionHandlers = function($confirmWrapper, $notification, onConfirm, onCancel) {

                $('.' + obj.btnConfirmSelector).on('click', function(e) {
                    e.preventDefault();
                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onConfirm callback
                    onConfirm();
                });

                $('.' + obj.btnCancelSelector).on('click', function(e) {
                    // prevent default action
                    e.preventDefault();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onCancel callback
                    onCancel();
                });
            };

            obj.confirm = function(args) {
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

                if ( args.selector ) {
                    $notification.addClass(args.selector);
                }

                $notification.show();

                this.initActionHandlers($confirmWrapper, $notification, onConfirm, onCancel);
            };

            return obj;
        })();


        // @private confirmData
        var confirmationData = (function() {
            var obj = {};
            $.extend(obj, confirmation);

            obj.formWrapper = 'notifier-form';
            obj.input       = 'notifier-input';

            obj.getConfirmTemplate = function(settings) {
                return '<div class="' + this.confirmSelector + ' ' + settings.type + '" data-index="' + settings.index + '"><p class="title">' + settings.args.title + '</p><p class="subtitle">' + settings.args.subtitle + '</p><div class="notifier-form-wrapper"><form class="' + obj.formWrapper + '"><input class="' + obj.input + '" type="text"/></form></div><div class="confirmation-buttons" class="' + obj.btnConfirmSelector + '">Confirm</a><a href="#" class="' + obj.btnCancelSelector + '">Cancel</a></div></div>';
            };

            obj.initActionHandlers = function($confirmWrapper, $notification, onConfirm, onCancel) {

                $('.' + obj.btnConfirmSelector).on('click', function(e) {
                    e.preventDefault();
                    var userInput = $('.notifier-form').find('input').val();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    // execute onConfirm callback
                    onConfirm(userInput);
                });

                $('.' + obj.btnCancelSelector).on('click', function(e) {
                    // prevent default action
                    e.preventDefault();

                    // hide confirmation
                    $notification.hide();
                    $confirmWrapper.remove();

                    onCancel();
                });
            };

            return obj;
        })();


        // @public notify
        var notify = function(args) {

            // set args
            args = typeof args === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification on event, if client has defined an event
            if ( typeof args.showOnEvent !== 'undefined' && args.showOnEvent.length > 0 ) {
                $(document).on(args.showOnEvent, function() {
                    // show notification with delay
                    setTimeout(function() {
                        notification.show(args);
                    }, delay);
                });
            } else {
                // show notification with delay
                setTimeout(function() {
                    notification.show(args);
                }, delay);
            }

            // enable cascade
            return this;
        };


        // @public confirm
        var confirm = function(args) {

            // set args
            args = typeof args === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function() {
                confirmation.confirm(args);
            }, delay);

            // enable cascade
            return this;
        };


        // @public notifyAndConfirm
        var notifyAndConfirm = function(args) {

            // set args
            args = typeof args === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function() {
                notification.notifyAndConfirm(args);
            }, delay);

            // enable cascade
            return this;
        };


        // @public confirmData
        var confirmData = function(args) {

            // set args
            args = typeof args === 'object' ? args : {};

            // set delay
            var delay = typeof args.delay === 'number' && args.delay > 0 ? args.delay : 0;

            // show notification with delay
            setTimeout(function() {
                confirmationData.confirm(args);
            }, delay);

            // enable cascade
            return this;
        };


        // @public init
        var init = function(args) {

            // configure args
            args = typeof args === 'object' ? args : {};

            // update show callback, if the client has provided one
            if ( typeof args.show === 'function' ) {
                show = args.show;
            }

            // update hide callback, if the client has provided one
            if ( typeof args.hide === 'function' ) {
                hide = args.hide;
            }

            // update icons, if the client has provided icons
            if ( typeof args.icons === 'object' ) {
                icons = args.icons;
            }

            // update hideAfter, if the client has provided one
            if ( typeof args.hideAfter === 'number' ) {
                hideAfter = args.hideAfter;
            }

            // enable cascade
            return this;
        };

        // notify
        return {
            init,
            notify,
            confirm,
            notifyAndConfirm
        };
    })();
})(window);
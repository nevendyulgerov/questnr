
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

    let slick = initialzr().schema('default');

    slick.configure("events")
        .node("onCancel", function(clb) {
            $('.slick-modal').find('.cancel').on('click', clb);
        })
        .node("onConfirm", function(clb) {
            $('.slick-modal').find('.confirm').on('click', clb);
        })
        .node("onClose", function(clb) {
            $('.slick-modal').find('.close').on('click', clb);
        })
        .node("onToggleFullscreen", function(clb) {
            $('.slick-modal').find('.trigger.fullscreen').on('click', clb);
        })
        .node("onAnyClick", function(clb) {
            $(document).on('click', clb);
        });

    slick.configure("renderers")
        .node("append", function(slickEl) {
            let $body = $('body'), $slick = $('.slick-modal');
            if ( $slick.length > 0) {
                $slick.remove();
            }
            $body.append(slickEl);
            if ( $body.find('.slick-modal-overlay').length === 0 ) {
                $body.append('<div class="slick-modal-overlay"></div>');
            }
        })
        .node("show", function(clb) {
            let $body = $('body');
            $body.find('.slick-modal-overlay').addClass('active');
            $body.find('.slick-modal').addClass('active');
            clb();
        })
        .node("hide", function(clb) {
            let $body = $('body');
            $body.find('.slick-modal-overlay').removeClass('active');
            $body.find('.slick-modal').removeClass('active');
            clb();
        });

    slick.configure("actions")
        .node("createSlick", function(opts) {
            let templ = '' +
                '<div class="slick-modal {selector}">'+
                '<div class="modal-header"><div class="title"><h2>{title}</h2></div>{fullscreen}<a href="#" class="trigger close" title="Close window"><span class="icon">+</span></a></div>'+
                '<div class="modal-body"><div class="modal-content">{content}</div></div>'+
                '<div class="modal-footer">{cancelBtn}{confirmBtn}</div>'+
                '</div>';
            return templ
                .replace("{selector}", opts.selector)
                .replace("{title}", opts.title)
                .replace("{fullscreen}", opts.hasFullscreen ? '<a href="#" class="trigger fullscreen" title="Toggle fullscreen"><span class="icon"></span></a>' : '')
                .replace("{content}", opts.content)
                .replace("{cancelBtn}", opts.cancelText ? '<a href="#" class="trigger cancel">'+opts.cancelText+'</a>' : '')
                .replace("{confirmBtn}", opts.confirmText ? '<a href="#" class="trigger confirm">'+opts.confirmText+'</a>' : '');
        })
        .node("toggleBody", function() {
            "use strict";
            let bodyStyle = $('body')[0].style;
            return function(isOn) {
                bodyStyle.overflowY = isOn ? 'auto' : 'hidden';
            };
        })
        .node("init", function(options) {
            let app = slick.getNodes();
            let opts = {};
            let $slick;
            let toggleBody = app.actions.toggleBody();
            opts.title = options.title || "";
            opts.content = options.content || "";
            opts.selector = options.selector || "";
            opts.cancelText = options.cancelText;
            opts.confirmText = options.confirmText;
            opts.hasClbs = typeof options.callbacks === "object";
            opts.hasFullscreen = typeof options.fullscreen === "boolean" && options.fullscreen;
            opts.isEasyCls = typeof options.easyClose === "boolean" && options.easyClose;
            opts.isAsyncConfirm = typeof options.asyncConfirm === "boolean" && options.asyncConfirm;
            opts.clbs = {
                show: opts.hasClbs && typeof options.callbacks.show === "function" ? options.callbacks.show : function() {},
                cancel: opts.hasClbs && typeof options.callbacks.cancel === "function" ? options.callbacks.cancel : function() {},
                confirm: opts.hasClbs && typeof options.callbacks.confirm === "function" ? options.callbacks.confirm : function() {},
                beforeConfirm: opts.hasClbs && typeof options.callbacks.beforeConfirm === "function" ? options.callbacks.beforeConfirm : function() {return true}
            };

            app.renderers.append(app.actions.createSlick(opts));
            $slick = $('.slick-modal');
            app.renderers.show(function() {
                opts.clbs.show();
                toggleBody(false);
            });

            app.events.onCancel(function(e) {
                e.preventDefault();
                app.renderers.hide(opts.clbs.cancel);
                toggleBody(true);
            });

            app.events.onConfirm(function(e) {
                e.preventDefault();

                if ( opts.isAsyncConfirm ) {
                    return opts.clbs.beforeConfirm(function(canHide) {
                        if ( canHide ) {
                            app.renderers.hide(opts.clbs.confirm);
                            toggleBody(true);
                        }
                    });
                }

                if ( opts.clbs.beforeConfirm() ) {
                    app.renderers.hide(opts.clbs.confirm);
                    toggleBody(true);
                }
            });

            app.events.onClose(function(e) {
                e.preventDefault();
                app.renderers.hide(opts.clbs.cancel);
                toggleBody(true);
            });

            app.events.onToggleFullscreen(function(e) {
                e.preventDefault();
                if ( $slick.hasClass('fullscreen') ) {
                    $slick.removeClass('fullscreen');
                } else {
                    $slick.addClass('fullscreen');
                }
            });

            if ( opts.isEasyCls ) {
                app.events.onAnyClick(function() {
                    if ($slick.hasClass('active') && $slick.filter(':hover').length === 0) {
                        app.renderers.hide(opts.clbs.cancel);
                        toggleBody(true);
                    }
                });
            }
        });

    base.slickModal = slick.getNode("actions", "init");
})(window);
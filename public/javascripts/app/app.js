"use strict";
/*globals questnr, $, initialzr, storage, sequence */

/**
 * Initialize global app
 */
((i) => { i({ name:"questnr", global: true }); })(initialzr);


/**
 * Configure global app
 */
questnr.schema('app')
    .configure('events')

    /**
     * Ready event
     * App's entrypoint
     */
    .node('onReady', (clb) => {
        $(document).ready(clb);
    })
    .configure('core')

    /**
     * Ajax
     * Global ajax API
     */
    .node('ajax', (opts) => {
        $.ajax({
            type: opts.type || "POST",
            url: opts.url || "",
            data: opts.data || {},
            dataType: opts.dataType || "JSON",
            success: (res) => {
                if ( opts.callback ) {
                    opts.callback(null, res);
                }
            },
            error: (xhr, status, err) => {
                if ( opts.callback ) {
                    opts.callback(err, null);
                }
            }
        });
    })

    /**
     * Storage key
     * Global key for referencing the app's storage
     */
    .node('storeKey', () => {
        return $('body').data('app-name').split(' ').map((a) => {return a.toLowerCase();}).join('_')+'_settings';
    })

    /**
     * Settings
     * Retrieves global app settings available via storage
     */
    .node('settings', (clb) => {
        let app = questnr.getNodes('core');
        let store = storage(app.storeKey());
        app.ajax({
            url: '/api/settings',
            callback: (err, res) => {
                if ( err || res && res.status === "error" ) {
                    console.error(err);
                }
                if ( res.status === "success" ) {
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
    .node('nodeManager', () => {
        let app = questnr.getNodes();
        return {
            callModules(selector) {
                let $modules = $(selector || '[data-module]');
                $modules.each((i, e) => {
                    let m = $(e).data('module');
                    if ( app.modules.hasOwnProperty(m) && typeof app.modules[m] === "function" ) {
                        app.modules[m]($(e), initialzr().schema('default'));
                    }
                });
                return this;
            },
            callCommon() {
                Object.keys(app.common).forEach((a) => { app.common[a](initialzr().schema('default')); });
                return this;
            }
        };
    })
    .configure('actions')

    /**
     * Initialization
     */
    .node('init', () => {
        let app = questnr.getNodes();
        sequence()
            .chain((seq) => {
                app.events.onReady(seq.resolve);
            })
            .chain((seq) => {
                app.core.settings(seq.resolve);
            })
            .chain(() => {
                app.core.nodeManager()
                    .callCommon()
                    .callModules();
            })
            .execute();
    });

questnr.callNode('actions', 'init');
/* globals questnr */

/**
 * Common: Monitor
 */

questnr.addNode("common", "monitor", (module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');
    let store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events')
        .node('onLogout', (clb) => {
            $(document).on('click', '.top-menu .logout a', clb);
        });

    module.configure('actions')
        .node('monitorIdleState', (timeout, check, clb) => {
            let idleTime = 0;
            let resetTimer = function() {
                idleTime = 0;
            };
            let incrementTimer = function() {
                idleTime++;
                if ( idleTime > timeout ) {
                    if ( _.isFunction(clb) ) {
                        clb();
                    }
                }
            };
            setInterval(incrementTimer, check);
            $(document).on('mousemove keypress', resetTimer);
        })
        .node('init', () => {
            let m = module.getNodes();
            let settings = store.getData();

            m.actions.monitorIdleState(15, 60000, () => {
                $('.logout').find('a').trigger('click');
            });

            if ( settings.justLoggedIn ) {
                store.removeItem('justLoggedIn');
                notifier.notify({
                    type: 'success',
                    title: 'Hi, '+settings.user.firstName,
                    subtitle: 'Welcome to '+settings.appName+'.'
                });
            }

            if ( settings.justLoggedOut ) {
                store.removeItem('justLoggedOut');
                notifier.notify({
                    type: 'success',
                    title: 'Success',
                    subtitle: 'You have successfully logged out of your '+settings.appName+' account.'
                });
            }

            m.events.onLogout((e) => {
                e.preventDefault();
                ajax({
                    url: '/login/logout',
                    callback: (err, res) => {
                        if ( err || res && res.status === 'error' ) {
                            notifier.notify({
                                type: 'error',
                                title: 'Error',
                                subtitle: res && res.status ? res.status : 'Unable to logout. Please try again.'
                            });
                        }
                        if ( res.status === 'success' ) {
                            store.setItem('justLoggedOut', true);
                            window.location.href = res.redirect || '/';
                        }
                    }
                });
            });
        });

    module.callNode('actions', 'init');
});
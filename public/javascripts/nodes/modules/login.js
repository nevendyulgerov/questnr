/* globals questnr, grecaptcha */
/**
 * Module: Login
 */

questnr.addNode("modules", "login", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');
    let store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events')
        .node('onLogin', (clb) => {
            $module.find('form').find('.trigger.login').on('click', clb);
        });

    module.configure('actions')
        .node('toggleLoading', (isOn) => {
            if ( isOn ) {
                $module.find('.trigger.login').addClass('loading');
            } else {
                $module.find('.trigger.login').removeClass('loading');
            }
        })
        .node('init', () => {
            let m = module.getNodes();
            $module.find('[name="email"]').focus();

            m.events.onLogin((e) => {
                e.preventDefault();
                if ( $(e.target).hasClass('loading') ) {
                    return false;
                }

                m.actions.toggleLoading(true);

                if ( $module.find('[name="email"]').val() === "" ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter your email first"
                    });
                }
                if ( ! validator.email($module.find('[name="email"]').val()) ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter a valid email address"
                    });
                }
                if ( $module.find('[name="password"]').val() === "" ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter your password first"
                    });
                }
                if ( ! validator.pass({upperCaseLetter: true,digit: true, passLength: 6}, $module.find('[name="password"]').val()) ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter a valid password, containing an upper case letter and some digits. The password must be at least 6 symbols."
                    });
                }
                if ( grecaptcha.getResponse() === "" ) {
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
                    callback: (err, res) => {
                        grecaptcha.reset();
                        if ( err || res && res.status === "error" ) {
                            m.actions.toggleLoading(false);
                            return notifier.notify({
                                type: "error",
                                title: "Error",
                                subtitle: err ? err.toString() : res.message
                            });
                        }
                        if ( res.status === "success" ) {
                            store.setItem("justLoggedIn", true);
                            window.location.href = res.redirect || '/';
                        }
                    }
                });
            });
        });

    module.callNode('actions', 'init');
});
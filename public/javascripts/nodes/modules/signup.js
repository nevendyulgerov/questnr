/* globals questnr, grecaptcha */
/**
 * Module: Sign Up
 */

questnr.addNode("modules", "signup", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');
    let store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events')
        .node('onSignup', (clb) => {
            $module.find('form').find('.trigger.signup').on('click', clb);
        });

    module.configure('actions')
        .node('toggleLoading', (isOn) => {
            if ( isOn ) {
                $module.find('.trigger.signup').addClass('loading');
            } else {
                $module.find('.trigger.signup').removeClass('loading');
            }
        })
        .node('init', () => {
            let m = module.getNodes();
            let settings = store.getData();
            $module.find('[name="email"]').focus();

            m.events.onSignup((e) => {
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
                if ( $module.find('[name="first_name"]').val() === "" ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter your first name"
                    });
                }
                if ( $module.find('[name="last_name"]').val() === "" ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter your last name"
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
                if ( ! validator.pass({upperCaseLetter: true, digit: true, passLength: 6}, $module.find('[name="password"]').val()) ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter a valid password, containing an upper case letter and some digits. The password must be at least 6 symbols."
                    });
                }
                if ( $module.find('[name="password"]').val() !== $module.find('[name="confirm_password"]').val() ) {
                    m.actions.toggleLoading(false);
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure that password and confirm password fields are equal."
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
                    url: '/signup',
                    data: {
                        email: $module.find('[name="email"]').val(),
                        firstName: $module.find('[name="first_name"]').val(),
                        lastName: $module.find('[name="last_name"]').val(),
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
                            notifier.notify({
                                type: 'success',
                                title: 'Success',
                                subtitle: res.message || 'You have successfully signed up for a '+settings.appName+' account. You will be redirected to the login page.',
                                callbacks: {
                                    hide: () => {
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
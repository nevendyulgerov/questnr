/* globals questnr, grecaptcha */
/**
 * Module: Reset Password
 */

questnr.addNode("modules", "resetPass", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');

    module.configure('events')
        .node('onPassReset', (clb) => {
            $module.find('form').find('[type="submit"]').on('click', clb);
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

            m.events.onPassReset((e) => {
                e.preventDefault();
                if ( $(e.target).hasClass('loading') ) {
                    return false;
                }
                m.actions.toggleLoading(true);

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
                    url: '/reset-password',
                    data: {
                        email: utils.getUrlParam('email'),
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
                                type: "success",
                                title: "Success",
                                subtitle: res.message,
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
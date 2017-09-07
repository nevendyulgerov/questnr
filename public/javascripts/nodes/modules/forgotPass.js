/* globals questnr, grecaptcha */

/**
 * Module: Forgot Password
 */

questnr.addNode("modules", "forgotPass", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');

    module.configure('events')
        .node('onPassReset', (clb) => {
            $module.find('form').find('[type="submit"]').on('click', clb);
        });

    module.configure('actions')
        .node('init', () => {
            let m = module.getNodes();

            $module.find('[name="email"]').focus();

            m.events.onPassReset((e) => {
                e.preventDefault();
                if ( $module.find('[name="email"]').val() === "" ) {
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter your email address first"
                    });
                }
                if ( ! validator.email($module.find('[name="email"]').val()) ) {
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to enter a valid email address first"
                    });
                }
                if ( grecaptcha.getResponse() === "" ) {
                    return notifier.notify({
                        type: "error",
                        title: "Error",
                        subtitle: "Make sure to check the reCaptcha first"
                    });
                }

                ajax({
                    url: '/forgot-password',
                    data: {
                        email: $module.find('[name="email"]').val(),
                        token: $module.find('[name="token"]').val(),
                        captcha: $module.find('[name="g-recaptcha-response"]').val()
                    },
                    callback: (err, res) => {
                        grecaptcha.reset();
                        if ( err || res && res.status === "error" ) {
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
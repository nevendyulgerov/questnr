/* globals questnr */
/**
 * Common: Header
 */

questnr.addNode("common", "header", (module) => {
    "use strict";

    module.configure('events')
        .node('onMenuToggle', (clb) => {
            $('.trigger.toggle-mobile-menu').on('click', clb);
        })
        .node('onOverlayClick', (clb) => {
            $('.main-overlay').on('click', clb);
        })
        .node('onProfileClick', (clb) => {
            $('.main-navigation').on('click', '.profile', clb);
        });

    module.configure('actions')
        .node('rndGradient', ($target, multiplier) => {
            let randomGradient = function() {
                let c1 = {
                    r: Math.floor(Math.random()*multiplier),
                    g: Math.floor(Math.random()*multiplier),
                    b: Math.floor(Math.random()*multiplier)
                };
                let c2 = {
                    r: Math.floor(Math.random()*multiplier),
                    g: Math.floor(Math.random()*multiplier),
                    b: Math.floor(Math.random()*multiplier)
                };
                c1.rgb = 'rgb('+c1.r+','+c1.g+','+c1.b+')';
                c2.rgb = 'rgb('+c2.r+','+c2.g+','+c2.b+')';
                return 'radial-gradient(at top left, '+c1.rgb+', '+c2.rgb+')';
            };
            $target.css({'background': randomGradient()});
        })
        .node('polygonBg', ($target, $targetResize, options) => {
            let targetStyle = $target[0].style;
            let $polygonCanvas;
            let pattern;
            let buffer = utils.buffer();

            let destroyPreviousPolygon = function() {
                let $previousCanvas = $target.find('canvas');
                if ( $previousCanvas.length > 0 ) {
                    $previousCanvas.remove();
                }
            };

            let initPolygon = function() {
                let settings = {
                    x_colors: options.x_colors,
                    variance: options.variance,
                    cell_size: options.cell_size,
                    width: $target.width(),
                    height: $target.height()
                };

                pattern = Trianglify(settings);
                $polygonCanvas = $target.find('.polygon-canvas');

                if ( $polygonCanvas.length <= 0 ) {
                    return console.warn("[polygonBackground]: Cannot find canvas wrapper. Make sure to define the wrapper in your html first.");
                }

                $target.find('.polygon-canvas').append(pattern.canvas());
            };

            let initActions = function() {
                $(window).resize(function() {
                    buffer($target.attr('class'), 300, () => {
                        targetStyle.width = $targetResize.width()+"px";
                        init();
                    });
                });
            };

            let init = function() {
                destroyPreviousPolygon();
                initPolygon();
                initActions();
            };

            init();
        })
        .node('init', () => {
            let m = module.getNodes();
            let $body = $('body');
            let $nav = $('ul.main-navigation');
            let $menuIcon = $('.hamburger');
            let $overlay = $('.main-overlay');

            m.actions.polygonBg($('.header-content'), $(window), {
                x_colors: "Greens",
                variance: 0.5,
                cell_size: 60
            });

            m.actions.polygonBg($('.logo').find('.image-box'), $('.logo').find('.image-box'), {
                x_colors: "Greens",
                variance: 0.3,
                cell_size: 10
            });

            m.events.onMenuToggle((e) => {
                e.preventDefault();
                if ( $menuIcon.is('.active') ) {
                    $nav.attr('data-state', 'closed');
                    $menuIcon.removeClass('active');
                    $overlay.removeClass('active');
                    $body.css({'overflow-y':'auto'});
                } else {
                    $nav.attr('data-state', 'opened');
                    $menuIcon.addClass('active');
                    $overlay.addClass('active');
                    $body.css({'overflow-y':'hidden'});
                }
            });

            m.events.onOverlayClick(() => {
                if ( $overlay.filter(':hover').length > 0 && $nav.filter(':hover').length === 0 ) {
                    $nav.attr('data-state', 'closed');
                    $menuIcon.removeClass('active');
                    $overlay.removeClass('active');
                    $body.css({'overflow-y':'auto'});
                }
            });

            m.events.onProfileClick((e) => {
                e.preventDefault();
            });
        });

    module.callNode('actions', 'init');
});
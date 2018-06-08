//name global vars referenced for JSlint happiness:
/*global $, isMobile, console, alert, ScrollMagic, Power1, Sine, Linear, TweenMax, TimelineLite, TimelineMax, ga, dataLayer, trackEvent, trackVirtualPageView */
$(function () {
    "use strict";
    //MAIN ENTRY POINT AT END of script ***************
    
    //lazyload scene 3&4 bg images ***************************    
    var didScroll = false;
    //set named scroll event
    $(window).on('scroll.lazy', function () {
        didScroll = true;
    });
    //create timer
    var lazyInterval = setInterval(function () {
        if (didScroll) {
            //run once
            didScroll = false;
            //add css hook
            $('html').addClass('lazy');
            //cancel scroll event
            $(window).off('scroll.lazy');
            //clear timer
            clearInterval(lazyInterval);
        }
    }, 100);
    
    
    //Revealing text fade *********************************** ************* *************   
    //https://github.com/dulaccc/Revealing.js
    
    //reference toggle button for resetting appearance
    var $toggleButton = $('#content-toggle');
    //declare timers to clear before running
    var timer1, timer2;

    var runRevealingText = function runRevealingText(elem, multielem) {
        //allow for single 'elem' operation, or triggering sequential run 1 run 2 with 'multielem'

        //run on provided element(s) within active scene's content
        var $textToFade = $(elem, '.scene-active .scene-content');
        
        // initialize the plugin, reset from previous use
        $textToFade.revealing('reset');

        //target for overall opacity
        $textToFade.addClass('reveal-this');
        
        //cleardelay and run
        function doReveal($revealTarget) {
            window.clearTimeout(timer1);
            $toggleButton.removeClass('toggled');
            timer1 = window.setTimeout(function () {
                $revealTarget.revealing('show');
            }, 150);
        }
        doReveal($textToFade);
        
        //handle scenes with multiple elements sequentially
        if (multielem !== false) {
            var $textToFade2 = $(multielem, '.scene-active .scene-content');
            //clear previous timer
            window.clearTimeout(timer2);
            //run timer to switch text
            timer2 = window.setTimeout(function () {
                //sets overall opacity
                $textToFade.removeClass('reveal-this');
                $textToFade2.addClass('reveal-this');
                //initialize plugin, reset, and run on text2
                $textToFade2.revealing('reset');
                doReveal($textToFade2);
                //show toggle button
                $toggleButton.addClass('visible').toggleClass('toggled');
            }, 4500);
        }
    };
    //called from SM on'leave'
    var clearRevealing = function clearRevealing(sceneToClear) {
        //reset timers
        window.clearTimeout(timer1);
        window.clearTimeout(timer2);
        //remove revealing classes from scoped content
        $('h2, h3', sceneToClear + ' .scene-content').removeClass('reveal-this');
        //hide content toggle button
        $toggleButton.removeClass('visible toggled');
    };
    //simple h2<>h3 class toggle for above.
    $('#content-toggle').on('click tap', function () {
        $(this).toggleClass('toggled');
        $('h2, h3', '.scene-active .scene-content').toggleClass('reveal-this');
    });

    
    //BEGIN THE SCROLLMAGIC.. MAGIC **************************** ************* ************* ************* 
    var initMagic = function initMagic() {

        //init controller
        var controllerSm = new ScrollMagic.Controller();

        //various eases used:
        //ease: Linear.easeNone
        //ease: Power1.easeInOut        
        //ease: Sine.easeOut
        //ease: Sine.easeIn
        
        //reuse scene transitions
        var sceneBgOutProps = {
            top: '-100%',
            ease: Power1.easeInOut
        },
            sceneBgInProps = {
                top: '0%',
                ease: Power1.easeInOut
            },
            sceneContentInProps = {
                opacity: 1,
                ease: Power1.easeInOut
            },
            sceneContentOutProps = {
                opacity: 0,
                top: '30%',
                ease: Power1.easeInOut
            },
            sceneLinksOutProps = {
                opacity: 0,
                ease: Power1.easeInOut
            },
            sceneNavProps = {
                strokeDashoffset: 0,
                ease: Power1.easeOut
            };

        //vars for reuse in time and tween functions
        var timeS = '.2',
            timeM = '.5',
            timeL = '1';
        var sceneDur = '50%',//scroll position difference in which transitions take place 
            sceneMasterDur = '100%',
            navsceneDur = 200,
            navsceneOffset = 100;//200

        //keep track of current scene for various ops
        var currentScene = 1;

        //SCENES, in order of time-position, top down *************************

        //SCENE 1 ***********
        //Xmaster scenes are the duration of the whole div, used for continuous scene triggers, currentScene tracking.
        var scene1master = new ScrollMagic.Scene({
                triggerElement: '#scene-1',
                duration: sceneMasterDur
            })
                .setClassToggle('#scene-1', 'scene-active')
                .on('enter', function () {
                    currentScene = 1;
                    runRevealingText('h1, h2', false);
                    $('.navdot').removeClass('scene-dotactive');
                })
                .addTo(controllerSm);
           
        //NavIntro SCENE.  4x dots intro, navCircle draw in, nav-scroll drop
        var sceneNavIntroTime = new TimelineLite(),
            snit1 = TweenMax.to('#navdot1, #navdot4', timeM, {
                left: '-210px',
                opacity: 1,
                ease: Sine.easeOut
            }),
            snit2 = TweenMax.to('#navdot3, #navdot2', timeM, {
                left: '210px',
                opacity: 1,
                ease: Sine.easeOut
            }),
            snit3 = TweenMax.to('.navmainarc', timeL, {
                strokeDashoffset: 0,
                ease: Sine.easeOut
            }),
            //http://greensock.com/docs/#/HTML5/Plugins/BezierPlugin/
            snit4 = TweenMax.to('#navdot1', timeM, {
                bezier: { curviness: 1.8, values: [{left: '-210px', top: '0px'}, {left: '-148px', top: '-148px'}, {left: '0px', top: '-210px'}]},
                ease: Sine.easeOut
            }),
            snit5 = TweenMax.to('#navdot3', timeM, {
                bezier: { curviness: 1.8, values: [{left: '210px', top: '0px'}, {left: '148px', top: '148px'}, {left: '0px', top: '210px'}]},
                ease: Sine.easeOut
            }),
            snavscroll = TweenMax.to('#nav-scroll', timeM, {css: {className: '+=nav-scroll-active'}});
        
        //add tweens in groups to run sequentially
        sceneNavIntroTime
            .add([snavscroll, snit1, snit2])
            .add([snit3, snit4, snit5]);

        var sceneNavIntro = new ScrollMagic.Scene({
            triggerElement: '#scene-2',
            offset: -200,
            duration: sceneDur
        })
            .setTween(sceneNavIntroTime)
            .addTo(controllerSm);
        

        //SCENE 2 ***********
        var scene2master = new ScrollMagic.Scene({
            triggerElement: '#scene-2',
            duration: sceneMasterDur
        })
            .setClassToggle('#scene-2', 'scene-active')
            .on('enter', function (event) {
                currentScene = 2;
                runRevealingText('h2', 'h3');
                //add highlighted dot if coming from next scene
                if (event.scrollDirection === 'REVERSE') {
                    $('#navdot2').addClass('scene-dotactive');
                }
                $('#navdot3, #navdot4').removeClass('scene-dotactive');
            })
            .on('leave', function () {
                clearRevealing('#scene-2');
            })
            .addTo(controllerSm);

        //Xtime Timelines and sceneX scenes are for shorter animated transitions, enabling semi-pinned appearance for content
        var scene2time = new TimelineLite(),
            s2t1 = TweenMax.to('#scene-1 .scene-background', timeL, sceneBgOutProps),
            s2t4 = TweenMax.to('#scene-2 .scene-background', timeL, sceneBgInProps),
            s2t2 = TweenMax.to('#scene-1 .scene-content', timeM, sceneContentOutProps),
            s2t3 = TweenMax.to('#scene-2 .scene-content, #scene-2 .scene-links, #links-social', timeL, sceneContentInProps);
        scene2time.add([s2t1, s2t2, s2t3, s2t4]);
        
        var scene2 = new ScrollMagic.Scene({
            triggerElement: '#scene-2',
            duration: sceneDur
        })
            .setTween(scene2time)
            .addTo(controllerSm);
      
        //SCENE 2 nav circle
        var scene2navtime = new TimelineLite(),
            s2tn0 = TweenMax.to('#navsectionarc-1, #navsectionarcstroke-1', '.01', {css: {className: '+=scene-active'}}),
            s2tn1 = TweenMax.to('#navsectionarc-1, #navsectionarcstroke-1', timeL, sceneNavProps),
            s2tn2 = TweenMax.to('#navdot2', '.01', {css: {className: '+=scene-dotactive'}});
        scene2navtime.add(s2tn0).add(s2tn1).add(s2tn2);

        var scene2nav = new ScrollMagic.Scene({
            triggerElement: "#scene-2",
            offset: navsceneOffset,
            duration: navsceneDur
        })
            .setTween(scene2navtime)
            .addTo(controllerSm);

        //SCENE 3 ***********
        var scene3master = new ScrollMagic.Scene({
            triggerElement: '#scene-3',
            duration: sceneMasterDur
        })
            .setClassToggle('#scene-3, #navdot3', 'scene-active')
            .on('enter', function (event) {
                currentScene = 3;
                runRevealingText('h2', 'h3');
                if (event.scrollDirection === 'REVERSE') {
                    $('#navdot3').addClass('scene-dotactive');
                }
                $('#navdot4').removeClass('scene-dotactive');
            })
            .on('leave', function () {
                clearRevealing('#scene-3');
            })
            .addTo(controllerSm);

        var scene3time = new TimelineLite(),
            s3t1 = TweenMax.to('#scene-2 .scene-background', timeL, sceneBgOutProps),
            s3t5 = TweenMax.to('#scene-3 .scene-background', timeL, sceneBgInProps),
            s3t2 = TweenMax.to('#scene-2 .scene-content', timeM, sceneContentOutProps),
            s3t3 = TweenMax.to('#scene-3 .scene-content, #scene-3 .scene-links', timeL, sceneContentInProps),
            s3t4 = TweenMax.to('#scene-2 .scene-links', timeS, sceneLinksOutProps);
        scene3time.add([s3t1, s3t2, s3t3, s3t4, s3t5]);
        var scene3 = new ScrollMagic.Scene({
            triggerElement: '#scene-3',
            duration: sceneDur
        })
            .setTween(scene3time)
            .addTo(controllerSm);

        //SCENE 3 nav circle
        var scene3navtime = new TimelineLite(),
            s3tn0 = TweenMax.to('#navsectionarc-2, #navsectionarcstroke-2', '.01', {css: {className: '+=scene-active'}}),
            s3tn1 = TweenMax.to('#navsectionarc-2, #navsectionarcstroke-2', timeL, sceneNavProps),
            s3tn2 = TweenMax.to('#navdot3', '.01', {css: {className: '+=scene-dotactive'}});
        scene3navtime.add(s3tn0).add(s3tn1).add(s3tn2);

        var scene3nav = new ScrollMagic.Scene({
            triggerElement: "#scene-3",
            offset: navsceneOffset,
            duration: navsceneDur
        })
            .setTween(scene3navtime)
            .on('enter', function () {
                $('#navdot2').removeClass('scene-dotactive');
            })
            .addTo(controllerSm);

        //SCENE 4 ***********
        var scene4master = new ScrollMagic.Scene({
            triggerElement: '#scene-4',
            duration: sceneMasterDur
        })
            .setClassToggle('#scene-4, #navdot4, #site-footer', 'scene-active')
            .on('enter', function (event) {
                currentScene = 4;
                runRevealingText('h2', 'h3');
                $('#nav-scroll').addClass('endscene');
                if (event.scrollDirection === 'REVERSE') {
                    $('#navdot4').addClass('scene-dotactive');
                }
            })
            .on('leave', function () {
                $('#nav-scroll').removeClass('endscene');
                clearRevealing('#scene-4');
            })
            .addTo(controllerSm);

        var scene4time = new TimelineLite(),
            s4t1 = TweenMax.to('#scene-3 .scene-background', timeL, sceneBgOutProps),
            s4t5 = TweenMax.to('#scene-4 .scene-background', timeL, sceneBgInProps),
            s4t2 = TweenMax.to('#scene-3 .scene-content', timeM, sceneContentOutProps),
            s4t3 = TweenMax.to('#scene-4 .scene-content, #scene-4 .scene-links', timeL, sceneContentInProps),
            s4t4 = TweenMax.to('#scene-3 .scene-links', timeS, sceneLinksOutProps);
        scene4time.add([s4t1, s4t2, s4t3, s4t4, s4t5]);
        var scene4 = new ScrollMagic.Scene({
            triggerElement: '#scene-4',
            duration: sceneDur
        })
            .setTween(scene4time)
            .addTo(controllerSm);

        //SCENE 4 nav circle
        var scene4navtime = new TimelineLite(),
            s4tn0 = TweenMax.to('#navsectionarc-3, #navsectionarcstroke-3', '.01', {css: {className: '+=scene-active'}}),
            s4tn1 = TweenMax.to('#navsectionarc-3, #navsectionarcstroke-3', timeL, sceneNavProps),
            s4tn2 = TweenMax.to('#navdot4', '.01', {css: {className: '+=scene-dotactive'}});
        scene4navtime.add(s4tn0).add(s4tn1).add(s4tn2);

        var scene4nav = new ScrollMagic.Scene({
            triggerElement: "#scene-4",
            offset: navsceneOffset,
            duration: navsceneDur
        })
            .setTween(scene4navtime)
            .on('enter', function () {
                $('#navdot3').removeClass('scene-dotactive');
            })
            .addTo(controllerSm);

        //DEBUG INDICATORS ***************
        
       //scene1master.addIndicators({name: 'scene1 MASTER'});
//        sceneNavIntro.addIndicators({name: 'navIntro'});
//        scene2.addIndicators({name: 'scene2'});
//        scene2nav.addIndicators({name: 'scene2 NAV'});
//        scene2master.addIndicators({name: 'scene2 MASTER'});
//        scene3.addIndicators({name: 'scene3'});
//        scene3master.addIndicators({name: 'scene3master'});
//        scene4.addIndicators({name: 'scene4'});
//        scene4master.addIndicators({name: 'scene4master'});



        //SCROLLTO NAVIGATION *******************
        //based on http://janpaepke.github.io/ScrollMagic/examples/advanced/anchor_link_scrolling.html    

        //globals to keep track of nav states
        var targetSceneNum;
        
        //redefine scrollTo for SM controller
        controllerSm.scrollTo(function (scrollTarget) {
            //note: scrollTarget is numeric Y position here

            //1- scroll slowly for scene 1 > 2 transition
            //2- if current scene is more than 1 scene away, skip
            //3- else scroll
            //using autokill:false to prevent manual interruption of scrolling - Safari 7/8 bug
            if (currentScene === 1 && targetSceneNum === 2) {
                TweenMax.to(window, 3.5, {scrollTo: {y: scrollTarget, autoKill: false}, ease: Sine.easeOut});
            } else if (Math.abs(targetSceneNum - currentScene) > 1) {
                TweenMax.to(window, 0, {scrollTo: {y: scrollTarget, autoKill: false}});
            } else {
                TweenMax.to(window, 2, {scrollTo: {y: scrollTarget, autoKill: false}, ease: Sine.easeOut});
            }
        });

        //single nav scroll down button: cycle through next scenes and from 4 go to 1
        $('#nav-scroll').on('click tap', function (e) {
            var scrollTarget;
            if (currentScene >= 4) {
                scrollTarget = '#scene-1';
                targetSceneNum = 1;
            } else {
                scrollTarget = '#scene-' + (currentScene + 1);
                targetSceneNum = currentScene + 1;
            }
            controllerSm.scrollTo(scrollTarget);
        });
        
        //SVG nav circles and side navigation scrollto menu
        $('.navdot, .scrollto').on('click tap', function (e) {
            //get #scene
            var scrollTarget = $(this).attr("href");
            if (scrollTarget.length > 0) {
                e.preventDefault();
                //assign scene num (last digit) to global for comparison
                targetSceneNum = parseInt(scrollTarget.slice(-1), 10);
                controllerSm.scrollTo(scrollTarget);
            }
        });
    }; //end initMagic
   
    
    /*MAIN ENTRY POINT **************************************
    check for:
        IE8
        matchMedia support (no IE9)
        matchMedia min ScrollMagic screen size
        isMobile
    ****************************************************** */

    //dev triggers for bypassing detection to force disable ScrollMagic. to test mobile on desktop, etc.
    //var isMobile = true;    //TESTING

    //isNoMagic is entry point trigger to enables/disable ScrollMagic on small screens as well as mobile, etc
    //var isNoMagic = true;    //TESTING
    var isNoMagic = false;

    
    //Non-scrollMagic as triggered at end 
    var disableMagic = function disableMagic() {
        isNoMagic = true;
        //add CSS hook for mobile and IE8, etc.
        $('html').addClass('no-magic');
    };
    
    //set heights on 100% elements to disable mobile browser address/toolbar viewport shift causing background jump
    var initMobileViewport = function initMobileViewport() {
        //elements controlling vertical screen size
        var $vpElements = $('html, body, .scene-background');
        //set height + 60 to approximate height of address bar, etc.
        function setHeight() {
            $vpElements.height($(window).height() + 60);
        }
        //DO NOT RUN ON window.resize - that's fired when scrolling in android.
        
        //check for matchMedia support 
        function supportsMatchMedia() {
            return (typeof window.matchMedia !== "undefined" || typeof window.msMatchMedia !== "undefined");
        }
        if (supportsMatchMedia() && window.matchMedia) {
            //find orientation match 
            var orientationMatchMedia = window.matchMedia('(orientation: portrait)');
            //add a media query change listener, run when orientation changes
            orientationMatchMedia.addListener(setHeight);
        }
        //initial run
        setHeight();
    };

    
    //run to set up ScrollMagic and manage screen sizes 
    var preInitMagic = function preInitMagic() {
      
        //keep track of current states set with matchMedia
        var isMobileSize = false;
        var isDesktopSize = false;

        //check MatchMedia support (no IE9)
        function supportsMatchMedia() {
            return (typeof window.matchMedia !== "undefined" || typeof window.msMatchMedia !== "undefined");
        }
        
        function screenSetup(thisMediaQ) {
            if (thisMediaQ.matches) {
                //small screens
                isMobileSize = true;
                
                if (isDesktopSize) {
                    //coming from desktop to mobile, reload page to disable ScrollMagic
                    document.location.reload();
                }
                isDesktopSize = false;
                disableMagic();
            } else {
                //large screens
                if (isMobileSize) {
                    //coming from mobile to desktop, reload page to set up ScrollMagic
                    document.location.reload();
                }
                isMobileSize = false;
                isDesktopSize = true;
                //Entry point into ScrollMagic
                initMagic();
            }
        }
        
        //minimum screen size for non-mobile ScrollMagic use
        var mobileMediaWidth = 500, mobileMediaHeight = 500;
        
        //media query event handler
        if (supportsMatchMedia() && window.matchMedia && !isMobile) {
            //set up mediaQuery
            var smallMatchMedia = window.matchMedia('(max-width: ' + mobileMediaWidth + 'px), (max-height: ' + mobileMediaHeight + 'px)');
            //add listener
            smallMatchMedia.addListener(screenSetup);
            //initial run
            screenSetup(smallMatchMedia);
        } else if (!supportsMatchMedia() && !isMobile) {
            //used for IE9 and any other non-mobile browsers that don't support media queries. does not recheck on screen resize
            if ($(window).width() <= mobileMediaWidth || $(window).height() <= mobileMediaHeight) {
                disableMagic();
            } else {
                initMagic();
            }
        }
    };

    //INITIAL ENTRY POINT TO SET UP SCROLLMAGIC OR NOT *******************************
    if (isMobile) {
        disableMagic();
        initMobileViewport();
    } else if ($('html').hasClass('lte8') || isNoMagic) {
        disableMagic();
    } else {
        preInitMagic();
    }
            
    //dynamic copyright in footer
    $('#copy-year').text((new Date()).getFullYear());
});
//name global vars referenced for JSlint happiness:
/*global $, console, alert,  ga, dataLayer, jQuery */
$(function () {
    "use strict";
    
    //EMAIL VALIDATION AND SILVERPOP INTEGRATION AT END
    
    
    //Google Analytics*************************************************
    
    //EVENT tracking ********************
    function trackEvent(category, action, label) {
        if (window['ga'] && ga !== undefined) {
            ga('send', 'event', category, action, label);
        }
        if (window['dataLayer']) {
            dataLayer.push({
                'event': 'eventName',
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label
            });
        }
    }
    //main nav Donors and Friends
    $('.link-donor').on('click tap', function () {
        trackEvent('Donors and Friends', 'click', 'Donate');
    });
    //scene video content links
    $('.vid').on('click tap', function (e) {
        var thisLabel = $(this).attr('title');
        trackEvent('Video', 'play', thisLabel);
    });
    //main nav hamburger
    $('#nav-toggle').on('click tap', function () {
        trackEvent('Menu', 'open', 'View Menu');
    });
    //nav scroll down button
    $('#nav-scroll').on('click tap', function () {
        trackEvent('Scroll down button', 'click', 'next scene');
    });
    //SVG nav circles and side navigation scrollto menu
    $('.navdot, .scrollto').on('click tap', function (e) {
        //get #scene
        var thisLink = $(this).attr("href");
        trackEvent('Menu', 'click', thisLink);
    });
    //email submit event tracking at bottom
    
    
    //VIRTUAL Pageview tracking **************
    //example:  ga('send', { 'hitType': 'pageview', 'page': '/contact-us/submitted/', 'title': 'Contact Us Submitted' });
    function trackVirtualPageView(name, url) {
        if (window['ga'] && ga !== undefined) {
            ga('send', { 'hitType': 'pageview', 'page': url, 'title': name });
        }
        if (window['dataLayer']) {
            dataLayer.push({
                'hitType': 'pageview',
                'page': url,
                'title': name
            });
        }
    }
    
    //scene story content links
    $('#scene-2 .story').on('click tap', function (e) {
        trackVirtualPageView('Trauma Story', '/trauma-story');
    });
    $('#scene-3 .story').on('click tap', function (e) {
        trackVirtualPageView('Cancer Home Story', '/cancer-home-story');
    });
    $('#scene-4 .story').on('click tap', function (e) {
        trackVirtualPageView('Cancer Family Story', '/cancer-family-story');
    });
    //scene navigation links
    $('#navdot1, #scrollto-1').on('click tap', function (e) {
        trackVirtualPageView('Home', '/home');
    });

    
    //SCROLLDEPTH - fire virtual page event on enter scene ****************
    $(document).ready(function () {
        jQuery.scrollDepth({
            elements: ['#scene-1', '#scene-2', '#scene-3', '#scene-4'],
            percentage: false,
            userTiming: false,
            pixelDepth: false,
            nonInteraction: false,
            eventHandler: function (data) {
                //available events: data.eventCategory, data.eventAction, data.eventLabel
                var thisElement = data.eventLabel;
                //initial name event and path from data.eventLabal
                var scrollElName = data.eventLabel;
                var scrollElUrl = data.eventLabel;
                //rename events and virtual path
                if (thisElement === '#scene-1') {
                    scrollElName = 'Home';
                    scrollElUrl = '/home';
                } else if (thisElement === '#scene-2') {
                    scrollElName = 'Trauma';
                    scrollElUrl = '/trauma';
                } else if (thisElement === '#scene-3') {
                    scrollElName = 'Cancer-Home';
                    scrollElUrl = '/cancer-home';
                } else if (thisElement === '#scene-4') {
                    scrollElName = 'Cancer-Family';
                    scrollElUrl = '/cancer-family';
                }
                //OLD: ga('send', 'event', data.eventCategory, data.eventAction, data.eventLabel);
                trackVirtualPageView(scrollElName, scrollElUrl);
            }
        });
    });
    
    
    //EMAIL NEWSLETTER SUBSCRIBE in footer ******************************************
    
    //NON_FUNCTIONAL, pre-integration into Sitecore. just minimal FE validation work.
    
    
    //ASPX and jquery.validate workaround
    $('form').validate({
        onsubmit: false
    });
    
    function processNewsletter() {

        var $emailId = $('#enews-email');

        //var formData = $("#enews-email").serializeObject();

       // var url = '/????????????/WebMethods/Silverpop.aspx/EmailOptIn';
       
//        $.ajax({
//            type: "POST",
//            url: url,
//            data: JSON.stringify(formData),
//            contentType: "application/json; charset=utf-8",
//            success: function (response) {
        
                //show SUCCESS message, enable and fade in
                var $successTarget = $('#enews-success');
                $successTarget.addClass('enabled visible');
        
                //timer for opacity class and size class, clear old value
                var clearSuccess = window.setTimeout(function () {
                    
                    $successTarget.removeClass('visible');
                    $emailId.val('');
                    window.clearTimeout(clearSuccess);
                    
                    var clearSuccess2 = window.setTimeout(function () {
                        $successTarget.removeClass('enabled');
                        window.clearTimeout(clearSuccess2);
                    }, 1000);
                    
                }, 4000);
        
//            }
//        });
    }//End processNewsletter
    
    //Submit button
    $('#enews-submit').on('click tap', function (e) {
        //email form field
        var $emailId = $('#enews-email');
        //validate
        if ($emailId.valid()) {
            //GA EVENT tracking
            trackEvent('E-Newsletter', 'subscribe', 'Sign up for E-Newsletter');
            //run silverpop
            processNewsletter();
        } else {
            return false;
        }
    });
    //Email field on Enter KEY
    $('#enews-email').on('keydown', function (e) {
        var $emailId = $(this);

        if (e.keyCode === 13) {
            e.preventDefault();
        
            if ($emailId.valid()) {
                //GA EVENT tracking
                trackEvent('E-Newsletter', 'subscribe', 'Sign up for E-Newsletter');
                //run silverpop
                processNewsletter();
            } else {
                return false;
            }
        } 
    });
    //if invalid, then blanked out, remove error on blur
    $('#enews-email').on('blur', function (e) {
        var $emailId = $(this);
        if ($emailId.val().length === 0) {
            $emailId.siblings('#enews-email-error').remove();
        }
    });
    
    
    //for Ajax
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
});
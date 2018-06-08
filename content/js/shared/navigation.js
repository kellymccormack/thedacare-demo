// @require ~/content/js/_libs/jquery.hoverIntent/jquery.hoverIntent-r7.js";
/*global $, isMobile, console, alert */

$(function () {
    "use strict";
    
    //side navigation scrollto-menu, close on use
    $('#nav-toggle').on('click tap', function () {
        $('html').toggleClass('nav-visible');
    });
    $('a', '#scrollto-menu').on('click tap', function (e) {
        $('html').removeClass('nav-visible');
    });
    
});
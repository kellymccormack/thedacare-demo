// @require ~/content/js/_libs/jquery.fancybox/jquery.fancybox-2.1.5.js
/*global $, console, isMobile, youtube_parser */

//== fancybox video
function setupFancyboxVideo() {
    "use strict";

	//default JS blocks GA events: $('.fancybox-video').off('click tap'); using named events: 
	$('.fancybox-video').off('click.fancy tap.fancy');

	if (isMobile && window.matchMedia('(max-width: 600px)').matches) {
        //named events for GA:
		$('.fancybox-video').on('click.fancy tap.fancy', function () {
			window.open($(this).attr('href'));
			return false;
		});
	} else {
		$('.fancybox-video').attr('href', function () {
            //OLD non-HTTPS return 'http://www.youtube.com/embed/' + youtube_parser($(this).attr('href')) + '?wmode=transparent&rel=0&autoplay=1';
            return '//www.youtube.com/embed/' + youtube_parser($(this).attr('href')) + '?wmode=transparent&rel=0&autoplay=1';
        }).fancybox({
			padding: 0,
			type: 'iframe',
			aspectRatio: true,
            //all new below, using modal appearance and custom close button:
            autoSize: false,
            modal: true,
            width: '85%',
            height: '85%',
            margin: 0,
            helpers: {
                overlay: {
                    locked: false
                }
            },
            beforeLoad: function () {
                $('body').append('<button type="button" class="modal-close btn btn-link no-print"><span class="bars"><span class="bar bar-2"></span><span class="bar bar-3"></span></span><span class="assistive-text">Close</span></button>');
                $('.modal-close').on('click tap', function (e) {
                    $.fancybox.close(true);
                    $(this).off('click tap').remove();
                });
            }
		});
	}
}


//MODAL FANCYBOX CONTENT LINKS ********************
function setupFancybox() {
    "use strict";
    
    $('.link-content').not('.vid').on('click tap', function (e) {
        e.preventDefault();
        //link to content #id'ed divs hidden within .modal-wrapper
        var thisHref = $(this).attr('href');
        $.fancybox({
            href: thisHref,
            autoSize: false,
            //modal true disables built in close button, but allows full 100% WxH
            modal: true,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            helpers: {
                overlay: {
                    locked: false
                }
            },
            beforeLoad: function () {
                $('body').append('<button type="button" class="modal-close btn btn-link no-print"><span class="bars"><span class="bar bar-2"></span><span class="bar bar-3"></span></span><span class="assistive-text">Close</span></button>');
                $('.modal-close').on('click tap', function (e) {
                    $.fancybox.close(true);
                    $(this).off('click tap').remove();
                });
            }
        });
        return false;
    });
}

$(function () {
    "use strict";
	//== embed fancybox videos
	setupFancyboxVideo();
    
    //custom modal fancybox content links
    setupFancybox();

    //add ESC key close since using modal option without default controls
    $(document).on('keyup.fancy', function (e) {
        if (e.keyCode === 27) { // esc
            $.fancybox.close(true);
            $('.modal-close').off('click tap').remove();
        }
    });
});

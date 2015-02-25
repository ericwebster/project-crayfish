"use strict"; // jshint ;_;

var $ = jQuery;

var cramer = cramer || {};

cramer = {
    /* glob cramer variables */
    debug: true,
    settings: {
        browserIsModern: true,
    },

     /* INITIALIZE
      * ====================== */
	init: function() {

            // Set the height of the #stage and the .page that slides over it.
            var windowHeight, panelHeight, stageHeight, pageHeight,
                menuHeight, difference, scrollPosition,
                scrollPositionPrevious, scrollingDown, panelTopMargin,
                hasStagePanel, isHomePage, isShowcase, positionToFadeIn;

            $('body').addClass('loaded');
            windowHeight = $(window).height();

            if(windowHeight > 1080){
              windowHeight = 1080;
            }

            if ( $('body').hasClass('home') ) {
                isHomePage = true;
            } else {
                isHomePage = false;
            }

            if ( $('body').hasClass('showcase') ) {
                isShowcase = true;
            } else {
                isShowcase = false;
            }

            menuHeight = $('#header').height();

            /*
                when there is a #stage panel, then we do a few things:
                    1/ fade the header menu bar in on scroll
                    2/ move/shift/fade the main body copy
            */

            if( $('#stage').length ) {
                hasStagePanel = true;
                stageHeight = $('#stage').height();
                pageHeight = $('.page').height();

                /*
                * if the stage height > page height, then set
                * page height to same as stage (prevents overscroll)
                */
                if ( stageHeight > pageHeight && !('body.team').length ) {
                    $('.page').css( { height: stageHeight+'px' } );
                }

                positionToFadeIn = stageHeight - menuHeight;

                // add the downarrow when needed (not on /story pages though)
                if ( $('#stage').length && !$('body.story').length ) {
                  $('#stage')
                    .append('<div class="arrow-down downbounce" style="top: ' + (stageHeight-34) + 'px;"></div>');


                  $('#stage').on('click', function(){
                      $('html, body').animate({
                          scrollTop : (positionToFadeIn+1)
                      }, 1200);
                  });
                }

                // change the menu styles on scroll
                var scrollChangesStart = stageHeight/7;

                $(window).scroll(function() {
                    scrollPosition = $(window).scrollTop();

                    if ( scrollPosition > scrollPositionPrevious ) {
                        scrollingDown = true;
                    } else {
                        scrollingDown = false;
                    }

                    if ( $(window).scrollTop() >= positionToFadeIn ){
                        $('#header').addClass('switch');
                    } else {
                        $('#header').removeClass('switch');

                        // fade out the body text
                        if ( scrollPosition > scrollChangesStart ) {
                            $('.feature-title, .feature-logo, .featured-desc')
                            .css({opacity:
                              ((stageHeight-scrollPosition)/(stageHeight-scrollChangesStart))
                            });
                        } else {
                            $('.feature-title, .feature-logo, .featured-desc')
                              .css( { opacity: 1 } );
                        }
                    }

                    if ( $(window).scrollTop() > 25 ) {
                        $('#stage .arrow-down').fadeOut(1000);
                    } else {
                        $('#stage .arrow-down').fadeIn(1000);
                    }

                    scrollPositionPrevious = scrollPosition;

                }); // .scroll

            } else {
                hasStagePanel = false;

                if ( !isHomePage ) {
                    $('body').addClass('menu-on-white');
                }

            }

            panelHeight = $('.feature .panel').height();
            difference = windowHeight - panelHeight - menuHeight;
            panelTopMargin = (difference/2) + menuHeight;

            if(panelTopMargin < menuHeight){
                panelTopMargin = menuHeight + 20;
            }

            $('.feature').css({
              'min-height': windowHeight
            });

            $('.feature .panel').css({
              'margin-top': panelTopMargin
            });

            if ( hasStagePanel ) {
              $('.page').css({
                'margin-top': windowHeight
              });
            }

	    $('small.time').each(function(){
	    	var posttime = moment($(this).attr('date-time')),
	    	now = moment();
	    	$(this).html(posttime.from(now));
	    });

        // hook up global google analytics events
        $('.newsletter-signup form input[type="email"]').on('focus', function() {
            $(this).removeAttr('placeholder');
            cramer.gtm.ga.trackEvent('Newsletter Signup', 'Form', 'Submit');
        });
        $('.newsletter-signup form input[type="submit"]').on('click', function() {
            cramer.gtm.ga.trackEvent('Newsletter Signup', 'Form', 'Submit');
        });
        $('ul.social a').on('click', function() {
            var href = $(this).attr('href');
            cramer.gtm.ga.trackEvent('Social Profile', 'Click', href);
        });
        $('#unsupported-browser a').on('click', function() {
            cramer.gtm.ga.trackEvent('Warning Bar', 'Click', 'Unsupported Browser');
        });


        // sticky social share bar
        if ( $('.social.can-stick') ) {

          $('.social li.print').on('click', function() {
              window.print();
              cramer.gtm.ga.trackEvent('Social Share Bar', 'Click', 'Print');
          });
        }


        // show warnings for older browsers
        // IE8 and below are not considered modern for this site
        if ($('html').is('.lt-ie9')) {
            cramer.settings.browserIsModern = false;
        }

        if ( !cramer.settings.browserIsModern ) {
            $('#unsupported-browser').addClass('visible');
        }

        // HANDLE some specific hover states
        if( $('.showcase-box a').length ) {

            $('.showcase-box a').on('mouseover touchstart ', function(){
	            $(this).addClass('active');
	          });

	          $('.showcase-box a').on('mouseout touchend ', function(){
	            $(this).removeClass('active');
	          });

        }

        // protect email addresses
        cramer.protectElectronicMailAddress.init();

	}, // end, init


    /* GOOGLE TAG MANAGER
     * ====================== */
    gtm: {
        // google analytics specific
        ga: {
            // track events
            trackEvent: function(category, action, label) {
                // push to the dataLayer
                dataLayer.push({
                    'event': 'gaTriggerEvent',
                    'gaEventCategory': category,
                    'gaEventAction': action,
                    'gaEventLabel': label,
                });
            }, // end, trackEvent

            // track pageviews
            trackPageview: function(pageUrl, pageName) {
                // push to the dataLayer
                dataLayer.push({
                    'event': 'gaTriggerPageview',
                    'gaPageURL': pageUrl,
                    'gaPageName': pageName,
                });
            } // end, trackEvent
        }, // end, ga
     }, // end, gtm



     /* GLOBAL MENU
     * ====================== */
    menu: {

		open: function() {
			if (this.debug) {
				console.log('cramer.menu.open');
			}
			$('body').addClass('menu-open');
			cramer.theFeed.init();

	           // track it
	           cramer.gtm.ga.trackEvent('Global Menu', 'Open');
		}, // end, open

		close: function() {
			if (this.debug) {
				console.log('cramer.menu.close');
			}
			$('body').removeClass('menu-open');
	            // track it
	            cramer.gtm.ga.trackEvent('Global Menu', 'Close');
		}, // end, close

    }, // end, menu

    /* GLOBAL MENU -- THE FEED
     * ====================== */
    theFeed: {
        settings: {
            source: '/thepulse/',
            // https://circulate.it/rss/RWyWa880Pveprdt-fHVD9UlWXbnK7u-WyG6QdYkiLoI?comments&days=10
            template: '',
            initialized: false,
        }, // end, settings

        init: function() {
            // has this been initialized already?
            if ( !cramer.theFeed.settings.initialized ) {
                cramer.theFeed.settings.initialized = true;

                // show spinny loader

                // get the template
                cramer.theFeed.settings.template = $('#feedTemplate').text();


                // get the data
                $.getJSON(cramer.theFeed.settings.source, function( data ) {
                    var items = data['items'];

                    $.each( items, function( i, item ) {
                        cramer.theFeed.addItem(i, item);

                        // only show first 30 entries
                        if ( i > 30 ) { return false; }
                    });

                    $('#menuFeed .loading').hide();
                    $('#menuFeed ul').show();
                    $('#menuFeed .poweredby').show();

                    // set up scrollbar
                    var $menuFeed = $('#menuFeed');
                    $menuFeed.tinyscrollbar();

                    // force an update again
                    var menuFeed = $menuFeed.data('plugin_tinyscrollbar');
                    menuFeed.update();

                    // add Google Analytics
                    $('#menuFeed ul li a').on('click', function() {
                        var href = $(this).attr('href');
                        var thisPosition = $(this).data('position');
                        cramer.gtm.ga.trackEvent('Menu - The Feed',
                          'Click Position - ' + thisPosition, href);
                    });

                });


            } // not yet init
        }, // end, init

        addItem: function( i, item ) {
            var template = cramer.theFeed.settings.template;

            // for time stamps
            var posttime = moment( item.pubDate );
            var now = moment();
            var fromNow = posttime.from(now);

            // replace items with the content
            // required fields
            template = template.replace('[[rssLink]]', item.link );
            template = template.replace('[[rssPosition]]', i );
            template = template.replace('[[rssTitle]]', item.title );
            template = template.replace('[[rssPubDate]]', item.pubDate );
            template = template.replace('[[rssTimeFromNow]]', fromNow );

            // optional fields
            if (typeof item.comment === 'undefined' || item.comment.length === 0) {
                template = template.replace('<h4>"[[rssComments]]"</h4>', '' );
            }  else {
                var comment = item.comment.replace(/"/g, ""); // remove double quotes from within double quotes
                template = template.replace('[[rssComments]]', comment );
            }

            if (typeof item.description === 'undefined' || item.description.length === 0) {
                template = template.replace('[[rssDesc]]', '' );
            } else {
                template = template.replace('[[rssDesc]]', item.description );
            }

            $('#menuFeed .overview ul').append( template );

        }, // end, add item

    }, // end, theFeed

    /* GLOBAL MENU -- THE FEED
     * ======================
     * initialized on pages with our email address,
     * used to do some baseline spam bot protection
     */
    protectElectronicMailAddress: {

      /* find all <span data-accountname="accountname"
        class="ElectronicMailAddress"> */
      init: function() {
        if ( $('.ElectronicMailAddress').length ) {
          var baseline, dhold, thelink;

          baseline = 'penzre pbz';
          dhold = cramer.protectElectronicMailAddress.reRearranger(baseline)
            .replace(' ','.');

          $('.ElectronicMailAddress').each(function() {

              thelink = $(this).data('accountname') + '@' + dhold;
              $(this).prop('href','mailto:' + thelink);

              if ( $(this).text().length === 0 ) {
                $(this).append(thelink);
              }

              // remove data prop, in case init runs again
              $(this).removeData('accountname');
          });
        }
      },

      reRearranger: function(s) {
          var b = [],c,i = s.length,a = 'a'.charCodeAt(),z = a + 26,A = 'A'.charCodeAt(),Z = A + 26;
          while (i--) {
              c = s.charCodeAt(i);
              if (c >= a && c < z) { b[i] = String.fromCharCode(((c - a + 13) % (26)) + a); }
              else if (c >= A && c < Z) { b[i] = String.fromCharCode(((c - A + 13) % (26)) + A); }
              else { b[i] = s.charAt(i); }
          }
          return b.join('');
      }
   } // end protectElectronicMailAddress

}; // end, cramer


/**
 * ***********************************************************************
 * LOAD UP THE PAGE
 */
$(document).ready(function() {

  //called when key is pressed in textbox
  $('#phone_1, #phone_2, #phone_3').keypress(function (e) {
    //if the letter is not digit then display error and don't type anything
    if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  });
	var video,
	   labelID;

	// bring in the applicable inits
	cramer.init();

	$('#menu-toggle').on('click', function(){
		if ($('body').hasClass('menu-open')){
			cramer.menu.close();
		}
		else{
			cramer.menu.open();
		}
		return false;
	});

  $('#team_filter').change(function(){
    $('.memberTile').css({'opacity': '0'});
    var delay = 0;
    $('.memberTile').each(function(){
        $(this).delay(delay).animate({
            opacity:1
        },600);
    });
  });

  $('label').click(function() {
         labelID = $(this).attr('for');
         $('#'+labelID).trigger('click');
  });

  // $('.memberTile').on('click', function() {
  //     $(this).find('.teamMember').slideToggle
  // });

  /* Mute the video */
  video = $('.video-container > video');
  video.volume = 0;

  $('.shadow-layer').on('click', function(){
  		if ($(this).hasClass('off')) {
  			$(this).removeClass('off').addClass('off');
  		}else{
  			$(this).removeClass('off').addClass('on');
  		}
  });

  var docHeight = $(document).height();
  $('.shadow-layer').css({
  	'height': docHeight
  });

$('input[type="submit"]').on('click', function() {

  $('#subject').find(':selected').each(function () {
    if ($(this).hasClass('default')) {
      $('label[for="subject"]')
        .prepend('<label id="comment-error" class="error" for="comment">This field is required.</label>');
      return false;
    }
  });
});



  // I need a delayed load addClass
  setTimeout(function(){
    $('body').addClass('loaded');
  },800);

  setTimeout(function(){
    $('.main-focus.loaded #stage .panel').css({
       opacity: '1'
    });
  },900);


  function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

}); // end, jquery

/*
* Center absolute positioned element
*
* This function subtracts the width
* of a container from an internal
* elements width then divides it in
* half and applies it as margin left
* to the internal element
*
* itemCenter = item to center
* container = itemCenter container
*/
function absoluteCenter(itemCenter) {
  $(itemCenter).each(function(){
    var $this = $(this);

    // The outer width of the item to center
    var centerMe = $this.outerWidth();

    // The width of items container
    var container = $this.parent().width();

    // Subtract the item form the container and divide by two
    var marginMath = ( container - centerMe ) / 2;

    // Apply number from wrapper as margin left for item to center
    $this.css('margin-left', marginMath);
  });
}

$(window).load(function() {
  // Gives containers time to load for proper math
  absoluteCenter('.goBox a p');
});

$(window).resize(function() {
  /*
  * This needs to be here for mobile
  *? Seems a little off when using the browsers square window resize button
  * Its fine when dragging to resize
  */
  absoluteCenter('.goBox a p');
});

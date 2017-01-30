/*jslint browser: true*/
'use strict';

/*
 * Carousel component
 *
 * Example:
 * <div class="carousel" role="carousel">
 *	<ul class="carousel-items">
 *		<li><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></li>
 *		<li><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></li>
 *  </ul>
 *	<div class="carousel-nav">
 *		<a href="http://www.starred.com"><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></a> 	
 *		<a href="http://www.starred.co.uk"><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></a>
 *	</div>
 *  <span class="carousel-arrows carousel-arrows-previous iconStarred-arrowRight"></span>
 *	<span class="carousel-arrows carousel-arrows-next iconStarred-arrowLeft"></span>
 * </div>
 *
 */

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_ATTR = 'role="carousel"';
var COMPONENT_SELECTOR = '[' + COMPONENT_ATTR + ']';

var CAROUSEL_ITEMS_SELECTOR = '.carousel-items';
var CAROUSEL_NAV_SELECTOR = '.carousel-nav';
var CAROUSEL_ARROWS_PREV_SELECTOR = '.carousel-arrows-previous';
var CAROUSEL_ARROWS_NEXT_SELECTOR = '.carousel-arrows-next';
var CAROUSEL_ACTIVE_SELECTOR = '.active';

// ------------------------------------------------------------------------------------------ Component Definition

var Carousel = function (options) {

	// Create the Carousel object
	var self = {};

	// Merge the default options with the provided parameter
	var opts = $.extend({

		firstSlide: 0,
		currentSlideNo: 0,
		intervalTimer: 5000,
		animationTimeout: 2000,
		targetElement: document.getElementById('carousel')

	}, options);

	// Get the slides
	var slides = $(opts.targetElement).find(CAROUSEL_ITEMS_SELECTOR)
									  .children();

	// Get the slide navigation elements
	var navs = $(opts.targetElement).find(CAROUSEL_NAV_SELECTOR)
									.children();

	// Click handler for the 'previous' arrow
	$(opts.targetElement).find(CAROUSEL_ARROWS_PREV_SELECTOR)
						 .show()
						 .click( function (e) {

		// Prevent default action;
		e.preventDefault();

		// Proceed to the previous slide
		self.previous();

	});

	// Click handler for the 'next' arrow
	$(opts.targetElement).find(CAROUSEL_ARROWS_NEXT_SELECTOR)
						 .show()
						 .click( function(e) {

		// Prevent default action;
		e.preventDefault();

		// Proceed to the next slide
		self.next();

	});

	// Click handler for the navigation links
	$(opts.targetElement).find(CAROUSEL_NAV_SELECTOR)
						 .click( function(e) {

		// Prevent default action;
		e.preventDefault();

		// Get the parent element of the image to determine position
		var parent = $(e.target).parent();

		// Proceed to the selected slide based on element index
		self.goTo(parent.index());

	});

	// Click handler for the slides
	$(opts.targetElement).find(CAROUSEL_ITEMS_SELECTOR)
						 .addClass('pe')
						 .click( function (e) {

		// Prevent default action;
		e.preventDefault();

		// Simulate click event on active navigation item
		var activeElement = $(opts.targetElement).find(CAROUSEL_ACTIVE_SELECTOR);

		// Get the location from the anchor tag
		var href = activeElement.attr('href');

		// Check if we have a valid location
		if(href && href != '') {

			// Redirect to new location
			window.location = href;

		}

	});

	/**
	 * Start the Carousel
	 * @returns Carousel
	 */
	self.start = function () {

		// Hide all slides
		slides.hide();
		// Show the first slide
		$(slides[opts.currentSlideNo]).show();
		// Activate the first navigation item
		$(navs[opts.currentSlideNo]).addClass('active');

		// Start the interval
		opts.interval = window.setTimeout(function() { self.next(); }, opts.intervalTimer);

		// Implement fluent interface
		return self;

	};

	/**
	 * Go back to the previous item in the Carousel
	 * @returns Carousel
	 */
	self.previous = function () {

		// Proceed to the previous slide
		self.goTo(opts.currentSlideNo - 1);

		// Implement fluent interface
		return self;

	}

	/**
	 * Continue to the next item in the Carousel
	 * @returns Carousel
	 */
	self.next = function () {

		// Proceed to the next slide
		self.goTo(opts.currentSlideNo + 1);

		// Implement fluent interface
		return self;

	};

	/**
	 * Go to the specified slide in the Carousel
	 * @param int slide The slide number to show
	 * @returns Carousel
	 */
	self.goTo = function (slide) {

		// Remove the current timeout
		clearTimeout(opts.interval);

		// Hide the current slide
		$(slides[opts.currentSlideNo]).fadeOut(opts.animationTimeout);
		$(navs[opts.currentSlideNo]).removeClass('active');

		// Update the current slide
		opts.currentSlideNo = slide;

		// Check if the current slide makes the carousel spin
		if (opts.currentSlideNo >= slides.length) {

			// Move it to the first slide
			opts.currentSlideNo = opts.firstSlide;

		} else if (opts.currentSlideNo < opts.firstSlide) {

			// Move it to the last slide
			opts.currentSlideNo = slides.length - 1;

		}

		// Show the current slide
		$(slides[opts.currentSlideNo]).fadeIn(opts.animationTimeout);
		$(navs[opts.currentSlideNo]).addClass('active');

		// Restart the interval
		opts.interval = window.setTimeout(function() { self.next(); }, opts.intervalTimer);

		// Implement fluent interface
		return self;

	};

	// Return the Carousel object
	return self;

};

// ------------------------------------------------------------------------------------------ Component Initialization

$(COMPONENT_SELECTOR).each(function(index, element) {

	// Create the Carousel object for this element
	var carousel = new Carousel({
		targetElement: element
	});

	// Start the carousel
	carousel.start();

});


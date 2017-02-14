'use strict';

// ------------------------------------------------------------------------------------------ Test Dependencies

var $ = require('jquery');
var Carousel = require('./carousel');

// ------------------------------------------------------------------------------------------ Test Definition

describe('Carousel component', function() {

	// -------------------------------------------------------------------------------------- Test Initialization

	beforeEach(function() {
		$('body').empty();
	});

	// -------------------------------------------------------------------------------------- Test features

	it('should be able to activate next item in the list', function() {

		// Populate document with text fixture
		var fixture = getFixture();

		// Initialize carousel
		var carousel = new Carousel({
			targetElement: fixture
		});

		// Ensure that the active element has not moved yet
		$('.carousel .active').index().should.equals(0);

		// Continue to the next element
		carousel.next();

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(1);

	});

	it('should be able to activate previous item in the list', function() {

		// Populate document with text fixture
		var fixture = getFixture();

		// Initialize carousel
		var carousel = new Carousel({
			targetElement: fixture
		});

		// Ensure that the active element has not moved yet
		$('.carousel .active').index().should.equals(0);

		// Continue to the next element
		carousel.goTo(2);

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(2);

		// Continue to the previous element
		carousel.previous();

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(1);

	});

	it('should be able to activate last item in the list if going previous from first item', function() {

		// Populate document with text fixture
		var fixture = getFixture();

		// Initialize carousel
		var carousel = new Carousel({
			targetElement: fixture
		});

		// Ensure that the active element has not moved yet
		$('.carousel .active').index().should.equals(0);

		// Continue to the previous element
		carousel.previous();

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(2);

	});

	it('should be able to activate first item in the list if going next from last item', function() {

		// Populate document with text fixture
		var fixture = getFixture();

		// Initialize carousel
		var carousel = new Carousel({
			targetElement: fixture
		});

		// Ensure that the active element has not moved yet
		$('.carousel .active').index().should.equals(0);

		// Continue to the last element
		carousel.goTo(2);

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(2);

		// Continue to the next element
		carousel.next();

		// Ensure that the active element has moved
		$('.carousel .active').index().should.equals(0);

	});

});

// ------------------------------------------------------------------------------------------ Test fixture

function getFixture() {

	var content = ' \
		<div class="carousel" role="carousel"> \
			<ul class="carousel-items"> \
				<li><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></li> \
				<li><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></li> \
				<li><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></li> \
			</ul> \
			<div class="carousel-nav"> \
				<a href="http://www.starred.com" class="active"><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></a> \
				<a href="http://www.starred.co.uk"><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></a> \
				<a href="http://www.starred.at"><img src="https://cdn.starred.com/images/homepage/index/Header.png" /></a> \
			</div> \
			<span class="carousel-arrows carousel-arrows-previous iconStarred-arrowRight" style="right: 20px;" /> \
			<span class="carousel-arrows carousel-arrows-next iconStarred-arrowLeft" style="left: 20px;" /> \
		</div>';

	var fixture = $(content).appendTo('body');
	return fixture.get(0);
}

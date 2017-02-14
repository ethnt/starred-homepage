'use strict';

/**
 * cd starred-cdn
 * to run the test   karma start karma.conf.js --single-run
 * to develop        karma start karma.conf.js --auto-watch
 * 
 */

// ------------------------------------------------------------------------------------------ Test Dependencies

var $ = require('jquery');
var Menu = require('./menu');
var assert = require('chai').assert;

// ------------------------------------------------------------------------------------------ Test Definition

describe('Menu', function() {

  // -------------------------------------------------------------------------------------- Test Initialization

  beforeEach(function() {
    $('body').empty();
  });

  // -------------------------------------------------------------------------------------- Test features

  it('Menu should be defined', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var menu = new Menu();

    menu.init(fixture);

    assert.isDefined(Menu, 'menu should be defined');

  });

  it('Should set autoclose timer on mouseleave', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var menu = new Menu();

    menu.init(fixture);

    $(fixture).trigger('mouseleave');

    var timer = $(fixture).data('autoclosetimer');

    assert.isNumber(timer, 'autoclose value should be number');

  });

  it('should open a menu when clicked', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var menu = new Menu();

    menu.init(fixture);

    // ensure that menu is closed
    assert.isNotTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be closed');

    // click the menu
    $(fixture).click();

    // ensure that the menu has open class
    assert.isTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be open');

  });

  it('menu should close after 300ms on mouseleave', function(done) {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var menu = new Menu();

    menu.init(fixture);

    // ensure that menu is closed
    assert.isNotTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be closed');

    // click the menu
    $(fixture).click();

    // ensure that the menu has open class
    assert.isTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be open');

    $(fixture).trigger('mouseleave');

    setTimeout(function(){

      assert.isNotTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be closed');
      done();

    },400);

  });

  it('should not open a menu if its empty and menu option is set on strict', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var menu = new Menu();

    menu.init(fixture);

    $('.dropdown-menu').empty();

    // open the menu
    $(fixture).click();

    // ensure that menu is closed
    assert.isNotTrue($(".dropdown-menu-trigger").hasClass('open'), 'menu should be closed');

  });

});

// ------------------------------------------------------------------------------------------ Test fixture

function getFixture() {

	var content = ' \
  <div class="custom-select dropdown-menu-trigger" role="dropdown-menu" data-menutype="strict"> \
      <div class="arrow"></div> \
      <p id="createTemplateLanguageDropdownText" class="dropdown-menu-parent">Select a language</p> \
      <div class="dropdown-arrow-2 popupDropdown hide dropdown-menu dropdown-arrowBar-2"> \
          <ul id="createTemplateLanguageList" class="clean"> \
                  <li data-id="1">English</li> \
                  <li data-id="4">Français</li> \
                  <li data-id="13">Hrvatsk</li> \
                  <li data-id="11">Lietuvių Kalba</li> \
          </ul> \
      </div> \
  </div>';

	var fixture = $(content).appendTo('body');
	return fixture.get(0);
}

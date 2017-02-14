'use strict';

/**
 * cd starred-cdn
 * to run the test   karma start karma.conf.js --single-run
 * to develop        karma start karma.conf.js --auto-watch
 *
 */

// ------------------------------------------------------------------------------------------ Test Dependencies

var $ = require('jquery');
var FlashMessage = require('./FlashMessage');
var assert = require('chai').assert;

// ------------------------------------------------------------------------------------------ Test Definition

describe('FlashMessage', function() {

  // -------------------------------------------------------------------------------------- Test Initialization

  beforeEach(function() {
    $('body').empty();
  });

  // -------------------------------------------------------------------------------------- Test features

  it('FlashMessage should be defined', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize flash message
    var fs = new FlashMessage();

    fs.init();

    assert.isDefined(FlashMessage, 'FlashMessage should be defined');

  });

  it('Should create container for flash message if no element was passed', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var fs = new FlashMessage();

    fs.init();

    assert.isTrue(Boolean($('#jsFlashMessage').length), 'element should exsist');
    assert.strictEqual($('#jsFlashMessage').css('display'),'none','element should be hidden');

  });

  it('Should display an error message and close it once clicked', function(done) {

    // Populate document with text fixture
    var fixture = getFixture();

    var expectedMessage = "Test Message";

    // Initialize carousel
    var fs = new FlashMessage();
    fs.init();
    fs.show(expectedMessage,"error");

    var message = $('.flashMessageContainer p').text();

    assert.strictEqual(expectedMessage, message, 'Message seems to be not displayed');

    //message should be visible
    assert.strictEqual($('#jsFlashMessage').css('display'),'block','element should be visible');

    $(".flashMessageLevelError").click();

    setTimeout(function(){

      //message should be hidden
      assert.strictEqual($('#jsFlashMessage').css('display'),'none','element should be hidden');
      done();

    },400);

  });

  it('Should display all three types of messages', function() {

    // Populate document with text fixture
    var fixture = getFixture();

    // Initialize carousel
    var fs = new FlashMessage();
    fs.init();

    // set expected message
    var expectedMessage = ["Info Message","Notification Message","Error Message"];

    // show info message
    fs.show(expectedMessage[0],"info");

    // get info message text value
    var message = $('.flashMessageLevelInfo p').text();

    // check if the messsage has correct text value
    assert.strictEqual(expectedMessage[0], message, 'Info message doesnt have the correct value');

    // show notification message
    fs.show(expectedMessage[1],"notification");

    // get notification message text value
    message = $('.flashMessageLevelNotification p').text();

    // check if the messsage has correct text value
    assert.strictEqual(expectedMessage[1], message, 'Notification message doesnt have the correct value');

    // show notification message
    fs.show(expectedMessage[2],"error");

    // get info message text value
    message = $('.flashMessageLevelError p').text();

    // check if the messsage has correct text value
    assert.strictEqual(expectedMessage[2], message, 'Error message doesnt have the correct value');


  });

  it('Should append flash message to given container element', function() {

      // create container for flash message
      var flashMessageContainer = window.document.createElement('div');
      flashMessageContainer.id = 'testFlashMessage';

      // init new flash message
      var fs = new FlashMessage();
      fs.init(flashMessageContainer);

      assert.isTrue(Boolean($('#jsFlashMessage',flashMessageContainer).length), 'element should exsist');

  });

});

// ------------------------------------------------------------------------------------------ Test fixture

function getFixture() {

	var content = '\
  <div id="homepageMenuSpacer"></div>';

	var fixture = $(content).appendTo('body');
	return fixture.get(0);

}

'use strict';

/**
 * cd starred-cdn
 * to run the test   karma start karma.conf.js --single-run
 * to develop        karma start karma.conf.js --auto-watch
 *
 */

// ------------------------------------------------------------------------------------------ Test Dependencies

var $ = require('jquery');
var assert = require('chai').assert;
var Hover = require('./Hover');
var ArrowBalloon = require('./ArrowBalloon');
var SpeechBalloon = require('./SpeechBalloon');
var ErrorBalloon = require('./ErrorBalloon');


// ------------------------------------------------------------------------------------------ Component Variables

var HOVER_SELECTOR = "title";
var SPEECH_SELECTOR = "titleSpeechBalloon";
var ARROW_SELECTOR = "titleArrowBalloon";
var ERROR_SELECTOR = "errorBalloon";

// ------------------------------------------------------------------------------------------ Test Definition

describe('Hover', function() {

  // -------------------------------------------------------------------------------------- Test Initialization

  // Populate document with text fixture
  getFixture();

  // Title hover balloon
  var titleHover = Hover();
  titleHover.unitTestMode();
  titleHover.watchClass(HOVER_SELECTOR);

  // Title hover speech balloon
  var titleHoverSpeechBalloon = SpeechBalloon();
  titleHoverSpeechBalloon.unitTestMode();
  titleHoverSpeechBalloon.watchClass(SPEECH_SELECTOR);

  // Title hover Arrow balloon
  var titleHoverArrowBalloon = ArrowBalloon();
  titleHoverArrowBalloon.unitTestMode();
  titleHoverArrowBalloon.watchClass(ARROW_SELECTOR);

  // Title hover error balloon
  var inputErrorBalloon = ErrorBalloon();
  inputErrorBalloon.unitTestMode();
  inputErrorBalloon.watchClass(ERROR_SELECTOR);

  var titleElement = $('#' + HOVER_SELECTOR + 'Hover');
  var speechElement = $('#' + SPEECH_SELECTOR + 'Hover');
  var arrowElement = $('#' + ARROW_SELECTOR + 'Hover');
  var errorElement = $('#' + ERROR_SELECTOR + 'Hover');

  // -------------------------------------------------------------------------------------- Test features

  it('Should create a hover element for each hover type and display the title on hover', function() {

    assert.isTrue(Boolean($(titleElement).length), 'title hover should exsist');
    assert.isTrue(Boolean($(speechElement).length), 'speech hover should exsist');
    assert.isTrue(Boolean($(arrowElement).length), 'arrrow hover should exsist');
    assert.isTrue(Boolean($(errorElement).length), 'error hover should exsist');

  });

  it('All hover elements should be hidden', function(){

    assert.isTrue(Boolean($(titleElement).css('display') === 'none'), 'title hover should be hidden');
    assert.isTrue(Boolean($(speechElement).css('display') === 'none'), 'speech hover should be hidden');
    assert.isTrue(Boolean($(arrowElement).css('display') === 'none'), 'arrrow hover should be hidden');
    assert.isTrue(Boolean($(errorElement).css('display') === 'none'), 'error hover should be hidden');

  });

  it.skip('Should display the element on mouseenter and show the title attribute', function(){

      // todo tests for hover states doesn't seem work properly

  });

});

// ------------------------------------------------------------------------------------------ Test fixture

function getFixture() {

  var content = ' \
    <div> \
      <div class="title" title="Hover"></div> \
      <div class="errorBalloon" data-error-message="ErrorBalloon"></div> \
      <div class="titleArrowBalloon" title="ArrowBalloon"></div> \
      <div class="titleSpeechBalloon" title="SpeechBalloon"></div> \
    </div>';

	var fixture = $(content).appendTo('body');
	return fixture.get(0);

}

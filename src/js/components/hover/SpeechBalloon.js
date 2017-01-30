"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require('jquery');
var Hover = require('./Hover');
require('./hover.less');

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_SELECTOR = "titleSpeechBalloon";


// ------------------------------------------------------------------------------------------ Component Definition

/**
 * A speech balloon is a slightly modified version of the hover class. Almost
 * all differences are visual
 *
 * @returns {SpeechBalloon}
 */
var SpeechBalloon = function () {


    // inherit Hover class
    var self = Hover();

    /**
     * Create hover popup for the given type
     *
     * @returns {jQuery Object}
     */
    self.setHoverPopup = function () {

        // Append hover element
        $('body').append(
            '<p id="' + self.classToWatch + 'Hover" class="triangle-border" ' +
            'style="display: none;"></p>'
        );

        var hoverElement = $('#' + self.classToWatch + 'Hover');

        if(self.isTest === false){
          if(constants.isHomePage) {
              $(hoverElement).addClass('center-triangle');
          }
        }

        // Return created element
        return hoverElement;

    };

    /**
     * Set position according to mouse event
     *
     * @param {jQuery Object} event Mouse event
     * @returns {jQuery Object} Return hover popup
     */
    self.setPosition = function (event) {

        // Get speechBalloon element
        var element = $(event.target).closest('.titleSpeechBalloon');

        // Position label to current speechBalloon
        self.setHoverPosition(
            element.offset().left,
            element.offset().top + element.outerHeight()
        ).finish().show();

        // Return popup
        return self.hoverPopup;

    };

    return self;

};

// Title hover speech balloon
var titleHoverSpeechBalloon = SpeechBalloon();
titleHoverSpeechBalloon.watchClass(COMPONENT_SELECTOR);


// Exposing SpeechBalloon as CommonJS module
module.exports = SpeechBalloon;

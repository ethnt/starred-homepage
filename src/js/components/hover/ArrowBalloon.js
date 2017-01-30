"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require('jquery');
var Hover = require('./Hover');
require('./hover.less');

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_SELECTOR = "titleArrowBalloon";

// ------------------------------------------------------------------------------------------ Component Definition

/**
 * An arrow balloon is a slightly modified version of the hover class. Almost
 * all differences are visual
 *
 * @returns {SpeechBalloon}
 */
var ArrowBalloon = function () {

    // inherit Hover class
    var self = Hover();

    /**
     * Default x and y ofsset applied to the hover element
     *
     * @type Object
     */
    self.defaultOffset = {
        "x": 0,
        "y": -65
    };

    /**
     * Create hover popup for the given type
     *
     * @returns {jQuery Object}
     */
    self.setHoverPopup = function () {

        if(self.isTest){
          //due to missing constants during unit tests

          $('body').append(
              '<p id="' + self.classToWatch + 'Hover" class="arrow-border" '+
              'style="display: none;"><span class="curvedArrow"></span>'+
              self.title + '</p>'
          );
        }else{
          // Append hover element
          $('body').append(
              '<p id="' + self.classToWatch + 'Hover" class="arrow-border" '+
              'style="display: none;"><span class="curvedArrow"></span>'+
              (self.title || constants.leaveCommentArrowText) + '</p>'
          );
        }
        // Return created element
        return $('#' + self.classToWatch + 'Hover');

    };

    /**
     * Set position according to mouse event
     *
     * @param {jQuery Object} event Mouse event
     * @returns {jQuery Object} Return hover popup
     */
    self.setPosition = function (event) {

        // Get speechBalloon element
        var element = $(event.target).closest('.titleArrowBalloon'),

            // Get element title
            title = self.getTitle(element);

        // Check whether title is set
        if (undefined !== title && title) {

            // Add title contents to hover
            self.hoverPopup.html('<span class="curvedArrow"></span>' + title);

        }

        // Position label to current mouse position
        self.setHoverPosition(
            element.offset().left + self.defaultOffset.x,
            element.offset().top - (self.hoverPopup.height() - self.defaultOffset.y)
        ).finish().show();

        // Return popup
        return self.hoverPopup;

    };

    /**
     * Bind all mouse events which are related to or trigger the hover object
     *
     * @returns {ArrowBalloon} Implements method chaining
     */
    self.bindMouseEvents = function () {
        // Define timeout function
        var timeoutFunction;

        // Show label when a mouseover is detected
        $('body').on('mouseover', '.' + self.classToWatch, function (event) {

            // Get custom offset
            var x = event.target.dataset.xoffset || undefined,
                y = event.target.dataset.yoffset || undefined;

            // Check whether custom offsets are defined
            if (x || y) {
                // Custom offset available

                // Update default offset
                self.setDefaultOffset(x, y);

            }

            // Show hover
            self.setPosition(event);

            // Reset balloon to original state
            timeoutFunction = setTimeout(function() {

                // Hide label
                self.hoverPopup.hide();

                // Remove arrow balloon
                $(event.target)
                    .closest('.arrowWrapper')
                    .removeClass('titleArrowBalloon');

            }, 3500);

        });

        // Implement method chaining
        return self;

    };

    return self;

};

// Title hover Arrow balloon
var titleHoverArrowBalloon = ArrowBalloon();
titleHoverArrowBalloon.watchClass(COMPONENT_SELECTOR);

// Exposing ArrowBalloon as CommonJS module
module.exports = ArrowBalloon;

"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require('jquery');
var Hover = require('./Hover');
require('./hover.less');

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_SELECTOR = "errorBalloon";


// ------------------------------------------------------------------------------------------ Component Definition

/**
 * The error balloon is a slightly modified version of the hover class. Almost
 * all differences are visual
 *
 * @returns {ErrorBalloon}
 */
var ErrorBalloon = function () {

    // inherit Hover class
    var self = Hover();

    // Title is always enabled
    self.hasTitle = true;

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
       var element = $(event.target).closest('.errorBalloon');

       // Position label to current speechBalloon
       self.setHoverPosition(
           element.offset().left,
           element.offset().top - (element.height() + self.hoverPopup.outerHeight() + 20)
       ).finish().show();

       // Return popup
       return self.hoverPopup;

    };

    /**
     * Set hover title
     *
     * @param {jQuery Object} hoveredElement Element being hovered
     * @returns {String}
     */
    self.getTitle = function (hoveredElement) {

        return hoveredElement.attr('data-error-message');

    };

    /**
     * Reset hover popup. Do not reset message to title
     *
     * @returns {ErrorBalloon} Implements fluent interface
     */
    self.reset = function () {

        // Clear/hide current popup title
        self.hoverPopup.html('');
        self.hoverPopup.finish().hide();

        return self;

    };

    return self;

};

// Title hover error balloon
var inputErrorBalloon = ErrorBalloon();
inputErrorBalloon.watchClass(COMPONENT_SELECTOR);


// Exposing ErrorBalloon as CommonJS module
module.exports = ErrorBalloon;

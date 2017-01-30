"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require('jquery');
require('./hover.less');

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_SELECTOR = "title";

//  Possibly needs to be deleted
var COMPONENT_SELECTOR_ALT = "titleTooltip";

// ------------------------------------------------------------------------------------------ Component Definition

/**
 * Hover class creates a label element which will be shown when the cursor
 * hovers above en element with the selected watchClass
 *
 * @returns {Hover}
 */
var Hover = function () {

    // Create the Hover object
    var self = {};

    /**
     * Created hover popup
     *
     * @type jQuery Object
     */
    self.hoverPopup = null;

    /**
     * Class to watch for hover
     *
     * @type string
     */
    self.classToWatch = '';

    /**
     * Whether mouse is down
     *
     * @type Boolean
     */
     self.mouseDown = false;

    /**
     * Whether title has been reset
     *
     * @type Boolean
     */
    self.titleHasBeenReset = false;

    /**
     * Whether hover has a title
     *
     * @type Boolean
     */
    self.hasTitle = false;


    /**
     * Default x and y ofsset applied to the hover element
     *
     * @type Object
     */
    self.defaultOffset = {
        "x": 20,
        "y": -10
    };

    /**
     * Define left offset. Will be a negative value when on right hand side of
     * the screen
     *
     * @type Number
     */
    self.leftOffset = 0;

    /**
     * Define top offset. Will be a negative version when on the lower side
     * of the screen
     *
     * @type Number
     */
    self.topOffset = 0;
    /**
     * Some parts need to be ignored during unit tests
     *
     * @type Boolean
     */
    self.isTest = false;

    /**
     * sets isTest to true
     *
     */
     self.unitTestMode = function(){
        self.isTest = true;
     };

    /**
     * Set watch class to create a hover element for
     *
     * @param {String} classToWatch Class to watch
     * @returns {hover} Implements fluent interface
     */
    self.watchClass = function (classToWatch) {

        if(self.isTest === false) {
          // Don't add hover object on touch devices
          var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
          if (isTouch) { return; }

          // Whether self is a touch device
          if (
              Object.prototype.hasOwnProperty.call(
                  window.document.documentElement,
                  'ontouchstart'
              )
          ) {
              // self is a touch device

              // Do not add a hover object
              return;

          }
        }

        // Set class to watch
        self.classToWatch = classToWatch;

        // Set hover popup
        self.hoverPopup = self.setHoverPopup();

        // Bind mouse events
        self.bindMouseEvents();

        // Implement fluent interface
        return self;

    };

    /**
     * Bind all mouse events which are related to or trigger the hover object
     *
     * @returns {Hover} Implements fluent interface
     */
    self.bindMouseEvents = function () {

        // Show label when a mouseover is detected
        $('body').on('mouseenter', '.' + self.classToWatch, function (event) {

            // Show hover
            self.showHover($(this), event);

            // Set self element as active
            self.isActive=true;
        });

        // Update label position when the mouse moves
        $('body').on('mousemove', '.' + self.classToWatch, function (event) {

            // Check if element is active
            if (!self.isActive) {
                // Element hasn't been checked in or out yet

                // Return
                return;
            }

            // Check whether mouse is down
            if (!self.mouseDown && self.hasTitle) {
                // Mouse is not down

                // Set position based on current mouse event
                self.setPosition(event);

                // Check whether title has been reset
                if (self.titleHasBeenReset) {
                    // Title element has been reset

                    // Show hover
                    self.showHover($(this), event);

                }

            } else if (self.mouseDown && !self.titleHasBeenReset) {
                // Mouse is down and title has not been reset

                // Reset title and popup
                self.reset($(this));

            }

        });

        // Remove label when a mouseleave is detected
        $('body').on('mouseleave', '.' + self.classToWatch, function () {

            // Check element out by setting to not active
            self.isActive=false;

            // Check whether title has been reset
            if (!self.titleHasBeenReset) {
                // Title has not been reset
                //
                // Reset title and popup
                self.reset($(this));

            }

        });

        // Attach mouse click events
        $('body').mousedown(function () {
            // Mouse down event

            // Mouse is down
            self.mouseDown = true;

        }).mouseup(function () {
            // Mouseup event

            // Mouse is up
            self.mouseDown = false;

        });

        // Implement fluent interface
        return self;

    };

    /**
     * Show hover popup
     *
     * @param {Object} element Element being hovered
     * @param {Object} event   Mouse event object
     * @returns {Hover} Implements fluent interface
     */
    self.showHover = function (element, event) {
        // Title is undefined by default
        var title;

        // Check whether mouse is down
        if (!self.mouseDown) {
            // Mouse is not down

            // Title has not been reset
            self.titleHasBeenReset = false;

            // Set element title
            title = self.getTitle(element);

            // Check whether title is empty
            if (!self.hasTitle) {
                // Title is not set

                // Hide label
                self.hoverPopup.finish().hide();

                // Do not show popup
                return self;

            } else {
                // Title is set

                // Add title contents to hover
                self.hoverPopup.html(title);

                // Set position based on current mouse event
                self.setPosition(event);

            }

        }

        // Implement fluent interface
        return self;

    };
    /**
     * Create hover popup for the given type
     *
     * @returns {jQuery Object}
     */
    self.setHoverPopup = function () {

        // Append hover element
        $('body').append(
            '<div id="' + self.classToWatch + 'Hover" '+
            'class="titleTooltipHover" style="display: none;">'+
            '</div>'
        );

        // Return created element
        return $('#' + self.classToWatch + 'Hover');

    };

    /**
     * Set new hover position
     *
     * @param {Number} top  Top position
     * @param {Number} left Left position
     * @returns {jQuery Object} Return hover popup
     */
    self.setHoverPosition = function (top, left) {

        // Set hover position
        self.hoverPopup.css(
            {
                "position": "absolute",
                "left": (top + self.leftOffset),
                "top": (left + self.topOffset)
            }
        );

        // Return popup
        return self.hoverPopup;

    };

    /**
     * Set position according to mouse event
     *
     * @param {jQuery Object} event Mouse event
     * @returns {jQuery Object} Return hover popup
     */
    self.setPosition = function (event) {

        // Define hover offset
        self.defineOffset(event);

        // Position label to current mouse position
        self.setHoverPosition(
            event.pageX,
            event.pageY
        ).finish().show();

        // Return popup
        return self.hoverPopup;

    };

    /**
     * Set default hover item offset. Both offsets will be applied when offset is
     * defined on hovering
     *
     * @param {Number} x Horizontal offset
     * @param {Number} y Vertical offset
     * @returns {Hover} Implements method chaining
     */
    self.setDefaultOffset = function (x, y) {

        // Overwrite default offset
        self.defaultOffset = {
            "x": Number(x),
            "y": Number(y)
        };

        // Implements method chaining
        return self;

    };

    /**
     * Define hover div offset. The hover moves to the left when the cursor
     * is at the right, and it moves to the top when the cursor is at the
     * lower side of the screen
     *
     * @param {event} event triggered by mouse enter or mouse move
     * @returns {Hover} Implements fluent interface
     */
    self.defineOffset = function (event) {

        // Check whether the cursor is at the right hand side of the screen
        if (event.pageX > ($(window).width() * 0.7)) {

            // Set a negative offset. The size for the hover plus some
            // extra spacing
            self.leftOffset =
                -(self.hoverPopup.width() + 20 + self.defaultOffset.x);

            self.hoverPopup.removeClass('right');
            self.hoverPopup.addClass('left');

        } else {

            // Move hover somewhat to the right to get spacing around the
            // cursor
            self.leftOffset = self.defaultOffset.x;

            self.hoverPopup.removeClass('left');
            self.hoverPopup.addClass('right');

        }

        // Check whether the cursor is at the bottom side of the screen
        if (event.pageY > ($(window).height() * 0.7)) {

            // Set a negative offset. The size for the hover plus some
            // extra spacing
            self.topOffset =
                -(self.hoverPopup.height() - self.defaultOffset.y);

            self.hoverPopup.removeClass('top');
            self.hoverPopup.addClass('bottom');

        } else {

            // Set default y offset
            self.topOffset = self.defaultOffset.y;

            self.hoverPopup.removeClass('bottom');
            self.hoverPopup.addClass('top');

        }

        // Implement fluent interface
        return self;

    };

    /**
     * Get attribute where the title should be derived from
     *
     * @param {jQuery Object} hoveredElement Element being hovered
     * @returns {String} Title attribute
     */
    self.getTitleAttribute = function (hoveredElement) {

        // Set title to be "title" attribute by default
        var titleAttribute = 'title';

        // Check whether element type is an image
        if ('IMG' === hoveredElement.prop('tagName')) {
            // Element is an image

            // Use "alt" as title attribute
            titleAttribute = 'alt';

        }

        // Return title attribute
        return titleAttribute;

    };

    /**
     * Set hover title
     *
     * @param {jQuery Object} hoveredElement Element being hovered
     * @returns {String}
     */
    self.getTitle = function (hoveredElement) {

        // Define which title attribute to use
        var titleAttribute = self.getTitleAttribute(hoveredElement),

            // Get hover title when set
            title = hoveredElement.attr(titleAttribute);

        // Check whether title is set
        if (undefined !== title && 0 < title.length) {
            // Title is set

            // Hover element has a title
            self.hasTitle = true;

        } else {
            // Title is not set

            // Title is not set
            self.hasTitle = false;

        }

        // Remove title
        hoveredElement.attr(titleAttribute, '');

        // Return title
        return title;

    };

    /**
     * Reset title and hover popup
     *
     * @param {jQuery Object} hoveredElement Element being hovered
     * @returns {Hover} Implements fluent interface
     */
    self.reset = function (hoveredElement) {

        // Get current popup title
        var title = self.hoverPopup.html();

        // Clear current popup title
        self.hoverPopup.html('');

        // Reset title to hovered element
        hoveredElement.attr(self.getTitleAttribute(hoveredElement), title);

        // Title has been reset
        self.titleHasBeenReset = true;

        // Hide label
        self.hoverPopup.finish().hide();

        // Implement fluent interface
        return self;

    };

    return self;
};


// Title hover balloon
var titleHover = Hover();
titleHover.watchClass(COMPONENT_SELECTOR);
titleHover.watchClass(COMPONENT_SELECTOR_ALT);

// Exposing Hover as CommonJS module
module.exports = Hover;

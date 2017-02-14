"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require('jquery');

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_ATTR = "role='popup'";
var COMPONENT_SELECTOR = "[" + COMPONENT_ATTR + "]";

// ------------------------------------------------------------------------------------------ Component Definition

/**
 * Popup class
 *
 * @return {Popup}
 */
var Popup = function () {

    /**
     * Reference to this
     *
     * @type popup
     */
    var self = this;

    /**
     * Popup background
     *
     * @type object
     */
    self.background = null;

    /**
     * Popup
     *
     * @type object
     */
    self.popup = null;

    /**
     * Title pane
     *
     * @type object
     */
    self.titlePane = null;

    /**
     * Close button
     *
     * @type object
     */
    self.closeButton = null;

    /**
     * Content pane
     *
     * @type object
     */
    self.contentPane = null;

    /**
     * Button pane
     *
     * @type object
     */
    self.buttonPane = null;

    /**
     * Popup name
     *
     * @type string
     */
    self.popupName = '';

    /**
     * Function to execute on enter
     *
     * @type object
     */
    self.onEnter = false;

    /**
     * Function to execute on close
     *
     * @type object
     */
    self.onClose = false;


    /**
     * Create or attach background
     *
     * @private
     */
    self.createBackground = function () {

        // Get background
        self.background = window.document.getElementById('popupBackground');

        // Whether background is already available
        if (null === self.background) {
            // background has not been created yet

            // Create background element
            var backgroundElement = window.document.createElement('div');
            backgroundElement.id = 'popupBackground';
            backgroundElement.style.display = 'none';

            // Add background to body
            window.document.body.appendChild(backgroundElement);

            // Set background
            self.background = backgroundElement;

        }

    }

    /**
     * Create title pane
     *
     * @return {void}
     * @private
     */
    self.createTitlePane = function () {

        // Define elements
        var titlePaneElement = null;

        // Create title pane element
        titlePaneElement = window.document.createElement('div');
        titlePaneElement.className = 'popupTitlePane';
        titlePaneElement.id = self.popupName + 'PopupTitlePane';

        // Set title pane element
        self.titlePane = titlePaneElement;

        // Add title pane to popup
        self.popup.appendChild(titlePaneElement);

    }

    /**
     * Create content pane
     *
     * @return {void}
     * @private
     */
    self.createContentPane = function () {

        // define elements
        var closeButtonElement = null;

        // Create content pane element
        var contentElement = window.document.createElement('div');
        contentElement.className = 'popupContentPane';
        contentElement.id = self.popupName + 'PopupContentPane';

        // Set content pane
        self.contentPane = contentElement;

        // Create button element
        closeButtonElement = window.document.createElement('button');
        closeButtonElement.className = 'iconStarred-close close';

        // Set close button element
        self.closeButton = closeButtonElement;

        // Add close button to popup
        self.popup.appendChild(closeButtonElement);

        // Add content pane to popup
        self.popup.appendChild(contentElement);

    }

    /**
     * Create button pane
     *
     * @return {void}
     * @private
     */
     self.createButtonPane = function () {

        // Create button pane element
        var buttonBarElement = window.document.createElement('div');
        buttonBarElement.className = 'popupButtonPane';
        buttonBarElement.id = self.popupName + 'PopupButtonPane';

        // Set button pane
        self.buttonPane = buttonBarElement;

        // Add button pane to popup
        self.popup.appendChild(buttonBarElement);

    }

    /**
     * Configures popup based on configuration object
     *
     * @example
     *  {
     *      title: 'example',
     *      buttons: {
     *          close: {
     *              title: 'close this popup',
     *              class: 'closeButton',
     *              onclick: function () {
     *                  popup.toggle();
     *              }
     *          }
     *      }
     *  }
     *
     * @param {object} config Configuration object literal
     *
     * @return {void}
     * @private
     */
    self.configure = function (config) {

        // Define functionName
        var functionName = '';
        var functionIndex = '';

        // Whether a config object has been provided
        if (undefined !== config) {
            // Config object has been set

            // Iterate over object properties
            for (functionIndex in config) {

                // Whether this is a property directly contained by its object
                if (config.hasOwnProperty(functionIndex)) {

                    // Construct function name
                    functionName = 'set' + functionIndex.charAt(0).toUpperCase()
                        + functionIndex.slice(1);

                    // Whether the function exists
                    if ('function' === typeof self[functionName]) {
                        // Function does exist

                        // Call the function with the configured parameter as an
                        // argument
                        self[functionName](config[functionIndex]);

                    }

                }

            }

        }

    }

    /**
     * Enable escape, close and background close listeners to hide popup
     *
     * @return {void}
     * @private
     */
    self.enableToggleListeners = function () {

        // Watch key up events
        window.document.onkeyup = function (event) {

            // Use event parameter when passed, use window.event otherwise
            // (i.e. FireFox falls back to the later)
            event = event || window.event;

            // Whether escape is pressed when the popup is visible
            if (27 === event.keyCode
                    && 'none' !== self.background.style.display) {
                // Popup is visible and escape key has been pressed

                // Hide popup
                self.toggle();

            }

        };

        // Add close background toggle litener
        self.background.onclick = function(e) {
            if (e.target.id === "popupBackground"){
              self.toggle();
            }
        };

        // Add close button toggle listener
        self.closeButton.onclick = function () {
            self.toggle();
        };
    }

    /**
     * Enables onEnter listener. When enter gets pressed the anonymous function
     * assigned to onEnter will be executed
     *
     * @returns {void}
     * @private
     */
    self.enableOnEnterListener = function () {

        // Watch key down events
        window.document.onkeydown = function (event) {

            // Use event parameter when passed, use window.event otherwise
            // (i.e. FireFox falls back to the latter)
            event = event || window.event;

            // Whether enter is pressed when the popup is visible on an element
            // other than a textarea
            if ("none" !== self.popup.offsetWidth
                    && 0 < self.popup.offsetWidth
                    && 13 === event.keyCode
                    && 'textarea' !== window.document.activeElement.tagName.toLowerCase()
                    ) {
                // Popup is visible and enter key has been pressed

                // Prevent default action to be executed
                event.preventDefault();

                // Trigger onEnter event
                self.onEnter();

                // Prevent bubble up
                return false;

            }

        };

    }

    /**
     * Moves given elementId to the popup content pane
     *
     * @param {string} elementId Element to move to content pane
     * @returns {popup} Implements fluent interface
     */
    self.setContentsByElementId = function (elementId) {

        // Get contentElement
        var contentsElement = window.document.getElementById(elementId);

        // Whether contentsElement is set
        if (null !== contentsElement) {
            // ContentsElement has been defined

            // Whether contents are visible
            if ('none' === contentsElement.style.display) {
                // Contents are hidden

                // Make contents visible
                contentsElement.style.display = '';

            }

            // Move contentsElement to content pane
            self.contentPane.appendChild(contentsElement);

        }

        // Implement fluent interface
        return self;

    };

    /**
     * Set popup title
     *
     * @param {string} title Popup title displayed at the top of the popup
     * @return {popup} Implements fluent interface
     */
    self.setTitle = function (title) {

        // Define element ID
        var elementId = self.popupName + 'Title';

            // Define title element
        var titleElement = document.getElementById(elementId);

        // Check whether the title element exists
        if (titleElement) {
            // Title element exists

            // Update title
            titleElement.innerHTML = title;

            // Implement fluent interface
            return self;

        }

        // Create header element
        titleElement = window.document.createElement('h2');
        titleElement.className = 'popupTitle';
        titleElement.innerHTML = title;
        titleElement.id = elementId;

        // Add header to popup
        self.titlePane.appendChild(titleElement);

        // Move element to be the first element
        self.titlePane.insertBefore(titleElement, self.titlePane.firstChild);

        // Show title pane
        self.titlePane.style.display = 'block';

        // Implement fluent interface
        return self;

    };

    /**
     * Create button(s) based on object literal. This will remove previously
     * set buttons
     *
     * @param {object} buttons Button class literal
     * @return {popup} Implements fluent interface
     */
    self.setButtons = function (buttons) {

        // Define button element
        var buttonElement = null,
            buttonIndex = null;

        // Assert button pane exists when buttons need to be set
        if (!self.buttonPane) {
            self.createButtonPane();
        }

        // Iterate buttons and remove them
        // @see http://stackoverflow.com/a/3955238 why this is faster than
        //  this.buttonPane.innerHtml = '';
        while(self.buttonPane.firstChild) {

            // Remove previously added buttons
            self.buttonPane.removeChild(self.buttonPane.firstChild);

        }

        // Iterate over buttons
        for (buttonIndex in buttons) {

            // Whether this property is directly contained by its object
            if (buttons.hasOwnProperty(buttonIndex)) {

                // Create a new button element
                buttonElement = window.document.createElement('button');

                // Create button ID
                buttonElement.id = self.popupName + 'Popup' +
                buttonIndex.charAt(0).toUpperCase() +
                buttonIndex.slice(1);

                // Whether button class is defined
                if (undefined !== buttons[buttonIndex].className) {
                    // Class has been set

                    // Add button className
                    buttonElement.className = buttons[buttonIndex].className;

                }

                // Whether button title is defined
                if (undefined !== buttons[buttonIndex].title) {
                    // Titla has been set

                    // Set button title
                    buttonElement.innerHTML = buttons[buttonIndex].title;

                }

                // Whether an onclick is defined
                if (undefined !== buttons[buttonIndex].onclick) {
                    // Onclick has been set

                    // Add onclick
                    buttonElement.onclick = buttons[buttonIndex].onclick;

                }

                // Whether enableOnEnter is defined
                if (undefined !== buttons[buttonIndex].enableOnEnter) {
                    // onEnter has been set

                    // Whether default or custom onEnter is defined
                    if (true === buttons[buttonIndex].enableOnEnter
                            && undefined !== buttons[buttonIndex].onclick
                            ) {
                        // Default onEnter behaviour

                        // Set on enter to be onclick
                        self.onEnter = buttons[buttonIndex].onclick;

                    } else {
                        // Custom onEnter behaviour

                        // Set custom onEnter
                        self.onEnter = buttons[buttonIndex].enableOnEnter;

                    }

                    // Enable listener
                    self.enableOnEnterListener();

                }

                // Add button to button bar
                self.buttonPane.appendChild(buttonElement);

            }

        }

        // Implement fluent interface
        return self;

    };

    /**
     * Set on close callback function
     *
     * @param {Object} callback
     * @returns {popup}
     */
    self.setOnClose = function (callback) {

        // Set on close callback
        this.onClose = callback;

        // Implement fluent interface
        return this;

    };

    /**
     * Create popup
     *
     * @param {String} popupName       Popup name, this is used to define its
     *  scope (should be unique)
     * @param {Object} config          Configuration Object literal
     * @param {String} additionalClass Additional styling class
     *
     * @return {popup} Implements fluent interface
     */
    self.create = function (popupName, config, additionalClass) {

        // Get popup element
        var popupElement = window.document.getElementById(popupName + 'Popup');

        // Set popup reference name
        self.popupName = popupName;

        // Check whether div already exists
        if (null !== popupElement) {
            // Div already exists

            // Set popup
            self.popup = popupElement;

            // Initialize background
            self.createBackground();

            // Implements fluent interface
            return self;

        }

        // Create popup element
        popupElement = window.document.createElement('div');
        popupElement.id = popupName + 'Popup';
        popupElement.style.display = 'none';

        // Check whether any additional styling class is set
        if (undefined !== additionalClass) {
            // Additional class is set

            // Set popup class names
            popupElement.className = 'popupBox ' + additionalClass;

        } else {
            // No additional class available

            // Set class name
            popupElement.className = 'popupBox';

        }

        // Create background
        self.createBackground();

        // Add popup to body
        self.background.appendChild(popupElement);

        // Set popup
        self.popup = popupElement;

        // Create close button
        self.createTitlePane();

        // Create content pane
        self.createContentPane();

        // Apply configuration
        self.configure(config);

        // Implements fluent interface
        return self;

    };

    /**
     * Set popup contents
     *
     * @param {string} html HTML popup contents to set
     *
     * @return {popup} Implements fluent interface
     */
    self.setContents = function (html) {

        // Set contents
        self.contentPane.innerHTML = html;

        // Implements fluent interface
        return self;

    };

    /**
     * Whether the popup is visible at the moment
     *
     * @returns {Boolean} True when visible, false otherwise
     */
    self.isVisible = function () {

        // Return whether the popup is visible
        return 'none' !== self.popup.style.display;

    };

    self.toggle = function () {

        // Whether the popup is visible
        if (self.isVisible()) {
            // Popup is visible

            // Popup won't close when text is selected, deselect all
            if (window.getSelection) {
                // all browsers, except IE before version 9

                // Deselect all
                window.getSelection().removeAllRanges();

            } else if (document.selection.createRange) {
                // Internet Explorer

                // Create selection range
                document.selection.createRange();

                // Clear selection
                document.selection.empty();

            }

            // Check whether close callback is set
            if (self.onClose) {

                // Execute on close callback
                self.onClose();

            }

            // Hide popup
            $('body').removeClass('no-scroll');
            self.background.style.display = 'none';
            self.popup.style.display = 'none';

        } else {
            // Popup is not visible

            $('body').addClass('no-scroll');
            // Toggle listeners
            self.enableToggleListeners();

            // Show popup
            this.background.style.display = '';
            this.popup.style.display = '';

        }

        // Implement fluent interface
        return self;

    };

};

$(COMPONENT_SELECTOR).each(function(index, element) {

  	// Create the Popup object for this element
    var popup = new Popup();

    // Retrieve configs from data attributes
    var data = $(element).data();

    // create popup with following configs
    popup.create(
      data.name,
      window[data.config],
      data.extraclass
    );

    // toggle classes
    var toggleClassList = data.toggleclass.split(" ");

    // bind popup toggle for these classes
    $.each(toggleClassList, function(i, toggleClass){
      $('.' + toggleClass).click(function(){
          popup.toggle();
      });
    });

});


// Exposing Popup as CommonJS module
module.exports = Popup;

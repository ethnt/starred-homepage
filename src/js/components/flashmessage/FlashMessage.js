"use strict";

/**
 * Flash message constructor
 *
 * @returns {FlashMessage}
 */

var FlashMessage = function () {

    // Create the FlashMessage object
    var self = {};

    /**
     * Message container spacer element
     *
     * @type HTMLObject
     */
    self.messageSpacerElement = null;

    /**
     * Message container element
     *
     * @type HTMLObject
     */
    self.messageElement = null;

    /**
     * Flash message height in pixels
     *
     * @type Number
     */
    self.height = 60;

    /**
     * Closing animation
     *
     * @type function
     */
    self.animation = null;

    /**
     * Construct flash message compontent
     *
     * HTML contents will be created and added right after menu, or as first element
     * of the bodywrapper when the menu is disabled
     *
     * @param elem Container element for the flash message
     * @returns {FlashMessage}
     */
    self.init = function (elem) {

        var messageContainer;
        var messageText;
        var menu;
        var bodyWrapper;
        var isClicked = true;

        self.messageSpacerElement = elem
                || window.document.getElementById("jsFlashMessage");

        // Create message spacer element when it does not exist yet
        if (elem || !self.messageSpacerElement) {

            self.messageSpacerElement = window.document.createElement("div");
            self.messageSpacerElement.id = "jsFlashMessage";
            self.messageSpacerElement.className = "flashMessageSpacer";
            self.messageSpacerElement.style.display = "none";

            self.messageElement = window.document.createElement("div");
            self.messageElement.id = "jsFlashMessage";
            self.messageElement.style.display = "none";
            self.messageElement.onclick = function () {

                // Hide animation
                self.animation = setInterval(
                    function () {
                        self.hide(isClicked);
                    },
                    5
                );

            };

            messageContainer = window.document.createElement("div");
            messageContainer.className = "flashMessageContainer";
            self.messageElement.appendChild(messageContainer);

            messageText = window.document.createElement("p");
            messageContainer.appendChild(messageText);

            // Check if a container element was provided
            if (elem) {

                // Container element provided, adding to container
                // Insert flashMessage in the specified container element
                elem.appendChild(self.messageElement);

            } else {

                // Container element not provided, adding to body / menu
                // Insert flashMessage right after the menu element so it is
                // positioned between the menu and the actual page, or as first
                // element of the bodywrapper when the meny is not present
                menu = window.document.getElementById("invite-navigation-spacer");

                if (!menu) {
                    menu = window.document.getElementById("homepageMenuSpacer");
                } else {
                    self.messageElement.style.top = "116px";
                }

                if (menu) {

                    menu.parentNode.insertBefore(
                        self.messageSpacerElement,
                        menu.nextSibling
                    );

                    self.messageSpacerElement.parentNode.insertBefore(
                        self.messageElement,
                        self.messageSpacerElement.nextSibling
                    );

                } else {

                    bodyWrapper = window.document.getElementById("bodyWrapper");
                    bodyWrapper.insertBefore(
                        self.messageSpacerElement,
                        bodyWrapper.firstChild
                    );

                }
            }

        } else {

            // Message is placed immediatly after the message spacer
            self.messageElement = self.messageSpacerElement.nextSibling;

        }

        return self;

    };

    /**
     * Show a flash message
     *
     * @param {String} message               The message to display
     * @param {String} severity              Message type (Info|Notification|Error)
     * @param {Number} autoCloseMilliSeconds Time for autoclosing the notification
     * @returns {FlashMessage}
     */
    self.show = function (message, severity, autoCloseMilliSeconds) {

        var severityClassName = "flashMessage flashMessageLevel";
        var timerPassed = true;

        // Define message severity class
        severity = severity.charAt(0).toUpperCase() +
                severity.slice(1).toLowerCase();

        if ("Error" === severity) {
            severityClassName += severity;
        } else if ("Notification" === severity) {
            severityClassName += severity;
        } else {
            severityClassName += "Info";
        }
        self.messageElement.className = severityClassName;

        // Set message
        self.messageElement.firstChild.firstChild.innerHTML = message;

        // Show the notification
        self.messageSpacerElement.style.display = "block";
        self.messageElement.style.display = "block";

        // Check if dropdown-menu-trigger parameter is set
        if (undefined !== autoCloseMilliSeconds) {
            // Auto close parameter is set

            // Set time out of the message
            setTimeout(function () {

                // Start hide animation
                self.animation = setInterval(
                    function () {
                        self.hide(timerPassed);
                    },
                    5
                );

            }, autoCloseMilliSeconds);
        }

        return self;
    };

    /**
     * Hide flash message
     *
     * @param {boolean} clicked
     * @returns {FlashMessage}
     */
    self.hide = function (clicked) {

        if (clicked) {

            // Update height of node
            self.messageSpacerElement.style.height = self.height + "px";
            self.messageElement.style.height = self.height + "px";

            // Update height
            self.height = Number(self.height - 4);

            if (0 === self.height) {

                // Reset the interval
                clearInterval(self.animation);

                // Hide the node so node will be completely gone
                self.messageSpacerElement.style.display = "none";
                self.messageElement.style.display = "none";

                // Reset the height of the nodes, so the next flashMessage will show correctly
                self.height = 60;
                self.messageSpacerElement.style.height = self.height + 4 + "px";
                self.messageElement.style.height = self.height + "px";

            }

        }

        return self;

    };

    return self;

};

// Exposing FlashMessage as CommonJS module
module.exports = FlashMessage;

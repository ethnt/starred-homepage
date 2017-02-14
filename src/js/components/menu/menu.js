"use strict";

// ------------------------------------------------------------------------------------------ Component Dependencies

var $ = require("jquery");
var visible = require('visible-element')($);

// ------------------------------------------------------------------------------------------ Component Variables

var COMPONENT_ATTR = "role='dropdown-menu'";
var COMPONENT_SELECTOR = "[" + COMPONENT_ATTR + "]";

var DROPDOWN_MENU = ".dropdown-menu";
var DROPDOWN_MENU_PARENT = ".dropdown-menu-parent";
var DROPDOWN_PARENT_SUBMENU = ".parentSubmenu";
var SUBMENU_AUTO_CLOSE = ".autoCloseSubMenu";

// ------------------------------------------------------------------------------------------ Component Definition
/**
 * Define menu handler
 *
 * @type {MenuHandler}
 */
var MenuHandler = function () {

    // Set default options
    var options = {

        submenu: true,
        menutype: 'default',
        breakpoint: false

    };

    return {

        /**
         * Initialise menu and its event handlers
         *
         * @param {HTMLObject} element
         */
        init: function (element) {

            // init options handlers
            this.getOptions(element);
            this.initOptions(element);

            // Assign menu enter handlers
            this.setSubMenuEnter(element);
            this.setMenuEnter(element);

            // Assign menu click handlers
            this.setMenuItemClick(element);
            this.setSubMenuClick(element);
            this.setParentMenuClick(element);
            this.setMenuClick(element);

            // Assign menu leave handlers
            this.setSubMenuLeave(element);
            this.setMenuLeave(element);

        },

        /**
         * Enter menu
         *
         * @param {HTMLObject} element
         */
        setMenuEnter: function (element) {

            /**
             * Watch for dropdown-menu-trigger mouse enter events
             */
            $(element).on("mouseenter", "", function () {

                // Get timer ID
                var menuTimerId = $(this).attr("data-autoclosetimer");

                // Check whether a timer ID is available
                if (!isNaN(menuTimerId)) {
                    // Timer ID is available

                    // Clear timer
                    window.clearTimeout(menuTimerId);

                }

            });

        },

        /**
         * Enter sub menu
         *
         * @param {HTMLObject} element
         */
        setSubMenuEnter: function (element) {

            /**
             * Watch for dropdown-menu-trigger mouse enter events
             */
            $(element).on("mouseenter", DROPDOWN_PARENT_SUBMENU + ".open", function () {

                // Get timer ID
                var menuTimerId = $(this).attr("data-autoclosetimer");

                // Check whether a timer ID is available
                if (!isNaN(menuTimerId)) {
                    // Timer ID is available

                    // Clear timer
                    window.clearTimeout(menuTimerId);

                }

            });

        },

        /**
         * Menu click
         *
         * @param {HTMLObject} element
         */
        setMenuClick: function (element) {

            /**
             * Watch for dropdown-menu-trigger element clicks
             */
            $(element).click(function () {

                // Check whether its sub menu is opened and has at least 1 item
                if (!$(this).hasClass("open")) {
                    // Sub menu has not been opened

                    // if the mode is strict check wether the list has at least 1 item else just open the menu
                    if (options.menutype === 'default' || options.menutype === 'strict' && $('ul li', element).length >= 1) {
                      // Show sub menu
                      $(DROPDOWN_MENU, this).show();

                      // Sub menu is opened
                      $(this).addClass("open");

                    }

                } else {
                    // Submenu is open

                    // Close sub menu
                    $(DROPDOWN_MENU, this).hide();

                    // Sub menu is closed
                    $(this).removeClass("open");

                }

                // Prevent event bubbling
                return false;

            });

        },

        /**
         * Parent menu click
         *
         * @param {HTMLObject} element
         */
        setParentMenuClick: function (element) {

            /**
             * Watch for dropdown-menu-parent click
             */
            $(element).on("click", DROPDOWN_MENU_PARENT, function () {

                // Trigger parent to be clicked
                $(this).parent().click();

                // Prevent event bubbling
                return false;

            });

        },

        /**
         * Sub menu click
         *
         * @param {HTMLObject} element
         */
        setSubMenuClick: function (element) {

            var self = this;

            $(element).on("click", DROPDOWN_PARENT_SUBMENU, function () {

                // Toggle clicked submenu
                self.toggleSubMenu($(this));

                // Prevent event bubbling
                return false;

            });

        },

        /**
         * Process event when a menu item link is clicked
         *
         * @param {HTMLObject} element
         */
        setMenuItemClick: function (element) {

            /**
             * Stop event propagation for all link elements contained by the dropdown-menu-trigger
             * element to prevent accidental menu closing
             *
             * @param {Object} event Click event
             */

            $("ul li", element).on("click", "a", function (event) {

                // Get link
                var link = $(this).attr("href");

                // Fall through when link is not set
                if (undefined === link || "#" === link) {
                    return;
                }

                // Link is clicked, so stop propagation
                event.stopPropagation();

            });
        },

        /**
         * Toggle the given sub menu on or off
         *
         * @param {Object} element Sub menu jquery element
         */
        toggleSubMenu: function (element) {

            // Whether sub menu has been opened
            if (!element.hasClass("open")) {
                // Sub menu is closed

                // Position submenu based on parent element
                element.children(SUBMENU_AUTO_CLOSE).css({
                    left: element.outerWidth() + 10
                });

                // Show submenu
                element.children(SUBMENU_AUTO_CLOSE).show();

                // Sub menu is opened
                element.addClass("open");

            } else {
                // Sub menu is open

                // Hide sub menu
                element.children(SUBMENU_AUTO_CLOSE).hide();

                // Mark sub menu as being closed
                element.removeClass("open");

            }

        },

        /**
         * Menu leave
         *
         * @param {HTMLObject} element
         */
        setMenuLeave: function (element) {

            /**
             * Watch for dropdown-menu-trigger mouse leave events
             */
            $(element).on("mouseleave", function () {

                // Get hovered element
                var menuHoverElement = $(this);

                // Set a timeout and get its ID
                var menuTimerId = window.setTimeout(function () {

                    // Check whether sub menu is open
                    if (menuHoverElement.hasClass("open")) {
                        // Sub menu is open

                        // Hide dropdown-menu menu"s
                        $(DROPDOWN_MENU + "," + SUBMENU_AUTO_CLOSE, menuHoverElement).hide();

                        // Close open submenu
                        $(DROPDOWN_PARENT_SUBMENU, menuHoverElement).removeClass("open");

                        if ($(".toggleSwitchMenu", menuHoverElement)) {
                            $("#switchAccount", menuHoverElement).hide();
                        }

                        // Sub menu is closed
                        menuHoverElement.removeClass("open");

                    }

                }, 400);

                // Add timer ID to the hovered element
                menuHoverElement.attr("data-autoclosetimer", menuTimerId);

                // Prevent event bubbling
                return false;

            });

        },

         /**
         * Sub menu leave
         *
         * @param {HTMLObject} element
         */
        setSubMenuLeave: function (element) {

            var self = this;

            /**
             * Watch for dropdown-menu-trigger sub menu mouse leave events
             */
            $(element).on("mouseleave", DROPDOWN_PARENT_SUBMENU + ".open", function () {

                // Get hovered element
                var menuHoverElement = $(this);

                // Set a timeout and get its ID
                var menuTimerId = window.setTimeout(function () {

                    self.toggleSubMenu(menuHoverElement);

                }, 300);

                // Add timer ID to the hovered element
                menuHoverElement.attr("data-autoclosetimer", menuTimerId);

            });
        },
        /**
        *
        *
        * @param {HTMLObject} element
        */
        setBreakPointHandler: function(element){

            $(element).click(function (element) {

                var getParent = $(this);
                var getCurrentdropdown = $(this).children('.popupDropdown');
                var getBottomPositionDropdown = getCurrentdropdown.offset().top + getCurrentdropdown.outerHeight();
                var getScreenBreakingPoint = $(window).height() * 0.85 + 80;

                var defaultDropdown = function() {
                    getCurrentdropdown.css({
                        "position": "fixed",
                        "top": getParent.offset().top + 52 - $(window).scrollTop(),
                        "width": getParent.outerWidth()
                    }).removeClass('dropdown-arrowBar-4').addClass('dropdown-arrowBar-2');
                }
                
                var breakpointDropDown = function(){
                    getCurrentdropdown.css({
                        "position": "fixed",
                        "top": getParent.offset().top - getCurrentdropdown.outerHeight() - 10 - $(window).scrollTop(),
                        "width": getParent.outerWidth()
                    }).removeClass('dropdown-arrowBar-2').addClass('dropdown-arrowBar-4');
                }

                if (getBottomPositionDropdown > getScreenBreakingPoint) {
                    
                    breakpointDropDown();

                    // if elements in the container are not visible fallback to default view
                    if(visible.inContainer($('ul li:first-of-type',getCurrentdropdown),$(getCurrentdropdown))){
                        defaultDropdown();
                    }

                } else {
                    defaultDropdown();
                }

                return false;

            });

        },
        /**
         * Gets element data attributes and maps to options object
         *
         * @param {HTMLObject} element
         */
        getOptions: function (element) {

            var data = $(element).data();

            $.each(data, function (key, value) {

                if (options.hasOwnProperty(key)) {
                    options[key] = value;
                }

            });

        },

        /**
         * Init options settings
         *
         * @param {HTMLObject} element
         */
        initOptions: function (element) {

            // Check if event propagation is needed
            if (options.submenu === true) {
                $(DROPDOWN_MENU, element).children().on("click", function (event) {

                    event.stopPropagation();

                });

            }

            if (options.breakpoint === true) {

                this.setBreakPointHandler(element);

            }
        }

    };

};

// ------------------------------------------------------------------------------------------ Component Initialization

$(COMPONENT_SELECTOR).each(function (index, element) {

    // Create the Menu object for this element
    var menu = new MenuHandler();

    // initialize the menu
    menu.init(element);

});

// ------------------------------------------------------------------------------------------ Component Exposure

module.exports = MenuHandler;

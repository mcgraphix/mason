/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.ResizeSensor = factory();
    }
}(this, function () {

    //Make sure it does not throw in a SSR (Server Side Rendering) situation
    if (typeof window === "undefined") {
        return null;
    }
    // Only used for the dirty checking, so the event callback count is limted to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType
            || ('[object NodeList]' === elementsType)
            || ('[object HTMLCollection]' === elementsType)
            || ('[object Object]' === elementsType)
            || ('undefined' !== typeof jQuery && elements instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            var q = [];
            this.add = function(ev) {
                q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = q.length; i < j; i++) {
                    q[i].call();
                }
            };

            this.remove = function(ev) {
                var newQueue = [];
                for(i = 0, j = q.length; i < j; i++) {
                    if(q[i] !== ev) newQueue.push(q[i]);
                }
                q = newQueue;
            }

            this.length = function() {
                return q.length;
            }
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') == 'static') {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];
            var dirty, rafId, newWidth, newHeight;
            var lastWidth = element.offsetWidth;
            var lastHeight = element.offsetHeight;

            var reset = function() {
                expandChild.style.width = '100000px';
                expandChild.style.height = '100000px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();

            var onResized = function() {
                rafId = 0;

                if (!dirty) return;

                lastWidth = newWidth;
                lastHeight = newHeight;

                if (element.resizedAttached) {
                    element.resizedAttached.call();
                }
            };

            var onScroll = function() {
                newWidth = element.offsetWidth;
                newHeight = element.offsetHeight;
                dirty = newWidth != lastWidth || newHeight != lastHeight;

                if (dirty && !rafId) {
                    rafId = requestAnimationFrame(onResized);
                }

                reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            ResizeSensor.detach(element, ev);
        };
    };

    ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if(elem.resizedAttached && typeof ev == "function"){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                if (elem.contains(elem.resizeSensor)) {
                    elem.removeChild(elem.resizeSensor);
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
            }
        });
    };

    return ResizeSensor;

}));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mason__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__mason__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__["a"]; });


//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    ResizeSensor: __webpack_require__(0),
    ElementQueries: __webpack_require__(5)
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MasonDomRenderer; });
/**
 * Created by mckeowr on 2/3/17.
 */
var MasonDomRenderer = (function () {
    function MasonDomRenderer() {
    }
    MasonDomRenderer.prototype.setColumns = function (columns) {
        this.columns = columns;
    };
    MasonDomRenderer.prototype.getElementWidth = function (element) {
        return element.offsetWidth;
    };
    MasonDomRenderer.prototype.getElementHeight = function (element) {
        return element.offsetHeight;
    };
    MasonDomRenderer.prototype.setPosition = function (element, leftInCols, topInUnits) {
        element.style.left = ((leftInCols / this.columns) * 100) + '%';
        element.style.top = topInUnits + 'px';
    };
    return MasonDomRenderer;
}());

//# sourceMappingURL=mason-dom-renderer.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Mason; });
var Mason = (function () {
    function Mason(renderer, containerWidth, columns) {
        if (columns === void 0) { columns = 12; }
        this.columns = 12;
        this.containerWidth = containerWidth;
        this.columnBottoms = [];
        while (this.columnBottoms.length < 12) {
            this.columnBottoms.push(0);
        }
        renderer.setColumns(columns);
        this.renderer = renderer;
        this.columns = columns;
    }
    Mason.prototype.findBestColumn = function (requiredColumns, element) {
        var _this = this;
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        var result = this.columnBottoms.reduce(function (accumulator, column, idx, all) {
            // starting at column X, if we put it here, what would be
            // its starting point
            if (idx + requiredColumns > _this.columns) {
                accumulator.push(-1);
                return accumulator;
            }
            else {
                // get the height at which it would have to be positioned
                // in order to not overlap something
                var yPos = -1;
                for (var i = idx; i < requiredColumns + idx; i++) {
                    yPos = Math.max(yPos, all[i]);
                }
                accumulator.push(yPos);
                return accumulator;
            }
        }, []);
        // now the we have the y coord that it would need to be at for each starting column
        // we just need to figure out which one is lowest and we're done
        var bestFit = result.reduce(function (best, curr, idx) {
            if (!best) {
                return { xColumns: idx, yUnits: curr };
            }
            else {
                if (curr < best.yUnits && curr !== -1) {
                    return { xColumns: idx, yUnits: curr };
                }
                else {
                    return best;
                }
            }
        }, null);
        bestFit.element = element;
        return bestFit;
    };
    /**
     * Takes a list of elements and returns the new coords for each one. This does not reposition anything.
     * You might use this if you want to handle how and when things get repositioned.
     *
     * See layout() if you want everything position automatically.
     *
     * @param elements
     * @returns {MasonCoord[]}
     */
    Mason.prototype.fit = function (elements) {
        var _this = this;
        var coordsList = [];
        elements.forEach(function (element, idx) {
            var elementWidth = _this.renderer.getElementWidth(element);
            var elementHeight = _this.renderer.getElementHeight(element);
            var cols = Math.round((elementWidth / _this.containerWidth) * _this.columns);
            // can't be bigger than 'all' columns
            if (cols > _this.columns) {
                cols = _this.columns;
            }
            var bestFit = _this.findBestColumn(cols, element);
            // update the column bottoms for all the columns this tile crosses when positioned at the best
            // location
            var startCol = bestFit.xColumns;
            var endCol = startCol + cols;
            for (var i = startCol; i < endCol; i++) {
                _this.columnBottoms[i] = bestFit.yUnits + elementHeight;
            }
            // this is a tuple where x is the column index and yPos is the pixel coord to position at.
            coordsList.push(bestFit);
        });
        // return the list of coordinates for each tile
        return coordsList;
    };
    /**
     * This will take the list of elements, find their new locations and then use the MasonRenderer
     * to reposition all the bricks into their new home.
     * @param elements
     */
    Mason.prototype.layout = function (elements) {
        var _this = this;
        this.fit(elements).forEach(function (coord) {
            // apply the calculated position for each brick however you want. In this case
            // we are just setting the CSS position. Animation will be provided via CSS
            _this.renderer.setPosition(coord.element, coord.xColumns, coord.yUnits);
        });
    };
    return Mason;
}());

;
//# sourceMappingURL=mason.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === "object") {
        module.exports = factory(require('./ResizeSensor.js'));
    } else {
        root.ElementQueries = factory(root.ResizeSensor);
    }
}(this, function (ResizeSensor) {

    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = function() {

        var trackingActive = false;
        var elements = [];

        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = window.getComputedStyle(element, null).fontSize;
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function convertToPx(element, value) {
            var numbers = value.split(/\d/);
            var units = numbers[numbers.length-1];
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = {};
            var key, option, width = 0, height = 0, value, actualValue, attrValues, attrValue, attrName;

            /**
             * @param {Object} option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                var idx = [option.mode, option.property, option.value].join(',');
                this.options[idx] = option;
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (key in this.options) {
                    if (!this.options.hasOwnProperty(key)){
                        continue;
                    }
                    option = this.options[key];

                    value = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode == 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode == 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ').indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if(!attributes.hasOwnProperty(k)) continue;

                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                element.elementQueriesSensor = new ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();

            if (trackingActive && elements.indexOf(element) < 0) {
                elements.push(element);
            }
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        var allQueries = {};
        function queueQuery(selector, mode, property, value) {
            if (typeof(allQueries[mode]) == 'undefined') allQueries[mode] = {};
            if (typeof(allQueries[mode][property]) == 'undefined') allQueries[mode][property] = {};
            if (typeof(allQueries[mode][property][value]) == 'undefined') allQueries[mode][property][value] = selector;
            else allQueries[mode][property][value] += ','+selector;
        }

        function getQuery() {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            return query;
        }

        /**
         * Start the magic. Go through all collected rules (readRules()) and attach the resize-listener.
         */
        function findElementQueriesElements() {
            var query = getQuery();

            for (var mode in allQueries) if (allQueries.hasOwnProperty(mode)) {

                for (var property in allQueries[mode]) if (allQueries[mode].hasOwnProperty(property)) {
                    for (var value in allQueries[mode][property]) if (allQueries[mode][property].hasOwnProperty(value)) {
                        var elements = query(allQueries[mode][property][value]);
                        for (var i = 0, j = elements.length; i < j; i++) {
                            setupElement(elements[i], {
                                mode: mode,
                                property: property,
                                value: value
                            });
                        }
                    }
                }

            }
        }

        /**
         *
         * @param {HTMLElement} element
         */
        function attachResponsiveImage(element) {
            var children = [];
            var rules = [];
            var sources = [];
            var defaultImageId = 0;
            var lastActiveImage = -1;
            var loadedImages = [];

            for (var i in element.children) {
                if(!element.children.hasOwnProperty(i)) continue;

                if (element.children[i].tagName && element.children[i].tagName.toLowerCase() === 'img') {
                    children.push(element.children[i]);

                    var minWidth = element.children[i].getAttribute('min-width') || element.children[i].getAttribute('data-min-width');
                    //var minHeight = element.children[i].getAttribute('min-height') || element.children[i].getAttribute('data-min-height');
                    var src = element.children[i].getAttribute('data-src') || element.children[i].getAttribute('url');

                    sources.push(src);

                    var rule = {
                        minWidth: minWidth
                    };

                    rules.push(rule);

                    if (!minWidth) {
                        defaultImageId = children.length - 1;
                        element.children[i].style.display = 'block';
                    } else {
                        element.children[i].style.display = 'none';
                    }
                }
            }

            lastActiveImage = defaultImageId;

            function check() {
                var imageToDisplay = false, i;

                for (i in children){
                    if(!children.hasOwnProperty(i)) continue;

                    if (rules[i].minWidth) {
                        if (element.offsetWidth > rules[i].minWidth) {
                            imageToDisplay = i;
                        }
                    }
                }

                if (!imageToDisplay) {
                    //no rule matched, show default
                    imageToDisplay = defaultImageId;
                }

                if (lastActiveImage != imageToDisplay) {
                    //image change

                    if (!loadedImages[imageToDisplay]){
                        //image has not been loaded yet, we need to load the image first in memory to prevent flash of
                        //no content

                        var image = new Image();
                        image.onload = function() {
                            children[imageToDisplay].src = sources[imageToDisplay];

                            children[lastActiveImage].style.display = 'none';
                            children[imageToDisplay].style.display = 'block';

                            loadedImages[imageToDisplay] = true;

                            lastActiveImage = imageToDisplay;
                        };

                        image.src = sources[imageToDisplay];
                    } else {
                        children[lastActiveImage].style.display = 'none';
                        children[imageToDisplay].style.display = 'block';
                        lastActiveImage = imageToDisplay;
                    }
                } else {
                    //make sure for initial check call the .src is set correctly
                    children[imageToDisplay].src = sources[imageToDisplay];
                }
            }

            element.resizeSensor = new ResizeSensor(element, check);
            check();

            if (trackingActive) {
                elements.push(element);
            }
        }

        function findResponsiveImages(){
            var query = getQuery();

            var elements = query('[data-responsive-image],[responsive-image]');
            for (var i = 0, j = elements.length; i < j; i++) {
                attachResponsiveImage(elements[i]);
            }
        }

        var regex = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/mgi;
        var attrRegex = /\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/mgi;
        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match;
            var smatch;
            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                smatch = match[1] + match[3];
                attrs = match[2];

                while (null !== (attrMatch = attrRegex.exec(attrs))) {
                    queueQuery(smatch, attrMatch[1], attrMatch[2], attrMatch[3]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        }else if(-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
        }

        var defaultCssInjected = false;

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.init = function(withTracking) {
            trackingActive = typeof withTracking === 'undefined' ? false : withTracking;

            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules || document.styleSheets[i].cssText);
                } catch(e) {
                    if (e.name !== 'SecurityError') {
                        throw e;
                    }
                }
            }

            if (!defaultCssInjected) {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img { width: 100%;}';
                document.getElementsByTagName('head')[0].appendChild(style);
                defaultCssInjected = true;
            }

            findElementQueriesElements();
            findResponsiveImages();
        };

        /**
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.update = function(withTracking) {
            this.init(withTracking);
        };

        this.detach = function() {
            if (!this.withTracking) {
                throw 'withTracking is not enabled. We can not detach elements since we don not store it.' +
                'Use ElementQueries.withTracking = true; before domready or call ElementQueryes.update(true).';
            }

            var element;
            while (element = elements.pop()) {
                ElementQueries.detach(element);
            }

            elements = [];
        };
    };

    /**
     *
     * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
     *                               (no garbage collection possible if you don not call .detach() first)
     */
    ElementQueries.update = function(withTracking) {
        ElementQueries.instance.update(withTracking);
    };

    /**
     * Removes all sensor and elementquery information from the element.
     *
     * @param {HTMLElement} element
     */
    ElementQueries.detach = function(element) {
        if (element.elementQueriesSetupInformation) {
            //element queries
            element.elementQueriesSensor.detach();
            delete element.elementQueriesSetupInformation;
            delete element.elementQueriesSensor;

        } else if (element.resizeSensor) {
            //responsive image

            element.resizeSensor.detach();
            delete element.resizeSensor;
        } else {
            //console.log('detached already', element);
        }
    };

    ElementQueries.withTracking = false;

    ElementQueries.init = function() {
        if (!ElementQueries.instance) {
            ElementQueries.instance = new ElementQueries();
        }

        ElementQueries.instance.init(ElementQueries.withTracking);
    };

    var domLoaded = function (callback) {
        /* Internet Explorer */
        /*@cc_on
         @if (@_win32 || @_win64)
         document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
         document.getElementById('ieScriptLoad').onreadystatechange = function() {
         if (this.readyState == 'complete') {
         callback();
         }
         };
         @end @*/
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
        /* Safari, iCab, Konqueror */
        else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        }
        /* Other web browsers */
        else window.onload = callback;
    };

    ElementQueries.listen = function() {
        domLoaded(ElementQueries.init);
    };

    // make available to common module loader
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = ElementQueries;
    }
    else {
        window.ElementQueries = ElementQueries;
        ElementQueries.listen();
    }

    return ElementQueries;

}));


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_css_element_queries__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_css_element_queries___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_css_element_queries__);
/**
 * Created by mckeowr on 2/2/17.
 */



function pack() {

        // find our container
        var dashboard = document.querySelector('.mason-container');
        var containerWidth = dashboard.offsetWidth;
        // find all the bricks in it
        // not all browsers are able to treat the results from querySelectorAll with array methods like forEach()
        // so this will make then an array
        var items = [].slice.call(dashboard.querySelectorAll('div.mason-brick'));

        // create a Mason and use it to fit the bricks into a container
        // the size of the 'dashboard'
        // since we are dealing with dom nodes, we need the MasonDomRenderer
        var renderer = new __WEBPACK_IMPORTED_MODULE_0__lib__["a" /* MasonDomRenderer */]();
        new __WEBPACK_IMPORTED_MODULE_0__lib__["b" /* Mason */](renderer, containerWidth).layout(items);

}

function start() {
    // initialize the layout
    pack();

    // in our case, we want to re layout the bricks when any of their sizes change.
    // if the bricks sizes can only change when the window is resized, you could use the
    // window resize event. However, if the bricks can resize themselves, you would want to do something
    // like this
    new __WEBPACK_IMPORTED_MODULE_1_css_element_queries__["ResizeSensor"](document.querySelector('.mason-container').querySelectorAll('div.mason-brick'), function() {
        pack();
    });

    document.getElementById('expandableExample').querySelector('button').addEventListener('click', function() {
       showMore();
    });
}

function resetHeight() {
    var firstTile = document.getElementById('expandableExample');
    firstTile.style.height = 'auto';
    firstTile.removeEventListener('transitionend', resetHeight);
}

function showMore() {
    var firstTile = document.getElementById('expandableExample');

    if (firstTile.style.height !== '400px') {
        var autoHeight = window.getComputedStyle(firstTile, null).height;
        firstTile.setAttribute('data-auto-height', autoHeight);
        firstTile.style.height = autoHeight;
        setTimeout(function() {
            firstTile.style.height = '400px';
        });
    } else {
        var targetHeight = firstTile.getAttribute('data-auto-height');
        firstTile.style.height = targetHeight;
        firstTile.addEventListener('transitionend', resetHeight);
    }
}

start();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzZhMmU3M2JkN2IzMTg4N2U1ZjYiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL3NyYy9SZXNpemVTZW5zb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY3NzLWVsZW1lbnQtcXVlcmllcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFzb24tZG9tLXJlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL2xpYi9tYXNvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL0VsZW1lbnRRdWVyaWVzLmpzIiwid2VicGFjazovLy8uL2RlbW8vbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7O0FDbGdCRDtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ2dDO0FBQ1g7O0FBRXJCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFEiLCJmaWxlIjoiLi9kZW1vL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDc2YTJlNzNiZDdiMzE4ODdlNWY2IiwiLyoqXG4gKiBDb3B5cmlnaHQgTWFyYyBKLiBTY2htaWR0LiBTZWUgdGhlIExJQ0VOU0UgZmlsZSBhdCB0aGUgdG9wLWxldmVsXG4gKiBkaXJlY3Rvcnkgb2YgdGhpcyBkaXN0cmlidXRpb24gYW5kIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2ovY3NzLWVsZW1lbnQtcXVlcmllcy9ibG9iL21hc3Rlci9MSUNFTlNFLlxuICovXG47XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5SZXNpemVTZW5zb3IgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAvL01ha2Ugc3VyZSBpdCBkb2VzIG5vdCB0aHJvdyBpbiBhIFNTUiAoU2VydmVyIFNpZGUgUmVuZGVyaW5nKSBzaXR1YXRpb25cbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gT25seSB1c2VkIGZvciB0aGUgZGlydHkgY2hlY2tpbmcsIHNvIHRoZSBldmVudCBjYWxsYmFjayBjb3VudCBpcyBsaW10ZWQgdG8gbWF4IDEgY2FsbCBwZXIgZnBzIHBlciBzZW5zb3IuXG4gICAgLy8gSW4gY29tYmluYXRpb24gd2l0aCB0aGUgZXZlbnQgYmFzZWQgcmVzaXplIHNlbnNvciB0aGlzIHNhdmVzIGNwdSB0aW1lLCBiZWNhdXNlIHRoZSBzZW5zb3IgaXMgdG9vIGZhc3QgYW5kXG4gICAgLy8gd291bGQgZ2VuZXJhdGUgdG9vIG1hbnkgdW5uZWNlc3NhcnkgZXZlbnRzLlxuICAgIHZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChmbiwgMjApO1xuICAgICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZSBvdmVyIGVhY2ggb2YgdGhlIHByb3ZpZGVkIGVsZW1lbnQocykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEhUTUxFbGVtZW50W119IGVsZW1lbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2hFbGVtZW50KGVsZW1lbnRzLCBjYWxsYmFjayl7XG4gICAgICAgIHZhciBlbGVtZW50c1R5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudHMpO1xuICAgICAgICB2YXIgaXNDb2xsZWN0aW9uVHlwZWQgPSAoJ1tvYmplY3QgQXJyYXldJyA9PT0gZWxlbWVudHNUeXBlXG4gICAgICAgICAgICB8fCAoJ1tvYmplY3QgTm9kZUxpc3RdJyA9PT0gZWxlbWVudHNUeXBlKVxuICAgICAgICAgICAgfHwgKCdbb2JqZWN0IEhUTUxDb2xsZWN0aW9uXScgPT09IGVsZW1lbnRzVHlwZSlcbiAgICAgICAgICAgIHx8ICgnW29iamVjdCBPYmplY3RdJyA9PT0gZWxlbWVudHNUeXBlKVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5ICYmIGVsZW1lbnRzIGluc3RhbmNlb2YgalF1ZXJ5KSAvL2pxdWVyeVxuICAgICAgICAgICAgfHwgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgRWxlbWVudHMgJiYgZWxlbWVudHMgaW5zdGFuY2VvZiBFbGVtZW50cykgLy9tb290b29sc1xuICAgICAgICApO1xuICAgICAgICB2YXIgaSA9IDAsIGogPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb25UeXBlZCkge1xuICAgICAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbGVtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgZGltZW5zaW9uIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfEVsZW1lbnRzfGpRdWVyeX0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB2YXIgUmVzaXplU2Vuc29yID0gZnVuY3Rpb24oZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gRXZlbnRRdWV1ZSgpIHtcbiAgICAgICAgICAgIHZhciBxID0gW107XG4gICAgICAgICAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgcS5wdXNoKGV2KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgdGhpcy5jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgaiA9IHEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHFbaV0uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucmVtb3ZlID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3UXVldWUgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDAsIGogPSBxLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZihxW2ldICE9PSBldikgbmV3UXVldWUucHVzaChxW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcSA9IG5ld1F1ZXVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIHByb3BcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmN1cnJlbnRTdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICByZXNpemVkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNpemVFdmVudChlbGVtZW50LCByZXNpemVkKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuY2xhc3NOYW1lID0gJ3Jlc2l6ZS1zZW5zb3InO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDsgYm90dG9tOiAwOyBvdmVyZmxvdzogaGlkZGVuOyB6LWluZGV4OiAtMTsgdmlzaWJpbGl0eTogaGlkZGVuOyc7XG4gICAgICAgICAgICB2YXIgc3R5bGVDaGlsZCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgdHJhbnNpdGlvbjogMHM7JztcblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3Iuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3ItZXhwYW5kXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1zaHJpbmtcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICcgd2lkdGg6IDIwMCU7IGhlaWdodDogMjAwJVwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50LnJlc2l6ZVNlbnNvcik7XG5cbiAgICAgICAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICdwb3NpdGlvbicpID09ICdzdGF0aWMnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHBhbmQgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIGV4cGFuZENoaWxkID0gZXhwYW5kLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgc2hyaW5rID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1sxXTtcbiAgICAgICAgICAgIHZhciBkaXJ0eSwgcmFmSWQsIG5ld1dpZHRoLCBuZXdIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgbGFzdFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHZhciBsYXN0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLndpZHRoID0gJzEwMDAwMHB4JztcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS5oZWlnaHQgPSAnMTAwMDAwcHgnO1xuXG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbExlZnQgPSAxMDAwMDA7XG4gICAgICAgICAgICAgICAgZXhwYW5kLnNjcm9sbFRvcCA9IDEwMDAwMDtcblxuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxMZWZ0ID0gMTAwMDAwO1xuICAgICAgICAgICAgICAgIHNocmluay5zY3JvbGxUb3AgPSAxMDAwMDA7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgb25SZXNpemVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmFmSWQgPSAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFkaXJ0eSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgbGFzdFdpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgICAgICAgICAgbGFzdEhlaWdodCA9IG5ld0hlaWdodDtcblxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9uU2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbmV3V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIG5ld0hlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGRpcnR5ID0gbmV3V2lkdGggIT0gbGFzdFdpZHRoIHx8IG5ld0hlaWdodCAhPSBsYXN0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpcnR5ICYmICFyYWZJZCkge1xuICAgICAgICAgICAgICAgICAgICByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShvblJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgY2IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBhZGRFdmVudChleHBhbmQsICdzY3JvbGwnLCBvblNjcm9sbCk7XG4gICAgICAgICAgICBhZGRFdmVudChzaHJpbmssICdzY3JvbGwnLCBvblNjcm9sbCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JFYWNoRWxlbWVudChlbGVtZW50LCBmdW5jdGlvbihlbGVtKXtcbiAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW0sIGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXRhY2ggPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgUmVzaXplU2Vuc29yLmRldGFjaChlbGVtZW50LCBldik7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIFJlc2l6ZVNlbnNvci5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50LCBldikge1xuICAgICAgICBmb3JFYWNoRWxlbWVudChlbGVtZW50LCBmdW5jdGlvbihlbGVtKXtcbiAgICAgICAgICAgIGlmKGVsZW0ucmVzaXplZEF0dGFjaGVkICYmIHR5cGVvZiBldiA9PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgICAgIGVsZW0ucmVzaXplZEF0dGFjaGVkLnJlbW92ZShldik7XG4gICAgICAgICAgICAgICAgaWYoZWxlbS5yZXNpemVkQXR0YWNoZWQubGVuZ3RoKCkpIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbGVtLnJlc2l6ZVNlbnNvcikge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtLmNvbnRhaW5zKGVsZW0ucmVzaXplU2Vuc29yKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUNoaWxkKGVsZW0ucmVzaXplU2Vuc29yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVsZW0ucmVzaXplU2Vuc29yO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtLnJlc2l6ZWRBdHRhY2hlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBSZXNpemVTZW5zb3I7XG5cbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL3NyYy9SZXNpemVTZW5zb3IuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IHsgTWFzb24gfSBmcm9tICcuL21hc29uJztcbmV4cG9ydCB7IE1hc29uRG9tUmVuZGVyZXIgfSBmcm9tICcuL21hc29uLWRvbS1yZW5kZXJlcic7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSZXNpemVTZW5zb3I6IHJlcXVpcmUoJy4vc3JjL1Jlc2l6ZVNlbnNvcicpLFxuICAgIEVsZW1lbnRRdWVyaWVzOiByZXF1aXJlKCcuL3NyYy9FbGVtZW50UXVlcmllcycpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG1ja2Vvd3Igb24gMi8zLzE3LlxuICovXG52YXIgTWFzb25Eb21SZW5kZXJlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFzb25Eb21SZW5kZXJlcigpIHtcbiAgICB9XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuc2V0Q29sdW1ucyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNvbHVtbnM7XG4gICAgfTtcbiAgICBNYXNvbkRvbVJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50V2lkdGggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICB9O1xuICAgIE1hc29uRG9tUmVuZGVyZXIucHJvdG90eXBlLmdldEVsZW1lbnRIZWlnaHQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcbiAgICBNYXNvbkRvbVJlbmRlcmVyLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBsZWZ0SW5Db2xzLCB0b3BJblVuaXRzKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICgobGVmdEluQ29scyAvIHRoaXMuY29sdW1ucykgKiAxMDApICsgJyUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHRvcEluVW5pdHMgKyAncHgnO1xuICAgIH07XG4gICAgcmV0dXJuIE1hc29uRG9tUmVuZGVyZXI7XG59KCkpO1xuZXhwb3J0IHsgTWFzb25Eb21SZW5kZXJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFzb24tZG9tLXJlbmRlcmVyLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL21hc29uLWRvbS1yZW5kZXJlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgTWFzb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uKHJlbmRlcmVyLCBjb250YWluZXJXaWR0aCwgY29sdW1ucykge1xuICAgICAgICBpZiAoY29sdW1ucyA9PT0gdm9pZCAwKSB7IGNvbHVtbnMgPSAxMjsgfVxuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgdGhpcy5jb250YWluZXJXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICB0aGlzLmNvbHVtbkJvdHRvbXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMuY29sdW1uQm90dG9tcy5sZW5ndGggPCAxMikge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5Cb3R0b21zLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyZXIuc2V0Q29sdW1ucyhjb2x1bW5zKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgIH1cbiAgICBNYXNvbi5wcm90b3R5cGUuZmluZEJlc3RDb2x1bW4gPSBmdW5jdGlvbiAocmVxdWlyZWRDb2x1bW5zLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbG9vayBhdCBhbGwgdGhlIGNvbHVtbnMgYW5kIGZpbmQgdGhlIHdoaWNoIG9uZXNcbiAgICAgICAgLy8gdGhpcyB3b3VsZCBzaG91bGQgc3BhbiBiYXNlZCBvbiBwcmVzZW50aW5nIGl0IGFzIGNsb3NlIHRvIHRoZVxuICAgICAgICAvLyB0b3AgYXMgcG9zc2libGUuXG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmNvbHVtbkJvdHRvbXMucmVkdWNlKGZ1bmN0aW9uIChhY2N1bXVsYXRvciwgY29sdW1uLCBpZHgsIGFsbCkge1xuICAgICAgICAgICAgLy8gc3RhcnRpbmcgYXQgY29sdW1uIFgsIGlmIHdlIHB1dCBpdCBoZXJlLCB3aGF0IHdvdWxkIGJlXG4gICAgICAgICAgICAvLyBpdHMgc3RhcnRpbmcgcG9pbnRcbiAgICAgICAgICAgIGlmIChpZHggKyByZXF1aXJlZENvbHVtbnMgPiBfdGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCgtMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBoZWlnaHQgYXQgd2hpY2ggaXQgd291bGQgaGF2ZSB0byBiZSBwb3NpdGlvbmVkXG4gICAgICAgICAgICAgICAgLy8gaW4gb3JkZXIgdG8gbm90IG92ZXJsYXAgc29tZXRoaW5nXG4gICAgICAgICAgICAgICAgdmFyIHlQb3MgPSAtMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gaWR4OyBpIDwgcmVxdWlyZWRDb2x1bW5zICsgaWR4OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgeVBvcyA9IE1hdGgubWF4KHlQb3MsIGFsbFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goeVBvcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBbXSk7XG4gICAgICAgIC8vIG5vdyB0aGUgd2UgaGF2ZSB0aGUgeSBjb29yZCB0aGF0IGl0IHdvdWxkIG5lZWQgdG8gYmUgYXQgZm9yIGVhY2ggc3RhcnRpbmcgY29sdW1uXG4gICAgICAgIC8vIHdlIGp1c3QgbmVlZCB0byBmaWd1cmUgb3V0IHdoaWNoIG9uZSBpcyBsb3dlc3QgYW5kIHdlJ3JlIGRvbmVcbiAgICAgICAgdmFyIGJlc3RGaXQgPSByZXN1bHQucmVkdWNlKGZ1bmN0aW9uIChiZXN0LCBjdXJyLCBpZHgpIHtcbiAgICAgICAgICAgIGlmICghYmVzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHhDb2x1bW5zOiBpZHgsIHlVbml0czogY3VyciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnIgPCBiZXN0LnlVbml0cyAmJiBjdXJyICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB4Q29sdW1uczogaWR4LCB5VW5pdHM6IGN1cnIgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgIGJlc3RGaXQuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHJldHVybiBiZXN0Rml0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGVsZW1lbnRzIGFuZCByZXR1cm5zIHRoZSBuZXcgY29vcmRzIGZvciBlYWNoIG9uZS4gVGhpcyBkb2VzIG5vdCByZXBvc2l0aW9uIGFueXRoaW5nLlxuICAgICAqIFlvdSBtaWdodCB1c2UgdGhpcyBpZiB5b3Ugd2FudCB0byBoYW5kbGUgaG93IGFuZCB3aGVuIHRoaW5ncyBnZXQgcmVwb3NpdGlvbmVkLlxuICAgICAqXG4gICAgICogU2VlIGxheW91dCgpIGlmIHlvdSB3YW50IGV2ZXJ5dGhpbmcgcG9zaXRpb24gYXV0b21hdGljYWxseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50c1xuICAgICAqIEByZXR1cm5zIHtNYXNvbkNvb3JkW119XG4gICAgICovXG4gICAgTWFzb24ucHJvdG90eXBlLmZpdCA9IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY29vcmRzTGlzdCA9IFtdO1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpZHgpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50V2lkdGggPSBfdGhpcy5yZW5kZXJlci5nZXRFbGVtZW50V2lkdGgoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudEhlaWdodCA9IF90aGlzLnJlbmRlcmVyLmdldEVsZW1lbnRIZWlnaHQoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgY29scyA9IE1hdGgucm91bmQoKGVsZW1lbnRXaWR0aCAvIF90aGlzLmNvbnRhaW5lcldpZHRoKSAqIF90aGlzLmNvbHVtbnMpO1xuICAgICAgICAgICAgLy8gY2FuJ3QgYmUgYmlnZ2VyIHRoYW4gJ2FsbCcgY29sdW1uc1xuICAgICAgICAgICAgaWYgKGNvbHMgPiBfdGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgY29scyA9IF90aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmVzdEZpdCA9IF90aGlzLmZpbmRCZXN0Q29sdW1uKGNvbHMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjb2x1bW4gYm90dG9tcyBmb3IgYWxsIHRoZSBjb2x1bW5zIHRoaXMgdGlsZSBjcm9zc2VzIHdoZW4gcG9zaXRpb25lZCBhdCB0aGUgYmVzdFxuICAgICAgICAgICAgLy8gbG9jYXRpb25cbiAgICAgICAgICAgIHZhciBzdGFydENvbCA9IGJlc3RGaXQueENvbHVtbnM7XG4gICAgICAgICAgICB2YXIgZW5kQ29sID0gc3RhcnRDb2wgKyBjb2xzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0Q29sOyBpIDwgZW5kQ29sOyBpKyspIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jb2x1bW5Cb3R0b21zW2ldID0gYmVzdEZpdC55VW5pdHMgKyBlbGVtZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBhIHR1cGxlIHdoZXJlIHggaXMgdGhlIGNvbHVtbiBpbmRleCBhbmQgeVBvcyBpcyB0aGUgcGl4ZWwgY29vcmQgdG8gcG9zaXRpb24gYXQuXG4gICAgICAgICAgICBjb29yZHNMaXN0LnB1c2goYmVzdEZpdCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgY29vcmRpbmF0ZXMgZm9yIGVhY2ggdGlsZVxuICAgICAgICByZXR1cm4gY29vcmRzTGlzdDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoaXMgd2lsbCB0YWtlIHRoZSBsaXN0IG9mIGVsZW1lbnRzLCBmaW5kIHRoZWlyIG5ldyBsb2NhdGlvbnMgYW5kIHRoZW4gdXNlIHRoZSBNYXNvblJlbmRlcmVyXG4gICAgICogdG8gcmVwb3NpdGlvbiBhbGwgdGhlIGJyaWNrcyBpbnRvIHRoZWlyIG5ldyBob21lLlxuICAgICAqIEBwYXJhbSBlbGVtZW50c1xuICAgICAqL1xuICAgIE1hc29uLnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5maXQoZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgICAgICAvLyBhcHBseSB0aGUgY2FsY3VsYXRlZCBwb3NpdGlvbiBmb3IgZWFjaCBicmljayBob3dldmVyIHlvdSB3YW50LiBJbiB0aGlzIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIGFyZSBqdXN0IHNldHRpbmcgdGhlIENTUyBwb3NpdGlvbi4gQW5pbWF0aW9uIHdpbGwgYmUgcHJvdmlkZWQgdmlhIENTU1xuICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIuc2V0UG9zaXRpb24oY29vcmQuZWxlbWVudCwgY29vcmQueENvbHVtbnMsIGNvb3JkLnlVbml0cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE1hc29uO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uIH07XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNvbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9tYXNvbi5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWycuL1Jlc2l6ZVNlbnNvci5qcyddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCcuL1Jlc2l6ZVNlbnNvci5qcycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkVsZW1lbnRRdWVyaWVzID0gZmFjdG9yeShyb290LlJlc2l6ZVNlbnNvcik7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoUmVzaXplU2Vuc29yKSB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB2YXIgRWxlbWVudFF1ZXJpZXMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdHJhY2tpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRFbVNpemUoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmZvbnRTaXplO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZm9udFNpemUpIHx8IDE2O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL01yMGdyb2cvZWxlbWVudC1xdWVyeS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbnZlcnRUb1B4KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVycyA9IHZhbHVlLnNwbGl0KC9cXGQvKTtcbiAgICAgICAgICAgIHZhciB1bml0cyA9IG51bWJlcnNbbnVtYmVycy5sZW5ndGgtMV07XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVtXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGdldEVtU2l6ZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBjYXNlIFwicmVtXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGdldEVtU2l6ZSgpO1xuICAgICAgICAgICAgICAgIC8vIFZpZXdwb3J0IHVuaXRzIVxuICAgICAgICAgICAgICAgIC8vIEFjY29yZGluZyB0byBodHRwOi8vcXVpcmtzbW9kZS5vcmcvbW9iaWxlL3RhYmxlVmlld3BvcnQuaHRtbFxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aC9IZWlnaHQgZ2V0cyB1cyB0aGUgbW9zdCByZWxpYWJsZSBpbmZvXG4gICAgICAgICAgICAgICAgY2FzZSBcInZ3XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDEwMDtcbiAgICAgICAgICAgICAgICBjYXNlIFwidmhcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDEwMDtcbiAgICAgICAgICAgICAgICBjYXNlIFwidm1pblwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ2bWF4XCI6XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNob29zZXIgPSBNYXRoW3VuaXRzID09PSBcInZtaW5cIiA/IFwibWluXCIgOiBcIm1heFwiXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogY2hvb3Nlcih2dywgdmgpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBmb3Igbm93LCBub3Qgc3VwcG9ydGluZyBwaHlzaWNhbCB1bml0cyAoc2luY2UgdGhleSBhcmUganVzdCBhIHNldCBudW1iZXIgb2YgcHgpXG4gICAgICAgICAgICAgICAgLy8gb3IgZXgvY2ggKGdldHRpbmcgYWNjdXJhdGUgbWVhc3VyZW1lbnRzIGlzIGhhcmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIFNldHVwSW5mb3JtYXRpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgdmFyIGtleSwgb3B0aW9uLCB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIHZhbHVlLCBhY3R1YWxWYWx1ZSwgYXR0clZhbHVlcywgYXR0clZhbHVlLCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIHttb2RlOiAnbWlufG1heCcsIHByb3BlcnR5OiAnd2lkdGh8aGVpZ2h0JywgdmFsdWU6ICcxMjNweCd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IFtvcHRpb24ubW9kZSwgb3B0aW9uLnByb3BlcnR5LCBvcHRpb24udmFsdWVdLmpvaW4oJywnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbaWR4XSA9IG9wdGlvbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gWydtaW4td2lkdGgnLCAnbWluLWhlaWdodCcsICdtYXgtd2lkdGgnLCAnbWF4LWhlaWdodCddO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dHJhY3RzIHRoZSBjb21wdXRlZCB3aWR0aC9oZWlnaHQgYW5kIHNldHMgdG8gbWluL21heC0gYXR0cmlidXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBleHRyYWN0IGN1cnJlbnQgZGltZW5zaW9uc1xuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBhdHRyVmFsdWVzID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSB0aGlzLm9wdGlvbnNba2V5XTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnZlcnRUb1B4KHRoaXMuZWxlbWVudCwgb3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhY3R1YWxWYWx1ZSA9IG9wdGlvbi5wcm9wZXJ0eSA9PSAnd2lkdGgnID8gd2lkdGggOiBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gb3B0aW9uLm1vZGUgKyAnLScgKyBvcHRpb24ucHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubW9kZSA9PSAnbWluJyAmJiBhY3R1YWxWYWx1ZSA+PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlICs9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubW9kZSA9PSAnbWF4JyAmJiBhY3R1YWxWYWx1ZSA8PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlICs9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXR0clZhbHVlc1thdHRyTmFtZV0pIGF0dHJWYWx1ZXNbYXR0ck5hbWVdID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWUgJiYgLTEgPT09ICgnICcrYXR0clZhbHVlc1thdHRyTmFtZV0rJyAnKS5pbmRleE9mKCcgJyArIGF0dHJWYWx1ZSArICcgJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZXNbYXR0ck5hbWVdICs9ICcgJyArIGF0dHJWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZighYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSwgYXR0clZhbHVlc1thdHRyaWJ1dGVzW2tdXS5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgICBvcHRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uYWRkT3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbiA9IG5ldyBTZXR1cEluZm9ybWF0aW9uKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcihlbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdBY3RpdmUgJiYgZWxlbWVudHMuaW5kZXhPZihlbGVtZW50KSA8IDApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBtaW58bWF4XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSB3aWR0aHxoZWlnaHRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgYWxsUXVlcmllcyA9IHt9O1xuICAgICAgICBmdW5jdGlvbiBxdWV1ZVF1ZXJ5KHNlbGVjdG9yLCBtb2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoYWxsUXVlcmllc1ttb2RlXSkgPT0gJ3VuZGVmaW5lZCcpIGFsbFF1ZXJpZXNbbW9kZV0gPSB7fTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0pID09ICd1bmRlZmluZWQnKSBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XSA9IHt9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZihhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0pID09ICd1bmRlZmluZWQnKSBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0gPSBzZWxlY3RvcjtcbiAgICAgICAgICAgIGVsc2UgYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV1bdmFsdWVdICs9ICcsJytzZWxlY3RvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFF1ZXJ5KCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5O1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwpIHF1ZXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbC5iaW5kKGRvY3VtZW50KTtcbiAgICAgICAgICAgIGlmICghcXVlcnkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiAkJCkgcXVlcnkgPSAkJDtcbiAgICAgICAgICAgIGlmICghcXVlcnkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkpIHF1ZXJ5ID0galF1ZXJ5O1xuXG4gICAgICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ05vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwsIGpRdWVyeSBvciBNb290b29sc1xcJ3MgJCQgZm91bmQuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0YXJ0IHRoZSBtYWdpYy4gR28gdGhyb3VnaCBhbGwgY29sbGVjdGVkIHJ1bGVzIChyZWFkUnVsZXMoKSkgYW5kIGF0dGFjaCB0aGUgcmVzaXplLWxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmluZEVsZW1lbnRRdWVyaWVzRWxlbWVudHMoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBnZXRRdWVyeSgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBtb2RlIGluIGFsbFF1ZXJpZXMpIGlmIChhbGxRdWVyaWVzLmhhc093blByb3BlcnR5KG1vZGUpKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhbGxRdWVyaWVzW21vZGVdKSBpZiAoYWxsUXVlcmllc1ttb2RlXS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFsdWUgaW4gYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0pIGlmIChhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHF1ZXJ5KGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldW3ZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHVwRWxlbWVudChlbGVtZW50c1tpXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzcG9uc2l2ZUltYWdlKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgdmFyIHJ1bGVzID0gW107XG4gICAgICAgICAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRJbWFnZUlkID0gMDtcbiAgICAgICAgICAgIHZhciBsYXN0QWN0aXZlSW1hZ2UgPSAtMTtcbiAgICAgICAgICAgIHZhciBsb2FkZWRJbWFnZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBlbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYoIWVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5baV0udGFnTmFtZSAmJiBlbGVtZW50LmNoaWxkcmVuW2ldLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChlbGVtZW50LmNoaWxkcmVuW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWluV2lkdGggPSBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnbWluLXdpZHRoJykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWluLXdpZHRoJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIG1pbkhlaWdodCA9IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdtaW4taGVpZ2h0JykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWluLWhlaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3JjID0gZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ3VybCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaChzcmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IG1pbldpZHRoXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcnVsZXMucHVzaChydWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0SW1hZ2VJZCA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbltpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0QWN0aXZlSW1hZ2UgPSBkZWZhdWx0SW1hZ2VJZDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlVG9EaXNwbGF5ID0gZmFsc2UsIGk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgICAgICBpZighY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlc1tpXS5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBydWxlc1tpXS5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlVG9EaXNwbGF5ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2VUb0Rpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9ubyBydWxlIG1hdGNoZWQsIHNob3cgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICBpbWFnZVRvRGlzcGxheSA9IGRlZmF1bHRJbWFnZUlkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsYXN0QWN0aXZlSW1hZ2UgIT0gaW1hZ2VUb0Rpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9pbWFnZSBjaGFuZ2VcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvYWRlZEltYWdlc1tpbWFnZVRvRGlzcGxheV0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbWFnZSBoYXMgbm90IGJlZW4gbG9hZGVkIHlldCwgd2UgbmVlZCB0byBsb2FkIHRoZSBpbWFnZSBmaXJzdCBpbiBtZW1vcnkgdG8gcHJldmVudCBmbGFzaCBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ubyBjb250ZW50XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baW1hZ2VUb0Rpc3BsYXldLnNyYyA9IHNvdXJjZXNbaW1hZ2VUb0Rpc3BsYXldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bbGFzdEFjdGl2ZUltYWdlXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZEltYWdlc1tpbWFnZVRvRGlzcGxheV0gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEFjdGl2ZUltYWdlID0gaW1hZ2VUb0Rpc3BsYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBzb3VyY2VzW2ltYWdlVG9EaXNwbGF5XTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2xhc3RBY3RpdmVJbWFnZV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RBY3RpdmVJbWFnZSA9IGltYWdlVG9EaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9tYWtlIHN1cmUgZm9yIGluaXRpYWwgY2hlY2sgY2FsbCB0aGUgLnNyYyBpcyBzZXQgY29ycmVjdGx5XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zcmMgPSBzb3VyY2VzW2ltYWdlVG9EaXNwbGF5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcihlbGVtZW50LCBjaGVjayk7XG4gICAgICAgICAgICBjaGVjaygpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZFJlc3BvbnNpdmVJbWFnZXMoKXtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGdldFF1ZXJ5KCk7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHF1ZXJ5KCdbZGF0YS1yZXNwb25zaXZlLWltYWdlXSxbcmVzcG9uc2l2ZS1pbWFnZV0nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzcG9uc2l2ZUltYWdlKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWdleCA9IC8sP1tcXHNcXHRdKihbXixcXG5dKj8pKCg/OlxcW1tcXHNcXHRdKj8oPzptaW58bWF4KS0oPzp3aWR0aHxoZWlnaHQpW1xcc1xcdF0qP1t+JFxcXl0/PVtcXHNcXHRdKj9cIlteXCJdKj9cIltcXHNcXHRdKj9dKSspKFteLFxcblxcc1xce10qKS9tZ2k7XG4gICAgICAgIHZhciBhdHRyUmVnZXggPSAvXFxbW1xcc1xcdF0qPyhtaW58bWF4KS0od2lkdGh8aGVpZ2h0KVtcXHNcXHRdKj9bfiRcXF5dPz1bXFxzXFx0XSo/XCIoW15cIl0qPylcIltcXHNcXHRdKj9dL21naTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RRdWVyeShjc3MpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgICAgIHZhciBzbWF0Y2g7XG4gICAgICAgICAgICBjc3MgPSBjc3MucmVwbGFjZSgvJy9nLCAnXCInKTtcbiAgICAgICAgICAgIHdoaWxlIChudWxsICE9PSAobWF0Y2ggPSByZWdleC5leGVjKGNzcykpKSB7XG4gICAgICAgICAgICAgICAgc21hdGNoID0gbWF0Y2hbMV0gKyBtYXRjaFszXTtcbiAgICAgICAgICAgICAgICBhdHRycyA9IG1hdGNoWzJdO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKG51bGwgIT09IChhdHRyTWF0Y2ggPSBhdHRyUmVnZXguZXhlYyhhdHRycykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlUXVlcnkoc21hdGNoLCBhdHRyTWF0Y2hbMV0sIGF0dHJNYXRjaFsyXSwgYXR0ck1hdGNoWzNdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtDc3NSdWxlW118U3RyaW5nfSBydWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVhZFJ1bGVzKHJ1bGVzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSAnJztcbiAgICAgICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBydWxlcykge1xuICAgICAgICAgICAgICAgIHJ1bGVzID0gcnVsZXMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHJ1bGVzLmluZGV4T2YoJ21pbi13aWR0aCcpIHx8IC0xICE9PSBydWxlcy5pbmRleE9mKCdtYXgtd2lkdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkocnVsZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBydWxlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gcnVsZXNbaV0uc2VsZWN0b3JUZXh0IHx8IHJ1bGVzW2ldLmNzc1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21pbi1oZWlnaHQnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LWhlaWdodCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKDQgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhydWxlc1tpXS5jc3NSdWxlcyB8fCBydWxlc1tpXS5ydWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdENzc0luamVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlYXJjaGVzIGFsbCBjc3MgcnVsZXMgYW5kIHNldHVwcyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gYWxsIGVsZW1lbnRzIHdpdGggZWxlbWVudCBxdWVyeSBydWxlcy4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdHJhY2tpbmdBY3RpdmUgPSB0eXBlb2Ygd2l0aFRyYWNraW5nID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogd2l0aFRyYWNraW5nO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NSdWxlcyB8fCBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5ydWxlcyB8fCBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NUZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gJ1NlY3VyaXR5RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRlZmF1bHRDc3NJbmplY3RlZCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJ1tyZXNwb25zaXZlLWltYWdlXSA+IGltZywgW2RhdGEtcmVzcG9uc2l2ZS1pbWFnZV0ge292ZXJmbG93OiBoaWRkZW47IHBhZGRpbmc6IDA7IH0gW3Jlc3BvbnNpdmUtaW1hZ2VdID4gaW1nLCBbZGF0YS1yZXNwb25zaXZlLWltYWdlXSA+IGltZyB7IHdpZHRoOiAxMDAlO30nO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRDc3NJbmplY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbmRFbGVtZW50UXVlcmllc0VsZW1lbnRzKCk7XG4gICAgICAgICAgICBmaW5kUmVzcG9uc2l2ZUltYWdlcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy5pbml0KHdpdGhUcmFja2luZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXRhY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy53aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnd2l0aFRyYWNraW5nIGlzIG5vdCBlbmFibGVkLiBXZSBjYW4gbm90IGRldGFjaCBlbGVtZW50cyBzaW5jZSB3ZSBkb24gbm90IHN0b3JlIGl0LicgK1xuICAgICAgICAgICAgICAgICdVc2UgRWxlbWVudFF1ZXJpZXMud2l0aFRyYWNraW5nID0gdHJ1ZTsgYmVmb3JlIGRvbXJlYWR5IG9yIGNhbGwgRWxlbWVudFF1ZXJ5ZXMudXBkYXRlKHRydWUpLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50cy5wb3AoKSkge1xuICAgICAgICAgICAgICAgIEVsZW1lbnRRdWVyaWVzLmRldGFjaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgKi9cbiAgICBFbGVtZW50UXVlcmllcy51cGRhdGUgPSBmdW5jdGlvbih3aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UudXBkYXRlKHdpdGhUcmFja2luZyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHNlbnNvciBhbmQgZWxlbWVudHF1ZXJ5IGluZm9ybWF0aW9uIGZyb20gdGhlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgRWxlbWVudFF1ZXJpZXMuZGV0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24pIHtcbiAgICAgICAgICAgIC8vZWxlbWVudCBxdWVyaWVzXG4gICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yLmRldGFjaCgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZW5zb3I7XG5cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZVNlbnNvcikge1xuICAgICAgICAgICAgLy9yZXNwb25zaXZlIGltYWdlXG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmRldGFjaCgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplU2Vuc29yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZGV0YWNoZWQgYWxyZWFkeScsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgRWxlbWVudFF1ZXJpZXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIUVsZW1lbnRRdWVyaWVzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZSA9IG5ldyBFbGVtZW50UXVlcmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UuaW5pdChFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICB2YXIgZG9tTG9hZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIC8qIEludGVybmV0IEV4cGxvcmVyICovXG4gICAgICAgIC8qQGNjX29uXG4gICAgICAgICBAaWYgKEBfd2luMzIgfHwgQF93aW42NClcbiAgICAgICAgIGRvY3VtZW50LndyaXRlKCc8c2NyaXB0IGlkPVwiaWVTY3JpcHRMb2FkXCIgZGVmZXIgc3JjPVwiLy86XCI+PFxcL3NjcmlwdD4nKTtcbiAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZVNjcmlwdExvYWQnKS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgIH1cbiAgICAgICAgIH07XG4gICAgICAgICBAZW5kIEAqL1xuICAgICAgICAvKiBNb3ppbGxhLCBDaHJvbWUsIE9wZXJhICovXG4gICAgICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBTYWZhcmksIGlDYWIsIEtvbnF1ZXJvciAqL1xuICAgICAgICBlbHNlIGlmICgvS0hUTUx8V2ViS2l0fGlDYWIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICB2YXIgRE9NTG9hZFRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgvbG9hZGVkfGNvbXBsZXRlL2kudGVzdChkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKERPTUxvYWRUaW1lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIC8qIE90aGVyIHdlYiBicm93c2VycyAqL1xuICAgICAgICBlbHNlIHdpbmRvdy5vbmxvYWQgPSBjYWxsYmFjaztcbiAgICB9O1xuXG4gICAgRWxlbWVudFF1ZXJpZXMubGlzdGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvbUxvYWRlZChFbGVtZW50UXVlcmllcy5pbml0KTtcbiAgICB9O1xuXG4gICAgLy8gbWFrZSBhdmFpbGFibGUgdG8gY29tbW9uIG1vZHVsZSBsb2FkZXJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRRdWVyaWVzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2luZG93LkVsZW1lbnRRdWVyaWVzID0gRWxlbWVudFF1ZXJpZXM7XG4gICAgICAgIEVsZW1lbnRRdWVyaWVzLmxpc3RlbigpO1xuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50UXVlcmllcztcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL0VsZW1lbnRRdWVyaWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlZCBieSBtY2tlb3dyIG9uIDIvMi8xNy5cbiAqL1xuaW1wb3J0IHtNYXNvbiwgTWFzb25Eb21SZW5kZXJlcn0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7UmVzaXplU2Vuc29yfSBmcm9tICdjc3MtZWxlbWVudC1xdWVyaWVzJztcblxuZnVuY3Rpb24gcGFjaygpIHtcblxuICAgICAgICAvLyBmaW5kIG91ciBjb250YWluZXJcbiAgICAgICAgdmFyIGRhc2hib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXNvbi1jb250YWluZXInKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gZGFzaGJvYXJkLm9mZnNldFdpZHRoO1xuICAgICAgICAvLyBmaW5kIGFsbCB0aGUgYnJpY2tzIGluIGl0XG4gICAgICAgIC8vIG5vdCBhbGwgYnJvd3NlcnMgYXJlIGFibGUgdG8gdHJlYXQgdGhlIHJlc3VsdHMgZnJvbSBxdWVyeVNlbGVjdG9yQWxsIHdpdGggYXJyYXkgbWV0aG9kcyBsaWtlIGZvckVhY2goKVxuICAgICAgICAvLyBzbyB0aGlzIHdpbGwgbWFrZSB0aGVuIGFuIGFycmF5XG4gICAgICAgIHZhciBpdGVtcyA9IFtdLnNsaWNlLmNhbGwoZGFzaGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5tYXNvbi1icmljaycpKTtcblxuICAgICAgICAvLyBjcmVhdGUgYSBNYXNvbiBhbmQgdXNlIGl0IHRvIGZpdCB0aGUgYnJpY2tzIGludG8gYSBjb250YWluZXJcbiAgICAgICAgLy8gdGhlIHNpemUgb2YgdGhlICdkYXNoYm9hcmQnXG4gICAgICAgIC8vIHNpbmNlIHdlIGFyZSBkZWFsaW5nIHdpdGggZG9tIG5vZGVzLCB3ZSBuZWVkIHRoZSBNYXNvbkRvbVJlbmRlcmVyXG4gICAgICAgIHZhciByZW5kZXJlciA9IG5ldyBNYXNvbkRvbVJlbmRlcmVyKCk7XG4gICAgICAgIG5ldyBNYXNvbihyZW5kZXJlciwgY29udGFpbmVyV2lkdGgpLmxheW91dChpdGVtcyk7XG5cbn1cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgbGF5b3V0XG4gICAgcGFjaygpO1xuXG4gICAgLy8gaW4gb3VyIGNhc2UsIHdlIHdhbnQgdG8gcmUgbGF5b3V0IHRoZSBicmlja3Mgd2hlbiBhbnkgb2YgdGhlaXIgc2l6ZXMgY2hhbmdlLlxuICAgIC8vIGlmIHRoZSBicmlja3Mgc2l6ZXMgY2FuIG9ubHkgY2hhbmdlIHdoZW4gdGhlIHdpbmRvdyBpcyByZXNpemVkLCB5b3UgY291bGQgdXNlIHRoZVxuICAgIC8vIHdpbmRvdyByZXNpemUgZXZlbnQuIEhvd2V2ZXIsIGlmIHRoZSBicmlja3MgY2FuIHJlc2l6ZSB0aGVtc2VsdmVzLCB5b3Ugd291bGQgd2FudCB0byBkbyBzb21ldGhpbmdcbiAgICAvLyBsaWtlIHRoaXNcbiAgICBuZXcgUmVzaXplU2Vuc29yKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXNvbi1jb250YWluZXInKS5xdWVyeVNlbGVjdG9yQWxsKCdkaXYubWFzb24tYnJpY2snKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhY2soKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlRXhhbXBsZScpLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgc2hvd01vcmUoKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzZXRIZWlnaHQoKSB7XG4gICAgdmFyIGZpcnN0VGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlRXhhbXBsZScpO1xuICAgIGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgZmlyc3RUaWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCByZXNldEhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHNob3dNb3JlKCkge1xuICAgIHZhciBmaXJzdFRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZUV4YW1wbGUnKTtcblxuICAgIGlmIChmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ICE9PSAnNDAwcHgnKSB7XG4gICAgICAgIHZhciBhdXRvSGVpZ2h0ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZmlyc3RUaWxlLCBudWxsKS5oZWlnaHQ7XG4gICAgICAgIGZpcnN0VGlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1oZWlnaHQnLCBhdXRvSGVpZ2h0KTtcbiAgICAgICAgZmlyc3RUaWxlLnN0eWxlLmhlaWdodCA9IGF1dG9IZWlnaHQ7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gJzQwMHB4JztcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IGZpcnN0VGlsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXV0by1oZWlnaHQnKTtcbiAgICAgICAgZmlyc3RUaWxlLnN0eWxlLmhlaWdodCA9IHRhcmdldEhlaWdodDtcbiAgICAgICAgZmlyc3RUaWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCByZXNldEhlaWdodCk7XG4gICAgfVxufVxuXG5zdGFydCgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZGVtby9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
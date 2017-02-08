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
/* unused harmony reexport MasonOptions */
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
/* unused harmony export MasonOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Mason; });
var MasonOptions = (function () {
    function MasonOptions() {
        this.columns = 12;
        this.threshold = 0;
    }
    return MasonOptions;
}());

var Mason = (function () {
    function Mason(rendererOrOptions, containerWidth, columns, threshold) {
        if (columns === void 0) { columns = 12; }
        if (threshold === void 0) { threshold = 0; }
        this.columns = 12;
        // This is the wiggle room Mason has when choosing a column for a brick
        // When starting on the left, Mason will only consider a column choose as a better fit
        // if it is better by this amount or more. This prevents bricks from being placed to the
        this.threshold = 40;
        this.columnBottoms = [];
        if (rendererOrOptions['renderer']) {
            var opts = rendererOrOptions;
            this.renderer = opts.renderer;
            this.containerWidth = opts.containerWidth;
            this.columns = opts.columns;
            this.threshold = opts.threshold;
        }
        else {
            this.renderer = rendererOrOptions;
            this.containerWidth = containerWidth;
            this.columns = columns;
            this.threshold = threshold;
        }
        while (this.columnBottoms.length < this.columns) {
            this.columnBottoms.push(0);
        }
        this.renderer.setColumns(columns);
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
        // we just need to figure out which one is lowest (while taking into account the threshold)
        // and we're done
        var bestFit = result.reduce(function (best, curr, idx) {
            if (!best) {
                return { xColumns: idx, yUnits: curr };
            }
            else {
                if (curr < (best.yUnits - _this.threshold) && curr !== -1) {
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
     * @returns {coords: MasonCoord[], totalHeight: number}
     */
    Mason.prototype.fit = function (elements) {
        var _this = this;
        var coordsList = [];
        var totalHeight = 0;
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
            // update the total height
            totalHeight = Math.max(totalHeight, elementHeight + bestFit.yUnits);
        });
        // return the list of coordinates for each tile
        return { coords: coordsList, totalHeight: totalHeight };
    };
    /**
     * This will take the list of elements, find their new locations and then use the MasonRenderer
     * to reposition all the bricks into their new home.
     * @param elements
     * @returns the height that the container must now be to hold the items.
     */
    Mason.prototype.layout = function (elements) {
        var _this = this;
        var layoutResult = this.fit(elements);
        layoutResult.coords.forEach(function (coord) {
            // apply the calculated position for each brick however you want. In this case
            // we are just setting the CSS position. Animation will be provided via CSS
            _this.renderer.setPosition(coord.element, coord.xColumns, coord.yUnits);
        });
        return layoutResult.totalHeight;
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

        var opts = { // MasonOptions object here
            containerWidth: containerWidth,
            renderer: renderer,
            // this threshold signifies that even if a column to the right
            // would postion the tile closer to the top, it will prefer
            // a column to the left if the difference is less than this
            // many pixels. Make this 0 and check the demo and you will
            // see the difference in position of bricks 5 and 6 after the
            // show more button is clicked in brick 1
            threshold: 40,
            columns: 12
        };

        var containerHeight = new __WEBPACK_IMPORTED_MODULE_0__lib__["b" /* Mason */](opts).layout(items);
        dashboard.style.minHeight = containerHeight + 'px';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGY4MzkyYjBiZWRkYzZjYjY5MjQiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL3NyYy9SZXNpemVTZW5zb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY3NzLWVsZW1lbnQtcXVlcmllcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFzb24tZG9tLXJlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL2xpYi9tYXNvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL0VsZW1lbnRRdWVyaWVzLmpzIiwid2VicGFjazovLy8uL2RlbW8vbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7QUNsZ0JEO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDZ0M7QUFDWDs7QUFFckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUSIsImZpbGUiOiIuL2RlbW8vYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNGY4MzkyYjBiZWRkYzZjYjY5MjQiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlJlc2l6ZVNlbnNvciA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICAgIC8vTWFrZSBzdXJlIGl0IGRvZXMgbm90IHRocm93IGluIGEgU1NSIChTZXJ2ZXIgU2lkZSBSZW5kZXJpbmcpIHNpdHVhdGlvblxuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBPbmx5IHVzZWQgZm9yIHRoZSBkaXJ0eSBjaGVja2luZywgc28gdGhlIGV2ZW50IGNhbGxiYWNrIGNvdW50IGlzIGxpbXRlZCB0byBtYXggMSBjYWxsIHBlciBmcHMgcGVyIHNlbnNvci5cbiAgICAvLyBJbiBjb21iaW5hdGlvbiB3aXRoIHRoZSBldmVudCBiYXNlZCByZXNpemUgc2Vuc29yIHRoaXMgc2F2ZXMgY3B1IHRpbWUsIGJlY2F1c2UgdGhlIHNlbnNvciBpcyB0b28gZmFzdCBhbmRcbiAgICAvLyB3b3VsZCBnZW5lcmF0ZSB0b28gbWFueSB1bm5lY2Vzc2FyeSBldmVudHMuXG4gICAgdmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZuLCAyMCk7XG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlIG92ZXIgZWFjaCBvZiB0aGUgcHJvdmlkZWQgZWxlbWVudChzKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTEVsZW1lbnRbXX0gZWxlbWVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yRWFjaEVsZW1lbnQoZWxlbWVudHMsIGNhbGxiYWNrKXtcbiAgICAgICAgdmFyIGVsZW1lbnRzVHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50cyk7XG4gICAgICAgIHZhciBpc0NvbGxlY3Rpb25UeXBlZCA9ICgnW29iamVjdCBBcnJheV0nID09PSBlbGVtZW50c1R5cGVcbiAgICAgICAgICAgIHx8ICgnW29iamVjdCBOb2RlTGlzdF0nID09PSBlbGVtZW50c1R5cGUpXG4gICAgICAgICAgICB8fCAoJ1tvYmplY3QgSFRNTENvbGxlY3Rpb25dJyA9PT0gZWxlbWVudHNUeXBlKVxuICAgICAgICAgICAgfHwgKCdbb2JqZWN0IE9iamVjdF0nID09PSBlbGVtZW50c1R5cGUpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudHMgaW5zdGFuY2VvZiBqUXVlcnkpIC8vanF1ZXJ5XG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBFbGVtZW50cyAmJiBlbGVtZW50cyBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICk7XG4gICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKGlzQ29sbGVjdGlvblR5cGVkKSB7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHZhciBSZXNpemVTZW5zb3IgPSBmdW5jdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBFdmVudFF1ZXVlKCkge1xuICAgICAgICAgICAgdmFyIHEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICBxLnB1c2goZXYpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gcS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5yZW1vdmUgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHZhciBuZXdRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcihpID0gMCwgaiA9IHEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHFbaV0gIT09IGV2KSBuZXdRdWV1ZS5wdXNoKHFbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBxID0gbmV3UXVldWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgIHJlc2l6ZWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIHJlc2l6ZWQpIHtcbiAgICAgICAgICAgIGlmICghZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCA9IG5ldyBFdmVudFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAncmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBoaWRkZW47IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyB0cmFuc2l0aW9uOiAwczsnO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLXNocmlua1wiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcblxuICAgICAgICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT0gJ3N0YXRpYycpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cGFuZCA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgZXhwYW5kQ2hpbGQgPSBleHBhbmQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmsgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzFdO1xuICAgICAgICAgICAgdmFyIGRpcnR5LCByYWZJZCwgbmV3V2lkdGgsIG5ld0hlaWdodDtcbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIGxhc3RIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwYW5kQ2hpbGQuc3R5bGUud2lkdGggPSAnMTAwMDAwcHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9ICcxMDAwMDBweCc7XG5cbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsTGVmdCA9IDEwMDAwMDtcbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsVG9wID0gMTAwMDAwO1xuXG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSAxMDAwMDA7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IDEwMDAwMDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlc2V0KCk7XG5cbiAgICAgICAgICAgIHZhciBvblJlc2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByYWZJZCA9IDA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWRpcnR5KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBsYXN0V2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gbmV3SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb25TY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXdXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbmV3SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgZGlydHkgPSBuZXdXaWR0aCAhPSBsYXN0V2lkdGggfHwgbmV3SGVpZ2h0ICE9IGxhc3RIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlydHkgJiYgIXJhZklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uUmVzaXplZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGFkZEV2ZW50KGV4cGFuZCwgJ3Njcm9sbCcsIG9uU2Nyb2xsKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KHNocmluaywgJ3Njcm9sbCcsIG9uU2Nyb2xsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvckVhY2hFbGVtZW50KGVsZW1lbnQsIGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbSwgY2FsbGJhY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBSZXNpemVTZW5zb3IuZGV0YWNoKGVsZW1lbnQsIGV2KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgUmVzaXplU2Vuc29yLmRldGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2KSB7XG4gICAgICAgIGZvckVhY2hFbGVtZW50KGVsZW1lbnQsIGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAgICAgaWYoZWxlbS5yZXNpemVkQXR0YWNoZWQgJiYgdHlwZW9mIGV2ID09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgZWxlbS5yZXNpemVkQXR0YWNoZWQucmVtb3ZlKGV2KTtcbiAgICAgICAgICAgICAgICBpZihlbGVtLnJlc2l6ZWRBdHRhY2hlZC5sZW5ndGgoKSkgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsZW0ucmVzaXplU2Vuc29yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uY29udGFpbnMoZWxlbS5yZXNpemVTZW5zb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2hpbGQoZWxlbS5yZXNpemVTZW5zb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgZWxlbS5yZXNpemVTZW5zb3I7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVsZW0ucmVzaXplZEF0dGFjaGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlc2l6ZVNlbnNvcjtcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL1Jlc2l6ZVNlbnNvci5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgeyBNYXNvbiwgTWFzb25PcHRpb25zIH0gZnJvbSAnLi9tYXNvbic7XG5leHBvcnQgeyBNYXNvbkRvbVJlbmRlcmVyIH0gZnJvbSAnLi9tYXNvbi1kb20tcmVuZGVyZXInO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUmVzaXplU2Vuc29yOiByZXF1aXJlKCcuL3NyYy9SZXNpemVTZW5zb3InKSxcbiAgICBFbGVtZW50UXVlcmllczogcmVxdWlyZSgnLi9zcmMvRWxlbWVudFF1ZXJpZXMnKVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlZCBieSBtY2tlb3dyIG9uIDIvMy8xNy5cbiAqL1xudmFyIE1hc29uRG9tUmVuZGVyZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uRG9tUmVuZGVyZXIoKSB7XG4gICAgfVxuICAgIE1hc29uRG9tUmVuZGVyZXIucHJvdG90eXBlLnNldENvbHVtbnMgPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgIH07XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuZ2V0RWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfTtcbiAgICBNYXNvbkRvbVJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50SGVpZ2h0ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgbGVmdEluQ29scywgdG9wSW5Vbml0cykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAoKGxlZnRJbkNvbHMgLyB0aGlzLmNvbHVtbnMpICogMTAwKSArICclJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSB0b3BJblVuaXRzICsgJ3B4JztcbiAgICB9O1xuICAgIHJldHVybiBNYXNvbkRvbVJlbmRlcmVyO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uRG9tUmVuZGVyZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hc29uLWRvbS1yZW5kZXJlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9tYXNvbi1kb20tcmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIE1hc29uT3B0aW9ucyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFzb25PcHRpb25zKCkge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgdGhpcy50aHJlc2hvbGQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWFzb25PcHRpb25zO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uT3B0aW9ucyB9O1xudmFyIE1hc29uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXNvbihyZW5kZXJlck9yT3B0aW9ucywgY29udGFpbmVyV2lkdGgsIGNvbHVtbnMsIHRocmVzaG9sZCkge1xuICAgICAgICBpZiAoY29sdW1ucyA9PT0gdm9pZCAwKSB7IGNvbHVtbnMgPSAxMjsgfVxuICAgICAgICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHsgdGhyZXNob2xkID0gMDsgfVxuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgd2lnZ2xlIHJvb20gTWFzb24gaGFzIHdoZW4gY2hvb3NpbmcgYSBjb2x1bW4gZm9yIGEgYnJpY2tcbiAgICAgICAgLy8gV2hlbiBzdGFydGluZyBvbiB0aGUgbGVmdCwgTWFzb24gd2lsbCBvbmx5IGNvbnNpZGVyIGEgY29sdW1uIGNob29zZSBhcyBhIGJldHRlciBmaXRcbiAgICAgICAgLy8gaWYgaXQgaXMgYmV0dGVyIGJ5IHRoaXMgYW1vdW50IG9yIG1vcmUuIFRoaXMgcHJldmVudHMgYnJpY2tzIGZyb20gYmVpbmcgcGxhY2VkIHRvIHRoZVxuICAgICAgICB0aGlzLnRocmVzaG9sZCA9IDQwO1xuICAgICAgICB0aGlzLmNvbHVtbkJvdHRvbXMgPSBbXTtcbiAgICAgICAgaWYgKHJlbmRlcmVyT3JPcHRpb25zWydyZW5kZXJlciddKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IHJlbmRlcmVyT3JPcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IG9wdHMucmVuZGVyZXI7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gb3B0cy5jb250YWluZXJXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IG9wdHMuY29sdW1ucztcbiAgICAgICAgICAgIHRoaXMudGhyZXNob2xkID0gb3B0cy50aHJlc2hvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXJPck9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgICAgICAgICAgdGhpcy50aHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMuY29sdW1uQm90dG9tcy5sZW5ndGggPCB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uQm90dG9tcy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q29sdW1ucyhjb2x1bW5zKTtcbiAgICB9XG4gICAgTWFzb24ucHJvdG90eXBlLmZpbmRCZXN0Q29sdW1uID0gZnVuY3Rpb24gKHJlcXVpcmVkQ29sdW1ucywgZWxlbWVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyB3ZSBuZWVkIHRvIGxvb2sgYXQgYWxsIHRoZSBjb2x1bW5zIGFuZCBmaW5kIHRoZSB3aGljaCBvbmVzXG4gICAgICAgIC8vIHRoaXMgd291bGQgc2hvdWxkIHNwYW4gYmFzZWQgb24gcHJlc2VudGluZyBpdCBhcyBjbG9zZSB0byB0aGVcbiAgICAgICAgLy8gdG9wIGFzIHBvc3NpYmxlLlxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5jb2x1bW5Cb3R0b21zLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIGNvbHVtbiwgaWR4LCBhbGwpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0aW5nIGF0IGNvbHVtbiBYLCBpZiB3ZSBwdXQgaXQgaGVyZSwgd2hhdCB3b3VsZCBiZVxuICAgICAgICAgICAgLy8gaXRzIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBpZiAoaWR4ICsgcmVxdWlyZWRDb2x1bW5zID4gX3RoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goLTEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaGVpZ2h0IGF0IHdoaWNoIGl0IHdvdWxkIGhhdmUgdG8gYmUgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIG5vdCBvdmVybGFwIHNvbWV0aGluZ1xuICAgICAgICAgICAgICAgIHZhciB5UG9zID0gLTE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGlkeDsgaSA8IHJlcXVpcmVkQ29sdW1ucyArIGlkeDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHlQb3MgPSBNYXRoLm1heCh5UG9zLCBhbGxbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHlQb3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgW10pO1xuICAgICAgICAvLyBub3cgdGhlIHdlIGhhdmUgdGhlIHkgY29vcmQgdGhhdCBpdCB3b3VsZCBuZWVkIHRvIGJlIGF0IGZvciBlYWNoIHN0YXJ0aW5nIGNvbHVtblxuICAgICAgICAvLyB3ZSBqdXN0IG5lZWQgdG8gZmlndXJlIG91dCB3aGljaCBvbmUgaXMgbG93ZXN0ICh3aGlsZSB0YWtpbmcgaW50byBhY2NvdW50IHRoZSB0aHJlc2hvbGQpXG4gICAgICAgIC8vIGFuZCB3ZSdyZSBkb25lXG4gICAgICAgIHZhciBiZXN0Rml0ID0gcmVzdWx0LnJlZHVjZShmdW5jdGlvbiAoYmVzdCwgY3VyciwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoIWJlc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4Q29sdW1uczogaWR4LCB5VW5pdHM6IGN1cnIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyIDwgKGJlc3QueVVuaXRzIC0gX3RoaXMudGhyZXNob2xkKSAmJiBjdXJyICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB4Q29sdW1uczogaWR4LCB5VW5pdHM6IGN1cnIgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgIGJlc3RGaXQuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHJldHVybiBiZXN0Rml0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGVsZW1lbnRzIGFuZCByZXR1cm5zIHRoZSBuZXcgY29vcmRzIGZvciBlYWNoIG9uZS4gVGhpcyBkb2VzIG5vdCByZXBvc2l0aW9uIGFueXRoaW5nLlxuICAgICAqIFlvdSBtaWdodCB1c2UgdGhpcyBpZiB5b3Ugd2FudCB0byBoYW5kbGUgaG93IGFuZCB3aGVuIHRoaW5ncyBnZXQgcmVwb3NpdGlvbmVkLlxuICAgICAqXG4gICAgICogU2VlIGxheW91dCgpIGlmIHlvdSB3YW50IGV2ZXJ5dGhpbmcgcG9zaXRpb24gYXV0b21hdGljYWxseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50c1xuICAgICAqIEByZXR1cm5zIHtjb29yZHM6IE1hc29uQ29vcmRbXSwgdG90YWxIZWlnaHQ6IG51bWJlcn1cbiAgICAgKi9cbiAgICBNYXNvbi5wcm90b3R5cGUuZml0ID0gZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjb29yZHNMaXN0ID0gW107XG4gICAgICAgIHZhciB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGlkeCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IF90aGlzLnJlbmRlcmVyLmdldEVsZW1lbnRXaWR0aChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50SGVpZ2h0ID0gX3RoaXMucmVuZGVyZXIuZ2V0RWxlbWVudEhlaWdodChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBjb2xzID0gTWF0aC5yb3VuZCgoZWxlbWVudFdpZHRoIC8gX3RoaXMuY29udGFpbmVyV2lkdGgpICogX3RoaXMuY29sdW1ucyk7XG4gICAgICAgICAgICAvLyBjYW4ndCBiZSBiaWdnZXIgdGhhbiAnYWxsJyBjb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29scyA+IF90aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBjb2xzID0gX3RoaXMuY29sdW1ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiZXN0Rml0ID0gX3RoaXMuZmluZEJlc3RDb2x1bW4oY29scywgZWxlbWVudCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGNvbHVtbiBib3R0b21zIGZvciBhbGwgdGhlIGNvbHVtbnMgdGhpcyB0aWxlIGNyb3NzZXMgd2hlbiBwb3NpdGlvbmVkIGF0IHRoZSBiZXN0XG4gICAgICAgICAgICAvLyBsb2NhdGlvblxuICAgICAgICAgICAgdmFyIHN0YXJ0Q29sID0gYmVzdEZpdC54Q29sdW1ucztcbiAgICAgICAgICAgIHZhciBlbmRDb2wgPSBzdGFydENvbCArIGNvbHM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRDb2w7IGkgPCBlbmRDb2w7IGkrKykge1xuICAgICAgICAgICAgICAgIF90aGlzLmNvbHVtbkJvdHRvbXNbaV0gPSBiZXN0Rml0LnlVbml0cyArIGVsZW1lbnRIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGlzIGlzIGEgdHVwbGUgd2hlcmUgeCBpcyB0aGUgY29sdW1uIGluZGV4IGFuZCB5UG9zIGlzIHRoZSBwaXhlbCBjb29yZCB0byBwb3NpdGlvbiBhdC5cbiAgICAgICAgICAgIGNvb3Jkc0xpc3QucHVzaChiZXN0Rml0KTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgdG90YWwgaGVpZ2h0XG4gICAgICAgICAgICB0b3RhbEhlaWdodCA9IE1hdGgubWF4KHRvdGFsSGVpZ2h0LCBlbGVtZW50SGVpZ2h0ICsgYmVzdEZpdC55VW5pdHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIGNvb3JkaW5hdGVzIGZvciBlYWNoIHRpbGVcbiAgICAgICAgcmV0dXJuIHsgY29vcmRzOiBjb29yZHNMaXN0LCB0b3RhbEhlaWdodDogdG90YWxIZWlnaHQgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoaXMgd2lsbCB0YWtlIHRoZSBsaXN0IG9mIGVsZW1lbnRzLCBmaW5kIHRoZWlyIG5ldyBsb2NhdGlvbnMgYW5kIHRoZW4gdXNlIHRoZSBNYXNvblJlbmRlcmVyXG4gICAgICogdG8gcmVwb3NpdGlvbiBhbGwgdGhlIGJyaWNrcyBpbnRvIHRoZWlyIG5ldyBob21lLlxuICAgICAqIEBwYXJhbSBlbGVtZW50c1xuICAgICAqIEByZXR1cm5zIHRoZSBoZWlnaHQgdGhhdCB0aGUgY29udGFpbmVyIG11c3Qgbm93IGJlIHRvIGhvbGQgdGhlIGl0ZW1zLlxuICAgICAqL1xuICAgIE1hc29uLnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGxheW91dFJlc3VsdCA9IHRoaXMuZml0KGVsZW1lbnRzKTtcbiAgICAgICAgbGF5b3V0UmVzdWx0LmNvb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uIChjb29yZCkge1xuICAgICAgICAgICAgLy8gYXBwbHkgdGhlIGNhbGN1bGF0ZWQgcG9zaXRpb24gZm9yIGVhY2ggYnJpY2sgaG93ZXZlciB5b3Ugd2FudC4gSW4gdGhpcyBjYXNlXG4gICAgICAgICAgICAvLyB3ZSBhcmUganVzdCBzZXR0aW5nIHRoZSBDU1MgcG9zaXRpb24uIEFuaW1hdGlvbiB3aWxsIGJlIHByb3ZpZGVkIHZpYSBDU1NcbiAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLnNldFBvc2l0aW9uKGNvb3JkLmVsZW1lbnQsIGNvb3JkLnhDb2x1bW5zLCBjb29yZC55VW5pdHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxheW91dFJlc3VsdC50b3RhbEhlaWdodDtcbiAgICB9O1xuICAgIHJldHVybiBNYXNvbjtcbn0oKSk7XG5leHBvcnQgeyBNYXNvbiB9O1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFzb24uanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvbWFzb24uanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDb3B5cmlnaHQgTWFyYyBKLiBTY2htaWR0LiBTZWUgdGhlIExJQ0VOU0UgZmlsZSBhdCB0aGUgdG9wLWxldmVsXG4gKiBkaXJlY3Rvcnkgb2YgdGhpcyBkaXN0cmlidXRpb24gYW5kIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2ovY3NzLWVsZW1lbnQtcXVlcmllcy9ibG9iL21hc3Rlci9MSUNFTlNFLlxuICovXG47XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFsnLi9SZXNpemVTZW5zb3IuanMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnLi9SZXNpemVTZW5zb3IuanMnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5FbGVtZW50UXVlcmllcyA9IGZhY3Rvcnkocm9vdC5SZXNpemVTZW5zb3IpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKFJlc2l6ZVNlbnNvcikge1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgdmFyIEVsZW1lbnRRdWVyaWVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRyYWNraW5nQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0RW1TaXplKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZm9udFNpemUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5mb250U2l6ZTtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGZvbnRTaXplKSB8fCAxNjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9NcjBncm9nL2VsZW1lbnQtcXVlcnkvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjb252ZXJ0VG9QeChlbGVtZW50LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG51bWJlcnMgPSB2YWx1ZS5zcGxpdCgvXFxkLyk7XG4gICAgICAgICAgICB2YXIgdW5pdHMgPSBudW1iZXJzW251bWJlcnMubGVuZ3RoLTFdO1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlbVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBnZXRFbVNpemUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJlbVwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBnZXRFbVNpemUoKTtcbiAgICAgICAgICAgICAgICAvLyBWaWV3cG9ydCB1bml0cyFcbiAgICAgICAgICAgICAgICAvLyBBY2NvcmRpbmcgdG8gaHR0cDovL3F1aXJrc21vZGUub3JnL21vYmlsZS90YWJsZVZpZXdwb3J0Lmh0bWxcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgvSGVpZ2h0IGdldHMgdXMgdGhlIG1vc3QgcmVsaWFibGUgaW5mb1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2d1wiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAxMDA7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZoXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAxMDA7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZtaW5cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidm1heFwiOlxuICAgICAgICAgICAgICAgICAgICB2YXIgdncgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaG9vc2VyID0gTWF0aFt1bml0cyA9PT0gXCJ2bWluXCIgPyBcIm1pblwiIDogXCJtYXhcIl07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGNob29zZXIodncsIHZoKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gZm9yIG5vdywgbm90IHN1cHBvcnRpbmcgcGh5c2ljYWwgdW5pdHMgKHNpbmNlIHRoZXkgYXJlIGp1c3QgYSBzZXQgbnVtYmVyIG9mIHB4KVxuICAgICAgICAgICAgICAgIC8vIG9yIGV4L2NoIChnZXR0aW5nIGFjY3VyYXRlIG1lYXN1cmVtZW50cyBpcyBoYXJkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBTZXR1cEluZm9ybWF0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIHZhciBrZXksIG9wdGlvbiwgd2lkdGggPSAwLCBoZWlnaHQgPSAwLCB2YWx1ZSwgYWN0dWFsVmFsdWUsIGF0dHJWYWx1ZXMsIGF0dHJWYWx1ZSwgYXR0ck5hbWU7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiB7bW9kZTogJ21pbnxtYXgnLCBwcm9wZXJ0eTogJ3dpZHRofGhlaWdodCcsIHZhbHVlOiAnMTIzcHgnfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBbb3B0aW9uLm1vZGUsIG9wdGlvbi5wcm9wZXJ0eSwgb3B0aW9uLnZhbHVlXS5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zW2lkeF0gPSBvcHRpb247XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFsnbWluLXdpZHRoJywgJ21pbi1oZWlnaHQnLCAnbWF4LXdpZHRoJywgJ21heC1oZWlnaHQnXTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeHRyYWN0cyB0aGUgY29tcHV0ZWQgd2lkdGgvaGVpZ2h0IGFuZCBzZXRzIHRvIG1pbi9tYXgtIGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gZXh0cmFjdCBjdXJyZW50IGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgYXR0clZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0gdGhpcy5vcHRpb25zW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb252ZXJ0VG9QeCh0aGlzLmVsZW1lbnQsIG9wdGlvbi52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWN0dWFsVmFsdWUgPSBvcHRpb24ucHJvcGVydHkgPT0gJ3dpZHRoJyA/IHdpZHRoIDogaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBhdHRyTmFtZSA9IG9wdGlvbi5tb2RlICsgJy0nICsgb3B0aW9uLnByb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLm1vZGUgPT0gJ21pbicgJiYgYWN0dWFsVmFsdWUgPj0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSArPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLm1vZGUgPT0gJ21heCcgJiYgYWN0dWFsVmFsdWUgPD0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSArPSBvcHRpb24udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJWYWx1ZXNbYXR0ck5hbWVdKSBhdHRyVmFsdWVzW2F0dHJOYW1lXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0clZhbHVlICYmIC0xID09PSAoJyAnK2F0dHJWYWx1ZXNbYXR0ck5hbWVdKycgJykuaW5kZXhPZignICcgKyBhdHRyVmFsdWUgKyAnICcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWVzW2F0dHJOYW1lXSArPSAnICcgKyBhdHRyVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoaykpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWVzW2F0dHJpYnV0ZXNba11dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZXNba10sIGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0uc3Vic3RyKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgb3B0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24gPSBuZXcgU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5hZGRPcHRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvciA9IG5ldyBSZXNpemVTZW5zb3IoZWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmNhbGwoKTtcblxuICAgICAgICAgICAgaWYgKHRyYWNraW5nQWN0aXZlICYmIGVsZW1lbnRzLmluZGV4T2YoZWxlbWVudCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZGUgbWlufG1heFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgd2lkdGh8aGVpZ2h0XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGFsbFF1ZXJpZXMgPSB7fTtcbiAgICAgICAgZnVuY3Rpb24gcXVldWVRdWVyeShzZWxlY3RvciwgbW9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKGFsbFF1ZXJpZXNbbW9kZV0pID09ICd1bmRlZmluZWQnKSBhbGxRdWVyaWVzW21vZGVdID0ge307XG4gICAgICAgICAgICBpZiAodHlwZW9mKGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldKSA9PSAndW5kZWZpbmVkJykgYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0gPSB7fTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV1bdmFsdWVdKSA9PSAndW5kZWZpbmVkJykgYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV1bdmFsdWVdID0gc2VsZWN0b3I7XG4gICAgICAgICAgICBlbHNlIGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldW3ZhbHVlXSArPSAnLCcrc2VsZWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRRdWVyeSgpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKSBxdWVyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwuYmluZChkb2N1bWVudCk7XG4gICAgICAgICAgICBpZiAoIXF1ZXJ5ICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YgJCQpIHF1ZXJ5ID0gJCQ7XG4gICAgICAgICAgICBpZiAoIXF1ZXJ5ICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5KSBxdWVyeSA9IGpRdWVyeTtcblxuICAgICAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgICAgIHRocm93ICdObyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLCBqUXVlcnkgb3IgTW9vdG9vbHNcXCdzICQkIGZvdW5kLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdGFydCB0aGUgbWFnaWMuIEdvIHRocm91Z2ggYWxsIGNvbGxlY3RlZCBydWxlcyAocmVhZFJ1bGVzKCkpIGFuZCBhdHRhY2ggdGhlIHJlc2l6ZS1saXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRFbGVtZW50UXVlcmllc0VsZW1lbnRzKCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gZ2V0UXVlcnkoKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgbW9kZSBpbiBhbGxRdWVyaWVzKSBpZiAoYWxsUXVlcmllcy5oYXNPd25Qcm9wZXJ0eShtb2RlKSkge1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYWxsUXVlcmllc1ttb2RlXSkgaWYgKGFsbFF1ZXJpZXNbbW9kZV0uaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHZhbHVlIGluIGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldKSBpZiAoYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0uaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBxdWVyeShhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR1cEVsZW1lbnQoZWxlbWVudHNbaV0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFJlc3BvbnNpdmVJbWFnZShlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIHZhciBydWxlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0SW1hZ2VJZCA9IDA7XG4gICAgICAgICAgICB2YXIgbGFzdEFjdGl2ZUltYWdlID0gLTE7XG4gICAgICAgICAgICB2YXIgbG9hZGVkSW1hZ2VzID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmKCFlbGVtZW50LmNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuW2ldLnRhZ05hbWUgJiYgZWxlbWVudC5jaGlsZHJlbltpXS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbWcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goZWxlbWVudC5jaGlsZHJlbltpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1pbldpZHRoID0gZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ21pbi13aWR0aCcpIHx8IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdkYXRhLW1pbi13aWR0aCcpO1xuICAgICAgICAgICAgICAgICAgICAvL3ZhciBtaW5IZWlnaHQgPSBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnbWluLWhlaWdodCcpIHx8IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdkYXRhLW1pbi1oZWlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNyYyA9IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpIHx8IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd1cmwnKTtcblxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goc3JjKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBtaW5XaWR0aFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzLnB1c2gocnVsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtaW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEltYWdlSWQgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbltpXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW5baV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGFzdEFjdGl2ZUltYWdlID0gZGVmYXVsdEltYWdlSWQ7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZVRvRGlzcGxheSA9IGZhbHNlLCBpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIGNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWNoaWxkcmVuLmhhc093blByb3BlcnR5KGkpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNbaV0ubWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gcnVsZXNbaV0ubWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVRvRGlzcGxheSA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWltYWdlVG9EaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vbm8gcnVsZSBtYXRjaGVkLCBzaG93IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0Rpc3BsYXkgPSBkZWZhdWx0SW1hZ2VJZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdEFjdGl2ZUltYWdlICE9IGltYWdlVG9EaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vaW1hZ2UgY2hhbmdlXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2FkZWRJbWFnZXNbaW1hZ2VUb0Rpc3BsYXldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaW1hZ2UgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQsIHdlIG5lZWQgdG8gbG9hZCB0aGUgaW1hZ2UgZmlyc3QgaW4gbWVtb3J5IHRvIHByZXZlbnQgZmxhc2ggb2ZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbm8gY29udGVudFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zcmMgPSBzb3VyY2VzW2ltYWdlVG9EaXNwbGF5XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2xhc3RBY3RpdmVJbWFnZV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltpbWFnZVRvRGlzcGxheV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWRJbWFnZXNbaW1hZ2VUb0Rpc3BsYXldID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RBY3RpdmVJbWFnZSA9IGltYWdlVG9EaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gc291cmNlc1tpbWFnZVRvRGlzcGxheV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltsYXN0QWN0aXZlSW1hZ2VdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltpbWFnZVRvRGlzcGxheV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0QWN0aXZlSW1hZ2UgPSBpbWFnZVRvRGlzcGxheTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vbWFrZSBzdXJlIGZvciBpbml0aWFsIGNoZWNrIGNhbGwgdGhlIC5zcmMgaXMgc2V0IGNvcnJlY3RseVxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltpbWFnZVRvRGlzcGxheV0uc3JjID0gc291cmNlc1tpbWFnZVRvRGlzcGxheV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvciA9IG5ldyBSZXNpemVTZW5zb3IoZWxlbWVudCwgY2hlY2spO1xuICAgICAgICAgICAgY2hlY2soKTtcblxuICAgICAgICAgICAgaWYgKHRyYWNraW5nQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRSZXNwb25zaXZlSW1hZ2VzKCl7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBnZXRRdWVyeSgpO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBxdWVyeSgnW2RhdGEtcmVzcG9uc2l2ZS1pbWFnZV0sW3Jlc3BvbnNpdmUtaW1hZ2VdJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGF0dGFjaFJlc3BvbnNpdmVJbWFnZShlbGVtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVnZXggPSAvLD9bXFxzXFx0XSooW14sXFxuXSo/KSgoPzpcXFtbXFxzXFx0XSo/KD86bWlufG1heCktKD86d2lkdGh8aGVpZ2h0KVtcXHNcXHRdKj9bfiRcXF5dPz1bXFxzXFx0XSo/XCJbXlwiXSo/XCJbXFxzXFx0XSo/XSkrKShbXixcXG5cXHNcXHtdKikvbWdpO1xuICAgICAgICB2YXIgYXR0clJlZ2V4ID0gL1xcW1tcXHNcXHRdKj8obWlufG1heCktKHdpZHRofGhlaWdodClbXFxzXFx0XSo/W34kXFxeXT89W1xcc1xcdF0qP1wiKFteXCJdKj8pXCJbXFxzXFx0XSo/XS9tZ2k7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY3NzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBleHRyYWN0UXVlcnkoY3NzKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgICAgICB2YXIgc21hdGNoO1xuICAgICAgICAgICAgY3NzID0gY3NzLnJlcGxhY2UoLycvZywgJ1wiJyk7XG4gICAgICAgICAgICB3aGlsZSAobnVsbCAhPT0gKG1hdGNoID0gcmVnZXguZXhlYyhjc3MpKSkge1xuICAgICAgICAgICAgICAgIHNtYXRjaCA9IG1hdGNoWzFdICsgbWF0Y2hbM107XG4gICAgICAgICAgICAgICAgYXR0cnMgPSBtYXRjaFsyXTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChudWxsICE9PSAoYXR0ck1hdGNoID0gYXR0clJlZ2V4LmV4ZWMoYXR0cnMpKSkge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZVF1ZXJ5KHNtYXRjaCwgYXR0ck1hdGNoWzFdLCBhdHRyTWF0Y2hbMl0sIGF0dHJNYXRjaFszXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7Q3NzUnVsZVtdfFN0cmluZ30gcnVsZXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRSdWxlcyhydWxlcykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gJyc7XG4gICAgICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcnVsZXMpIHtcbiAgICAgICAgICAgICAgICBydWxlcyA9IHJ1bGVzLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKC0xICE9PSBydWxlcy5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gcnVsZXMuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHJ1bGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gcnVsZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgxID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHJ1bGVzW2ldLnNlbGVjdG9yVGV4dCB8fCBydWxlc1tpXS5jc3NUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4taGVpZ2h0JykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC1oZWlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RRdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZigtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWluLXdpZHRoJykgfHwgLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21heC13aWR0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICg0ID09PSBydWxlc1tpXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkUnVsZXMocnVsZXNbaV0uY3NzUnVsZXMgfHwgcnVsZXNbaV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmF1bHRDc3NJbmplY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWFyY2hlcyBhbGwgY3NzIHJ1bGVzIGFuZCBzZXR1cHMgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIGFsbCBlbGVtZW50cyB3aXRoIGVsZW1lbnQgcXVlcnkgcnVsZXMuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbih3aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgICAgIHRyYWNraW5nQWN0aXZlID0gdHlwZW9mIHdpdGhUcmFja2luZyA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IHdpdGhUcmFja2luZztcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZWFkUnVsZXMoZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0uY3NzUnVsZXMgfHwgZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0ucnVsZXMgfHwgZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0uY3NzVGV4dCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLm5hbWUgIT09ICdTZWN1cml0eUVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFkZWZhdWx0Q3NzSW5qZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICdbcmVzcG9uc2l2ZS1pbWFnZV0gPiBpbWcsIFtkYXRhLXJlc3BvbnNpdmUtaW1hZ2VdIHtvdmVyZmxvdzogaGlkZGVuOyBwYWRkaW5nOiAwOyB9IFtyZXNwb25zaXZlLWltYWdlXSA+IGltZywgW2RhdGEtcmVzcG9uc2l2ZS1pbWFnZV0gPiBpbWcgeyB3aWR0aDogMTAwJTt9JztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q3NzSW5qZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaW5kRWxlbWVudFF1ZXJpZXNFbGVtZW50cygpO1xuICAgICAgICAgICAgZmluZFJlc3BvbnNpdmVJbWFnZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoVHJhY2tpbmcgYWxsb3dzIGFuZCByZXF1aXJlcyB5b3UgdG8gdXNlIGRldGFjaCwgc2luY2Ugd2Ugc3RvcmUgaW50ZXJuYWxseSBhbGwgdXNlZCBlbGVtZW50c1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbih3aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCh3aXRoVHJhY2tpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGV0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMud2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ3dpdGhUcmFja2luZyBpcyBub3QgZW5hYmxlZC4gV2UgY2FuIG5vdCBkZXRhY2ggZWxlbWVudHMgc2luY2Ugd2UgZG9uIG5vdCBzdG9yZSBpdC4nICtcbiAgICAgICAgICAgICAgICAnVXNlIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IHRydWU7IGJlZm9yZSBkb21yZWFkeSBvciBjYWxsIEVsZW1lbnRRdWVyeWVzLnVwZGF0ZSh0cnVlKS4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudHMucG9wKCkpIHtcbiAgICAgICAgICAgICAgICBFbGVtZW50UXVlcmllcy5kZXRhY2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnRzID0gW107XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoVHJhY2tpbmcgYWxsb3dzIGFuZCByZXF1aXJlcyB5b3UgdG8gdXNlIGRldGFjaCwgc2luY2Ugd2Ugc3RvcmUgaW50ZXJuYWxseSBhbGwgdXNlZCBlbGVtZW50c1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICovXG4gICAgRWxlbWVudFF1ZXJpZXMudXBkYXRlID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgIEVsZW1lbnRRdWVyaWVzLmluc3RhbmNlLnVwZGF0ZSh3aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBzZW5zb3IgYW5kIGVsZW1lbnRxdWVyeSBpbmZvcm1hdGlvbiBmcm9tIHRoZSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIEVsZW1lbnRRdWVyaWVzLmRldGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uKSB7XG4gICAgICAgICAgICAvL2VsZW1lbnQgcXVlcmllc1xuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvci5kZXRhY2goKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5yZXNpemVTZW5zb3IpIHtcbiAgICAgICAgICAgIC8vcmVzcG9uc2l2ZSBpbWFnZVxuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5kZXRhY2goKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LnJlc2l6ZVNlbnNvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2RldGFjaGVkIGFscmVhZHknLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcgPSBmYWxzZTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFFbGVtZW50UXVlcmllcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UgPSBuZXcgRWxlbWVudFF1ZXJpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEVsZW1lbnRRdWVyaWVzLmluc3RhbmNlLmluaXQoRWxlbWVudFF1ZXJpZXMud2l0aFRyYWNraW5nKTtcbiAgICB9O1xuXG4gICAgdmFyIGRvbUxvYWRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAvKiBJbnRlcm5ldCBFeHBsb3JlciAqL1xuICAgICAgICAvKkBjY19vblxuICAgICAgICAgQGlmIChAX3dpbjMyIHx8IEBfd2luNjQpXG4gICAgICAgICBkb2N1bWVudC53cml0ZSgnPHNjcmlwdCBpZD1cImllU2NyaXB0TG9hZFwiIGRlZmVyIHNyYz1cIi8vOlwiPjxcXC9zY3JpcHQ+Jyk7XG4gICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWVTY3JpcHRMb2FkJykub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICB9XG4gICAgICAgICB9O1xuICAgICAgICAgQGVuZCBAKi9cbiAgICAgICAgLyogTW96aWxsYSwgQ2hyb21lLCBPcGVyYSAqL1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogU2FmYXJpLCBpQ2FiLCBLb25xdWVyb3IgKi9cbiAgICAgICAgZWxzZSBpZiAoL0tIVE1MfFdlYktpdHxpQ2FiL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICAgICAgdmFyIERPTUxvYWRUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoL2xvYWRlZHxjb21wbGV0ZS9pLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChET01Mb2FkVGltZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBPdGhlciB3ZWIgYnJvd3NlcnMgKi9cbiAgICAgICAgZWxzZSB3aW5kb3cub25sb2FkID0gY2FsbGJhY2s7XG4gICAgfTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLmxpc3RlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb21Mb2FkZWQoRWxlbWVudFF1ZXJpZXMuaW5pdCk7XG4gICAgfTtcblxuICAgIC8vIG1ha2UgYXZhaWxhYmxlIHRvIGNvbW1vbiBtb2R1bGUgbG9hZGVyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50UXVlcmllcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5FbGVtZW50UXVlcmllcyA9IEVsZW1lbnRRdWVyaWVzO1xuICAgICAgICBFbGVtZW50UXVlcmllcy5saXN0ZW4oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRWxlbWVudFF1ZXJpZXM7XG5cbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL3NyYy9FbGVtZW50UXVlcmllcy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZWQgYnkgbWNrZW93ciBvbiAyLzIvMTcuXG4gKi9cbmltcG9ydCB7TWFzb24sIE1hc29uRG9tUmVuZGVyZXJ9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQge1Jlc2l6ZVNlbnNvcn0gZnJvbSAnY3NzLWVsZW1lbnQtcXVlcmllcyc7XG5cbmZ1bmN0aW9uIHBhY2soKSB7XG5cbiAgICAgICAgLy8gZmluZCBvdXIgY29udGFpbmVyXG4gICAgICAgIHZhciBkYXNoYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFzb24tY29udGFpbmVyJyk7XG4gICAgICAgIHZhciBjb250YWluZXJXaWR0aCA9IGRhc2hib2FyZC5vZmZzZXRXaWR0aDtcbiAgICAgICAgLy8gZmluZCBhbGwgdGhlIGJyaWNrcyBpbiBpdFxuICAgICAgICAvLyBub3QgYWxsIGJyb3dzZXJzIGFyZSBhYmxlIHRvIHRyZWF0IHRoZSByZXN1bHRzIGZyb20gcXVlcnlTZWxlY3RvckFsbCB3aXRoIGFycmF5IG1ldGhvZHMgbGlrZSBmb3JFYWNoKClcbiAgICAgICAgLy8gc28gdGhpcyB3aWxsIG1ha2UgdGhlbiBhbiBhcnJheVxuICAgICAgICB2YXIgaXRlbXMgPSBbXS5zbGljZS5jYWxsKGRhc2hib2FyZC5xdWVyeVNlbGVjdG9yQWxsKCdkaXYubWFzb24tYnJpY2snKSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgTWFzb24gYW5kIHVzZSBpdCB0byBmaXQgdGhlIGJyaWNrcyBpbnRvIGEgY29udGFpbmVyXG4gICAgICAgIC8vIHRoZSBzaXplIG9mIHRoZSAnZGFzaGJvYXJkJ1xuICAgICAgICAvLyBzaW5jZSB3ZSBhcmUgZGVhbGluZyB3aXRoIGRvbSBub2Rlcywgd2UgbmVlZCB0aGUgTWFzb25Eb21SZW5kZXJlclxuICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgTWFzb25Eb21SZW5kZXJlcigpO1xuXG4gICAgICAgIHZhciBvcHRzID0geyAvLyBNYXNvbk9wdGlvbnMgb2JqZWN0IGhlcmVcbiAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoOiBjb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgIHJlbmRlcmVyOiByZW5kZXJlcixcbiAgICAgICAgICAgIC8vIHRoaXMgdGhyZXNob2xkIHNpZ25pZmllcyB0aGF0IGV2ZW4gaWYgYSBjb2x1bW4gdG8gdGhlIHJpZ2h0XG4gICAgICAgICAgICAvLyB3b3VsZCBwb3N0aW9uIHRoZSB0aWxlIGNsb3NlciB0byB0aGUgdG9wLCBpdCB3aWxsIHByZWZlclxuICAgICAgICAgICAgLy8gYSBjb2x1bW4gdG8gdGhlIGxlZnQgaWYgdGhlIGRpZmZlcmVuY2UgaXMgbGVzcyB0aGFuIHRoaXNcbiAgICAgICAgICAgIC8vIG1hbnkgcGl4ZWxzLiBNYWtlIHRoaXMgMCBhbmQgY2hlY2sgdGhlIGRlbW8gYW5kIHlvdSB3aWxsXG4gICAgICAgICAgICAvLyBzZWUgdGhlIGRpZmZlcmVuY2UgaW4gcG9zaXRpb24gb2YgYnJpY2tzIDUgYW5kIDYgYWZ0ZXIgdGhlXG4gICAgICAgICAgICAvLyBzaG93IG1vcmUgYnV0dG9uIGlzIGNsaWNrZWQgaW4gYnJpY2sgMVxuICAgICAgICAgICAgdGhyZXNob2xkOiA0MCxcbiAgICAgICAgICAgIGNvbHVtbnM6IDEyXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNvbnRhaW5lckhlaWdodCA9IG5ldyBNYXNvbihvcHRzKS5sYXlvdXQoaXRlbXMpO1xuICAgICAgICBkYXNoYm9hcmQuc3R5bGUubWluSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0ICsgJ3B4JztcblxufVxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgICAvLyBpbml0aWFsaXplIHRoZSBsYXlvdXRcbiAgICBwYWNrKCk7XG5cbiAgICAvLyBpbiBvdXIgY2FzZSwgd2Ugd2FudCB0byByZSBsYXlvdXQgdGhlIGJyaWNrcyB3aGVuIGFueSBvZiB0aGVpciBzaXplcyBjaGFuZ2UuXG4gICAgLy8gaWYgdGhlIGJyaWNrcyBzaXplcyBjYW4gb25seSBjaGFuZ2Ugd2hlbiB0aGUgd2luZG93IGlzIHJlc2l6ZWQsIHlvdSBjb3VsZCB1c2UgdGhlXG4gICAgLy8gd2luZG93IHJlc2l6ZSBldmVudC4gSG93ZXZlciwgaWYgdGhlIGJyaWNrcyBjYW4gcmVzaXplIHRoZW1zZWx2ZXMsIHlvdSB3b3VsZCB3YW50IHRvIGRvIHNvbWV0aGluZ1xuICAgIC8vIGxpa2UgdGhpc1xuICAgIG5ldyBSZXNpemVTZW5zb3IoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hc29uLWNvbnRhaW5lcicpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5tYXNvbi1icmljaycpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFjaygpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJykucXVlcnlTZWxlY3RvcignYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICBzaG93TW9yZSgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZXNldEhlaWdodCgpIHtcbiAgICB2YXIgZmlyc3RUaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJyk7XG4gICAgZmlyc3RUaWxlLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICBmaXJzdFRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHJlc2V0SGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gc2hvd01vcmUoKSB7XG4gICAgdmFyIGZpcnN0VGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlRXhhbXBsZScpO1xuXG4gICAgaWYgKGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgIT09ICc0MDBweCcpIHtcbiAgICAgICAgdmFyIGF1dG9IZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmaXJzdFRpbGUsIG51bGwpLmhlaWdodDtcbiAgICAgICAgZmlyc3RUaWxlLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWhlaWdodCcsIGF1dG9IZWlnaHQpO1xuICAgICAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gYXV0b0hlaWdodDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgPSAnNDAwcHgnO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gZmlyc3RUaWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWhlaWdodCcpO1xuICAgICAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gdGFyZ2V0SGVpZ2h0O1xuICAgICAgICBmaXJzdFRpbGUuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHJlc2V0SGVpZ2h0KTtcbiAgICB9XG59XG5cbnN0YXJ0KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9kZW1vL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
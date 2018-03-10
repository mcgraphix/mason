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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MasonDefaultPacker; });
/**
 * Default packer used to position each brick as close to the top as possible
 */
var MasonDefaultPacker = (function () {
    function MasonDefaultPacker() {
    }
    MasonDefaultPacker.prototype.findBestColumn = function (requiredColumns, element, elementIndex, columnBottoms, threshold) {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        var columns = columnBottoms.length;
        var result = columnBottoms.reduce(function (accumulator, column, idx, all) {
            // starting at column X, if we put it here, what would be
            // its starting point
            if (idx + requiredColumns > columns) {
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
                if (curr < (best.yUnits - threshold) && curr !== -1) {
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
    return MasonDefaultPacker;
}());

//# sourceMappingURL=mason-default-packer.js.map

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mason__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__mason__["a"]; });
/* unused harmony reexport MasonOptions */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mason_default_packer__ = __webpack_require__(0);
/* unused harmony reexport MasonDefaultPacker */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mason_simple_packer__ = __webpack_require__(5);
/* unused harmony reexport MasonSimplePacker */




//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    ResizeSensor: __webpack_require__(1),
    ElementQueries: __webpack_require__(7)
};


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MasonSimplePacker */
/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
var MasonSimplePacker = (function () {
    function MasonSimplePacker() {
    }
    MasonSimplePacker.prototype.findBestColumn = function (requiredColumns, element, elementIndex, columnBottoms, threshold) {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        var columns = columnBottoms.length;
        var result = columnBottoms.reduce(function (accumulator, column, idx, all) {
            // starting at column X, if we put it here, what would be
            // its starting point
            if (idx + requiredColumns > columns) {
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
        var nextColumn = (requiredColumns * elementIndex) % columns;
        var bestFit = { xColumns: nextColumn, yUnits: columnBottoms[nextColumn], element: element };
        return bestFit;
    };
    return MasonSimplePacker;
}());

//# sourceMappingURL=mason-simple-packer.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mason_default_packer__ = __webpack_require__(0);
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
            this.packer = opts.packer || new __WEBPACK_IMPORTED_MODULE_0__mason_default_packer__["a" /* MasonDefaultPacker */]();
        }
        else {
            this.renderer = rendererOrOptions;
            this.containerWidth = containerWidth;
            this.columns = columns;
            this.threshold = threshold;
            this.packer = new __WEBPACK_IMPORTED_MODULE_0__mason_default_packer__["a" /* MasonDefaultPacker */]();
        }
        while (this.columnBottoms.length < this.columns) {
            this.columnBottoms.push(0);
        }
        this.renderer.setColumns(columns);
    }
    Mason.prototype.findBestColumn = function (requiredColumns, element, elementIndex) {
        return this.packer.findBestColumn(requiredColumns, element, elementIndex, this.columnBottoms, this.threshold);
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
            var bestFit = _this.findBestColumn(cols, element, idx);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_css_element_queries__ = __webpack_require__(3);
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
            // implement your own packing logic
            // form example, import MasonSimplePacker and try that
            // packer: new MasonSimplePacker()
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
    // ResizeSensor is from css-element-queries (which is listed as an optional dependency);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWNkMzAzODdhYjk4NWU3M2I4ZDIiLCJ3ZWJwYWNrOi8vLy4vbGliL21hc29uLWRlZmF1bHQtcGFja2VyLmpzIiwid2VicGFjazovLy8uL34vY3NzLWVsZW1lbnQtcXVlcmllcy9zcmMvUmVzaXplU2Vuc29yLmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hc29uLWRvbS1yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFzb24tc2ltcGxlLXBhY2tlci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFzb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtZWxlbWVudC1xdWVyaWVzL3NyYy9FbGVtZW50UXVlcmllcy5qcyIsIndlYnBhY2s6Ly8vLi9kZW1vL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDaEVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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RXJCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUSIsImZpbGUiOiIuL2RlbW8vYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOWNkMzAzODdhYjk4NWU3M2I4ZDIiLCIvKipcbiAqIERlZmF1bHQgcGFja2VyIHVzZWQgdG8gcG9zaXRpb24gZWFjaCBicmljayBhcyBjbG9zZSB0byB0aGUgdG9wIGFzIHBvc3NpYmxlXG4gKi9cbnZhciBNYXNvbkRlZmF1bHRQYWNrZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uRGVmYXVsdFBhY2tlcigpIHtcbiAgICB9XG4gICAgTWFzb25EZWZhdWx0UGFja2VyLnByb3RvdHlwZS5maW5kQmVzdENvbHVtbiA9IGZ1bmN0aW9uIChyZXF1aXJlZENvbHVtbnMsIGVsZW1lbnQsIGVsZW1lbnRJbmRleCwgY29sdW1uQm90dG9tcywgdGhyZXNob2xkKSB7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbG9vayBhdCBhbGwgdGhlIGNvbHVtbnMgYW5kIGZpbmQgdGhlIHdoaWNoIG9uZXNcbiAgICAgICAgLy8gdGhpcyB3b3VsZCBzaG91bGQgc3BhbiBiYXNlZCBvbiBwcmVzZW50aW5nIGl0IGFzIGNsb3NlIHRvIHRoZVxuICAgICAgICAvLyB0b3AgYXMgcG9zc2libGUuXG4gICAgICAgIHZhciBjb2x1bW5zID0gY29sdW1uQm90dG9tcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHQgPSBjb2x1bW5Cb3R0b21zLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIGNvbHVtbiwgaWR4LCBhbGwpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0aW5nIGF0IGNvbHVtbiBYLCBpZiB3ZSBwdXQgaXQgaGVyZSwgd2hhdCB3b3VsZCBiZVxuICAgICAgICAgICAgLy8gaXRzIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBpZiAoaWR4ICsgcmVxdWlyZWRDb2x1bW5zID4gY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goLTEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaGVpZ2h0IGF0IHdoaWNoIGl0IHdvdWxkIGhhdmUgdG8gYmUgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIG5vdCBvdmVybGFwIHNvbWV0aGluZ1xuICAgICAgICAgICAgICAgIHZhciB5UG9zID0gLTE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGlkeDsgaSA8IHJlcXVpcmVkQ29sdW1ucyArIGlkeDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHlQb3MgPSBNYXRoLm1heCh5UG9zLCBhbGxbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHlQb3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgW10pO1xuICAgICAgICAvLyBub3cgdGhlIHdlIGhhdmUgdGhlIHkgY29vcmQgdGhhdCBpdCB3b3VsZCBuZWVkIHRvIGJlIGF0IGZvciBlYWNoIHN0YXJ0aW5nIGNvbHVtblxuICAgICAgICAvLyB3ZSBqdXN0IG5lZWQgdG8gZmlndXJlIG91dCB3aGljaCBvbmUgaXMgbG93ZXN0ICh3aGlsZSB0YWtpbmcgaW50byBhY2NvdW50IHRoZSB0aHJlc2hvbGQpXG4gICAgICAgIC8vIGFuZCB3ZSdyZSBkb25lXG4gICAgICAgIHZhciBiZXN0Rml0ID0gcmVzdWx0LnJlZHVjZShmdW5jdGlvbiAoYmVzdCwgY3VyciwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoIWJlc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4Q29sdW1uczogaWR4LCB5VW5pdHM6IGN1cnIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyIDwgKGJlc3QueVVuaXRzIC0gdGhyZXNob2xkKSAmJiBjdXJyICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB4Q29sdW1uczogaWR4LCB5VW5pdHM6IGN1cnIgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgIGJlc3RGaXQuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHJldHVybiBiZXN0Rml0O1xuICAgIH07XG4gICAgcmV0dXJuIE1hc29uRGVmYXVsdFBhY2tlcjtcbn0oKSk7XG5leHBvcnQgeyBNYXNvbkRlZmF1bHRQYWNrZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hc29uLWRlZmF1bHQtcGFja2VyLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL21hc29uLWRlZmF1bHQtcGFja2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuUmVzaXplU2Vuc29yID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG4gICAgLy9NYWtlIHN1cmUgaXQgZG9lcyBub3QgdGhyb3cgaW4gYSBTU1IgKFNlcnZlciBTaWRlIFJlbmRlcmluZykgc2l0dWF0aW9uXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIE9ubHkgdXNlZCBmb3IgdGhlIGRpcnR5IGNoZWNraW5nLCBzbyB0aGUgZXZlbnQgY2FsbGJhY2sgY291bnQgaXMgbGltdGVkIHRvIG1heCAxIGNhbGwgcGVyIGZwcyBwZXIgc2Vuc29yLlxuICAgIC8vIEluIGNvbWJpbmF0aW9uIHdpdGggdGhlIGV2ZW50IGJhc2VkIHJlc2l6ZSBzZW5zb3IgdGhpcyBzYXZlcyBjcHUgdGltZSwgYmVjYXVzZSB0aGUgc2Vuc29yIGlzIHRvbyBmYXN0IGFuZFxuICAgIC8vIHdvdWxkIGdlbmVyYXRlIHRvbyBtYW55IHVubmVjZXNzYXJ5IGV2ZW50cy5cbiAgICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZm4sIDIwKTtcbiAgICAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgb3ZlciBlYWNoIG9mIHRoZSBwcm92aWRlZCBlbGVtZW50KHMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxIVE1MRWxlbWVudFtdfSBlbGVtZW50c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JFYWNoRWxlbWVudChlbGVtZW50cywgY2FsbGJhY2spe1xuICAgICAgICB2YXIgZWxlbWVudHNUeXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsZW1lbnRzKTtcbiAgICAgICAgdmFyIGlzQ29sbGVjdGlvblR5cGVkID0gKCdbb2JqZWN0IEFycmF5XScgPT09IGVsZW1lbnRzVHlwZVxuICAgICAgICAgICAgfHwgKCdbb2JqZWN0IE5vZGVMaXN0XScgPT09IGVsZW1lbnRzVHlwZSlcbiAgICAgICAgICAgIHx8ICgnW29iamVjdCBIVE1MQ29sbGVjdGlvbl0nID09PSBlbGVtZW50c1R5cGUpXG4gICAgICAgICAgICB8fCAoJ1tvYmplY3QgT2JqZWN0XScgPT09IGVsZW1lbnRzVHlwZSlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSAmJiBlbGVtZW50cyBpbnN0YW5jZW9mIGpRdWVyeSkgLy9qcXVlcnlcbiAgICAgICAgICAgIHx8ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIEVsZW1lbnRzICYmIGVsZW1lbnRzIGluc3RhbmNlb2YgRWxlbWVudHMpIC8vbW9vdG9vbHNcbiAgICAgICAgKTtcbiAgICAgICAgdmFyIGkgPSAwLCBqID0gZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uVHlwZWQpIHtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIGRpbWVuc2lvbiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXXxFbGVtZW50c3xqUXVlcnl9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgdmFyIFJlc2l6ZVNlbnNvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50UXVldWUoKSB7XG4gICAgICAgICAgICB2YXIgcSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5hZGQgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHEucHVzaChldik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgaSwgajtcbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSBxLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBxW2ldLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1F1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwLCBqID0gcS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocVtpXSAhPT0gZXYpIG5ld1F1ZXVlLnB1c2gocVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHEgPSBuZXdRdWV1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICBwcm9wXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd8TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBwcm9wKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jdXJyZW50U3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5jdXJyZW50U3R5bGVbcHJvcF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgcmVzaXplZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzaXplRXZlbnQoZWxlbWVudCwgcmVzaXplZCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkID0gbmV3IEV2ZW50UXVldWUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZC5hZGQocmVzaXplZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmNsYXNzTmFtZSA9ICdyZXNpemUtc2Vuc29yJztcbiAgICAgICAgICAgIHZhciBzdHlsZSA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IGhpZGRlbjsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xuICAgICAgICAgICAgdmFyIHN0eWxlQ2hpbGQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHRyYW5zaXRpb246IDBzOyc7XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLWV4cGFuZFwiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJ1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInJlc2l6ZS1zZW5zb3Itc2hyaW5rXCIgc3R5bGU9XCInICsgc3R5bGUgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwiJyArIHN0eWxlQ2hpbGQgKyAnIHdpZHRoOiAyMDAlOyBoZWlnaHQ6IDIwMCVcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudC5yZXNpemVTZW5zb3IpO1xuXG4gICAgICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAncG9zaXRpb24nKSA9PSAnc3RhdGljJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwYW5kID0gZWxlbWVudC5yZXNpemVTZW5zb3IuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRDaGlsZCA9IGV4cGFuZC5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgdmFyIHNocmluayA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMV07XG4gICAgICAgICAgICB2YXIgZGlydHksIHJhZklkLCBuZXdXaWR0aCwgbmV3SGVpZ2h0O1xuICAgICAgICAgICAgdmFyIGxhc3RXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB2YXIgbGFzdEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRDaGlsZC5zdHlsZS53aWR0aCA9ICcxMDAwMDBweCc7XG4gICAgICAgICAgICAgICAgZXhwYW5kQ2hpbGQuc3R5bGUuaGVpZ2h0ID0gJzEwMDAwMHB4JztcblxuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxMZWZ0ID0gMTAwMDAwO1xuICAgICAgICAgICAgICAgIGV4cGFuZC5zY3JvbGxUb3AgPSAxMDAwMDA7XG5cbiAgICAgICAgICAgICAgICBzaHJpbmsuc2Nyb2xsTGVmdCA9IDEwMDAwMDtcbiAgICAgICAgICAgICAgICBzaHJpbmsuc2Nyb2xsVG9wID0gMTAwMDAwO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzZXQoKTtcblxuICAgICAgICAgICAgdmFyIG9uUmVzaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJhZklkID0gMDtcblxuICAgICAgICAgICAgICAgIGlmICghZGlydHkpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGxhc3RXaWR0aCA9IG5ld1dpZHRoO1xuICAgICAgICAgICAgICAgIGxhc3RIZWlnaHQgPSBuZXdIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuY2FsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBvblNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICBkaXJ0eSA9IG5ld1dpZHRoICE9IGxhc3RXaWR0aCB8fCBuZXdIZWlnaHQgIT0gbGFzdEhlaWdodDtcblxuICAgICAgICAgICAgICAgIGlmIChkaXJ0eSAmJiAhcmFmSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUob25SZXNpemVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24oZWwsIG5hbWUsIGNiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBjYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYWRkRXZlbnQoZXhwYW5kLCAnc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgICAgICAgYWRkRXZlbnQoc2hyaW5rLCAnc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yRWFjaEVsZW1lbnQoZWxlbWVudCwgZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgICAgICBhdHRhY2hSZXNpemVFdmVudChlbGVtLCBjYWxsYmFjayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV0YWNoID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIFJlc2l6ZVNlbnNvci5kZXRhY2goZWxlbWVudCwgZXYpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBSZXNpemVTZW5zb3IuZGV0YWNoID0gZnVuY3Rpb24oZWxlbWVudCwgZXYpIHtcbiAgICAgICAgZm9yRWFjaEVsZW1lbnQoZWxlbWVudCwgZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgICAgICBpZihlbGVtLnJlc2l6ZWRBdHRhY2hlZCAmJiB0eXBlb2YgZXYgPT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgICAgICBlbGVtLnJlc2l6ZWRBdHRhY2hlZC5yZW1vdmUoZXYpO1xuICAgICAgICAgICAgICAgIGlmKGVsZW0ucmVzaXplZEF0dGFjaGVkLmxlbmd0aCgpKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZWxlbS5yZXNpemVTZW5zb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbS5jb250YWlucyhlbGVtLnJlc2l6ZVNlbnNvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVDaGlsZChlbGVtLnJlc2l6ZVNlbnNvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtLnJlc2l6ZVNlbnNvcjtcbiAgICAgICAgICAgICAgICBkZWxldGUgZWxlbS5yZXNpemVkQXR0YWNoZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVzaXplU2Vuc29yO1xuXG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWVsZW1lbnQtcXVlcmllcy9zcmMvUmVzaXplU2Vuc29yLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCB7IE1hc29uLCBNYXNvbk9wdGlvbnMgfSBmcm9tICcuL21hc29uJztcbmV4cG9ydCB7IE1hc29uRG9tUmVuZGVyZXIgfSBmcm9tICcuL21hc29uLWRvbS1yZW5kZXJlcic7XG5leHBvcnQgeyBNYXNvbkRlZmF1bHRQYWNrZXIgfSBmcm9tICcuL21hc29uLWRlZmF1bHQtcGFja2VyJztcbmV4cG9ydCB7IE1hc29uU2ltcGxlUGFja2VyIH0gZnJvbSAnLi9tYXNvbi1zaW1wbGUtcGFja2VyJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFJlc2l6ZVNlbnNvcjogcmVxdWlyZSgnLi9zcmMvUmVzaXplU2Vuc29yJyksXG4gICAgRWxlbWVudFF1ZXJpZXM6IHJlcXVpcmUoJy4vc3JjL0VsZW1lbnRRdWVyaWVzJylcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWVsZW1lbnQtcXVlcmllcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZWQgYnkgbWNrZW93ciBvbiAyLzMvMTcuXG4gKi9cbnZhciBNYXNvbkRvbVJlbmRlcmVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXNvbkRvbVJlbmRlcmVyKCkge1xuICAgIH1cbiAgICBNYXNvbkRvbVJlbmRlcmVyLnByb3RvdHlwZS5zZXRDb2x1bW5zID0gZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gY29sdW1ucztcbiAgICB9O1xuICAgIE1hc29uRG9tUmVuZGVyZXIucHJvdG90eXBlLmdldEVsZW1lbnRXaWR0aCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIH07XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuZ2V0RWxlbWVudEhlaWdodCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuICAgIE1hc29uRG9tUmVuZGVyZXIucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIGxlZnRJbkNvbHMsIHRvcEluVW5pdHMpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gKChsZWZ0SW5Db2xzIC8gdGhpcy5jb2x1bW5zKSAqIDEwMCkgKyAnJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gdG9wSW5Vbml0cyArICdweCc7XG4gICAgfTtcbiAgICByZXR1cm4gTWFzb25Eb21SZW5kZXJlcjtcbn0oKSk7XG5leHBvcnQgeyBNYXNvbkRvbVJlbmRlcmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNvbi1kb20tcmVuZGVyZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvbWFzb24tZG9tLXJlbmRlcmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogU2ltcGxlIHBhY2tlciB0aGF0IHBvc2l0aW9ucyBlYWNoIGJyaWNrIGluIHRoZSBuZXh0IGNvbHVtbi4gVGhpcyB3aWxsXG4gKiBmYWlsIHNwZWN0YWN1bGFybHkgd2l0aCBjb2x1bW5zIG9mIGRpZmZlcmVudCB3aWR0aHMuXG4gKi9cbnZhciBNYXNvblNpbXBsZVBhY2tlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFzb25TaW1wbGVQYWNrZXIoKSB7XG4gICAgfVxuICAgIE1hc29uU2ltcGxlUGFja2VyLnByb3RvdHlwZS5maW5kQmVzdENvbHVtbiA9IGZ1bmN0aW9uIChyZXF1aXJlZENvbHVtbnMsIGVsZW1lbnQsIGVsZW1lbnRJbmRleCwgY29sdW1uQm90dG9tcywgdGhyZXNob2xkKSB7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbG9vayBhdCBhbGwgdGhlIGNvbHVtbnMgYW5kIGZpbmQgdGhlIHdoaWNoIG9uZXNcbiAgICAgICAgLy8gdGhpcyB3b3VsZCBzaG91bGQgc3BhbiBiYXNlZCBvbiBwcmVzZW50aW5nIGl0IGFzIGNsb3NlIHRvIHRoZVxuICAgICAgICAvLyB0b3AgYXMgcG9zc2libGUuXG4gICAgICAgIHZhciBjb2x1bW5zID0gY29sdW1uQm90dG9tcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHQgPSBjb2x1bW5Cb3R0b21zLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIGNvbHVtbiwgaWR4LCBhbGwpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0aW5nIGF0IGNvbHVtbiBYLCBpZiB3ZSBwdXQgaXQgaGVyZSwgd2hhdCB3b3VsZCBiZVxuICAgICAgICAgICAgLy8gaXRzIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBpZiAoaWR4ICsgcmVxdWlyZWRDb2x1bW5zID4gY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goLTEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaGVpZ2h0IGF0IHdoaWNoIGl0IHdvdWxkIGhhdmUgdG8gYmUgcG9zaXRpb25lZFxuICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIG5vdCBvdmVybGFwIHNvbWV0aGluZ1xuICAgICAgICAgICAgICAgIHZhciB5UG9zID0gLTE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGlkeDsgaSA8IHJlcXVpcmVkQ29sdW1ucyArIGlkeDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHlQb3MgPSBNYXRoLm1heCh5UG9zLCBhbGxbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKHlQb3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgW10pO1xuICAgICAgICB2YXIgbmV4dENvbHVtbiA9IChyZXF1aXJlZENvbHVtbnMgKiBlbGVtZW50SW5kZXgpICUgY29sdW1ucztcbiAgICAgICAgdmFyIGJlc3RGaXQgPSB7IHhDb2x1bW5zOiBuZXh0Q29sdW1uLCB5VW5pdHM6IGNvbHVtbkJvdHRvbXNbbmV4dENvbHVtbl0sIGVsZW1lbnQ6IGVsZW1lbnQgfTtcbiAgICAgICAgcmV0dXJuIGJlc3RGaXQ7XG4gICAgfTtcbiAgICByZXR1cm4gTWFzb25TaW1wbGVQYWNrZXI7XG59KCkpO1xuZXhwb3J0IHsgTWFzb25TaW1wbGVQYWNrZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hc29uLXNpbXBsZS1wYWNrZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvbWFzb24tc2ltcGxlLXBhY2tlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBNYXNvbkRlZmF1bHRQYWNrZXIgfSBmcm9tIFwiLi9tYXNvbi1kZWZhdWx0LXBhY2tlclwiO1xudmFyIE1hc29uT3B0aW9ucyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFzb25PcHRpb25zKCkge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgdGhpcy50aHJlc2hvbGQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWFzb25PcHRpb25zO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uT3B0aW9ucyB9O1xudmFyIE1hc29uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXNvbihyZW5kZXJlck9yT3B0aW9ucywgY29udGFpbmVyV2lkdGgsIGNvbHVtbnMsIHRocmVzaG9sZCkge1xuICAgICAgICBpZiAoY29sdW1ucyA9PT0gdm9pZCAwKSB7IGNvbHVtbnMgPSAxMjsgfVxuICAgICAgICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHsgdGhyZXNob2xkID0gMDsgfVxuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgd2lnZ2xlIHJvb20gTWFzb24gaGFzIHdoZW4gY2hvb3NpbmcgYSBjb2x1bW4gZm9yIGEgYnJpY2tcbiAgICAgICAgLy8gV2hlbiBzdGFydGluZyBvbiB0aGUgbGVmdCwgTWFzb24gd2lsbCBvbmx5IGNvbnNpZGVyIGEgY29sdW1uIGNob29zZSBhcyBhIGJldHRlciBmaXRcbiAgICAgICAgLy8gaWYgaXQgaXMgYmV0dGVyIGJ5IHRoaXMgYW1vdW50IG9yIG1vcmUuIFRoaXMgcHJldmVudHMgYnJpY2tzIGZyb20gYmVpbmcgcGxhY2VkIHRvIHRoZVxuICAgICAgICB0aGlzLnRocmVzaG9sZCA9IDQwO1xuICAgICAgICB0aGlzLmNvbHVtbkJvdHRvbXMgPSBbXTtcbiAgICAgICAgaWYgKHJlbmRlcmVyT3JPcHRpb25zWydyZW5kZXJlciddKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IHJlbmRlcmVyT3JPcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IG9wdHMucmVuZGVyZXI7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gb3B0cy5jb250YWluZXJXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IG9wdHMuY29sdW1ucztcbiAgICAgICAgICAgIHRoaXMudGhyZXNob2xkID0gb3B0cy50aHJlc2hvbGQ7XG4gICAgICAgICAgICB0aGlzLnBhY2tlciA9IG9wdHMucGFja2VyIHx8IG5ldyBNYXNvbkRlZmF1bHRQYWNrZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlck9yT3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IGNvbHVtbnM7XG4gICAgICAgICAgICB0aGlzLnRocmVzaG9sZCA9IHRocmVzaG9sZDtcbiAgICAgICAgICAgIHRoaXMucGFja2VyID0gbmV3IE1hc29uRGVmYXVsdFBhY2tlcigpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0aGlzLmNvbHVtbkJvdHRvbXMubGVuZ3RoIDwgdGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkJvdHRvbXMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENvbHVtbnMoY29sdW1ucyk7XG4gICAgfVxuICAgIE1hc29uLnByb3RvdHlwZS5maW5kQmVzdENvbHVtbiA9IGZ1bmN0aW9uIChyZXF1aXJlZENvbHVtbnMsIGVsZW1lbnQsIGVsZW1lbnRJbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWNrZXIuZmluZEJlc3RDb2x1bW4ocmVxdWlyZWRDb2x1bW5zLCBlbGVtZW50LCBlbGVtZW50SW5kZXgsIHRoaXMuY29sdW1uQm90dG9tcywgdGhpcy50aHJlc2hvbGQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGVsZW1lbnRzIGFuZCByZXR1cm5zIHRoZSBuZXcgY29vcmRzIGZvciBlYWNoIG9uZS4gVGhpcyBkb2VzIG5vdCByZXBvc2l0aW9uIGFueXRoaW5nLlxuICAgICAqIFlvdSBtaWdodCB1c2UgdGhpcyBpZiB5b3Ugd2FudCB0byBoYW5kbGUgaG93IGFuZCB3aGVuIHRoaW5ncyBnZXQgcmVwb3NpdGlvbmVkLlxuICAgICAqXG4gICAgICogU2VlIGxheW91dCgpIGlmIHlvdSB3YW50IGV2ZXJ5dGhpbmcgcG9zaXRpb24gYXV0b21hdGljYWxseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50c1xuICAgICAqIEByZXR1cm5zIHtjb29yZHM6IE1hc29uQ29vcmRbXSwgdG90YWxIZWlnaHQ6IG51bWJlcn1cbiAgICAgKi9cbiAgICBNYXNvbi5wcm90b3R5cGUuZml0ID0gZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjb29yZHNMaXN0ID0gW107XG4gICAgICAgIHZhciB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGlkeCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IF90aGlzLnJlbmRlcmVyLmdldEVsZW1lbnRXaWR0aChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50SGVpZ2h0ID0gX3RoaXMucmVuZGVyZXIuZ2V0RWxlbWVudEhlaWdodChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBjb2xzID0gTWF0aC5yb3VuZCgoZWxlbWVudFdpZHRoIC8gX3RoaXMuY29udGFpbmVyV2lkdGgpICogX3RoaXMuY29sdW1ucyk7XG4gICAgICAgICAgICAvLyBjYW4ndCBiZSBiaWdnZXIgdGhhbiAnYWxsJyBjb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29scyA+IF90aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBjb2xzID0gX3RoaXMuY29sdW1ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiZXN0Rml0ID0gX3RoaXMuZmluZEJlc3RDb2x1bW4oY29scywgZWxlbWVudCwgaWR4KTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY29sdW1uIGJvdHRvbXMgZm9yIGFsbCB0aGUgY29sdW1ucyB0aGlzIHRpbGUgY3Jvc3NlcyB3aGVuIHBvc2l0aW9uZWQgYXQgdGhlIGJlc3RcbiAgICAgICAgICAgIC8vIGxvY2F0aW9uXG4gICAgICAgICAgICB2YXIgc3RhcnRDb2wgPSBiZXN0Rml0LnhDb2x1bW5zO1xuICAgICAgICAgICAgdmFyIGVuZENvbCA9IHN0YXJ0Q29sICsgY29scztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFydENvbDsgaSA8IGVuZENvbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY29sdW1uQm90dG9tc1tpXSA9IGJlc3RGaXQueVVuaXRzICsgZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMgaXMgYSB0dXBsZSB3aGVyZSB4IGlzIHRoZSBjb2x1bW4gaW5kZXggYW5kIHlQb3MgaXMgdGhlIHBpeGVsIGNvb3JkIHRvIHBvc2l0aW9uIGF0LlxuICAgICAgICAgICAgY29vcmRzTGlzdC5wdXNoKGJlc3RGaXQpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSB0b3RhbCBoZWlnaHRcbiAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gTWF0aC5tYXgodG90YWxIZWlnaHQsIGVsZW1lbnRIZWlnaHQgKyBiZXN0Rml0LnlVbml0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgY29vcmRpbmF0ZXMgZm9yIGVhY2ggdGlsZVxuICAgICAgICByZXR1cm4geyBjb29yZHM6IGNvb3Jkc0xpc3QsIHRvdGFsSGVpZ2h0OiB0b3RhbEhlaWdodCB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhpcyB3aWxsIHRha2UgdGhlIGxpc3Qgb2YgZWxlbWVudHMsIGZpbmQgdGhlaXIgbmV3IGxvY2F0aW9ucyBhbmQgdGhlbiB1c2UgdGhlIE1hc29uUmVuZGVyZXJcbiAgICAgKiB0byByZXBvc2l0aW9uIGFsbCB0aGUgYnJpY2tzIGludG8gdGhlaXIgbmV3IGhvbWUuXG4gICAgICogQHBhcmFtIGVsZW1lbnRzXG4gICAgICogQHJldHVybnMgdGhlIGhlaWdodCB0aGF0IHRoZSBjb250YWluZXIgbXVzdCBub3cgYmUgdG8gaG9sZCB0aGUgaXRlbXMuXG4gICAgICovXG4gICAgTWFzb24ucHJvdG90eXBlLmxheW91dCA9IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgbGF5b3V0UmVzdWx0ID0gdGhpcy5maXQoZWxlbWVudHMpO1xuICAgICAgICBsYXlvdXRSZXN1bHQuY29vcmRzLmZvckVhY2goZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgICAgICAvLyBhcHBseSB0aGUgY2FsY3VsYXRlZCBwb3NpdGlvbiBmb3IgZWFjaCBicmljayBob3dldmVyIHlvdSB3YW50LiBJbiB0aGlzIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIGFyZSBqdXN0IHNldHRpbmcgdGhlIENTUyBwb3NpdGlvbi4gQW5pbWF0aW9uIHdpbGwgYmUgcHJvdmlkZWQgdmlhIENTU1xuICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIuc2V0UG9zaXRpb24oY29vcmQuZWxlbWVudCwgY29vcmQueENvbHVtbnMsIGNvb3JkLnlVbml0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGF5b3V0UmVzdWx0LnRvdGFsSGVpZ2h0O1xuICAgIH07XG4gICAgcmV0dXJuIE1hc29uO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uIH07XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNvbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9tYXNvbi5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWycuL1Jlc2l6ZVNlbnNvci5qcyddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCcuL1Jlc2l6ZVNlbnNvci5qcycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkVsZW1lbnRRdWVyaWVzID0gZmFjdG9yeShyb290LlJlc2l6ZVNlbnNvcik7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoUmVzaXplU2Vuc29yKSB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICB2YXIgRWxlbWVudFF1ZXJpZXMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdHJhY2tpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRFbVNpemUoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmZvbnRTaXplO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZm9udFNpemUpIHx8IDE2O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBjb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL01yMGdyb2cvZWxlbWVudC1xdWVyeS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNvbnZlcnRUb1B4KGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVycyA9IHZhbHVlLnNwbGl0KC9cXGQvKTtcbiAgICAgICAgICAgIHZhciB1bml0cyA9IG51bWJlcnNbbnVtYmVycy5sZW5ndGgtMV07XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVtXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGdldEVtU2l6ZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBjYXNlIFwicmVtXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGdldEVtU2l6ZSgpO1xuICAgICAgICAgICAgICAgIC8vIFZpZXdwb3J0IHVuaXRzIVxuICAgICAgICAgICAgICAgIC8vIEFjY29yZGluZyB0byBodHRwOi8vcXVpcmtzbW9kZS5vcmcvbW9iaWxlL3RhYmxlVmlld3BvcnQuaHRtbFxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aC9IZWlnaHQgZ2V0cyB1cyB0aGUgbW9zdCByZWxpYWJsZSBpbmZvXG4gICAgICAgICAgICAgICAgY2FzZSBcInZ3XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAqIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDEwMDtcbiAgICAgICAgICAgICAgICBjYXNlIFwidmhcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDEwMDtcbiAgICAgICAgICAgICAgICBjYXNlIFwidm1pblwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ2bWF4XCI6XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNob29zZXIgPSBNYXRoW3VuaXRzID09PSBcInZtaW5cIiA/IFwibWluXCIgOiBcIm1heFwiXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogY2hvb3Nlcih2dywgdmgpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBmb3Igbm93LCBub3Qgc3VwcG9ydGluZyBwaHlzaWNhbCB1bml0cyAoc2luY2UgdGhleSBhcmUganVzdCBhIHNldCBudW1iZXIgb2YgcHgpXG4gICAgICAgICAgICAgICAgLy8gb3IgZXgvY2ggKGdldHRpbmcgYWNjdXJhdGUgbWVhc3VyZW1lbnRzIGlzIGhhcmQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIFNldHVwSW5mb3JtYXRpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgdmFyIGtleSwgb3B0aW9uLCB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIHZhbHVlLCBhY3R1YWxWYWx1ZSwgYXR0clZhbHVlcywgYXR0clZhbHVlLCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIHttb2RlOiAnbWlufG1heCcsIHByb3BlcnR5OiAnd2lkdGh8aGVpZ2h0JywgdmFsdWU6ICcxMjNweCd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IFtvcHRpb24ubW9kZSwgb3B0aW9uLnByb3BlcnR5LCBvcHRpb24udmFsdWVdLmpvaW4oJywnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbaWR4XSA9IG9wdGlvbjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gWydtaW4td2lkdGgnLCAnbWluLWhlaWdodCcsICdtYXgtd2lkdGgnLCAnbWF4LWhlaWdodCddO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dHJhY3RzIHRoZSBjb21wdXRlZCB3aWR0aC9oZWlnaHQgYW5kIHNldHMgdG8gbWluL21heC0gYXR0cmlidXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBleHRyYWN0IGN1cnJlbnQgZGltZW5zaW9uc1xuICAgICAgICAgICAgICAgIHdpZHRoID0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBhdHRyVmFsdWVzID0ge307XG5cbiAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSB0aGlzLm9wdGlvbnNba2V5XTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnZlcnRUb1B4KHRoaXMuZWxlbWVudCwgb3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhY3R1YWxWYWx1ZSA9IG9wdGlvbi5wcm9wZXJ0eSA9PSAnd2lkdGgnID8gd2lkdGggOiBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gb3B0aW9uLm1vZGUgKyAnLScgKyBvcHRpb24ucHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubW9kZSA9PSAnbWluJyAmJiBhY3R1YWxWYWx1ZSA+PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlICs9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubW9kZSA9PSAnbWF4JyAmJiBhY3R1YWxWYWx1ZSA8PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlICs9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXR0clZhbHVlc1thdHRyTmFtZV0pIGF0dHJWYWx1ZXNbYXR0ck5hbWVdID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyVmFsdWUgJiYgLTEgPT09ICgnICcrYXR0clZhbHVlc1thdHRyTmFtZV0rJyAnKS5pbmRleE9mKCcgJyArIGF0dHJWYWx1ZSArICcgJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJWYWx1ZXNbYXR0ck5hbWVdICs9ICcgJyArIGF0dHJWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBpZighYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZXNbYXR0cmlidXRlc1trXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlc1trXSwgYXR0clZhbHVlc1thdHRyaWJ1dGVzW2tdXS5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgICBvcHRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uYWRkT3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbiA9IG5ldyBTZXR1cEluZm9ybWF0aW9uKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uLmFkZE9wdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcihlbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uY2FsbCgpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdBY3RpdmUgJiYgZWxlbWVudHMuaW5kZXhPZihlbGVtZW50KSA8IDApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBtaW58bWF4XG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSB3aWR0aHxoZWlnaHRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgYWxsUXVlcmllcyA9IHt9O1xuICAgICAgICBmdW5jdGlvbiBxdWV1ZVF1ZXJ5KHNlbGVjdG9yLCBtb2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoYWxsUXVlcmllc1ttb2RlXSkgPT0gJ3VuZGVmaW5lZCcpIGFsbFF1ZXJpZXNbbW9kZV0gPSB7fTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0pID09ICd1bmRlZmluZWQnKSBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XSA9IHt9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZihhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0pID09ICd1bmRlZmluZWQnKSBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0gPSBzZWxlY3RvcjtcbiAgICAgICAgICAgIGVsc2UgYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV1bdmFsdWVdICs9ICcsJytzZWxlY3RvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFF1ZXJ5KCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5O1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwpIHF1ZXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbC5iaW5kKGRvY3VtZW50KTtcbiAgICAgICAgICAgIGlmICghcXVlcnkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiAkJCkgcXVlcnkgPSAkJDtcbiAgICAgICAgICAgIGlmICghcXVlcnkgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkpIHF1ZXJ5ID0galF1ZXJ5O1xuXG4gICAgICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ05vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwsIGpRdWVyeSBvciBNb290b29sc1xcJ3MgJCQgZm91bmQuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0YXJ0IHRoZSBtYWdpYy4gR28gdGhyb3VnaCBhbGwgY29sbGVjdGVkIHJ1bGVzIChyZWFkUnVsZXMoKSkgYW5kIGF0dGFjaCB0aGUgcmVzaXplLWxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZmluZEVsZW1lbnRRdWVyaWVzRWxlbWVudHMoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBnZXRRdWVyeSgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBtb2RlIGluIGFsbFF1ZXJpZXMpIGlmIChhbGxRdWVyaWVzLmhhc093blByb3BlcnR5KG1vZGUpKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhbGxRdWVyaWVzW21vZGVdKSBpZiAoYWxsUXVlcmllc1ttb2RlXS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdmFsdWUgaW4gYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV0pIGlmIChhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHF1ZXJ5KGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldW3ZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHVwRWxlbWVudChlbGVtZW50c1tpXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoUmVzcG9uc2l2ZUltYWdlKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgdmFyIHJ1bGVzID0gW107XG4gICAgICAgICAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRJbWFnZUlkID0gMDtcbiAgICAgICAgICAgIHZhciBsYXN0QWN0aXZlSW1hZ2UgPSAtMTtcbiAgICAgICAgICAgIHZhciBsb2FkZWRJbWFnZXMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBlbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYoIWVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5baV0udGFnTmFtZSAmJiBlbGVtZW50LmNoaWxkcmVuW2ldLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChlbGVtZW50LmNoaWxkcmVuW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWluV2lkdGggPSBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnbWluLXdpZHRoJykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWluLXdpZHRoJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIG1pbkhlaWdodCA9IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdtaW4taGVpZ2h0JykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWluLWhlaWdodCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3JjID0gZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykgfHwgZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ3VybCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaChzcmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IG1pbldpZHRoXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcnVsZXMucHVzaChydWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0SW1hZ2VJZCA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbltpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0QWN0aXZlSW1hZ2UgPSBkZWZhdWx0SW1hZ2VJZDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlVG9EaXNwbGF5ID0gZmFsc2UsIGk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gY2hpbGRyZW4pe1xuICAgICAgICAgICAgICAgICAgICBpZighY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlc1tpXS5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiBydWxlc1tpXS5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlVG9EaXNwbGF5ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaW1hZ2VUb0Rpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9ubyBydWxlIG1hdGNoZWQsIHNob3cgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICBpbWFnZVRvRGlzcGxheSA9IGRlZmF1bHRJbWFnZUlkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsYXN0QWN0aXZlSW1hZ2UgIT0gaW1hZ2VUb0Rpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9pbWFnZSBjaGFuZ2VcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvYWRlZEltYWdlc1tpbWFnZVRvRGlzcGxheV0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbWFnZSBoYXMgbm90IGJlZW4gbG9hZGVkIHlldCwgd2UgbmVlZCB0byBsb2FkIHRoZSBpbWFnZSBmaXJzdCBpbiBtZW1vcnkgdG8gcHJldmVudCBmbGFzaCBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ubyBjb250ZW50XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baW1hZ2VUb0Rpc3BsYXldLnNyYyA9IHNvdXJjZXNbaW1hZ2VUb0Rpc3BsYXldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bbGFzdEFjdGl2ZUltYWdlXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZEltYWdlc1tpbWFnZVRvRGlzcGxheV0gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEFjdGl2ZUltYWdlID0gaW1hZ2VUb0Rpc3BsYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBzb3VyY2VzW2ltYWdlVG9EaXNwbGF5XTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2xhc3RBY3RpdmVJbWFnZV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RBY3RpdmVJbWFnZSA9IGltYWdlVG9EaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9tYWtlIHN1cmUgZm9yIGluaXRpYWwgY2hlY2sgY2FsbCB0aGUgLnNyYyBpcyBzZXQgY29ycmVjdGx5XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ltYWdlVG9EaXNwbGF5XS5zcmMgPSBzb3VyY2VzW2ltYWdlVG9EaXNwbGF5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gbmV3IFJlc2l6ZVNlbnNvcihlbGVtZW50LCBjaGVjayk7XG4gICAgICAgICAgICBjaGVjaygpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZFJlc3BvbnNpdmVJbWFnZXMoKXtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGdldFF1ZXJ5KCk7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHF1ZXJ5KCdbZGF0YS1yZXNwb25zaXZlLWltYWdlXSxbcmVzcG9uc2l2ZS1pbWFnZV0nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXR0YWNoUmVzcG9uc2l2ZUltYWdlKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWdleCA9IC8sP1tcXHNcXHRdKihbXixcXG5dKj8pKCg/OlxcW1tcXHNcXHRdKj8oPzptaW58bWF4KS0oPzp3aWR0aHxoZWlnaHQpW1xcc1xcdF0qP1t+JFxcXl0/PVtcXHNcXHRdKj9cIlteXCJdKj9cIltcXHNcXHRdKj9dKSspKFteLFxcblxcc1xce10qKS9tZ2k7XG4gICAgICAgIHZhciBhdHRyUmVnZXggPSAvXFxbW1xcc1xcdF0qPyhtaW58bWF4KS0od2lkdGh8aGVpZ2h0KVtcXHNcXHRdKj9bfiRcXF5dPz1bXFxzXFx0XSo/XCIoW15cIl0qPylcIltcXHNcXHRdKj9dL21naTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RRdWVyeShjc3MpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgICAgIHZhciBzbWF0Y2g7XG4gICAgICAgICAgICBjc3MgPSBjc3MucmVwbGFjZSgvJy9nLCAnXCInKTtcbiAgICAgICAgICAgIHdoaWxlIChudWxsICE9PSAobWF0Y2ggPSByZWdleC5leGVjKGNzcykpKSB7XG4gICAgICAgICAgICAgICAgc21hdGNoID0gbWF0Y2hbMV0gKyBtYXRjaFszXTtcbiAgICAgICAgICAgICAgICBhdHRycyA9IG1hdGNoWzJdO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKG51bGwgIT09IChhdHRyTWF0Y2ggPSBhdHRyUmVnZXguZXhlYyhhdHRycykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlUXVlcnkoc21hdGNoLCBhdHRyTWF0Y2hbMV0sIGF0dHJNYXRjaFsyXSwgYXR0ck1hdGNoWzNdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtDc3NSdWxlW118U3RyaW5nfSBydWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVhZFJ1bGVzKHJ1bGVzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSAnJztcbiAgICAgICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBydWxlcykge1xuICAgICAgICAgICAgICAgIHJ1bGVzID0gcnVsZXMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHJ1bGVzLmluZGV4T2YoJ21pbi13aWR0aCcpIHx8IC0xICE9PSBydWxlcy5pbmRleE9mKCdtYXgtd2lkdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkocnVsZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBydWxlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gcnVsZXNbaV0uc2VsZWN0b3JUZXh0IHx8IHJ1bGVzW2ldLmNzc1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21pbi1oZWlnaHQnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LWhlaWdodCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFF1ZXJ5KHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtaW4td2lkdGgnKSB8fCAtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWF4LXdpZHRoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKDQgPT09IHJ1bGVzW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhydWxlc1tpXS5jc3NSdWxlcyB8fCBydWxlc1tpXS5ydWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdENzc0luamVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlYXJjaGVzIGFsbCBjc3MgcnVsZXMgYW5kIHNldHVwcyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gYWxsIGVsZW1lbnRzIHdpdGggZWxlbWVudCBxdWVyeSBydWxlcy4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdHJhY2tpbmdBY3RpdmUgPSB0eXBlb2Ygd2l0aFRyYWNraW5nID09PSAndW5kZWZpbmVkJyA/IGZhbHNlIDogd2l0aFRyYWNraW5nO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSdWxlcyhkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NSdWxlcyB8fCBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5ydWxlcyB8fCBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NUZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUubmFtZSAhPT0gJ1NlY3VyaXR5RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRlZmF1bHRDc3NJbmplY3RlZCkge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJ1tyZXNwb25zaXZlLWltYWdlXSA+IGltZywgW2RhdGEtcmVzcG9uc2l2ZS1pbWFnZV0ge292ZXJmbG93OiBoaWRkZW47IHBhZGRpbmc6IDA7IH0gW3Jlc3BvbnNpdmUtaW1hZ2VdID4gaW1nLCBbZGF0YS1yZXNwb25zaXZlLWltYWdlXSA+IGltZyB7IHdpZHRoOiAxMDAlO30nO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRDc3NJbmplY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbmRFbGVtZW50UXVlcmllc0VsZW1lbnRzKCk7XG4gICAgICAgICAgICBmaW5kUmVzcG9uc2l2ZUltYWdlcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChubyBnYXJiYWdlIGNvbGxlY3Rpb24gcG9zc2libGUgaWYgeW91IGRvbiBub3QgY2FsbCAuZGV0YWNoKCkgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICAgICAgdGhpcy5pbml0KHdpdGhUcmFja2luZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXRhY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy53aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnd2l0aFRyYWNraW5nIGlzIG5vdCBlbmFibGVkLiBXZSBjYW4gbm90IGRldGFjaCBlbGVtZW50cyBzaW5jZSB3ZSBkb24gbm90IHN0b3JlIGl0LicgK1xuICAgICAgICAgICAgICAgICdVc2UgRWxlbWVudFF1ZXJpZXMud2l0aFRyYWNraW5nID0gdHJ1ZTsgYmVmb3JlIGRvbXJlYWR5IG9yIGNhbGwgRWxlbWVudFF1ZXJ5ZXMudXBkYXRlKHRydWUpLic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50cy5wb3AoKSkge1xuICAgICAgICAgICAgICAgIEVsZW1lbnRRdWVyaWVzLmRldGFjaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudHMgPSBbXTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdpdGhUcmFja2luZyBhbGxvd3MgYW5kIHJlcXVpcmVzIHlvdSB0byB1c2UgZGV0YWNoLCBzaW5jZSB3ZSBzdG9yZSBpbnRlcm5hbGx5IGFsbCB1c2VkIGVsZW1lbnRzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgKi9cbiAgICBFbGVtZW50UXVlcmllcy51cGRhdGUgPSBmdW5jdGlvbih3aXRoVHJhY2tpbmcpIHtcbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UudXBkYXRlKHdpdGhUcmFja2luZyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHNlbnNvciBhbmQgZWxlbWVudHF1ZXJ5IGluZm9ybWF0aW9uIGZyb20gdGhlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgRWxlbWVudFF1ZXJpZXMuZGV0YWNoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24pIHtcbiAgICAgICAgICAgIC8vZWxlbWVudCBxdWVyaWVzXG4gICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2Vuc29yLmRldGFjaCgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZW5zb3I7XG5cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZVNlbnNvcikge1xuICAgICAgICAgICAgLy9yZXNwb25zaXZlIGltYWdlXG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yLmRldGFjaCgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQucmVzaXplU2Vuc29yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZGV0YWNoZWQgYWxyZWFkeScsIGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgRWxlbWVudFF1ZXJpZXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIUVsZW1lbnRRdWVyaWVzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZSA9IG5ldyBFbGVtZW50UXVlcmllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UuaW5pdChFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcpO1xuICAgIH07XG5cbiAgICB2YXIgZG9tTG9hZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIC8qIEludGVybmV0IEV4cGxvcmVyICovXG4gICAgICAgIC8qQGNjX29uXG4gICAgICAgICBAaWYgKEBfd2luMzIgfHwgQF93aW42NClcbiAgICAgICAgIGRvY3VtZW50LndyaXRlKCc8c2NyaXB0IGlkPVwiaWVTY3JpcHRMb2FkXCIgZGVmZXIgc3JjPVwiLy86XCI+PFxcL3NjcmlwdD4nKTtcbiAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZVNjcmlwdExvYWQnKS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgIH1cbiAgICAgICAgIH07XG4gICAgICAgICBAZW5kIEAqL1xuICAgICAgICAvKiBNb3ppbGxhLCBDaHJvbWUsIE9wZXJhICovXG4gICAgICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBTYWZhcmksIGlDYWIsIEtvbnF1ZXJvciAqL1xuICAgICAgICBlbHNlIGlmICgvS0hUTUx8V2ViS2l0fGlDYWIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICB2YXIgRE9NTG9hZFRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgvbG9hZGVkfGNvbXBsZXRlL2kudGVzdChkb2N1bWVudC5yZWFkeVN0YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKERPTUxvYWRUaW1lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIC8qIE90aGVyIHdlYiBicm93c2VycyAqL1xuICAgICAgICBlbHNlIHdpbmRvdy5vbmxvYWQgPSBjYWxsYmFjaztcbiAgICB9O1xuXG4gICAgRWxlbWVudFF1ZXJpZXMubGlzdGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvbUxvYWRlZChFbGVtZW50UXVlcmllcy5pbml0KTtcbiAgICB9O1xuXG4gICAgLy8gbWFrZSBhdmFpbGFibGUgdG8gY29tbW9uIG1vZHVsZSBsb2FkZXJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRRdWVyaWVzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2luZG93LkVsZW1lbnRRdWVyaWVzID0gRWxlbWVudFF1ZXJpZXM7XG4gICAgICAgIEVsZW1lbnRRdWVyaWVzLmxpc3RlbigpO1xuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50UXVlcmllcztcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL0VsZW1lbnRRdWVyaWVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlZCBieSBtY2tlb3dyIG9uIDIvMi8xNy5cbiAqL1xuaW1wb3J0IHtNYXNvbiwgTWFzb25Eb21SZW5kZXJlcn0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7UmVzaXplU2Vuc29yfSBmcm9tICdjc3MtZWxlbWVudC1xdWVyaWVzJztcblxuZnVuY3Rpb24gcGFjaygpIHtcblxuICAgICAgICAvLyBmaW5kIG91ciBjb250YWluZXJcbiAgICAgICAgdmFyIGRhc2hib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXNvbi1jb250YWluZXInKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lcldpZHRoID0gZGFzaGJvYXJkLm9mZnNldFdpZHRoO1xuICAgICAgICAvLyBmaW5kIGFsbCB0aGUgYnJpY2tzIGluIGl0XG4gICAgICAgIC8vIG5vdCBhbGwgYnJvd3NlcnMgYXJlIGFibGUgdG8gdHJlYXQgdGhlIHJlc3VsdHMgZnJvbSBxdWVyeVNlbGVjdG9yQWxsIHdpdGggYXJyYXkgbWV0aG9kcyBsaWtlIGZvckVhY2goKVxuICAgICAgICAvLyBzbyB0aGlzIHdpbGwgbWFrZSB0aGVuIGFuIGFycmF5XG4gICAgICAgIHZhciBpdGVtcyA9IFtdLnNsaWNlLmNhbGwoZGFzaGJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5tYXNvbi1icmljaycpKTtcblxuICAgICAgICAvLyBjcmVhdGUgYSBNYXNvbiBhbmQgdXNlIGl0IHRvIGZpdCB0aGUgYnJpY2tzIGludG8gYSBjb250YWluZXJcbiAgICAgICAgLy8gdGhlIHNpemUgb2YgdGhlICdkYXNoYm9hcmQnXG4gICAgICAgIC8vIHNpbmNlIHdlIGFyZSBkZWFsaW5nIHdpdGggZG9tIG5vZGVzLCB3ZSBuZWVkIHRoZSBNYXNvbkRvbVJlbmRlcmVyXG4gICAgICAgIHZhciByZW5kZXJlciA9IG5ldyBNYXNvbkRvbVJlbmRlcmVyKCk7XG5cbiAgICAgICAgdmFyIG9wdHMgPSB7IC8vIE1hc29uT3B0aW9ucyBvYmplY3QgaGVyZVxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGg6IGNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgcmVuZGVyZXI6IHJlbmRlcmVyLFxuICAgICAgICAgICAgLy8gdGhpcyB0aHJlc2hvbGQgc2lnbmlmaWVzIHRoYXQgZXZlbiBpZiBhIGNvbHVtbiB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIC8vIHdvdWxkIHBvc3Rpb24gdGhlIHRpbGUgY2xvc2VyIHRvIHRoZSB0b3AsIGl0IHdpbGwgcHJlZmVyXG4gICAgICAgICAgICAvLyBhIGNvbHVtbiB0byB0aGUgbGVmdCBpZiB0aGUgZGlmZmVyZW5jZSBpcyBsZXNzIHRoYW4gdGhpc1xuICAgICAgICAgICAgLy8gbWFueSBwaXhlbHMuIE1ha2UgdGhpcyAwIGFuZCBjaGVjayB0aGUgZGVtbyBhbmQgeW91IHdpbGxcbiAgICAgICAgICAgIC8vIHNlZSB0aGUgZGlmZmVyZW5jZSBpbiBwb3NpdGlvbiBvZiBicmlja3MgNSBhbmQgNiBhZnRlciB0aGVcbiAgICAgICAgICAgIC8vIHNob3cgbW9yZSBidXR0b24gaXMgY2xpY2tlZCBpbiBicmljayAxXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IDQwLFxuICAgICAgICAgICAgY29sdW1uczogMTJcbiAgICAgICAgICAgIC8vIGltcGxlbWVudCB5b3VyIG93biBwYWNraW5nIGxvZ2ljXG4gICAgICAgICAgICAvLyBmb3JtIGV4YW1wbGUsIGltcG9ydCBNYXNvblNpbXBsZVBhY2tlciBhbmQgdHJ5IHRoYXRcbiAgICAgICAgICAgIC8vIHBhY2tlcjogbmV3IE1hc29uU2ltcGxlUGFja2VyKClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gbmV3IE1hc29uKG9wdHMpLmxheW91dChpdGVtcyk7XG4gICAgICAgIGRhc2hib2FyZC5zdHlsZS5taW5IZWlnaHQgPSBjb250YWluZXJIZWlnaHQgKyAncHgnO1xuXG59XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIC8vIGluaXRpYWxpemUgdGhlIGxheW91dFxuICAgIHBhY2soKTtcblxuICAgIC8vIGluIG91ciBjYXNlLCB3ZSB3YW50IHRvIHJlIGxheW91dCB0aGUgYnJpY2tzIHdoZW4gYW55IG9mIHRoZWlyIHNpemVzIGNoYW5nZS5cbiAgICAvLyBpZiB0aGUgYnJpY2tzIHNpemVzIGNhbiBvbmx5IGNoYW5nZSB3aGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplZCwgeW91IGNvdWxkIHVzZSB0aGVcbiAgICAvLyB3aW5kb3cgcmVzaXplIGV2ZW50LiBIb3dldmVyLCBpZiB0aGUgYnJpY2tzIGNhbiByZXNpemUgdGhlbXNlbHZlcywgeW91IHdvdWxkIHdhbnQgdG8gZG8gc29tZXRoaW5nXG4gICAgLy8gbGlrZSB0aGlzXG4gICAgLy8gUmVzaXplU2Vuc29yIGlzIGZyb20gY3NzLWVsZW1lbnQtcXVlcmllcyAod2hpY2ggaXMgbGlzdGVkIGFzIGFuIG9wdGlvbmFsIGRlcGVuZGVuY3kpO1xuICAgIG5ldyBSZXNpemVTZW5zb3IoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hc29uLWNvbnRhaW5lcicpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5tYXNvbi1icmljaycpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFjaygpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJykucXVlcnlTZWxlY3RvcignYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICBzaG93TW9yZSgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZXNldEhlaWdodCgpIHtcbiAgICB2YXIgZmlyc3RUaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJyk7XG4gICAgZmlyc3RUaWxlLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICBmaXJzdFRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHJlc2V0SGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gc2hvd01vcmUoKSB7XG4gICAgdmFyIGZpcnN0VGlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlRXhhbXBsZScpO1xuXG4gICAgaWYgKGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgIT09ICc0MDBweCcpIHtcbiAgICAgICAgdmFyIGF1dG9IZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmaXJzdFRpbGUsIG51bGwpLmhlaWdodDtcbiAgICAgICAgZmlyc3RUaWxlLnNldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWhlaWdodCcsIGF1dG9IZWlnaHQpO1xuICAgICAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gYXV0b0hlaWdodDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgPSAnNDAwcHgnO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gZmlyc3RUaWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1hdXRvLWhlaWdodCcpO1xuICAgICAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gdGFyZ2V0SGVpZ2h0O1xuICAgICAgICBmaXJzdFRpbGUuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHJlc2V0SGVpZ2h0KTtcbiAgICB9XG59XG5cbnN0YXJ0KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9kZW1vL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
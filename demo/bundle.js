/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
var MasonDefaultPacker = /** @class */ (function () {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mason__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__mason__["a"]; });
/* unused harmony reexport MasonOptions */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__mason_dom_renderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mason_default_packer__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__mason_default_packer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mason_simple_packer__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__mason_simple_packer__["a"]; });




//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    ResizeSensor: __webpack_require__(1),
    ElementQueries: __webpack_require__(8)
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_css_element_queries__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_css_element_queries___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_css_element_queries__);
/**
 * Created by mckeowr on 2/2/17.
 */



var useSimplePacker = false;
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
            columns: 12,
            // implement your own packing logic
            // form example, import MasonSimplePacker and try that
            packer: useSimplePacker ? new __WEBPACK_IMPORTED_MODULE_0__lib__["b" /* MasonSimplePacker */]() : new __WEBPACK_IMPORTED_MODULE_0__lib__["c" /* MasonDefaultPacker */]()
        };

        var containerHeight = new __WEBPACK_IMPORTED_MODULE_0__lib__["d" /* Mason */](opts).layout(items);
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

    document.getElementById('useSimple').addEventListener('change', togglePacker);
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

function togglePacker(evt) {
    useSimplePacker = evt.target.checked;
    pack();  
}

start();

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MasonDomRenderer; });
/**
 * Created by mckeowr on 2/3/17.
 */
var MasonDomRenderer = /** @class */ (function () {
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MasonSimplePacker; });
/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
var MasonSimplePacker = /** @class */ (function () {
    function MasonSimplePacker() {
    }
    MasonSimplePacker.prototype.findBestColumn = function (requiredColumns, element, elementIndex, columnBottoms, threshold) {
        // This packer simply figures out which column it should
        // go in based on the element index and assumes that all
        // elements are require the same number of columns
        var columns = columnBottoms.length;
        var nextColumn = (requiredColumns * elementIndex) % columns;
        return { xColumns: nextColumn, yUnits: columnBottoms[nextColumn], element: element };
    };
    return MasonSimplePacker;
}());

//# sourceMappingURL=mason-simple-packer.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MasonOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Mason; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mason_default_packer__ = __webpack_require__(0);

var MasonOptions = /** @class */ (function () {
    function MasonOptions() {
        this.columns = 12;
        this.threshold = 0;
    }
    return MasonOptions;
}());

var Mason = /** @class */ (function () {
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
/* 8 */
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2Y4OGFmMTliNTc0N2Y2MzI2MzQiLCJ3ZWJwYWNrOi8vLy4vbGliL21hc29uLWRlZmF1bHQtcGFja2VyLmpzIiwid2VicGFjazovLy8uL34vY3NzLWVsZW1lbnQtcXVlcmllcy9zcmMvUmVzaXplU2Vuc29yLmpzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vZGVtby9tYWluLmpzIiwid2VicGFjazovLy8uL2xpYi9tYXNvbi1kb20tcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hc29uLXNpbXBsZS1wYWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hc29uLmpzIiwid2VicGFjazovLy8uL34vY3NzLWVsZW1lbnQtcXVlcmllcy9zcmMvRWxlbWVudFF1ZXJpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVztBQUNBOztBQUVBLFE7Ozs7Ozs7QUMzRkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNPO0FBQ1IsOEM7Ozs7Ozs7QUN0QkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsQ0FBQztBQUNPO0FBQ1IsK0M7Ozs7Ozs7Ozs7QUNsQjZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDTztBQUNSO0FBQ0E7QUFDQSxpQ0FBaUMsY0FBYztBQUMvQyxtQ0FBbUMsZUFBZTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNUOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQyIsImZpbGUiOiIuL2RlbW8vYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZjg4YWYxOWI1NzQ3ZjYzMjYzNCIsIi8qKlxuICogRGVmYXVsdCBwYWNrZXIgdXNlZCB0byBwb3NpdGlvbiBlYWNoIGJyaWNrIGFzIGNsb3NlIHRvIHRoZSB0b3AgYXMgcG9zc2libGVcbiAqL1xudmFyIE1hc29uRGVmYXVsdFBhY2tlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXNvbkRlZmF1bHRQYWNrZXIoKSB7XG4gICAgfVxuICAgIE1hc29uRGVmYXVsdFBhY2tlci5wcm90b3R5cGUuZmluZEJlc3RDb2x1bW4gPSBmdW5jdGlvbiAocmVxdWlyZWRDb2x1bW5zLCBlbGVtZW50LCBlbGVtZW50SW5kZXgsIGNvbHVtbkJvdHRvbXMsIHRocmVzaG9sZCkge1xuICAgICAgICAvLyB3ZSBuZWVkIHRvIGxvb2sgYXQgYWxsIHRoZSBjb2x1bW5zIGFuZCBmaW5kIHRoZSB3aGljaCBvbmVzXG4gICAgICAgIC8vIHRoaXMgd291bGQgc2hvdWxkIHNwYW4gYmFzZWQgb24gcHJlc2VudGluZyBpdCBhcyBjbG9zZSB0byB0aGVcbiAgICAgICAgLy8gdG9wIGFzIHBvc3NpYmxlLlxuICAgICAgICB2YXIgY29sdW1ucyA9IGNvbHVtbkJvdHRvbXMubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0ID0gY29sdW1uQm90dG9tcy5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBjb2x1bW4sIGlkeCwgYWxsKSB7XG4gICAgICAgICAgICAvLyBzdGFydGluZyBhdCBjb2x1bW4gWCwgaWYgd2UgcHV0IGl0IGhlcmUsIHdoYXQgd291bGQgYmVcbiAgICAgICAgICAgIC8vIGl0cyBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgaWYgKGlkeCArIHJlcXVpcmVkQ29sdW1ucyA+IGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBhY2N1bXVsYXRvci5wdXNoKC0xKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGhlaWdodCBhdCB3aGljaCBpdCB3b3VsZCBoYXZlIHRvIGJlIHBvc2l0aW9uZWRcbiAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciB0byBub3Qgb3ZlcmxhcCBzb21ldGhpbmdcbiAgICAgICAgICAgICAgICB2YXIgeVBvcyA9IC0xO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBpZHg7IGkgPCByZXF1aXJlZENvbHVtbnMgKyBpZHg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB5UG9zID0gTWF0aC5tYXgoeVBvcywgYWxsW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWNjdW11bGF0b3IucHVzaCh5UG9zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIFtdKTtcbiAgICAgICAgLy8gbm93IHRoZSB3ZSBoYXZlIHRoZSB5IGNvb3JkIHRoYXQgaXQgd291bGQgbmVlZCB0byBiZSBhdCBmb3IgZWFjaCBzdGFydGluZyBjb2x1bW5cbiAgICAgICAgLy8gd2UganVzdCBuZWVkIHRvIGZpZ3VyZSBvdXQgd2hpY2ggb25lIGlzIGxvd2VzdCAod2hpbGUgdGFraW5nIGludG8gYWNjb3VudCB0aGUgdGhyZXNob2xkKVxuICAgICAgICAvLyBhbmQgd2UncmUgZG9uZVxuICAgICAgICB2YXIgYmVzdEZpdCA9IHJlc3VsdC5yZWR1Y2UoZnVuY3Rpb24gKGJlc3QsIGN1cnIsIGlkeCkge1xuICAgICAgICAgICAgaWYgKCFiZXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgeENvbHVtbnM6IGlkeCwgeVVuaXRzOiBjdXJyIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyciA8IChiZXN0LnlVbml0cyAtIHRocmVzaG9sZCkgJiYgY3VyciAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgeENvbHVtbnM6IGlkeCwgeVVuaXRzOiBjdXJyIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmVzdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgICBiZXN0Rml0LmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICByZXR1cm4gYmVzdEZpdDtcbiAgICB9O1xuICAgIHJldHVybiBNYXNvbkRlZmF1bHRQYWNrZXI7XG59KCkpO1xuZXhwb3J0IHsgTWFzb25EZWZhdWx0UGFja2VyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNvbi1kZWZhdWx0LXBhY2tlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9tYXNvbi1kZWZhdWx0LXBhY2tlci5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENvcHlyaWdodCBNYXJjIEouIFNjaG1pZHQuIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWxcbiAqIGRpcmVjdG9yeSBvZiB0aGlzIGRpc3RyaWJ1dGlvbiBhbmQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjai9jc3MtZWxlbWVudC1xdWVyaWVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UuXG4gKi9cbjtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlJlc2l6ZVNlbnNvciA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICAgIC8vTWFrZSBzdXJlIGl0IGRvZXMgbm90IHRocm93IGluIGEgU1NSIChTZXJ2ZXIgU2lkZSBSZW5kZXJpbmcpIHNpdHVhdGlvblxuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBPbmx5IHVzZWQgZm9yIHRoZSBkaXJ0eSBjaGVja2luZywgc28gdGhlIGV2ZW50IGNhbGxiYWNrIGNvdW50IGlzIGxpbXRlZCB0byBtYXggMSBjYWxsIHBlciBmcHMgcGVyIHNlbnNvci5cbiAgICAvLyBJbiBjb21iaW5hdGlvbiB3aXRoIHRoZSBldmVudCBiYXNlZCByZXNpemUgc2Vuc29yIHRoaXMgc2F2ZXMgY3B1IHRpbWUsIGJlY2F1c2UgdGhlIHNlbnNvciBpcyB0b28gZmFzdCBhbmRcbiAgICAvLyB3b3VsZCBnZW5lcmF0ZSB0b28gbWFueSB1bm5lY2Vzc2FyeSBldmVudHMuXG4gICAgdmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXRUaW1lb3V0KGZuLCAyMCk7XG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlIG92ZXIgZWFjaCBvZiB0aGUgcHJvdmlkZWQgZWxlbWVudChzKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8SFRNTEVsZW1lbnRbXX0gZWxlbWVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yRWFjaEVsZW1lbnQoZWxlbWVudHMsIGNhbGxiYWNrKXtcbiAgICAgICAgdmFyIGVsZW1lbnRzVHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50cyk7XG4gICAgICAgIHZhciBpc0NvbGxlY3Rpb25UeXBlZCA9ICgnW29iamVjdCBBcnJheV0nID09PSBlbGVtZW50c1R5cGVcbiAgICAgICAgICAgIHx8ICgnW29iamVjdCBOb2RlTGlzdF0nID09PSBlbGVtZW50c1R5cGUpXG4gICAgICAgICAgICB8fCAoJ1tvYmplY3QgSFRNTENvbGxlY3Rpb25dJyA9PT0gZWxlbWVudHNUeXBlKVxuICAgICAgICAgICAgfHwgKCdbb2JqZWN0IE9iamVjdF0nID09PSBlbGVtZW50c1R5cGUpXG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBqUXVlcnkgJiYgZWxlbWVudHMgaW5zdGFuY2VvZiBqUXVlcnkpIC8vanF1ZXJ5XG4gICAgICAgICAgICB8fCAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBFbGVtZW50cyAmJiBlbGVtZW50cyBpbnN0YW5jZW9mIEVsZW1lbnRzKSAvL21vb3Rvb2xzXG4gICAgICAgICk7XG4gICAgICAgIHZhciBpID0gMCwgaiA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKGlzQ29sbGVjdGlvblR5cGVkKSB7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBkaW1lbnNpb24gY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W118RWxlbWVudHN8alF1ZXJ5fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHZhciBSZXNpemVTZW5zb3IgPSBmdW5jdGlvbihlbGVtZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBFdmVudFF1ZXVlKCkge1xuICAgICAgICAgICAgdmFyIHEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuYWRkID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICBxLnB1c2goZXYpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICB0aGlzLmNhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBqID0gcS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcVtpXS5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5yZW1vdmUgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIHZhciBuZXdRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcihpID0gMCwgaiA9IHEubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHFbaV0gIT09IGV2KSBuZXdRdWV1ZS5wdXNoKHFbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBxID0gbmV3UXVldWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgcHJvcFxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgIHJlc2l6ZWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaFJlc2l6ZUV2ZW50KGVsZW1lbnQsIHJlc2l6ZWQpIHtcbiAgICAgICAgICAgIGlmICghZWxlbWVudC5yZXNpemVkQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCA9IG5ldyBFdmVudFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXNpemVkQXR0YWNoZWQuYWRkKHJlc2l6ZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlc2l6ZWRBdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmFkZChyZXNpemVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVzaXplU2Vuc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5jbGFzc05hbWUgPSAncmVzaXplLXNlbnNvcic7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IG92ZXJmbG93OiBoaWRkZW47IHotaW5kZXg6IC0xOyB2aXNpYmlsaXR5OiBoaWRkZW47JztcbiAgICAgICAgICAgIHZhciBzdHlsZUNoaWxkID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyB0cmFuc2l0aW9uOiAwczsnO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2l6ZVNlbnNvci5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVzaXplLXNlbnNvci1leHBhbmRcIiBzdHlsZT1cIicgKyBzdHlsZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCInICsgc3R5bGVDaGlsZCArICdcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZXNpemUtc2Vuc29yLXNocmlua1wiIHN0eWxlPVwiJyArIHN0eWxlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cIicgKyBzdHlsZUNoaWxkICsgJyB3aWR0aDogMjAwJTsgaGVpZ2h0OiAyMDAlXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQucmVzaXplU2Vuc29yKTtcblxuICAgICAgICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT0gJ3N0YXRpYycpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cGFuZCA9IGVsZW1lbnQucmVzaXplU2Vuc29yLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICB2YXIgZXhwYW5kQ2hpbGQgPSBleHBhbmQuY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgIHZhciBzaHJpbmsgPSBlbGVtZW50LnJlc2l6ZVNlbnNvci5jaGlsZE5vZGVzWzFdO1xuICAgICAgICAgICAgdmFyIGRpcnR5LCByYWZJZCwgbmV3V2lkdGgsIG5ld0hlaWdodDtcbiAgICAgICAgICAgIHZhciBsYXN0V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIGxhc3RIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZXhwYW5kQ2hpbGQuc3R5bGUud2lkdGggPSAnMTAwMDAwcHgnO1xuICAgICAgICAgICAgICAgIGV4cGFuZENoaWxkLnN0eWxlLmhlaWdodCA9ICcxMDAwMDBweCc7XG5cbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsTGVmdCA9IDEwMDAwMDtcbiAgICAgICAgICAgICAgICBleHBhbmQuc2Nyb2xsVG9wID0gMTAwMDAwO1xuXG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbExlZnQgPSAxMDAwMDA7XG4gICAgICAgICAgICAgICAgc2hyaW5rLnNjcm9sbFRvcCA9IDEwMDAwMDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlc2V0KCk7XG5cbiAgICAgICAgICAgIHZhciBvblJlc2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByYWZJZCA9IDA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWRpcnR5KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBsYXN0V2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgICAgICAgICBsYXN0SGVpZ2h0ID0gbmV3SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVzaXplZEF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVzaXplZEF0dGFjaGVkLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb25TY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBuZXdXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgbmV3SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgZGlydHkgPSBuZXdXaWR0aCAhPSBsYXN0V2lkdGggfHwgbmV3SGVpZ2h0ICE9IGxhc3RIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlydHkgJiYgIXJhZklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uUmVzaXplZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBjYikge1xuICAgICAgICAgICAgICAgIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgbmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGFkZEV2ZW50KGV4cGFuZCwgJ3Njcm9sbCcsIG9uU2Nyb2xsKTtcbiAgICAgICAgICAgIGFkZEV2ZW50KHNocmluaywgJ3Njcm9sbCcsIG9uU2Nyb2xsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvckVhY2hFbGVtZW50KGVsZW1lbnQsIGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAgICAgYXR0YWNoUmVzaXplRXZlbnQoZWxlbSwgY2FsbGJhY2spO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBSZXNpemVTZW5zb3IuZGV0YWNoKGVsZW1lbnQsIGV2KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgUmVzaXplU2Vuc29yLmRldGFjaCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2KSB7XG4gICAgICAgIGZvckVhY2hFbGVtZW50KGVsZW1lbnQsIGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAgICAgaWYoZWxlbS5yZXNpemVkQXR0YWNoZWQgJiYgdHlwZW9mIGV2ID09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICAgICAgZWxlbS5yZXNpemVkQXR0YWNoZWQucmVtb3ZlKGV2KTtcbiAgICAgICAgICAgICAgICBpZihlbGVtLnJlc2l6ZWRBdHRhY2hlZC5sZW5ndGgoKSkgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsZW0ucmVzaXplU2Vuc29yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uY29udGFpbnMoZWxlbS5yZXNpemVTZW5zb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2hpbGQoZWxlbS5yZXNpemVTZW5zb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgZWxlbS5yZXNpemVTZW5zb3I7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVsZW0ucmVzaXplZEF0dGFjaGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlc2l6ZVNlbnNvcjtcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvc3JjL1Jlc2l6ZVNlbnNvci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgeyBNYXNvbiwgTWFzb25PcHRpb25zIH0gZnJvbSAnLi9tYXNvbic7XG5leHBvcnQgeyBNYXNvbkRvbVJlbmRlcmVyIH0gZnJvbSAnLi9tYXNvbi1kb20tcmVuZGVyZXInO1xuZXhwb3J0IHsgTWFzb25EZWZhdWx0UGFja2VyIH0gZnJvbSAnLi9tYXNvbi1kZWZhdWx0LXBhY2tlcic7XG5leHBvcnQgeyBNYXNvblNpbXBsZVBhY2tlciB9IGZyb20gJy4vbWFzb24tc2ltcGxlLXBhY2tlcic7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSZXNpemVTZW5zb3I6IHJlcXVpcmUoJy4vc3JjL1Jlc2l6ZVNlbnNvcicpLFxuICAgIEVsZW1lbnRRdWVyaWVzOiByZXF1aXJlKCcuL3NyYy9FbGVtZW50UXVlcmllcycpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1lbGVtZW50LXF1ZXJpZXMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG1ja2Vvd3Igb24gMi8yLzE3LlxuICovXG5pbXBvcnQge01hc29uLCBNYXNvbkRvbVJlbmRlcmVyLCBNYXNvblNpbXBsZVBhY2tlciwgTWFzb25EZWZhdWx0UGFja2VyfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHtSZXNpemVTZW5zb3J9IGZyb20gJ2Nzcy1lbGVtZW50LXF1ZXJpZXMnO1xuXG52YXIgdXNlU2ltcGxlUGFja2VyID0gZmFsc2U7XG5mdW5jdGlvbiBwYWNrKCkge1xuXG4gICAgICAgIC8vIGZpbmQgb3VyIGNvbnRhaW5lclxuICAgICAgICB2YXIgZGFzaGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hc29uLWNvbnRhaW5lcicpO1xuICAgICAgICB2YXIgY29udGFpbmVyV2lkdGggPSBkYXNoYm9hcmQub2Zmc2V0V2lkdGg7XG4gICAgICAgIC8vIGZpbmQgYWxsIHRoZSBicmlja3MgaW4gaXRcbiAgICAgICAgLy8gbm90IGFsbCBicm93c2VycyBhcmUgYWJsZSB0byB0cmVhdCB0aGUgcmVzdWx0cyBmcm9tIHF1ZXJ5U2VsZWN0b3JBbGwgd2l0aCBhcnJheSBtZXRob2RzIGxpa2UgZm9yRWFjaCgpXG4gICAgICAgIC8vIHNvIHRoaXMgd2lsbCBtYWtlIHRoZW4gYW4gYXJyYXlcbiAgICAgICAgdmFyIGl0ZW1zID0gW10uc2xpY2UuY2FsbChkYXNoYm9hcmQucXVlcnlTZWxlY3RvckFsbCgnZGl2Lm1hc29uLWJyaWNrJykpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIE1hc29uIGFuZCB1c2UgaXQgdG8gZml0IHRoZSBicmlja3MgaW50byBhIGNvbnRhaW5lclxuICAgICAgICAvLyB0aGUgc2l6ZSBvZiB0aGUgJ2Rhc2hib2FyZCdcbiAgICAgICAgLy8gc2luY2Ugd2UgYXJlIGRlYWxpbmcgd2l0aCBkb20gbm9kZXMsIHdlIG5lZWQgdGhlIE1hc29uRG9tUmVuZGVyZXJcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IE1hc29uRG9tUmVuZGVyZXIoKTtcblxuICAgICAgICB2YXIgb3B0cyA9IHsgLy8gTWFzb25PcHRpb25zIG9iamVjdCBoZXJlXG4gICAgICAgICAgICBjb250YWluZXJXaWR0aDogY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICByZW5kZXJlcjogcmVuZGVyZXIsXG4gICAgICAgICAgICAvLyB0aGlzIHRocmVzaG9sZCBzaWduaWZpZXMgdGhhdCBldmVuIGlmIGEgY29sdW1uIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgLy8gd291bGQgcG9zdGlvbiB0aGUgdGlsZSBjbG9zZXIgdG8gdGhlIHRvcCwgaXQgd2lsbCBwcmVmZXJcbiAgICAgICAgICAgIC8vIGEgY29sdW1uIHRvIHRoZSBsZWZ0IGlmIHRoZSBkaWZmZXJlbmNlIGlzIGxlc3MgdGhhbiB0aGlzXG4gICAgICAgICAgICAvLyBtYW55IHBpeGVscy4gTWFrZSB0aGlzIDAgYW5kIGNoZWNrIHRoZSBkZW1vIGFuZCB5b3Ugd2lsbFxuICAgICAgICAgICAgLy8gc2VlIHRoZSBkaWZmZXJlbmNlIGluIHBvc2l0aW9uIG9mIGJyaWNrcyA1IGFuZCA2IGFmdGVyIHRoZVxuICAgICAgICAgICAgLy8gc2hvdyBtb3JlIGJ1dHRvbiBpcyBjbGlja2VkIGluIGJyaWNrIDFcbiAgICAgICAgICAgIHRocmVzaG9sZDogNDAsXG4gICAgICAgICAgICBjb2x1bW5zOiAxMixcbiAgICAgICAgICAgIC8vIGltcGxlbWVudCB5b3VyIG93biBwYWNraW5nIGxvZ2ljXG4gICAgICAgICAgICAvLyBmb3JtIGV4YW1wbGUsIGltcG9ydCBNYXNvblNpbXBsZVBhY2tlciBhbmQgdHJ5IHRoYXRcbiAgICAgICAgICAgIHBhY2tlcjogdXNlU2ltcGxlUGFja2VyID8gbmV3IE1hc29uU2ltcGxlUGFja2VyKCkgOiBuZXcgTWFzb25EZWZhdWx0UGFja2VyKClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gbmV3IE1hc29uKG9wdHMpLmxheW91dChpdGVtcyk7XG4gICAgICAgIGRhc2hib2FyZC5zdHlsZS5taW5IZWlnaHQgPSBjb250YWluZXJIZWlnaHQgKyAncHgnO1xuXG59XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIC8vIGluaXRpYWxpemUgdGhlIGxheW91dFxuICAgIHBhY2soKTtcblxuICAgIC8vIGluIG91ciBjYXNlLCB3ZSB3YW50IHRvIHJlIGxheW91dCB0aGUgYnJpY2tzIHdoZW4gYW55IG9mIHRoZWlyIHNpemVzIGNoYW5nZS5cbiAgICAvLyBpZiB0aGUgYnJpY2tzIHNpemVzIGNhbiBvbmx5IGNoYW5nZSB3aGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplZCwgeW91IGNvdWxkIHVzZSB0aGVcbiAgICAvLyB3aW5kb3cgcmVzaXplIGV2ZW50LiBIb3dldmVyLCBpZiB0aGUgYnJpY2tzIGNhbiByZXNpemUgdGhlbXNlbHZlcywgeW91IHdvdWxkIHdhbnQgdG8gZG8gc29tZXRoaW5nXG4gICAgLy8gbGlrZSB0aGlzXG4gICAgLy8gUmVzaXplU2Vuc29yIGlzIGZyb20gY3NzLWVsZW1lbnQtcXVlcmllcyAod2hpY2ggaXMgbGlzdGVkIGFzIGFuIG9wdGlvbmFsIGRlcGVuZGVuY3kpO1xuICAgIG5ldyBSZXNpemVTZW5zb3IoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hc29uLWNvbnRhaW5lcicpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5tYXNvbi1icmljaycpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFjaygpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJykucXVlcnlTZWxlY3RvcignYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICBzaG93TW9yZSgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZVNpbXBsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRvZ2dsZVBhY2tlcik7XG59XG5cbmZ1bmN0aW9uIHJlc2V0SGVpZ2h0KCkge1xuICAgIHZhciBmaXJzdFRpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZUV4YW1wbGUnKTtcbiAgICBmaXJzdFRpbGUuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgIGZpcnN0VGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgcmVzZXRIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBzaG93TW9yZSgpIHtcbiAgICB2YXIgZmlyc3RUaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVFeGFtcGxlJyk7XG5cbiAgICBpZiAoZmlyc3RUaWxlLnN0eWxlLmhlaWdodCAhPT0gJzQwMHB4Jykge1xuICAgICAgICB2YXIgYXV0b0hlaWdodCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGZpcnN0VGlsZSwgbnVsbCkuaGVpZ2h0O1xuICAgICAgICBmaXJzdFRpbGUuc2V0QXR0cmlidXRlKCdkYXRhLWF1dG8taGVpZ2h0JywgYXV0b0hlaWdodCk7XG4gICAgICAgIGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgPSBhdXRvSGVpZ2h0O1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZmlyc3RUaWxlLnN0eWxlLmhlaWdodCA9ICc0MDBweCc7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBmaXJzdFRpbGUuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG8taGVpZ2h0Jyk7XG4gICAgICAgIGZpcnN0VGlsZS5zdHlsZS5oZWlnaHQgPSB0YXJnZXRIZWlnaHQ7XG4gICAgICAgIGZpcnN0VGlsZS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgcmVzZXRIZWlnaHQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9nZ2xlUGFja2VyKGV2dCkge1xuICAgIHVzZVNpbXBsZVBhY2tlciA9IGV2dC50YXJnZXQuY2hlY2tlZDtcbiAgICBwYWNrKCk7ICBcbn1cblxuc3RhcnQoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2RlbW8vbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZWQgYnkgbWNrZW93ciBvbiAyLzMvMTcuXG4gKi9cbnZhciBNYXNvbkRvbVJlbmRlcmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uRG9tUmVuZGVyZXIoKSB7XG4gICAgfVxuICAgIE1hc29uRG9tUmVuZGVyZXIucHJvdG90eXBlLnNldENvbHVtbnMgPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xuICAgIH07XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuZ2V0RWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgfTtcbiAgICBNYXNvbkRvbVJlbmRlcmVyLnByb3RvdHlwZS5nZXRFbGVtZW50SGVpZ2h0ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG4gICAgTWFzb25Eb21SZW5kZXJlci5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgbGVmdEluQ29scywgdG9wSW5Vbml0cykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAoKGxlZnRJbkNvbHMgLyB0aGlzLmNvbHVtbnMpICogMTAwKSArICclJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSB0b3BJblVuaXRzICsgJ3B4JztcbiAgICB9O1xuICAgIHJldHVybiBNYXNvbkRvbVJlbmRlcmVyO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uRG9tUmVuZGVyZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hc29uLWRvbS1yZW5kZXJlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9tYXNvbi1kb20tcmVuZGVyZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBTaW1wbGUgcGFja2VyIHRoYXQgcG9zaXRpb25zIGVhY2ggYnJpY2sgaW4gdGhlIG5leHQgY29sdW1uLiBUaGlzIHdpbGxcbiAqIGZhaWwgc3BlY3RhY3VsYXJseSB3aXRoIGNvbHVtbnMgb2YgZGlmZmVyZW50IHdpZHRocy5cbiAqL1xudmFyIE1hc29uU2ltcGxlUGFja2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uU2ltcGxlUGFja2VyKCkge1xuICAgIH1cbiAgICBNYXNvblNpbXBsZVBhY2tlci5wcm90b3R5cGUuZmluZEJlc3RDb2x1bW4gPSBmdW5jdGlvbiAocmVxdWlyZWRDb2x1bW5zLCBlbGVtZW50LCBlbGVtZW50SW5kZXgsIGNvbHVtbkJvdHRvbXMsIHRocmVzaG9sZCkge1xuICAgICAgICAvLyBUaGlzIHBhY2tlciBzaW1wbHkgZmlndXJlcyBvdXQgd2hpY2ggY29sdW1uIGl0IHNob3VsZFxuICAgICAgICAvLyBnbyBpbiBiYXNlZCBvbiB0aGUgZWxlbWVudCBpbmRleCBhbmQgYXNzdW1lcyB0aGF0IGFsbFxuICAgICAgICAvLyBlbGVtZW50cyBhcmUgcmVxdWlyZSB0aGUgc2FtZSBudW1iZXIgb2YgY29sdW1uc1xuICAgICAgICB2YXIgY29sdW1ucyA9IGNvbHVtbkJvdHRvbXMubGVuZ3RoO1xuICAgICAgICB2YXIgbmV4dENvbHVtbiA9IChyZXF1aXJlZENvbHVtbnMgKiBlbGVtZW50SW5kZXgpICUgY29sdW1ucztcbiAgICAgICAgcmV0dXJuIHsgeENvbHVtbnM6IG5leHRDb2x1bW4sIHlVbml0czogY29sdW1uQm90dG9tc1tuZXh0Q29sdW1uXSwgZWxlbWVudDogZWxlbWVudCB9O1xuICAgIH07XG4gICAgcmV0dXJuIE1hc29uU2ltcGxlUGFja2VyO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uU2ltcGxlUGFja2VyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNvbi1zaW1wbGUtcGFja2VyLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL21hc29uLXNpbXBsZS1wYWNrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTWFzb25EZWZhdWx0UGFja2VyIH0gZnJvbSBcIi4vbWFzb24tZGVmYXVsdC1wYWNrZXJcIjtcbnZhciBNYXNvbk9wdGlvbnMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWFzb25PcHRpb25zKCkge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSAxMjtcbiAgICAgICAgdGhpcy50aHJlc2hvbGQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWFzb25PcHRpb25zO1xufSgpKTtcbmV4cG9ydCB7IE1hc29uT3B0aW9ucyB9O1xudmFyIE1hc29uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hc29uKHJlbmRlcmVyT3JPcHRpb25zLCBjb250YWluZXJXaWR0aCwgY29sdW1ucywgdGhyZXNob2xkKSB7XG4gICAgICAgIGlmIChjb2x1bW5zID09PSB2b2lkIDApIHsgY29sdW1ucyA9IDEyOyB9XG4gICAgICAgIGlmICh0aHJlc2hvbGQgPT09IHZvaWQgMCkgeyB0aHJlc2hvbGQgPSAwOyB9XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IDEyO1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSB3aWdnbGUgcm9vbSBNYXNvbiBoYXMgd2hlbiBjaG9vc2luZyBhIGNvbHVtbiBmb3IgYSBicmlja1xuICAgICAgICAvLyBXaGVuIHN0YXJ0aW5nIG9uIHRoZSBsZWZ0LCBNYXNvbiB3aWxsIG9ubHkgY29uc2lkZXIgYSBjb2x1bW4gY2hvb3NlIGFzIGEgYmV0dGVyIGZpdFxuICAgICAgICAvLyBpZiBpdCBpcyBiZXR0ZXIgYnkgdGhpcyBhbW91bnQgb3IgbW9yZS4gVGhpcyBwcmV2ZW50cyBicmlja3MgZnJvbSBiZWluZyBwbGFjZWQgdG8gdGhlXG4gICAgICAgIHRoaXMudGhyZXNob2xkID0gNDA7XG4gICAgICAgIHRoaXMuY29sdW1uQm90dG9tcyA9IFtdO1xuICAgICAgICBpZiAocmVuZGVyZXJPck9wdGlvbnNbJ3JlbmRlcmVyJ10pIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gcmVuZGVyZXJPck9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyID0gb3B0cy5yZW5kZXJlcjtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyV2lkdGggPSBvcHRzLmNvbnRhaW5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gb3B0cy5jb2x1bW5zO1xuICAgICAgICAgICAgdGhpcy50aHJlc2hvbGQgPSBvcHRzLnRocmVzaG9sZDtcbiAgICAgICAgICAgIHRoaXMucGFja2VyID0gb3B0cy5wYWNrZXIgfHwgbmV3IE1hc29uRGVmYXVsdFBhY2tlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyT3JPcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gY29sdW1ucztcbiAgICAgICAgICAgIHRoaXMudGhyZXNob2xkID0gdGhyZXNob2xkO1xuICAgICAgICAgICAgdGhpcy5wYWNrZXIgPSBuZXcgTWFzb25EZWZhdWx0UGFja2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMuY29sdW1uQm90dG9tcy5sZW5ndGggPCB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uQm90dG9tcy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q29sdW1ucyhjb2x1bW5zKTtcbiAgICB9XG4gICAgTWFzb24ucHJvdG90eXBlLmZpbmRCZXN0Q29sdW1uID0gZnVuY3Rpb24gKHJlcXVpcmVkQ29sdW1ucywgZWxlbWVudCwgZWxlbWVudEluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhY2tlci5maW5kQmVzdENvbHVtbihyZXF1aXJlZENvbHVtbnMsIGVsZW1lbnQsIGVsZW1lbnRJbmRleCwgdGhpcy5jb2x1bW5Cb3R0b21zLCB0aGlzLnRocmVzaG9sZCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGxpc3Qgb2YgZWxlbWVudHMgYW5kIHJldHVybnMgdGhlIG5ldyBjb29yZHMgZm9yIGVhY2ggb25lLiBUaGlzIGRvZXMgbm90IHJlcG9zaXRpb24gYW55dGhpbmcuXG4gICAgICogWW91IG1pZ2h0IHVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIGhhbmRsZSBob3cgYW5kIHdoZW4gdGhpbmdzIGdldCByZXBvc2l0aW9uZWQuXG4gICAgICpcbiAgICAgKiBTZWUgbGF5b3V0KCkgaWYgeW91IHdhbnQgZXZlcnl0aGluZyBwb3NpdGlvbiBhdXRvbWF0aWNhbGx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1lbnRzXG4gICAgICogQHJldHVybnMge2Nvb3JkczogTWFzb25Db29yZFtdLCB0b3RhbEhlaWdodDogbnVtYmVyfVxuICAgICAqL1xuICAgIE1hc29uLnByb3RvdHlwZS5maXQgPSBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGNvb3Jkc0xpc3QgPSBbXTtcbiAgICAgICAgdmFyIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaWR4KSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudFdpZHRoID0gX3RoaXMucmVuZGVyZXIuZ2V0RWxlbWVudFdpZHRoKGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRIZWlnaHQgPSBfdGhpcy5yZW5kZXJlci5nZXRFbGVtZW50SGVpZ2h0KGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIGNvbHMgPSBNYXRoLnJvdW5kKChlbGVtZW50V2lkdGggLyBfdGhpcy5jb250YWluZXJXaWR0aCkgKiBfdGhpcy5jb2x1bW5zKTtcbiAgICAgICAgICAgIC8vIGNhbid0IGJlIGJpZ2dlciB0aGFuICdhbGwnIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChjb2xzID4gX3RoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGNvbHMgPSBfdGhpcy5jb2x1bW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJlc3RGaXQgPSBfdGhpcy5maW5kQmVzdENvbHVtbihjb2xzLCBlbGVtZW50LCBpZHgpO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjb2x1bW4gYm90dG9tcyBmb3IgYWxsIHRoZSBjb2x1bW5zIHRoaXMgdGlsZSBjcm9zc2VzIHdoZW4gcG9zaXRpb25lZCBhdCB0aGUgYmVzdFxuICAgICAgICAgICAgLy8gbG9jYXRpb25cbiAgICAgICAgICAgIHZhciBzdGFydENvbCA9IGJlc3RGaXQueENvbHVtbnM7XG4gICAgICAgICAgICB2YXIgZW5kQ29sID0gc3RhcnRDb2wgKyBjb2xzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0Q29sOyBpIDwgZW5kQ29sOyBpKyspIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jb2x1bW5Cb3R0b21zW2ldID0gYmVzdEZpdC55VW5pdHMgKyBlbGVtZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBhIHR1cGxlIHdoZXJlIHggaXMgdGhlIGNvbHVtbiBpbmRleCBhbmQgeVBvcyBpcyB0aGUgcGl4ZWwgY29vcmQgdG8gcG9zaXRpb24gYXQuXG4gICAgICAgICAgICBjb29yZHNMaXN0LnB1c2goYmVzdEZpdCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRvdGFsIGhlaWdodFxuICAgICAgICAgICAgdG90YWxIZWlnaHQgPSBNYXRoLm1heCh0b3RhbEhlaWdodCwgZWxlbWVudEhlaWdodCArIGJlc3RGaXQueVVuaXRzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJldHVybiB0aGUgbGlzdCBvZiBjb29yZGluYXRlcyBmb3IgZWFjaCB0aWxlXG4gICAgICAgIHJldHVybiB7IGNvb3JkczogY29vcmRzTGlzdCwgdG90YWxIZWlnaHQ6IHRvdGFsSGVpZ2h0IH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGlzIHdpbGwgdGFrZSB0aGUgbGlzdCBvZiBlbGVtZW50cywgZmluZCB0aGVpciBuZXcgbG9jYXRpb25zIGFuZCB0aGVuIHVzZSB0aGUgTWFzb25SZW5kZXJlclxuICAgICAqIHRvIHJlcG9zaXRpb24gYWxsIHRoZSBicmlja3MgaW50byB0aGVpciBuZXcgaG9tZS5cbiAgICAgKiBAcGFyYW0gZWxlbWVudHNcbiAgICAgKiBAcmV0dXJucyB0aGUgaGVpZ2h0IHRoYXQgdGhlIGNvbnRhaW5lciBtdXN0IG5vdyBiZSB0byBob2xkIHRoZSBpdGVtcy5cbiAgICAgKi9cbiAgICBNYXNvbi5wcm90b3R5cGUubGF5b3V0ID0gZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBsYXlvdXRSZXN1bHQgPSB0aGlzLmZpdChlbGVtZW50cyk7XG4gICAgICAgIGxheW91dFJlc3VsdC5jb29yZHMuZm9yRWFjaChmdW5jdGlvbiAoY29vcmQpIHtcbiAgICAgICAgICAgIC8vIGFwcGx5IHRoZSBjYWxjdWxhdGVkIHBvc2l0aW9uIGZvciBlYWNoIGJyaWNrIGhvd2V2ZXIgeW91IHdhbnQuIEluIHRoaXMgY2FzZVxuICAgICAgICAgICAgLy8gd2UgYXJlIGp1c3Qgc2V0dGluZyB0aGUgQ1NTIHBvc2l0aW9uLiBBbmltYXRpb24gd2lsbCBiZSBwcm92aWRlZCB2aWEgQ1NTXG4gICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5zZXRQb3NpdGlvbihjb29yZC5lbGVtZW50LCBjb29yZC54Q29sdW1ucywgY29vcmQueVVuaXRzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsYXlvdXRSZXN1bHQudG90YWxIZWlnaHQ7XG4gICAgfTtcbiAgICByZXR1cm4gTWFzb247XG59KCkpO1xuZXhwb3J0IHsgTWFzb24gfTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hc29uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL21hc29uLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ29weXJpZ2h0IE1hcmMgSi4gU2NobWlkdC4gU2VlIHRoZSBMSUNFTlNFIGZpbGUgYXQgdGhlIHRvcC1sZXZlbFxuICogZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uIGFuZCBhdFxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmNqL2Nzcy1lbGVtZW50LXF1ZXJpZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5cbiAqL1xuO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJy4vUmVzaXplU2Vuc29yLmpzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJy4vUmVzaXplU2Vuc29yLmpzJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRWxlbWVudFF1ZXJpZXMgPSBmYWN0b3J5KHJvb3QuUmVzaXplU2Vuc29yKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChSZXNpemVTZW5zb3IpIHtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHZhciBFbGVtZW50UXVlcmllcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0cmFja2luZ0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEVtU2l6ZShlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZm9udFNpemU7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChmb250U2l6ZSkgfHwgMTY7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICogQGNvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vTXIwZ3JvZy9lbGVtZW50LXF1ZXJ5L2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29udmVydFRvUHgoZWxlbWVudCwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBudW1iZXJzID0gdmFsdWUuc3BsaXQoL1xcZC8pO1xuICAgICAgICAgICAgdmFyIHVuaXRzID0gbnVtYmVyc1tudW1iZXJzLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyZW1cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZ2V0RW1TaXplKCk7XG4gICAgICAgICAgICAgICAgLy8gVmlld3BvcnQgdW5pdHMhXG4gICAgICAgICAgICAgICAgLy8gQWNjb3JkaW5nIHRvIGh0dHA6Ly9xdWlya3Ntb2RlLm9yZy9tb2JpbGUvdGFibGVWaWV3cG9ydC5odG1sXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoL0hlaWdodCBnZXRzIHVzIHRoZSBtb3N0IHJlbGlhYmxlIGluZm9cbiAgICAgICAgICAgICAgICBjYXNlIFwidndcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2aFwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ2bWluXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInZtYXhcIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ3ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hvb3NlciA9IE1hdGhbdW5pdHMgPT09IFwidm1pblwiID8gXCJtaW5cIiA6IFwibWF4XCJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKiBjaG9vc2VyKHZ3LCB2aCk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGZvciBub3csIG5vdCBzdXBwb3J0aW5nIHBoeXNpY2FsIHVuaXRzIChzaW5jZSB0aGV5IGFyZSBqdXN0IGEgc2V0IG51bWJlciBvZiBweClcbiAgICAgICAgICAgICAgICAvLyBvciBleC9jaCAoZ2V0dGluZyBhY2N1cmF0ZSBtZWFzdXJlbWVudHMgaXMgaGFyZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gU2V0dXBJbmZvcm1hdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICAgICAgICB2YXIga2V5LCBvcHRpb24sIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCwgdmFsdWUsIGFjdHVhbFZhbHVlLCBhdHRyVmFsdWVzLCBhdHRyVmFsdWUsIGF0dHJOYW1lO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24ge21vZGU6ICdtaW58bWF4JywgcHJvcGVydHk6ICd3aWR0aHxoZWlnaHQnLCB2YWx1ZTogJzEyM3B4J31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gW29wdGlvbi5tb2RlLCBvcHRpb24ucHJvcGVydHksIG9wdGlvbi52YWx1ZV0uam9pbignLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1tpZHhdID0gb3B0aW9uO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbJ21pbi13aWR0aCcsICdtaW4taGVpZ2h0JywgJ21heC13aWR0aCcsICdtYXgtaGVpZ2h0J107XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0cmFjdHMgdGhlIGNvbXB1dGVkIHdpZHRoL2hlaWdodCBhbmQgc2V0cyB0byBtaW4vbWF4LSBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgY3VycmVudCBkaW1lbnNpb25zXG4gICAgICAgICAgICAgICAgd2lkdGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgICAgIGF0dHJWYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiA9IHRoaXMub3B0aW9uc1trZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29udmVydFRvUHgodGhpcy5lbGVtZW50LCBvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbFZhbHVlID0gb3B0aW9uLnByb3BlcnR5ID09ICd3aWR0aCcgPyB3aWR0aCA6IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBvcHRpb24ubW9kZSArICctJyArIG9wdGlvbi5wcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtaW4nICYmIGFjdHVhbFZhbHVlID49IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5tb2RlID09ICdtYXgnICYmIGFjdHVhbFZhbHVlIDw9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyVmFsdWUgKz0gb3B0aW9uLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdHRyVmFsdWVzW2F0dHJOYW1lXSkgYXR0clZhbHVlc1thdHRyTmFtZV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJWYWx1ZSAmJiAtMSA9PT0gKCcgJythdHRyVmFsdWVzW2F0dHJOYW1lXSsnICcpLmluZGV4T2YoJyAnICsgYXR0clZhbHVlICsgJyAnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0clZhbHVlc1thdHRyTmFtZV0gKz0gJyAnICsgYXR0clZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGspKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0clZhbHVlc1thdHRyaWJ1dGVzW2tdXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVzW2tdLCBhdHRyVmFsdWVzW2F0dHJpYnV0ZXNba11dLnN1YnN0cigxKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZXNba10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIG9wdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwRWxlbWVudChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5hZGRPcHRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZXR1cEluZm9ybWF0aW9uID0gbmV3IFNldHVwSW5mb3JtYXRpb24oZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb24uYWRkT3B0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZW5zb3IgPSBuZXcgUmVzaXplU2Vuc29yKGVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbi5jYWxsKCk7XG5cbiAgICAgICAgICAgIGlmICh0cmFja2luZ0FjdGl2ZSAmJiBlbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpIDwgMCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlIG1pbnxtYXhcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IHdpZHRofGhlaWdodFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBhbGxRdWVyaWVzID0ge307XG4gICAgICAgIGZ1bmN0aW9uIHF1ZXVlUXVlcnkoc2VsZWN0b3IsIG1vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihhbGxRdWVyaWVzW21vZGVdKSA9PSAndW5kZWZpbmVkJykgYWxsUXVlcmllc1ttb2RlXSA9IHt9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZihhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XSkgPT0gJ3VuZGVmaW5lZCcpIGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldID0ge307XG4gICAgICAgICAgICBpZiAodHlwZW9mKGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldW3ZhbHVlXSkgPT0gJ3VuZGVmaW5lZCcpIGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldW3ZhbHVlXSA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgZWxzZSBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XVt2YWx1ZV0gKz0gJywnK3NlbGVjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UXVlcnkoKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkgcXVlcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsLmJpbmQoZG9jdW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mICQkKSBxdWVyeSA9ICQkO1xuICAgICAgICAgICAgaWYgKCFxdWVyeSAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGpRdWVyeSkgcXVlcnkgPSBqUXVlcnk7XG5cbiAgICAgICAgICAgIGlmICghcXVlcnkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnTm8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCwgalF1ZXJ5IG9yIE1vb3Rvb2xzXFwncyAkJCBmb3VuZC4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhcnQgdGhlIG1hZ2ljLiBHbyB0aHJvdWdoIGFsbCBjb2xsZWN0ZWQgcnVsZXMgKHJlYWRSdWxlcygpKSBhbmQgYXR0YWNoIHRoZSByZXNpemUtbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBmaW5kRWxlbWVudFF1ZXJpZXNFbGVtZW50cygpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGdldFF1ZXJ5KCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIG1vZGUgaW4gYWxsUXVlcmllcykgaWYgKGFsbFF1ZXJpZXMuaGFzT3duUHJvcGVydHkobW9kZSkpIHtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGFsbFF1ZXJpZXNbbW9kZV0pIGlmIChhbGxRdWVyaWVzW21vZGVdLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB2YWx1ZSBpbiBhbGxRdWVyaWVzW21vZGVdW3Byb3BlcnR5XSkgaWYgKGFsbFF1ZXJpZXNbbW9kZV1bcHJvcGVydHldLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gcXVlcnkoYWxsUXVlcmllc1ttb2RlXVtwcm9wZXJ0eV1bdmFsdWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dXBFbGVtZW50KGVsZW1lbnRzW2ldLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hSZXNwb25zaXZlSW1hZ2UoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgICAgICB2YXIgcnVsZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEltYWdlSWQgPSAwO1xuICAgICAgICAgICAgdmFyIGxhc3RBY3RpdmVJbWFnZSA9IC0xO1xuICAgICAgICAgICAgdmFyIGxvYWRlZEltYWdlcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZighZWxlbWVudC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbltpXS50YWdOYW1lICYmIGVsZW1lbnQuY2hpbGRyZW5baV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaW1nJykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGVsZW1lbnQuY2hpbGRyZW5baV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW5XaWR0aCA9IGVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCdtaW4td2lkdGgnKSB8fCBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1taW4td2lkdGgnKTtcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgbWluSGVpZ2h0ID0gZWxlbWVudC5jaGlsZHJlbltpXS5nZXRBdHRyaWJ1dGUoJ21pbi1oZWlnaHQnKSB8fCBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1taW4taGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcmMgPSBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSB8fCBlbGVtZW50LmNoaWxkcmVuW2ldLmdldEF0dHJpYnV0ZSgndXJsJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgc291cmNlcy5wdXNoKHNyYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogbWluV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBydWxlcy5wdXNoKHJ1bGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRJbWFnZUlkID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW5baV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3RBY3RpdmVJbWFnZSA9IGRlZmF1bHRJbWFnZUlkO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjaGVjaygpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2VUb0Rpc3BsYXkgPSBmYWxzZSwgaTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBjaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShpKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzW2ldLm1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IHJ1bGVzW2ldLm1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0Rpc3BsYXkgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFpbWFnZVRvRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAvL25vIHJ1bGUgbWF0Y2hlZCwgc2hvdyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9EaXNwbGF5ID0gZGVmYXVsdEltYWdlSWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RBY3RpdmVJbWFnZSAhPSBpbWFnZVRvRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAvL2ltYWdlIGNoYW5nZVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG9hZGVkSW1hZ2VzW2ltYWdlVG9EaXNwbGF5XSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ltYWdlIGhhcyBub3QgYmVlbiBsb2FkZWQgeWV0LCB3ZSBuZWVkIHRvIGxvYWQgdGhlIGltYWdlIGZpcnN0IGluIG1lbW9yeSB0byBwcmV2ZW50IGZsYXNoIG9mXG4gICAgICAgICAgICAgICAgICAgICAgICAvL25vIGNvbnRlbnRcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltpbWFnZVRvRGlzcGxheV0uc3JjID0gc291cmNlc1tpbWFnZVRvRGlzcGxheV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltsYXN0QWN0aXZlSW1hZ2VdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baW1hZ2VUb0Rpc3BsYXldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkSW1hZ2VzW2ltYWdlVG9EaXNwbGF5XSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0QWN0aXZlSW1hZ2UgPSBpbWFnZVRvRGlzcGxheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IHNvdXJjZXNbaW1hZ2VUb0Rpc3BsYXldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bbGFzdEFjdGl2ZUltYWdlXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baW1hZ2VUb0Rpc3BsYXldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEFjdGl2ZUltYWdlID0gaW1hZ2VUb0Rpc3BsYXk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL21ha2Ugc3VyZSBmb3IgaW5pdGlhbCBjaGVjayBjYWxsIHRoZSAuc3JjIGlzIHNldCBjb3JyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5baW1hZ2VUb0Rpc3BsYXldLnNyYyA9IHNvdXJjZXNbaW1hZ2VUb0Rpc3BsYXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IgPSBuZXcgUmVzaXplU2Vuc29yKGVsZW1lbnQsIGNoZWNrKTtcbiAgICAgICAgICAgIGNoZWNrKCk7XG5cbiAgICAgICAgICAgIGlmICh0cmFja2luZ0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kUmVzcG9uc2l2ZUltYWdlcygpe1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gZ2V0UXVlcnkoKTtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gcXVlcnkoJ1tkYXRhLXJlc3BvbnNpdmUtaW1hZ2VdLFtyZXNwb25zaXZlLWltYWdlXScpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hSZXNwb25zaXZlSW1hZ2UoZWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlZ2V4ID0gLyw/W1xcc1xcdF0qKFteLFxcbl0qPykoKD86XFxbW1xcc1xcdF0qPyg/Om1pbnxtYXgpLSg/OndpZHRofGhlaWdodClbXFxzXFx0XSo/W34kXFxeXT89W1xcc1xcdF0qP1wiW15cIl0qP1wiW1xcc1xcdF0qP10pKykoW14sXFxuXFxzXFx7XSopL21naTtcbiAgICAgICAgdmFyIGF0dHJSZWdleCA9IC9cXFtbXFxzXFx0XSo/KG1pbnxtYXgpLSh3aWR0aHxoZWlnaHQpW1xcc1xcdF0qP1t+JFxcXl0/PVtcXHNcXHRdKj9cIihbXlwiXSo/KVwiW1xcc1xcdF0qP10vbWdpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNzc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5KGNzcykge1xuICAgICAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAgICAgdmFyIHNtYXRjaDtcbiAgICAgICAgICAgIGNzcyA9IGNzcy5yZXBsYWNlKC8nL2csICdcIicpO1xuICAgICAgICAgICAgd2hpbGUgKG51bGwgIT09IChtYXRjaCA9IHJlZ2V4LmV4ZWMoY3NzKSkpIHtcbiAgICAgICAgICAgICAgICBzbWF0Y2ggPSBtYXRjaFsxXSArIG1hdGNoWzNdO1xuICAgICAgICAgICAgICAgIGF0dHJzID0gbWF0Y2hbMl07XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAobnVsbCAhPT0gKGF0dHJNYXRjaCA9IGF0dHJSZWdleC5leGVjKGF0dHJzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWVRdWVyeShzbWF0Y2gsIGF0dHJNYXRjaFsxXSwgYXR0ck1hdGNoWzJdLCBhdHRyTWF0Y2hbM10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0Nzc1J1bGVbXXxTdHJpbmd9IHJ1bGVzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZWFkUnVsZXMocnVsZXMpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9ICcnO1xuICAgICAgICAgICAgaWYgKCFydWxlcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgcnVsZXMgPSBydWxlcy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmICgtMSAhPT0gcnVsZXMuaW5kZXhPZignbWluLXdpZHRoJykgfHwgLTEgIT09IHJ1bGVzLmluZGV4T2YoJ21heC13aWR0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dHJhY3RRdWVyeShydWxlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHJ1bGVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMSA9PT0gcnVsZXNbaV0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBydWxlc1tpXS5zZWxlY3RvclRleHQgfHwgcnVsZXNbaV0uY3NzVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgtMSAhPT0gc2VsZWN0b3IuaW5kZXhPZignbWluLWhlaWdodCcpIHx8IC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtYXgtaGVpZ2h0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UXVlcnkoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoLTEgIT09IHNlbGVjdG9yLmluZGV4T2YoJ21pbi13aWR0aCcpIHx8IC0xICE9PSBzZWxlY3Rvci5pbmRleE9mKCdtYXgtd2lkdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RRdWVyeShzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoNCA9PT0gcnVsZXNbaV0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZFJ1bGVzKHJ1bGVzW2ldLmNzc1J1bGVzIHx8IHJ1bGVzW2ldLnJ1bGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0Q3NzSW5qZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VhcmNoZXMgYWxsIGNzcyBydWxlcyBhbmQgc2V0dXBzIHRoZSBldmVudCBsaXN0ZW5lciB0byBhbGwgZWxlbWVudHMgd2l0aCBlbGVtZW50IHF1ZXJ5IHJ1bGVzLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoVHJhY2tpbmcgYWxsb3dzIGFuZCByZXF1aXJlcyB5b3UgdG8gdXNlIGRldGFjaCwgc2luY2Ugd2Ugc3RvcmUgaW50ZXJuYWxseSBhbGwgdXNlZCBlbGVtZW50c1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICB0cmFja2luZ0FjdGl2ZSA9IHR5cGVvZiB3aXRoVHJhY2tpbmcgPT09ICd1bmRlZmluZWQnID8gZmFsc2UgOiB3aXRoVHJhY2tpbmc7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZFJ1bGVzKGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1J1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLnJ1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1RleHQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5uYW1lICE9PSAnU2VjdXJpdHlFcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZGVmYXVsdENzc0luamVjdGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSAnW3Jlc3BvbnNpdmUtaW1hZ2VdID4gaW1nLCBbZGF0YS1yZXNwb25zaXZlLWltYWdlXSB7b3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZzogMDsgfSBbcmVzcG9uc2l2ZS1pbWFnZV0gPiBpbWcsIFtkYXRhLXJlc3BvbnNpdmUtaW1hZ2VdID4gaW1nIHsgd2lkdGg6IDEwMCU7fSc7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdENzc0luamVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmluZEVsZW1lbnRRdWVyaWVzRWxlbWVudHMoKTtcbiAgICAgICAgICAgIGZpbmRSZXNwb25zaXZlSW1hZ2VzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vIGdhcmJhZ2UgY29sbGVjdGlvbiBwb3NzaWJsZSBpZiB5b3UgZG9uIG5vdCBjYWxsIC5kZXRhY2goKSBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24od2l0aFRyYWNraW5nKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQod2l0aFRyYWNraW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpdGhUcmFja2luZykge1xuICAgICAgICAgICAgICAgIHRocm93ICd3aXRoVHJhY2tpbmcgaXMgbm90IGVuYWJsZWQuIFdlIGNhbiBub3QgZGV0YWNoIGVsZW1lbnRzIHNpbmNlIHdlIGRvbiBub3Qgc3RvcmUgaXQuJyArXG4gICAgICAgICAgICAgICAgJ1VzZSBFbGVtZW50UXVlcmllcy53aXRoVHJhY2tpbmcgPSB0cnVlOyBiZWZvcmUgZG9tcmVhZHkgb3IgY2FsbCBFbGVtZW50UXVlcnllcy51cGRhdGUodHJ1ZSkuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRzLnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgRWxlbWVudFF1ZXJpZXMuZGV0YWNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50cyA9IFtdO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2l0aFRyYWNraW5nIGFsbG93cyBhbmQgcmVxdWlyZXMgeW91IHRvIHVzZSBkZXRhY2gsIHNpbmNlIHdlIHN0b3JlIGludGVybmFsbHkgYWxsIHVzZWQgZWxlbWVudHNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobm8gZ2FyYmFnZSBjb2xsZWN0aW9uIHBvc3NpYmxlIGlmIHlvdSBkb24gbm90IGNhbGwgLmRldGFjaCgpIGZpcnN0KVxuICAgICAqL1xuICAgIEVsZW1lbnRRdWVyaWVzLnVwZGF0ZSA9IGZ1bmN0aW9uKHdpdGhUcmFja2luZykge1xuICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZS51cGRhdGUod2l0aFRyYWNraW5nKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgc2Vuc29yIGFuZCBlbGVtZW50cXVlcnkgaW5mb3JtYXRpb24gZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBFbGVtZW50UXVlcmllcy5kZXRhY2ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmVsZW1lbnRRdWVyaWVzU2V0dXBJbmZvcm1hdGlvbikge1xuICAgICAgICAgICAgLy9lbGVtZW50IHF1ZXJpZXNcbiAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudFF1ZXJpZXNTZW5zb3IuZGV0YWNoKCk7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5lbGVtZW50UXVlcmllc1NldHVwSW5mb3JtYXRpb247XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5lbGVtZW50UXVlcmllc1NlbnNvcjtcblxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQucmVzaXplU2Vuc29yKSB7XG4gICAgICAgICAgICAvL3Jlc3BvbnNpdmUgaW1hZ2VcblxuICAgICAgICAgICAgZWxlbWVudC5yZXNpemVTZW5zb3IuZGV0YWNoKCk7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5yZXNpemVTZW5zb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkZXRhY2hlZCBhbHJlYWR5JywgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWxlbWVudFF1ZXJpZXMud2l0aFRyYWNraW5nID0gZmFsc2U7XG5cbiAgICBFbGVtZW50UXVlcmllcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghRWxlbWVudFF1ZXJpZXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEVsZW1lbnRRdWVyaWVzLmluc3RhbmNlID0gbmV3IEVsZW1lbnRRdWVyaWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBFbGVtZW50UXVlcmllcy5pbnN0YW5jZS5pbml0KEVsZW1lbnRRdWVyaWVzLndpdGhUcmFja2luZyk7XG4gICAgfTtcblxuICAgIHZhciBkb21Mb2FkZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgLyogSW50ZXJuZXQgRXhwbG9yZXIgKi9cbiAgICAgICAgLypAY2Nfb25cbiAgICAgICAgIEBpZiAoQF93aW4zMiB8fCBAX3dpbjY0KVxuICAgICAgICAgZG9jdW1lbnQud3JpdGUoJzxzY3JpcHQgaWQ9XCJpZVNjcmlwdExvYWRcIiBkZWZlciBzcmM9XCIvLzpcIj48XFwvc2NyaXB0PicpO1xuICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2llU2NyaXB0TG9hZCcpLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSB7XG4gICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgfVxuICAgICAgICAgfTtcbiAgICAgICAgIEBlbmQgQCovXG4gICAgICAgIC8qIE1vemlsbGEsIENocm9tZSwgT3BlcmEgKi9cbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8qIFNhZmFyaSwgaUNhYiwgS29ucXVlcm9yICovXG4gICAgICAgIGVsc2UgaWYgKC9LSFRNTHxXZWJLaXR8aUNhYi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIHZhciBET01Mb2FkVGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKC9sb2FkZWR8Y29tcGxldGUvaS50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoRE9NTG9hZFRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgLyogT3RoZXIgd2ViIGJyb3dzZXJzICovXG4gICAgICAgIGVsc2Ugd2luZG93Lm9ubG9hZCA9IGNhbGxiYWNrO1xuICAgIH07XG5cbiAgICBFbGVtZW50UXVlcmllcy5saXN0ZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9tTG9hZGVkKEVsZW1lbnRRdWVyaWVzLmluaXQpO1xuICAgIH07XG5cbiAgICAvLyBtYWtlIGF2YWlsYWJsZSB0byBjb21tb24gbW9kdWxlIGxvYWRlclxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRWxlbWVudFF1ZXJpZXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cuRWxlbWVudFF1ZXJpZXMgPSBFbGVtZW50UXVlcmllcztcbiAgICAgICAgRWxlbWVudFF1ZXJpZXMubGlzdGVuKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZW1lbnRRdWVyaWVzO1xuXG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWVsZW1lbnQtcXVlcmllcy9zcmMvRWxlbWVudFF1ZXJpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
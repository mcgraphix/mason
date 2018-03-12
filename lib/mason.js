import { MasonDefaultPacker } from "./mason-default-packer";
var MasonOptions = /** @class */ (function () {
    function MasonOptions() {
        this.columns = 12;
        this.threshold = 0;
    }
    return MasonOptions;
}());
export { MasonOptions };
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
        if (rendererOrOptions["renderer"]) {
            var opts = rendererOrOptions;
            this.renderer = opts.renderer;
            this.containerWidth = opts.containerWidth;
            this.columns = opts.columns;
            this.threshold = opts.threshold;
            this.packer = opts.packer || new MasonDefaultPacker();
        }
        else {
            this.renderer = rendererOrOptions;
            this.containerWidth = containerWidth;
            this.columns = columns;
            this.threshold = threshold;
            this.packer = new MasonDefaultPacker();
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
            var cols = Math.round(elementWidth / _this.containerWidth * _this.columns);
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
export { Mason };
//# sourceMappingURL=mason.js.map
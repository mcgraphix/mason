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
export { Mason };
;
//# sourceMappingURL=mason.js.map
var Mason = (function () {
    function Mason(containerWidth) {
        this.containerWidth = containerWidth;
        this.columnBottoms = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    Mason.prototype.findBestColumn = function (requiredColumns, element) {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        var result = this.columnBottoms.reduce(function (accumulator, column, idx, all) {
            // starting at column X, if we put it here, what would be
            // its starting point
            if (idx + requiredColumns > 12) {
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
                return { x: idx, yPos: curr };
            }
            else {
                if (curr < best.yPos && curr !== -1) {
                    return { x: idx, yPos: curr };
                }
                else {
                    return best;
                }
            }
        }, null);
        bestFit.element = element;
        return bestFit;
    };
    Mason.prototype.fit = function (elements) {
        var _this = this;
        var coordsList = [];
        elements.forEach(function (element, idx) {
            var cols = Math.round((element.offsetWidth / _this.containerWidth) * 12);
            // can't be bigger than 12 columns
            if (cols > 12) {
                cols = 12;
            }
            var bestFit = _this.findBestColumn(cols, element);
            // update the column bottoms for all the columns this tile crosses when positioned at the best
            // location
            var height = element.offsetHeight;
            var startCol = bestFit.x;
            var endCol = startCol + cols;
            for (var i = startCol; i < endCol; i++) {
                _this.columnBottoms[i] = bestFit.yPos + height;
            }
            // this is a tuple where x is the column index and yPos is the pixel coord to position at.
            coordsList.push(bestFit);
        });
        // return the list of coordinates for each tile
        return coordsList;
    };
    return Mason;
}());
export { Mason };
;
//# sourceMappingURL=mason.js.map
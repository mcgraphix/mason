/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
var MasonSimplePacker = /** @class */ (function () {
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
export { MasonSimplePacker };
//# sourceMappingURL=mason-simple-packer.js.map
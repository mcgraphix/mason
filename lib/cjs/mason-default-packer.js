"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasonDefaultPacker = void 0;
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
exports.MasonDefaultPacker = MasonDefaultPacker;
//# sourceMappingURL=mason-default-packer.js.map
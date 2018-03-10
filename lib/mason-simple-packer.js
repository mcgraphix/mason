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
export { MasonSimplePacker };
//# sourceMappingURL=mason-simple-packer.js.map
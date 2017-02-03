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
export { MasonDomRenderer };
//# sourceMappingURL=mason-dom-renderer.js.map
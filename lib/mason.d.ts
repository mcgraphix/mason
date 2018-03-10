export interface MasonCoord {
    xColumns: number;
    yUnits: number;
    element: any;
}
/**
 * The MasonRender interface allows you to use mason to layout anything for which
 * you can calculate it's width and height and set its position based on
 * columns (for x axis) and units (for y axis)
 *
 */
export interface MasonRenderer {
    /**
     * This is called by Mason when so that the renderer knows how many columns it should use when
     * setting the new position
     * @param columns
     */
    setColumns(columns: number): void;
    /**
     * Takes some brick that is going to be positioned with Mason and returns it's width
     * @param brick - the thing being positioned
     * @return the width in units. This value will be compared to Mason's containerWidth to determing
     *      how many columns wide it is.
     */
    getElementWidth(brick: any): number;
    /**
     * Takes some brick that is going to be positioned with Mason and returns it's height
     * @param brick - the thing being positioned
     * @return the height in units. This value will be used to size the items and prevent overlap
     */
    getElementHeight(brick: any): number;
    /**
     * Sets the new position of the brick
     * @param brick - the thing being positioned
     * @param xCoordInColumns - the x coordinate in columns
     * @param yCoordInUnits
     */
    setPosition(brick: any, xCoordInColumns: number, yCoordInUnits: number): void;
}
export interface MasonPacker {
    findBestColumn: (requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number) => MasonCoord;
}
export declare class MasonOptions {
    renderer: MasonRenderer;
    containerWidth: number;
    columns: number;
    threshold: number;
    packer: MasonPacker;
}
export declare class Mason {
    containerWidth: number;
    columnBottoms: number[];
    columns: number;
    renderer: MasonRenderer;
    packer?: MasonPacker;
    threshold: number;
    constructor(opts: MasonOptions);
    private findBestColumn(requiredColumns, element, elementIndex);
    /**
     * Takes a list of elements and returns the new coords for each one. This does not reposition anything.
     * You might use this if you want to handle how and when things get repositioned.
     *
     * See layout() if you want everything position automatically.
     *
     * @param elements
     * @returns {coords: MasonCoord[], totalHeight: number}
     */
    fit(elements: any[]): {
        coords: MasonCoord[];
        totalHeight: number;
    };
    /**
     * This will take the list of elements, find their new locations and then use the MasonRenderer
     * to reposition all the bricks into their new home.
     * @param elements
     * @returns the height that the container must now be to hold the items.
     */
    layout(elements: any[]): number;
}

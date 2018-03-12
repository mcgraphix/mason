
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
    setPosition(brick: any, xCoordInColumns: number, yCoordInUnits: number):void;
}


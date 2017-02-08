
export interface MasonCoord {
    xColumns:number,
    yUnits: number,
    element:any
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
    setPosition(brick: any, xCoordInColumns: number, yCoordInUnits: number):void;
}

export class MasonOptions {
    renderer: MasonRenderer;
    containerWidth: number;
    columns: number = 12;
    threshold: number = 0;
}

export class Mason {
    containerWidth: number;
    columnBottoms: number[];
    columns = 12;
    renderer: MasonRenderer;

    // This is the wiggle room Mason has when choosing a column for a brick
    // When starting on the left, Mason will only consider a column choose as a better fit
    // if it is better by this amount or more. This prevents bricks from being placed to the
    threshold = 40;

    constructor(opts: MasonOptions);
    constructor(rendererOrOptions:MasonRenderer | MasonOptions, containerWidth?: number,
                columns:number = 12, threshold: number = 0) {
        this.columnBottoms = [];

        if (rendererOrOptions['renderer']) {
            let opts = (<MasonOptions>rendererOrOptions);
            this.renderer = opts.renderer;
            this.containerWidth = opts.containerWidth;
            this.columns = opts.columns;
            this.threshold = opts.threshold;
        } else {
            this.renderer = (<MasonRenderer>rendererOrOptions);
            this.containerWidth = containerWidth;
            this.columns = columns;
            this.threshold = threshold;
        }


        while(this.columnBottoms.length < this.columns) {
            this.columnBottoms.push(0);
        }

        this.renderer.setColumns(columns);
    }


    private findBestColumn(requiredColumns, element): MasonCoord {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        let result = this.columnBottoms.reduce((accumulator, column, idx, all) => {
            // starting at column X, if we put it here, what would be
            // its starting point

            if (idx + requiredColumns > this.columns) {
                accumulator.push(-1);
                return accumulator;
            } else {
                // get the height at which it would have to be positioned
                // in order to not overlap something
                let yPos = -1;

                for (let i = idx; i < requiredColumns + idx; i++) {
                    yPos = Math.max(yPos, all[i]);
                }

                accumulator.push(yPos);
                return accumulator;
            }
        }, []);


        // now the we have the y coord that it would need to be at for each starting column
        // we just need to figure out which one is lowest (while taking into account the threshold)
        // and we're done
        let bestFit = result.reduce((best, curr, idx) => {
            if (!best) {
                return {xColumns: idx, yUnits: curr};
            } else {
                if (curr < (best.yUnits - this.threshold) && curr !== -1) {
                    return {xColumns: idx, yUnits: curr};
                } else {
                    return best;
                }
            }
        }, null);

        bestFit.element = element;
        return bestFit;
    }

    /**
     * Takes a list of elements and returns the new coords for each one. This does not reposition anything.
     * You might use this if you want to handle how and when things get repositioned.
     *
     * See layout() if you want everything position automatically.
     *
     * @param elements
     * @returns {coords: MasonCoord[], totalHeight: number}
     */
    fit(elements: any[]): {coords:MasonCoord[], totalHeight:number} {

        let coordsList:MasonCoord[] = [];
        let totalHeight = 0;

        elements.forEach((element, idx) => {
            let elementWidth = this.renderer.getElementWidth(element);
            let elementHeight = this.renderer.getElementHeight(element);

            let cols = Math.round((elementWidth / this.containerWidth) * this.columns);
            // can't be bigger than 'all' columns
            if (cols > this.columns) {
                cols = this.columns;
            }

            let bestFit: MasonCoord = this.findBestColumn(cols, element);

            // update the column bottoms for all the columns this tile crosses when positioned at the best
            // location

            let startCol = bestFit.xColumns;
            let endCol = startCol + cols;

            for (let i = startCol; i < endCol; i++) {

                this.columnBottoms[i] = bestFit.yUnits + elementHeight;
            }

            // this is a tuple where x is the column index and yPos is the pixel coord to position at.
            coordsList.push(bestFit);

            // update the total height
            totalHeight = Math.max(totalHeight, elementHeight + bestFit.yUnits);
        });

        // return the list of coordinates for each tile
        return {coords: coordsList, totalHeight: totalHeight};
    }

    /**
     * This will take the list of elements, find their new locations and then use the MasonRenderer
     * to reposition all the bricks into their new home.
     * @param elements
     * @returns the height that the container must now be to hold the items.
     */
    layout(elements: any[]): number {

        let layoutResult = this.fit(elements);
        layoutResult.coords.forEach((coord: MasonCoord) => {
            // apply the calculated position for each brick however you want. In this case
            // we are just setting the CSS position. Animation will be provided via CSS
            this.renderer.setPosition(coord.element, coord.xColumns, coord.yUnits);

        });

        return layoutResult.totalHeight;
    }

};



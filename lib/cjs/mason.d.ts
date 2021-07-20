import { MasonRenderer } from "./mason-renderer";
import { MasonPacker } from "./mason-packer";
import { MasonCoord } from "./mason-coord";
export declare class MasonOptions {
    renderer: MasonRenderer;
    containerWidth: number;
    columns: number;
    threshold: number;
    packer?: MasonPacker;
}
export declare class Mason {
    containerWidth: number;
    columnBottoms: number[];
    columns: number;
    renderer: MasonRenderer;
    packer: MasonPacker;
    threshold: number;
    constructor(opts: MasonOptions);
    private findBestColumn;
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

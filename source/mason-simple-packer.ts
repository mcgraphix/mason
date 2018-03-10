import { MasonPacker, MasonCoord } from "./mason";

/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
export class MasonSimplePacker implements MasonPacker {
    findBestColumn(requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number) {
        // This packer simply figures out which column it should
        // go in based on the element index and assumes that all
        // elements are require the same number of columns
        const columns = columnBottoms.length;
        const nextColumn = (requiredColumns * elementIndex) % columns;
        
        return {xColumns: nextColumn, yUnits: columnBottoms[nextColumn], element: element};
    }
}

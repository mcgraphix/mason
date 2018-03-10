import { MasonPacker, MasonCoord } from "./mason";

/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
export class MasonSimplePacker implements MasonPacker {
    findBestColumn(requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number) {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        let columns = columnBottoms.length;

        let result = columnBottoms.reduce((accumulator, column, idx, all) => {
            // starting at column X, if we put it here, what would be
            // its starting point

            if (idx + requiredColumns > columns) {
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

        let nextColumn = (requiredColumns * elementIndex) % columns;
        let bestFit: MasonCoord = {xColumns: nextColumn, yUnits: columnBottoms[nextColumn], element: element}
        
        return bestFit;
    }
}

import { MasonPacker } from "./mason-packer";
import { MasonCoord} from './mason-coord';

/**
 * Default packer used to position each brick as close to the top as possible
 */
export class MasonDefaultPacker implements MasonPacker {
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


        // now the we have the y coord that it would need to be at for each starting column
        // we just need to figure out which one is lowest (while taking into account the threshold)
        // and we're done
        let bestFit = result.reduce((best, curr, idx) => {
            if (!best) {
                return {xColumns: idx, yUnits: curr};
            } else {
                if (curr < (best.yUnits - threshold) && curr !== -1) {
                    return {xColumns: idx, yUnits: curr};
                } else {
                    return best;
                }
            }
        }, null);

        bestFit.element = element;
        return bestFit;
    }
}

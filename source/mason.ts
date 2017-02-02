
export interface MasonCoord {
    x:number,
    yPos: number,
    element:any
}

export class Mason {
    containerWidth: number;
    columnBottoms: number[];

    constructor(containerWidth: number) {
        this.containerWidth = containerWidth;
        this.columnBottoms = [0,0,0,0,0,0,0,0,0,0,0,0];
    }


    findBestColumn(requiredColumns, element): MasonCoord {
        // we need to look at all the columns and find the which ones
        // this would should span based on presenting it as close to the
        // top as possible.
        let result = this.columnBottoms.reduce((accumulator, column, idx, all) => {
            // starting at column X, if we put it here, what would be
            // its starting point

            if (idx + requiredColumns > 12) {
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
        // we just need to figure out which one is lowest and we're done
        let bestFit = result.reduce((best, curr, idx) => {
            if (!best) {
                return {x: idx, yPos: curr};
            } else {
                if (curr < best.yPos && curr !== -1) {
                    return {x: idx, yPos: curr};
                } else {
                    return best;
                }
            }
        }, null);

        bestFit.element = element;
        return bestFit;
    }

    fit(elements: any[]): MasonCoord[] {

       let coordsList:MasonCoord[] = [];

        elements.forEach((element, idx) => {

            let cols = Math.round((element.offsetWidth / this.containerWidth) * 12);
            // can't be bigger than 12 columns
            if (cols > 12) {
                cols = 12;
            }

            let bestFit: MasonCoord = this.findBestColumn(cols, element);

            // update the column bottoms for all the columns this tile crosses when positioned at the best
            // location
            let height = element.offsetHeight;

            let startCol = bestFit.x;
            let endCol = startCol + cols;

            for (let i = startCol; i < endCol; i++) {

                this.columnBottoms[i] = bestFit.yPos + height;
            }

            // this is a tuple where x is the column index and yPos is the pixel coord to position at.
            coordsList.push(bestFit);
        });

        // return the list of coordinates for each tile
        return coordsList;
    }

};



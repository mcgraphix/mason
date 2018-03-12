import {MasonCoord} from './mason-coord';

/**
 * Interface for objects that can determine the best column to put an element in.
 * This will be called sequentially for each brick being positioned.
 */
export interface MasonPacker {
    /**
     * Determines the best column for an element
     * @param requiredColumns - The number of columns the element requires
     * @param element - The element being positioned
     * @param elementIndex - the index of the element
     * @param columnBottoms - the current position of bottom of each column based on
     *  the other elements that are in it or cross it
     * @param threshold - the threshold used to determine when an element should be placed
     *  in a column to the left even if it is lower than if it were positioned in a column to
     *  the right
     * @returns MasonCoord
     */
    findBestColumn: (requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number) => MasonCoord;
}

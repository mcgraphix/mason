import { MasonPacker, MasonCoord } from "./mason";
/**
 * Simple packer that positions each brick in the next column. This will
 * fail spectacularly with columns of different widths.
 */
export declare class MasonSimplePacker implements MasonPacker {
    findBestColumn(requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number): MasonCoord;
}

import { MasonPacker } from "./mason";
/**
 * Default packer used to position each brick as close to the top as possible
 */
export declare class MasonDefaultPacker implements MasonPacker {
    findBestColumn(requiredColumns: number, element: any, elementIndex: number, columnBottoms: number[], threshold: number): any;
}

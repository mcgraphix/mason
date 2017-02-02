export interface MasonCoord {
    x: number;
    yPos: number;
    element: any;
}
export declare class Mason {
    containerWidth: number;
    columnBottoms: number[];
    constructor(containerWidth: number);
    findBestColumn(requiredColumns: any, element: any): MasonCoord;
    fit(elements: any[]): MasonCoord[];
}

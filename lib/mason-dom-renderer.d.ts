/**
 * Created by mckeowr on 2/3/17.
 */
export declare class MasonDomRenderer {
    columns: number;
    setColumns(columns: number): void;
    getElementWidth(element: HTMLElement): number;
    getElementHeight(element: HTMLElement): number;
    setPosition(element: HTMLElement, leftInCols: number, topInUnits: number): void;
}

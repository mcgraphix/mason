import { MasonRenderer } from './mason-renderer';
/**
 * Created by mckeowr on 2/3/17.
 */
export class MasonDomRenderer implements MasonRenderer {
    columns:number;

    setColumns(columns: number) {
        this.columns = columns;
    }

    getElementWidth(element: HTMLElement): number {
        return element.offsetWidth;
    }

    getElementHeight(element: HTMLElement): number {
        return element.offsetHeight;
    }

    setPosition(element: HTMLElement, leftInCols: number, topInUnits: number) {
        element.style.left =((leftInCols / this.columns) * 100) + '%';
        element.style.top = topInUnits + 'px';
    }
}
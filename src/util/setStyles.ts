import { IStyle, StyleName } from "@/interface/IStyle";

export function setStyles(element: HTMLElement, styles: IStyle): void {
    Object.keys(styles).forEach((key: string) => {
        let unit = '';
        if (styles[<StyleName>key] === 'number') {
            unit = 'px';
        }
        element.style[<StyleName>key] = `${styles[<StyleName>key]}${unit}`;
    });
}
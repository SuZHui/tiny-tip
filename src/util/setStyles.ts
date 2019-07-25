import { IStyle } from "@/interface/IStyle";

export function setStyles(element: HTMLElement, styles: IStyle): void {
    Object.keys(styles).forEach((key: string) => {
        let unit = '';
        if (
            ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(key) !== -1
            && styles[<keyof CSSStyleDeclaration>key] === 'number') {
            unit = 'px';
        }
        (element.style[<keyof CSSStyleDeclaration>key] as string) = `${styles[<keyof CSSStyleDeclaration>key]}${unit}`;
    });
}
export function getStyleComputedProperty(element: HTMLElement, property: string | null = null) {
    if (element.nodeType !== Node.ELEMENT_NODE || element.nodeType !== 1) {
        return [];
    }
    const window = element.ownerDocument!.defaultView;
    const css = window!.getComputedStyle(element, null);
    return property ? css[<any>property] : css;
}
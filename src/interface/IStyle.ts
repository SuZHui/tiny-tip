// export type IStyleName = 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left' ;
export enum StyleName {
    width = 'width' ,
    height = 'height' , 
    top = 'top' , 
    right = 'right' , 
    bottom = 'bottom' ,
    left = 'left' 
};
export type IStyle = {
    [key in keyof CSSStyleDeclaration]?: string | number;
};
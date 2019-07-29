export interface ICatapultConfig {
    placement: 'top' | 'bottom' | 'left' | 'right';
    onCreate?: Function;
    onUpdate?: Function;
}
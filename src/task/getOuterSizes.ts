export function getOuterSizes(element: HTMLElement)
    :{ width: number; height: number } 
{
    const window = element.ownerDocument!.defaultView;
    const styles = window!.getComputedStyle(element);
    const x = parseFloat(styles.marginTop || '0') + parseFloat(styles.marginBottom || '0');
    const y = parseFloat(styles.marginLeft || '0') + parseFloat(styles.marginRight || '0');
    const result = {
        width: element.offsetWidth + y,
        height: element.offsetHeight + x
    }
    return result;
}
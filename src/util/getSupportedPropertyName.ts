export function getSupportedPropertyName(property: string): string | null {
    const prefixes = [ false, 'ms', 'webkit', 'Moz', 'O' ];
    const upperProp = `${property.charAt(0).toUpperCase()}${property.slice(1)}`;

    for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        const toCheck = prefix ? `${prefix}${upperProp}` : property;

        if (document.body.style.hasOwnProperty(toCheck)) {
            return toCheck;
        }
    }
    return null;
}
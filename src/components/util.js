export const replaceSpecialCharacters = (str) => {
    return str
        .replace(/[_-]/g, ' ')
        .replace(/([a-zA-Z])(\d|[A-Z])/g, '$1 $2');
};

export const snakeCaseToTitleCase = (str) => {
    return str
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
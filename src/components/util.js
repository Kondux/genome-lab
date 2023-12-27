export const addSpaceBeforeNumbers = (text) => {
	return text.replace(/(\d+)/g, ' $1');
};

export const camelCaseToTitleCase = (text) => {
	return text
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const replaceDashesAndUnderscores = (text) => {
	return text.replace(/[_-]/g, ' ');
};

export const snakeCaseToTitleCase = (text) => {
	return text
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

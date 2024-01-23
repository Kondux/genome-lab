export const addSpaceBeforeNumbers = (text) => {
	if (typeof text !== 'string') {
		return text;
	}
	return text.replace(/(\d+)/g, ' $1');
};

export const camelCaseToTitleCase = (text) => {
	if (typeof text !== 'string') {
		return text;
	}

	return text
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const replaceDashesAndUnderscores = (text) => {
	if (typeof text !== 'string') {
		return text;
	}

	return text.replace(/[_-]/g, ' ');
};

export const snakeCaseToTitleCase = (text) => {
	if (typeof text !== 'string') {
		return text;
	}


	return text
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const toTitleCase = (text) => {
	if (typeof text !== 'string') {
		return text;
	}


	return text.replace(/\w\S*/g, function (match) {
		return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
	});
};

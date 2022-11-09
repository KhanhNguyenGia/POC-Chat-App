export const getError = (error) => {
	const code = error.split('/')[1].replace(/-/g, ' ');
	return code.charAt(0).toUpperCase() + code.slice(1);
};

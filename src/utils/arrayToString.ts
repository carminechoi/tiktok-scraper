const arrayToString = (items: string[], separator: string = ","): string => {
	if (items) {
		return items.map((item) => `#${item}`).join(separator);
	} else {
		return "";
	}
};

export default arrayToString;

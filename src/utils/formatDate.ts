const formatDate = (timestamp: number) => {
	return new Date(timestamp * 1000).toLocaleDateString("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		timeZone: "America/Los_Angeles",
	});
};

export default formatDate;

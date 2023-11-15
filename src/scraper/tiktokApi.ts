// Skeleton API Request
export const fetchSkeletonTikTokData = async () => {
	try {
		const placeholderURL = "https://httpbin.org/get";
		const response = await fetch(placeholderURL, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const responseData = await response.json();
		return responseData;
	} catch (error: unknown) {
		console.error("Error fetching TikTok data:", error);
		throw error;
	}
};

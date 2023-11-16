export const fetchTikTokVideosByHashtag = async (
	hashtag: string = "fashion"
): Promise<string[]> => {
	try {
		const url = `https://tiktok.com/tag/${hashtag}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const html = await response.text();

		// Extract video urls
		const videoURLs: string[] = [];
		const regex = /href="([^"]*tiktok\.com\/@[^"]*)"/g;

		let match;
		while ((match = regex.exec(html)) !== null) {
			videoURLs.push(match[1]);
		}

		return videoURLs;
	} catch (error) {
		console.error("Error fetching TikTok data:", error);
		throw error;
	}
};

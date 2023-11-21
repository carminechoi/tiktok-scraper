const { TT_CHAIN_TOKEN, TTWID } = process.env;

if (!TT_CHAIN_TOKEN || !TTWID) {
	throw new Error("Missing TikTok API environment variables");
}

const fetchTikTokVideosByHashtag = async (
	hashtag: string = "fashion",
	offset: number = 0
) => {
	try {
		const url = `https://www.tiktok.com/api/search/general/full/?keyword=%23${hashtag}&offset=${offset}`;

		const headers = new Headers({
			Cookie: `tt_chain_token=${TT_CHAIN_TOKEN}; ttwid=${TTWID};`,
		});

		const response = await fetch(url, { method: "get", headers: headers });

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching TikTok hashtag data:", error);
		throw error;
	}
};

const fetchTikTokTrendingVideos = async (count: number = 50) => {
	try {
		const url = `https://m.tiktok.com/api/item_list/?count=${count}&id=1&type=5&maxCursor=0&minCursor=0&sourceType=12`;
		const headers = new Headers({
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"sec-ch-ua":
				'"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			host: "t.tiktok.com",
			Cookie: `tt_chain_token=${TT_CHAIN_TOKEN}; ttwid=${TTWID};`,
		});

		const response = await fetch(url, {
			method: "get",
			headers: headers,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return data.items;
	} catch (error) {
		console.error("Error fetching TikTok trending data:", error);
		throw error;
	}
};

const fetchTiktokVideo = async (videoUrl: string): Promise<string> => {
	try {
		const headers = new Headers({
			Cookie: `tt_chain_token=${TT_CHAIN_TOKEN}; ttwid=${TTWID};`,
		});
		const response = await fetch(videoUrl, {
			method: "get",
			headers: headers,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.text();
	} catch (error) {
		console.error("Error fetching TikTok video:", error);
		throw error;
	}
};

export {
	fetchTikTokVideosByHashtag,
	fetchTikTokTrendingVideos,
	fetchTiktokVideo,
};

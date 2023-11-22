const { TT_CHAIN_TOKEN, TTWID } = process.env;

if (!TT_CHAIN_TOKEN || !TTWID) {
	throw new Error("Missing TikTok API environment variables");
}

const baseUrl = "https://www.tiktok.com/api";

const fetchTikTokPostsByHashtag = async (
	hashtag: string = "fashion",
	offset: number = 0,
	searchId: string = ""
) => {
	try {
		const url = `${baseUrl}/search/general/full/?keyword=%23${hashtag}&offset=${offset}&search_id=${searchId}`;
		const headers = new Headers({
			Host: "www.tiktok.com",
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

const fetchTikTokCommentsByPostId = async (
	id: number,
	count: number = 20,
	cursor: number = 0
) => {
	try {
		const url = `${baseUrl}/comment/list/?aweme_id=${id}&count=${count}&cursor=${cursor}`;
		const headers = new Headers({
			Host: "www.tiktok.com",
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

export { fetchTikTokPostsByHashtag, fetchTikTokCommentsByPostId };

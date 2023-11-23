import { TT_CHAIN_TOKEN, TTWID, SESSIONID_SS } from "../constants";

const BASE_URL = "https://www.tiktok.com/api";
const HEADERS = new Headers({
	Host: "www.tiktok.com",
	Cookie: `tt_chain_token=${TT_CHAIN_TOKEN}; ttwid=${TTWID}; sessionid_ss=${SESSIONID_SS}`,
});

const handleFetchError = (error: any, source: string) => {
	console.error(`Error in ${source}:`, error);
	throw { error: `Error in ${source}: ${error.message}` };
};

const fetchTikTokPostsByHashtag = async (
	hashtag: string = "fashion",
	offset: number = 0,
	searchId: string = ""
) => {
	try {
		const url = `${BASE_URL}/search/general/full/?keyword=%23${hashtag}&offset=${offset}&search_id=${searchId}`;
		const response = await fetch(url, { method: "get", headers: HEADERS });

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		handleFetchError(error, "fetchTikTokPostsByHashtag");
	}
};

const fetchTikTokCommentsByPostId = async (
	id: string,
	count: number = 20,
	cursor: number = 0
) => {
	try {
		const url = `${BASE_URL}/comment/list/?aweme_id=${id}&count=${count}&cursor=${cursor}`;
		const response = await fetch(url, { method: "get", headers: HEADERS });

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		handleFetchError(error, "fetchTikTokCommentsByPostId");
	}
};

export { fetchTikTokPostsByHashtag, fetchTikTokCommentsByPostId };

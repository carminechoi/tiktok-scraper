import {
	fetchTikTokTrendingVideos,
	fetchTikTokVideosByHashtag,
} from "./tiktokApi";

export const tiktokScraper = async () => {
	// Retrive web page
	const hashTagVideoList = await fetchTikTokVideosByHashtag();
	// console.log(hashTagVideoList);

	const trendingVideoList = await fetchTikTokTrendingVideos();
	console.log(trendingVideoList);
	// Process the data as needed
};

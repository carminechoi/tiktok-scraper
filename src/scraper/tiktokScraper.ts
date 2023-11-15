import { fetchSkeletonTikTokData } from "./tiktokApi";

export const tiktokScraper = async () => {
	// Retrive web page
	const responseData = await fetchSkeletonTikTokData();
	console.log(responseData);
	// Process the data as needed
};

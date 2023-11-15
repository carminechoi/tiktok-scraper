import { fetchSkeletonTikTokData } from "./tiktokApi";

export const tiktokScraper = async () => {
	let cursor = "";

	// Retrive web page
	const responseData = await fetchSkeletonTikTokData(cursor);

	// Process the data as needed

	// Update cursor for the next iteration
	cursor = responseData.nextCursor;
};

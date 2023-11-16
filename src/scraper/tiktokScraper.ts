import * as cheerio from "cheerio";
import {
	fetchTikTokTrendingVideos,
	fetchTikTokVideosByHashtag,
	fetchTiktokVideo,
} from "./tiktokApi";

export const tiktokScraper = async () => {
	// Retrieve video urls
	const fashionVideoList = await fetchTikTokVideosByHashtag("fashion");
	const ootdVideoList = await fetchTikTokVideosByHashtag("ootd");
	const trendingVideoList = await fetchTikTokTrendingVideos(1);

	const videoUrlList = [
		...fashionVideoList,
		...ootdVideoList,
		...trendingVideoList,
	];

	// For each video: scrape attributes, score, and save to CSV
	videoUrlList.map((videoUrl) => {
		const attributes = getAttributes(videoUrl);
	});
};

const getAttributes = async (videoUrl: string) => {
	try {
		const html = await fetchTiktokVideo(videoUrl);

		// Load HTML into Cheerio
		const $ = cheerio.load(html);
		const scriptContent = $("#SIGI_STATE").text();

		if (scriptContent) {
			try {
				const jsonData = JSON.parse(scriptContent);
				const videoId = Object.keys(jsonData.ItemModule)[0];
				const itemModule = jsonData.ItemModule[videoId];

				const stats = itemModule?.stats;

				const hashtags: string[] = [];
				itemModule.challenges.forEach((challenge: any) => {
					hashtags.push(challenge.title);
				});

				const attributes = {
					PostURL: videoUrl,
					Account: itemModule?.author,
					Views: stats?.playCount,
					Likes: stats?.diggCount,
					"Comment Count": stats?.commentCount,
					"Saved Count": stats?.collectCount,
					Caption: itemModule?.desc,
					Hashtags: hashtags,
					"Date Posted": formatDate(itemModule?.createTime),
					"Date Collected": formatDate(Date.now() / 1000),
					Shares: stats?.shareCount,
				};

				console.log(attributes);
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}
		} else {
			console.log("Script with video ID not found.");
		}
	} catch (error) {
		console.error("Error fetching metadata:", error);
		throw error;
	}
};

const formatDate = (timestamp: number) => {
	return new Date(timestamp * 1000).toLocaleDateString("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		timeZone: "America/Los_Angeles",
	});
};

import * as cheerio from "cheerio";
import { createObjectCsvWriter } from "csv-writer";
import {
	fetchTikTokTrendingVideos,
	fetchTikTokVideosByHashtag,
	fetchTiktokVideo,
} from "./tiktokApi";
import { ObjectMap } from "csv-writer/src/lib/lang/object";

export const tiktokScraper = async () => {
	// Retrieve video urls
	// const fashionVideoList = await fetchTikTokVideosByHashtag("fashion");
	// const ootdVideoList = await fetchTikTokVideosByHashtag("ootd");
	const trendingVideoList = await fetchTikTokTrendingVideos(2);

	const videoUrlList = [
		// ...fashionVideoList,
		// ...ootdVideoList,
		...trendingVideoList,
	];

	// For each video: scrape attributes, score, and save to CSV
	const videoAttributesList: any = [];
	await Promise.all(
		videoUrlList.map(async (videoUrl) => {
			const attributes = await getAttributes(videoUrl);
			if (attributes) videoAttributesList.push(attributes);
		})
	);

	saveToCSV(videoAttributesList);
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

				let hashtags: string = "";
				itemModule.challenges.forEach((challenge: any) => {
					hashtags += "#" + challenge.title + "\n";
				});

				const attributes = {
					PostURL: videoUrl,
					Account: itemModule?.author,
					Views: stats?.playCount,
					Likes: stats?.diggCount,
					"Comment Count": stats?.commentCount,
					Saved: stats?.collectCount,
					Caption: itemModule?.desc,
					Hashtags: hashtags,
					"Date Posted": formatDate(itemModule?.createTime),
					"Date Collected": formatDate(Date.now() / 1000),
					Shares: stats?.shareCount,
				};

				return attributes;
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}
			return null;
		} else {
			console.error("Script with video ID not found.");
			return null;
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

const saveToCSV = (record: ObjectMap<any>[]) => {
	const csvWriter = createObjectCsvWriter({
		path: "tiktok_fashion_posts.csv",
		header: [
			{ id: "PostURL", title: "PostURL" },
			{ id: "Account", title: "Account" },
			{ id: "Views", title: "Views" },
			{ id: "Likes", title: "Likes" },
			{ id: "Comment Count", title: "Comment Count" },
			{ id: "Saved", title: "Saved" },
			{ id: "Caption", title: "Caption" },
			{ id: "Hashtags", title: "Hashtags" },
			{ id: "Date Posted", title: "Date Posted" },
			{ id: "Date Collected", title: "Date Collected" },
			{ id: "Shares", title: "Shares" },
		],
	});

	csvWriter
		.writeRecords(record)
		.then(() => {
			console.log("...Done");
		})
		.catch((error) => {
			console.error("Error writing to CSV:", error);
		});
};

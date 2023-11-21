import { createObjectCsvWriter } from "csv-writer";
import {
	fetchTikTokVideosByHashtag,
	fetchTikTokTrendingVideos,
} from "./tiktokApi";
import { keywords } from "../fashion-keywords.json";
import { TikTokPost, FashionAttributes } from "../types/tiktokTypes";

export const tiktokScraper = async () => {
	const fashionData = await fetchTikTokVideosByHashtag("fashion", 0);
	const searchId = fashionData.extra.logid;
	const cursor = fashionData.cursor;

	// // Retrieve trending video data
	// const trendingPostList = await fetchTikTokTrendingVideos();

	// // Filter for fashion related posts based on hashtag keywords
	// const fashionPostList: TikTokPost[] = trendingPostList.filter(
	// 	(post: TikTokPost) =>
	// 		keywords.some((keyword) =>
	// 			getHashTags(post.textExtra).includes(keyword)
	// 		)
	// );

	// // Scrape attributes of each fashion post
	// const fashionAttributesList: FashionAttributes[] = await Promise.all(
	// 	fashionPostList.map(async (fashionPost) => {
	// 		return await getAttributes(fashionPost);
	// 	})
	// );

	// // Save result to CSV
	// if (fashionAttributesList.length != 0) saveToCSV(fashionAttributesList);
};

const getHashTags = (textExtraArray: { hashtagName: string }[]): string => {
	if (textExtraArray) {
		return textExtraArray.map((item) => `#${item.hashtagName}`).join("\n");
	} else {
		return "";
	}
};

const getAttributes = async (post: TikTokPost) => {
	try {
		const attributes: FashionAttributes = {
			PostURL: `https://tiktok.com/@${post.author.uniqueId}/video/${post.video.id}`,
			Account: post.author.uniqueId,
			"Account Followers": post.authorStats.followerCount,
			Views: post.stats.playCount,
			Likes: post.stats.diggCount,
			"Comment Count": post.stats.commentCount,
			Saved: post.stats.collectCount,
			Caption: post.desc,
			Hashtags: getHashTags(post.textExtra),
			"Date Posted": formatDate(post.createTime),
			"Date Collected": formatDate(Date.now() / 1000),
			Shares: post.stats.shareCount,
		};

		return attributes;
	} catch (error) {
		console.error("Error in getAttributes:", error);
		return <FashionAttributes>{};
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

const saveToCSV = (record: FashionAttributes[]) => {
	try {
		const csvWriter = createObjectCsvWriter({
			path: "tiktok-fashion-posts.csv",
			header: [
				{ id: "PostURL", title: "PostURL" },
				{ id: "Account", title: "Account" },
				{ id: "Account Followers", title: "Account Followers" },
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
			append: true,
		});

		csvWriter
			.writeRecords(record)
			.then(() => {
				console.log("CSV write complete");
			})
			.catch((error) => {
				console.error("Error writing to CSV:", error);
			});
	} catch (error) {
		console.error("Error in saveToCSV:", error);
	}
};

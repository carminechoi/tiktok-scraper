import { createObjectCsvWriter } from "csv-writer";
import { fetchTikTokPostsByHashtag } from "./tiktokApi";
import { keywords } from "../fashion-keywords.json";
import { TikTokAttributes } from "../types/tiktokTypes";
import arrayToString from "../utils/arrayToString";
import delay from "../utils/delay";
import formatDate from "../utils/formatDate";

export const tiktokScraper = async () => {
	const DELAY_TIMER_MS = 1000;
	const CUSOR_MAX = 100;

	let cursor = 0;
	let searchId = "";
	let attributesList: TikTokAttributes[] = [];

	while (cursor < CUSOR_MAX) {
		const posts = await fetchTikTokPostsByHashtag("fashion", cursor, searchId);
		const attributes = getAttributesFromTikTokPosts(posts);
		attributesList.push(...attributes);

		cursor = posts.cursor;
		searchId = posts.extra.logid;

		// Exit loop if there are no more posts
		if (posts.has_more == 0) break;

		// Delay to avoid rate limit
		await delay(DELAY_TIMER_MS);
	}

	// Save result to CSV
	if (attributesList.length != 0) saveToCSV(attributesList);
};

const getAttributesFromTikTokPosts = (posts: any) => {
	let attributesList: TikTokAttributes[] = [];

	try {
		posts?.data?.forEach((post: any) => {
			if (post?.type == 1) {
				const attributes: TikTokAttributes = {
					id: post.item.id,
					PostURL: `https://tiktok.com/@${post.item.author.uniqueId}/video/${post.item.video.id}`,
					Account: post.item.author.uniqueId,
					"Account Followers": post.item.authorStats.followerCount,
					"Account Heart Count": post.item.authorStats.heartCount,
					"Account Video Count": post.item.authorStats.videoCount,
					Views: post.item.stats.playCount,
					Likes: post.item.stats.diggCount,
					Shares: post.item.stats.shareCount,
					Saved: post.item.stats.collectCount,
					"Comment Count": post.item.stats.commentCount,
					Comments: [],
					Caption: post.item.desc,
					Hashtags: arrayToString(
						post.item.challenges.map((challenge: any) => challenge.title)
					),
					Music: post.item.music.title,
					"Date Posted": formatDate(post.item.createTime),
					"Date Collected": formatDate(Date.now() / 1000),
				};

				attributesList.push(attributes);
			}
		});

		return attributesList;
	} catch (error) {
		console.error("Error in getAttributesFromTikTokPost:", error);
		return attributesList;
	}
};

const saveToCSV = (record: TikTokAttributes[]) => {
	try {
		const csvWriter = createObjectCsvWriter({
			path: "tiktok-fashion-posts.csv",
			header: [
				{ id: "PostURL", title: "PostURL" },
				{ id: "Account", title: "Account" },
				{ id: "Account Followers", title: "Account Followers" },
				{ id: "Account Heart Count", title: "Account Heart Count" },
				{ id: "Account Video Count", title: "Account Video Count" },
				{ id: "Views", title: "Views" },
				{ id: "Likes", title: "Likes" },
				{ id: "Shares", title: "Shares" },
				{ id: "Saved", title: "Saved" },
				{ id: "Comment Count", title: "Comment Count" },
				{ id: "Caption", title: "Caption" },
				{ id: "Hashtags", title: "Hashtags" },
				{ id: "Music", title: "Music" },
				{ id: "Date Posted", title: "Date Posted" },
				{ id: "Date Collected", title: "Date Collected" },
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

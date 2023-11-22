import { fetchTikTokPostsByHashtag } from "./tiktokApi";
import { keywords } from "../fashion-keywords.json";
import arrayToString from "../utils/arrayToString";
import delay from "../utils/delay";
import formatDate from "../utils/formatDate";
import saveToCSV from "../utils/saveToCSV";
import { TikTokAttributes } from "../types/tiktokTypes";
import { CsvHeader } from "../types/csvTypes";

export const tiktokScraper = async () => {
	const DELAY_TIMER_MS = 1000;
	const CUSOR_MAX = 10;

	let cursor = 0;
	let searchId = "";
	let attributesList: TikTokAttributes[] = [];

	while (cursor < CUSOR_MAX) {
		const posts = await fetchTikTokPostsByHashtag("fashion", cursor, searchId);
		const attributes = getAttributesFromTikTokPosts(posts);
		attributesList.push(...attributes);

		// Update for next fetch
		cursor = posts.cursor;
		searchId = posts.extra.logid;

		// Exit loop if there are no more posts
		if (posts.has_more == 0) break;

		// Delay to avoid rate limit
		await delay(DELAY_TIMER_MS);
	}

	// Save result to CSV if attributesList is not empty
	if (attributesList.length > 0) {
		const header: CsvHeader[] = Object.keys(attributesList[0])
			.filter((key) => key !== "id")
			.map((key) => ({
				id: key,
				title: key,
			}));

		await saveToCSV("tiktok-fashion-posts.csv", header, attributesList);
	}
};

const getAttributesFromTikTokPosts = (posts: any) => {
	let attributesList: TikTokAttributes[] = [];

	try {
		posts?.data?.forEach((post: any) => {
			if (post?.type == 1) {
				const attributes: TikTokAttributes = {
					id: post.item.id,
					PostURL: `https://www.tiktok.com/@${post.item.author.uniqueId}/video/${post.item.video.id}`,
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
						post.item.challenges?.map((challenge: any) => challenge.title)
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

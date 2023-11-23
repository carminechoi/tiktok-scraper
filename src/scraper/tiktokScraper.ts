import {
	fetchTikTokPostsByHashtag,
	fetchTikTokCommentsByPostId,
} from "./tiktokApi";
import arrayToString from "../utils/arrayToString";
import delay from "../utils/delay";
import formatDate from "../utils/formatDate";
import saveToCSV from "../utils/saveToCSV";
import { TikTokAttributes } from "../types/tiktokTypes";
import { CsvHeader } from "../types/csvTypes";

const COMMENTS_PER_FETCH = 10000;
const INITIAL_CURSOR = 0;
const DELAY_TIMER_MS = 100;
const CUSOR_MAX = 100;

export const tiktokScraper = async () => {
	try {
		const tiktokPosts = await getTikTokPosts();

		// Exit scraper if there are no posts
		if (tiktokPosts.length === 0) {
			console.error("No TikTok posts found.");
			return;
		}

		// Get Attributes from TikTok posts
		const attributes: TikTokAttributes[] = await getAttributesFromTikTokPosts(
			tiktokPosts
		);

		// Save result to CSV if attributesList is not empty
		if (attributes.length > 0) {
			const header: CsvHeader[] = Object.keys(attributes[0]).map((key) => ({
				id: key,
				title: key,
			}));

			await saveToCSV("tiktok-fashion-posts.csv", header, attributes);
		}
	} catch (error) {
		console.error("Error in tiktokScraper:", error);
	}
};

const getTikTokPosts = async () => {
	let tiktokPosts = [];
	try {
		let cursor = 0;
		let searchId = "";
		let hasMore = true;

		while (cursor < CUSOR_MAX && hasMore) {
			const posts = await fetchTikTokPostsByHashtag(
				"fashion",
				cursor,
				searchId
			);
			if (posts.data !== undefined && posts.data !== null) {
				tiktokPosts.push(...posts.data);
			}

			// Use the same searchId from the first iteration
			if (cursor === 0) {
				searchId = posts.extra.logid;
			}

			// Update for next fetch
			cursor = posts.cursor;
			hasMore = posts.has_more === 1;

			// Delay to avoid rate limit
			await delay(DELAY_TIMER_MS);
		}

		return tiktokPosts;
	} catch (error) {
		console.error("Error in getTikTokPosts:", error);
		return tiktokPosts;
	}
};

const getAttributesFromTikTokPosts = async (posts: any) => {
	const attributeList: TikTokAttributes[] = [];

	try {
		if (!Array.isArray(posts)) {
			throw new Error("Invalid posts data");
		}

		for (const post of posts) {
			if (post?.type === 1) {
				const commentsList = await fetchComments(post.item.id);

				// Map attribute values
				const attributes: TikTokAttributes = {
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
					Comments: commentsList,
					Caption: post.item.desc,
					Hashtags: arrayToString(
						post.item.challenges?.map((challenge: any) => challenge.title)
					),
					Music: post.item.music.title,
					"Date Posted": formatDate(post.item.createTime),
					"Date Collected": formatDate(Date.now() / 1000),
				};

				attributeList.push(attributes);
			}
		}
		return attributeList;
	} catch (error) {
		console.error("Error in getAttributesFromTikTokPost:", error);
		return attributeList;
	}
};

const fetchComments = async (postId: string) => {
	try {
		let comments: string[] = [];
		let hasMore = true;
		let cursor = INITIAL_CURSOR;

		while (hasMore) {
			const data = await fetchTikTokCommentsByPostId(
				postId,
				COMMENTS_PER_FETCH,
				cursor
			);
			if (data.comments !== undefined && data.comments !== null) {
				comments.push(
					...data.comments.map((comment: { text: string }) => comment.text)
				);
			}

			hasMore = data.has_more === 1;
			cursor = data.cursor;

			await delay(DELAY_TIMER_MS);
		}
		return comments;
	} catch (error) {
		console.error("Error in fetchComments:", error);
		return [];
	}
};

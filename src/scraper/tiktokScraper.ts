import {
	fetchTikTokPostsByHashtag,
	fetchTikTokCommentsByPostId,
} from "./tiktokApi";
import arrayToString from "../utils/arrayToString";
import delay from "../utils/delay";
import formatDate from "../utils/formatDate";
import saveToCSV from "../utils/saveToCSV";
import { TikTokAttributes } from "../types/tiktokTypes";
import { INITIAL_CURSOR, DELAY_TIMER_MS, CUSOR_MAX } from "../constants";
import pLimit from "p-limit";

const limit = pLimit(40);

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

		// Save result to CSV
		await saveToCSV("tiktok-fashion-posts.csv", attributes);
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

		const getAttributesFromTikTokPost = async (post: any) => {
			// Map each post data to TikTokAttributes object
			if (post?.type === 1) {
				const commentsList = await fetchComments(
					post.item.id,
					post.item.stats.commentCount
				);

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
		};

		await Promise.all(
			posts.map((post) => limit(() => getAttributesFromTikTokPost(post)))
		);

		return attributeList;
	} catch (error) {
		console.error("Error in getAttributesFromTikTokPost:", error);
		return attributeList;
	}
};

const fetchComments = async (postId: string, commentCount: number) => {
	let comments: string[] = [];

	try {
		let hasMore = true;
		let cursor = INITIAL_CURSOR;

		while (hasMore) {
			const data = await fetchTikTokCommentsByPostId(
				postId,
				commentCount,
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
		return comments;
	}
};

export interface TikTokPost {
	author: {
		uniqueId: string;
	};
	authorStats: {
		followerCount: number;
	};
	video: {
		id: string;
	};
	stats: {
		playCount: number;
		diggCount: number;
		commentCount: number;
		collectCount: number;
		shareCount: number;
	};
	desc: string;
	textExtra: { hashtagName: string }[];
	createTime: number;
}

export interface FashionAttributes {
	PostURL: string;
	Account: string;
	"Account Followers": number;
	Views: number;
	Likes: number;
	"Comment Count": number;
	Saved: number;
	Caption: string;
	Hashtags: string;
	"Date Posted": string;
	"Date Collected": string;
	Shares: number;
}

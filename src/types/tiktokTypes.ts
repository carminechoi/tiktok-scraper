export interface TikTokPost {
	type: number;
	item: {
		id: string;
		stats: {
			commentCount: number;
			playCount: number;
			diggCount: number;
			shareCount: number;
			collectCount: number;
		};
		author: {
			uniqueId: string;
		};
		authorStats: {
			followerCount: number;
			heartCount: number;
			videoCount: number;
		};

		video: {
			id: string;
		};
		challenges: Array<{ title: string }>;
		desc: string;
		music: {
			title: string;
		};
		createTime: number;
	};
}

export interface TikTokAttributes {
	PostURL: string;
	Account: string;
	"Account Followers": number;
	"Account Heart Count": number;
	"Account Video Count": number;
	Views: number;
	Likes: number;
	Shares: number;
	Saved: number;
	"Comment Count": number;
	Comments: string[];
	Caption: string;
	Hashtags: string;
	Music: string;
	"Date Posted": string;
	"Date Collected": string;
}

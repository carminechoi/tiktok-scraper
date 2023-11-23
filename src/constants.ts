export const INITIAL_CURSOR = 0;
export const DELAY_TIMER_MS = 100;
export const CUSOR_MAX = 100;
export const COMMENTS_PER_FETCH = 10000;

export const { TT_CHAIN_TOKEN, TTWID, SESSIONID_SS } = process.env;

if (!TT_CHAIN_TOKEN || !TTWID || !SESSIONID_SS) {
	throw new Error("Missing TikTok API environment variables");
}

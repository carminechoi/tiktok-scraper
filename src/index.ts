import "dotenv/config";
import cron from "node-cron";
import { tiktokScraper } from "./scraper/tiktokScraper";
import { fetchTikTokVideosByHashtag } from "./scraper/tiktokApi";

// const scheduleScrapper = () => {
// 	// Schedule scraper to run 1 minute
// 	cron.schedule("*/10 * * * * *", () => {
// 		console.log("Running TikTok scraper...");
// 		tiktokScraper();
// 	});
// };

// scheduleScrapper();

fetchTikTokVideosByHashtag().then((data) => console.log(data));

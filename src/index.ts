import cron from "node-cron";
import { tiktokScraper } from "./scraper/tiktokScraper";

// Schedule scraper to run every midnight
cron.schedule("0 0 * * *", () => {
	console.log("Running TikTok scraper...");
	tiktokScraper();
});

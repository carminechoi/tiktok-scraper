import cron from "node-cron";
import { tiktokScraper } from "./scraper/tiktokScraper";

const scheduleScrapper = () => {
	// Schedule scraper to run every midnight
	cron.schedule("0 0 * * *", () => {
		console.log("Running TikTok scraper...");
		tiktokScraper();
	});
};

const main = () => {
	scheduleScrapper();
};

main();

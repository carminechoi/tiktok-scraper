import "dotenv/config";
import cron from "node-cron";
import { tiktokScraper } from "./scraper/tiktokScraper";

const scheduleScrapper = () => {
	// Schedule scraper to run 1 minute
	cron.schedule("*/1 * * * *", () => {
		console.log("Running TikTok scraper...");
		tiktokScraper();
	});
};

scheduleScrapper();

import "dotenv/config";
import cron from "node-cron";
import { tiktokScraper } from "./scraper/tiktokScraper";

const scheduleScrapper = () => {
	// Schedule scraper to run 1 minute
	cron.schedule("*/5 * * * *", () => {
		console.log("Running TikTok scraper...");
		tiktokScraper("fashion", "tiktok-fashion-posts.csv");
	});
};

scheduleScrapper();

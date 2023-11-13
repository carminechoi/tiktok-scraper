import cron from "node-cron";
import inquirer from "inquirer";

let cronJob: cron.ScheduledTask | null = null;

const startCronJob = () => {
	// Your cron job logic goes here
	cronJob = cron.schedule("* * * * *", () => {
		console.log("running a task every minute");
	});

	console.log("Cron job started.");
};

const stopCronJob = () => {
	// Add logic to stop or pause the cron job

	if (cronJob) {
		cronJob.stop();
		cronJob = null;
		console.log("Cron job stopped.");
	} else {
		console.log("No cron job is currently running.");
	}
};

const handleUserInput = async () => {
	const choices = [
		"Change Parameters",
		cronJob ? "Restart Job" : "Start Job",
		"Stop Job",
		"Quit",
	];

	const { action } = await inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "Choose an action:",
			choices: choices,
		},
	]);

	switch (action) {
		case "Change Parameters":
			console.log("Changing parameters...");
			break;
		case "Start Job":
			startCronJob();
			break;
		case "Restart Job":
			stopCronJob();
			startCronJob();
			break;
		case "Stop Job":
			stopCronJob();
			break;
		case "Quit":
			// Exit the program
			console.log("Quitting...");
			process.exit(0);
	}
	handleUserInput();
};

const init = () => {
	console.log("Initializing TikTok Scraper...");

	// Listen for User Input
	handleUserInput();
};

init();

import { createObjectCsvWriter } from "csv-writer";
import fs from "fs/promises";
import { CsvHeader, CsvRecord } from "../types/csvTypes";

const saveToCSV = async (
	path: string,
	header: CsvHeader[],
	records: CsvRecord[]
) => {
	try {
		const append = await fileExists(path);

		const csvWriter = createObjectCsvWriter({
			path,
			header: header,
			append,
		});

		csvWriter
			.writeRecords(records)
			.then(() => {
				console.log("CSV write complete");
			})
			.catch((error) => {
				console.error("Error writing to CSV:", error);
			});
	} catch (error) {
		console.error("Error in saveToCSV:", error);
	}
};

const fileExists = async (path: string) => {
	try {
		await fs.access(path);
		const st = await fs.stat(path);
		return st.size > 0;
	} catch (error) {
		return false;
	}
};

export default saveToCSV;

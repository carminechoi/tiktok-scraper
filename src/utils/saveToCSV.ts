import { createObjectCsvWriter } from "csv-writer";
import { CsvHeader, CsvRecord } from "../types/csvTypes";

const saveToCSV = (
	path: string,
	headers: CsvHeader[],
	records: CsvRecord[]
) => {
	try {
		const csvWriter = createObjectCsvWriter({
			path,
			header: headers,
			append: true,
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

export default saveToCSV;

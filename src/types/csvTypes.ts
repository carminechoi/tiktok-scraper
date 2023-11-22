export interface CsvHeader {
	id: string;
	title: string;
}

export interface CsvRecord {
	[key: string]: any;
}

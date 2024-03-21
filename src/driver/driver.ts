export interface Driver {
	listAllTables: () => Promise<string[]>;
	deleteAllRecordsByTableName: (tableName: string) => Promise<void>;
	verifyCreateRecordQuery: (query: string) => { tableName: string } | null;
}

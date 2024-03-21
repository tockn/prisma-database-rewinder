import * as process from "process";
import {PostgresDriver} from "./postgres";
import {PrismaClientLike} from "../prismaClientLike";

export interface Driver {
	listAllTables: () => Promise<string[]>;
	deleteAllRecordsByTableName: (tableName: string) => Promise<void>;
	verifyCreateRecordQuery: (query: string) => { tableName: string } | null;
}

export const driverFactory = (db: PrismaClientLike): Driver => {
	const DATABASE_URL = process.env.DATABASE_URL
	if (!DATABASE_URL) {
		return new PostgresDriver(db)
	}
	const url = new URL(DATABASE_URL)
	switch (url.protocol) {
		case "postgresql:":
			return new PostgresDriver(db)
	}
	throw new Error(`[prisma-database-rewinder] Unsupported database: ${url.protocol}`)
}

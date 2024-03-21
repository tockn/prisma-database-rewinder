import { Driver } from "./driver";
import { PrismaClientLike } from "../prismaClientLike";

export class PostgresDriver implements Driver {
	constructor(private db: PrismaClientLike) {}

	async deleteAllRecordsByTableName(tableName: string): Promise<void> {
		await this.db.$executeRawUnsafe(`DELETE FROM "${tableName}"`);
	}

	async listAllTables(): Promise<string[]> {
		return await this.db.$queryRaw<
			{ tablename: string }[]
		>`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != ' _prisma_migrations'`.then(
			(r) => r.map((t) => t.tablename),
		);
	}

	verifyCreateRecordQuery(query: string): { tableName: string } | null {
		const match = query.match(
			/\s*INSERT(?:\s+IGNORE)?(?:\s+INTO)?\s+(?:\.*[`"]?([^.\s`"(]+)[`"]?)*/i,
		);
		return match?.length && match.length > 1 ? { tableName: match[1] } : null;
	}
}

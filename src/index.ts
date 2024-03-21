import { PrismaClientLike } from "./prismaClientLike";

type Options = {
	envCheck?: boolean;
}

export class PrismaDatabaseRewinder {
	private insertedTables: string[] = [];
	constructor(private db: PrismaClientLike, options: Options = {
		envCheck: true
	}) {
		if (options.envCheck && process.env.NODE_ENV !== "test") {
			throw new Error("You can't run DatabaseRewinder in non-test environment");
		}
	}

	async beforeAll() {
		const tables = await this.db.$queryRaw<
			{ tablename: string }[]
		>`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != ' _prisma_migrations'`.then(
			(r) => r.map((t) => t.tablename),
		);
		for (const table of tables) {
			await this.db.$executeRawUnsafe(`DELETE FROM "${table}"`);
		}
		this.watchInsertedTables();
	}

	async afterEach() {
		for (const table of this.insertedTables) {
			await this.db.$executeRawUnsafe(`DELETE FROM "${table}"`);
		}
	}

	private watchInsertedTables() {
		this.db.$on("query", (e) => {
			const match = e.query.match(
				/\s*INSERT(?:\s+IGNORE)?(?:\s+INTO)?\s+(?:\.*[`"]?([^.\s`"(]+)[`"]?)*/i,
			);
			if (match?.length) {
				this.insertedTables.push(match[1]);
			}
		});
	}
}

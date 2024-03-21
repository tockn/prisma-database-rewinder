import { PrismaClientLike } from "./prismaClientLike";
import * as process from "process";
import {Driver, driverFactory} from "./driver/driver";

type Options = {
	envCheck?: boolean;
};

export class PrismaDatabaseRewinder {
	private insertedTables: string[] = [];
	private driver: Driver;
	constructor(
		private prisma: PrismaClientLike,
		options: Options = {
			envCheck: true,
		},
	) {
		if (options.envCheck && process.env.NODE_ENV !== "test") {
			throw new Error("You can't run DatabaseRewinder in non-test environment");
		}
		this.driver = driverFactory(prisma);
	}

	async beforeAll() {
		const tables = await this.driver.listAllTables()
		for (const table of tables) {
			await this.driver.deleteAllRecordsByTableName(table);
		}
		this.watchInsertedTables();
	}

	async afterEach() {
		for (const table of this.insertedTables) {
			await this.driver.deleteAllRecordsByTableName(table);
		}
	}

	private watchInsertedTables() {
		this.prisma.$on("query", (e) => {
			const match = e.query.match(
				/\s*INSERT(?:\s+IGNORE)?(?:\s+INTO)?\s+(?:\.*[`"]?([^.\s`"(]+)[`"]?)*/i,
			);
			if (match?.length) {
				this.insertedTables.push(match[1]);
			}
		});
	}
}

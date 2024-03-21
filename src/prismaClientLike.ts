import { Sql } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client/extension";

type PrismaQueryEvent = {
	timestamp: Date;
	query: string;
	params: string;
	duration: number;
	target: string;
};

export type PrismaClientLike = {
	$on(eventType: "query", callback: (event: PrismaQueryEvent) => void): void;
	$queryRaw<T = unknown>(
		query: TemplateStringsArray | Sql,
		...values: any[]
	): Prisma.PrismaPromise<T>;
	$executeRawUnsafe<T = unknown>(
		query: string,
		...values: any[]
	): Prisma.PrismaPromise<number>;
};

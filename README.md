# prisma-database-rewinder

[![npm version](https://badge.fury.io/js/prisma-database-rewinder.svg)](https://badge.fury.io/js/prisma-database-rewinder)

`prisma-database-rewinder` is a port of [database-rewinder](https://github.com/amatsuda/database_rewinder) for [Prisma](https://github.com/prisma/prisma).  
This library is designed to **extremely fast** clean up test database records in Integration tests using a database.  
It's currently intended for use with Jest and PostgreSQL.  

## Installation

```
npm install prisma-database-rewinder
or
yarn add prisma-database-rewinder
or
pnpm add prisma-database-rewinder
```

## Usage

At the beginning of your Jest test file, include the following setup:

```typescript
// prepare prisma client for test db
const prismaTestClient = new PrismaClient();

const rewinder = new PrismaDatabaseRewinder(prismaTestClient);
beforeAll(async () => {
  await rewinder.beforeAll();
});
afterEach(async () => {
  await rewinder.afterEach();
});
```

This setup ensures that your test database is cleaned up before all tests run and after each test completes, keeping your database in a consistent state and ready for the next test.

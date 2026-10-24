import "server-only";

import knex, { type Knex } from "knex";

const connection = process.env.DATABASE_URL;

if (!connection) {
  throw new Error("DATABASE_URL must be set to connect to PostgreSQL.");
}

const globalForDb = globalThis as typeof globalThis & {
  db?: Knex;
};

export const db =
  globalForDb.db ??
  knex({
    client: "pg",
    connection,
    pool: {
      min: 0,
      max: 10,
    },
    acquireConnectionTimeout: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
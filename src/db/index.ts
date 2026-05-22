import { Pool, type PoolClient, type QueryResultRow } from "pg";

export const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

export function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
  client?: PoolClient,
) {
  const runner = client ?? pool;
  console.log("Executing query:", text);
  return runner.query<T>(text, params);
}
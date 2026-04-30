import { Pool, type QueryResultRow } from "pg";
 
export const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});
 
export function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  console.log("Executing query:", text);
  return pool.query<T>(text, params);
}
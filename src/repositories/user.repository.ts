import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

interface UserRow {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

type User = ReturnType<typeof camelCaseKeys<UserRow>>;
export type PublicUser = Omit<User, "password">;

export async function findByEmail(email: string): Promise<User | null> {
  const result = await db.query<UserRow>(
    `
    SELECT * FROM users
    WHERE email = $1
    `,
    [email],
  );

  const row = result.rows[0];

  return row !== undefined ? camelCaseKeys(row) : null;
}

export async function create(email: string, password: string): Promise<User> {
  const result = await db.query<UserRow>(
    `
    INSERT INTO users (email, password) VALUES 
    ($1, $2) 
    RETURNING *
    `,
    [email, password],
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("insert did not return a row");

  return camelCaseKeys(row);
}

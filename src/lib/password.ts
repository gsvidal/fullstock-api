import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hash(plainPassword: string) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function compare(plainPassword: string, hash: string) {
  return bcrypt.compare(plainPassword, hash);
}

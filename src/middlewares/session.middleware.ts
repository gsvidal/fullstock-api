import pgSession from "connect-pg-simple";
import session from "express-session";
import { pool } from "../db/index.ts";
import { env } from "../env.ts";

const PgStore = pgSession(session);
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const sessionMiddleware = session({
  store: new PgStore({ pool }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: ONE_WEEK_MS },
});

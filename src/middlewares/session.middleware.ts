import session from "express-session";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const sessionMiddleware = session({
  secret: process.env["SESSION_SECRET"] ?? "my-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: ONE_WEEK_MS },
});
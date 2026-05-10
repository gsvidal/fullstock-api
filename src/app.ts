import express from "express";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.ts";
import { sessionMiddleware } from "./middlewares/session.middleware.ts";
import router from "./routes.ts";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.json());
app.use(sessionMiddleware);
app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

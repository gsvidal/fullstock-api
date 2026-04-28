import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/errors.ts";

export function notFoundHandler() {
  throw new ApiError(404, "Recurso no encontrado");
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}

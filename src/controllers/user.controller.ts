import { type Request, type Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { SESSION_COOKIE_NAME, destroySession } from "../lib/session.ts";
import { registerSchemaBody } from "../schemas/auth.schema.ts";
import * as cartService from "../services/cart.service.ts";
import * as userService from "../services/user.service.ts";

export async function createUser(req: Request, res: Response) {
  const { email, password } = registerSchemaBody.parse(req.body);

  const user = await userService.createUser(email, password);

  req.session.userId = user.id;

  const cartId = await cartService.resolveCartId(req.session.cartId, user.id);
  if (cartId !== undefined) {
    req.session.cartId = cartId;
  }

  res.status(201).json({ data: user });
}

export async function getCurrentUser(req: Request, res: Response) {
  const userId = req.session.userId;

  if (userId === undefined) {
    throw new ApiError(401, "No autenticado");
  }

  const user = await userService.getUserById(userId);

  if (user === null) {
    await destroySession(req.session);
    res.clearCookie(SESSION_COOKIE_NAME);
    throw new ApiError(401, "No autenticado");
  }

  res.status(200).json({ status: "success", data: user });
}

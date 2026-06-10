import type { Request, Response } from "express";
import { requireCart } from "../guards/cart.guard.ts";
import { ApiError } from "../lib/errors.ts";
import { createOrderBodySchema } from "../schemas/order.schema.ts";
import { idParamSchema } from "../schemas/params.schema.ts";
import * as orderService from "../services/order.service.ts";
import * as userService from "../services/user.service.ts";

export async function createOrder(req: Request, res: Response) {
  const cart = await requireCart(req);

  const body = createOrderBodySchema.parse(req.body);

  const userId = req.session.userId;

  if (userId !== undefined) {
    const user = await userService.getUserById(userId);
    if (user === null) throw new ApiError(401, "Usuario no encontrado");
    body.email = user.email;
  }

  const order = await orderService.createOrder(cart.id, body, userId);

  delete req.session.cartId;
  req.session.lastOrderId = order.id;

  res.status(201).json({ status: "success", data: order });
}

export async function getOrder(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  console.log("id: ", id);

  const order = await orderService.getOrderById(id);

  if (order === null) {
    throw new ApiError(404, "Orden no encontrada");
  }

  const userId = req.session.userId;
  const isOwner = order.userId !== null && order.userId === userId;
  const isJustCreated = req.session.lastOrderId === id;

  // El usuario puede ver la orden si:
  // Le pertenece o si acaba de crearla en esta misma sesión, incluso como invitado.
  const canAccessOrder = isOwner || isJustCreated;

  if (!canAccessOrder) {
    throw new ApiError(404, "Orden no encontrada");
  }

  res.json({ data: order });
}

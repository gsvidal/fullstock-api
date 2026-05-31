import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { createOrderBodySchema } from "../schemas/order.schema.ts";
import { idParamSchema } from "../schemas/params.schema.ts";
import * as cartService from "../services/cart.service.ts";
import * as orderService from "../services/order.service.ts";
import * as userService from "../services/user.service.ts";

export async function createOrder(req: Request, res: Response) {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    throw new ApiError(400, "El carrito no existe");
  }

  const cart = await cartService.getCart(cartId);

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(
      409,
      "El carrito de la sesion ya no existe en la base de datos",
    );
  }

  const body = createOrderBodySchema.parse(req.body);

  const userId = req.session.userId;

  if (userId !== undefined) {
    const user = await userService.getUserById(userId);
    if (user === null) throw new ApiError(401, "Usuario no encontrado");
    body.email = user.email;
  }

  const order = await orderService.createOrder(cartId, body, userId);

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

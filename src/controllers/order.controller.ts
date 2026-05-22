import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as cartService from "../services/cart.service.ts";
import * as orderService from "../services/order.service.ts";

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

  const order = await orderService.createOrder(cartId, req.body);

  delete req.session.cartId;

  res.status(201).json({ status: "success", data: order });
}
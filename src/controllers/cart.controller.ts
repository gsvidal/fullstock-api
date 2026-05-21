import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as cartService from "../services/cart.service.ts";

export async function getCart(req: Request, res: Response) {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    throw new ApiError(404, "El usuario no tiene carrito");
  }

  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesion ya no existe en la bd");
  }

  res.status(200).json({ status: "success", data: cart });
}

import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import * as cartService from "../services/cart.service.ts";

export async function createCartItem(
  req: Request<object, unknown, { productId?: unknown; quantity?: unknown }>,
  res: Response,
) {
  const { productId, quantity } = req.body;

  if (typeof productId !== "number") {
    throw new ApiError(400, "productId es requerido y debe ser un número");
  }
  if (typeof quantity !== "number" || quantity < 1) {
    throw new ApiError(
      400,
      "quantity es requerido y debe ser un número positivo",
    );
  }

  let cartId: number;

  if (req.session.cartId !== undefined) {
    const cart = await cartService.getCart(req.session.cartId);
    if (cart === null) {
      delete req.session.cartId;
      throw new ApiError(409, "El carrito de la sesión ya no existe");
    }
    cartId = cart.id;
  } else {
    const cart = await cartService.createCart();
    req.session.cartId = cart.id;
    cartId = cart.id;
  }

  const item = await cartItemService.createCartItem(
    cartId,
    productId,
    quantity,
  );

  res.status(201).json({ data: item });
}

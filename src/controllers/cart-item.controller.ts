import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { createCartItemBodySchema, updateCartItemBodySchema } from "../schemas/cart-item.schema.ts";
import { idParamSchema } from "../schemas/params.schema.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import * as cartService from "../services/cart.service.ts";

export async function createCartItem(req: Request, res: Response) {
  const { productId, quantity } = createCartItemBodySchema.parse(req.body);

  let cartId: number;

  if (req.session.cartId !== undefined) {
    const cart = await cartService.getCart(req.session.cartId);
    if (cart === null) {
      delete req.session.cartId;
      throw new ApiError(409, "El carrito de la sesión ya no existe");
    }
    cartId = cart.id;
  } else {
    const cart = await cartService.createCart(req.session.userId);
    req.session.cartId = cart.id;
    cartId = cart.id;
  }

  const item = await cartItemService.createCartItem(cartId, {
    productId,
    quantity,
  });

  res.status(201).json({ data: item });
}

export async function updateCartItem(req: Request, res: Response) {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    delete req.session.cartId;
    throw new ApiError(404, "El carrito no existe");
  }
  const cart = cartService.getCart(cartId);

  if (cart === null) {
    throw new ApiError(409, "El carrito de la sesión ya no existe");
  }

  const { id } = idParamSchema.parse(req.params);

  const { quantity } = updateCartItemBodySchema.parse(req.body);

  const item = await cartItemService.updateCartItemQuantity(
    cartId,
    id,
    quantity,
  );

  res.status(200).json({ status: "success", data: item });
}

export async function deleteCartItem(req: Request, res: Response) {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    delete req.session.cartId;
    throw new ApiError(404, "El carrito no existe");
  }
  const cart = cartService.getCart(cartId);

  if (cart === null) {
    throw new ApiError(409, "El carrito de la sesión ya no existe");
  }

  const { id } = idParamSchema.parse(req.params);

  await cartItemService.deleteCartItem(cartId, id);

  res.status(204);
}

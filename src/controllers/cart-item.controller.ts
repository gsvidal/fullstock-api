import type { Request, Response } from "express";
import { requireCart } from "../guards/cart.guard.ts";
import { ApiError } from "../lib/errors.ts";
import {
  createCartItemBodySchema,
  updateCartItemBodySchema,
} from "../schemas/cart-item.schema.ts";
import { idParamSchema } from "../schemas/params.schema.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import * as cartService from "../services/cart.service.ts";

export async function createCartItem(req: Request, res: Response) {
  const { productId, quantity } = createCartItemBodySchema.parse(req.body);

  let cart;

  if (req.session.cartId !== undefined) {
    cart = await requireCart(req)
    if (cart === null) {
      delete req.session.cartId;
      throw new ApiError(409, "El carrito de la sesión ya no existe");
    }
  } else {
    cart = await cartService.createCart(req.session.userId);
    req.session.cartId = cart.id;
  }

  const item = await cartItemService.createCartItem(cart.id, {
    productId,
    quantity,
  });

  res.status(201).json({ data: item });
}

export async function updateCartItem(req: Request, res: Response) {
  const cart = await requireCart(req);

  const { id } = idParamSchema.parse(req.params);

  const { quantity } = updateCartItemBodySchema.parse(req.body);

  const item = await cartItemService.updateCartItemQuantity(
    cart.id,
    id,
    quantity,
  );

  res.status(200).json({ status: "success", data: item });
}

export async function deleteCartItem(req: Request, res: Response) {
  const cart = await requireCart(req);

  const { id } = idParamSchema.parse(req.params);

  await cartItemService.deleteCartItem(cart.id, id);

  res.status(204);
}

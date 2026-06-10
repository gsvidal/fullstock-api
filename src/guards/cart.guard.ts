import type { Request } from "express";
 
import { ApiError } from "../lib/errors.ts";
import type { Cart } from "../repositories/cart.repository.ts";
import * as cartService from "../services/cart.service.ts";
 
export async function requireCart(req: Request): Promise<Cart> {
  const cartId = req.session.cartId;
 
  if (cartId === undefined) {
    throw new ApiError(404, "El carrito no existe");
  }
 
  const cart = await cartService.getCart(cartId);
 
  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesión ya no existe");
  }
 
  return cart;
}
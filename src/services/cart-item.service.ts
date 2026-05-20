import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";

export async function createCartItem(
  cartId: number,
  productId: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> {
  const foundCartItem = await cartItemRepository.findByCartAndProduct(
    cartId,
    productId,
  );
  if (foundCartItem) {
    throw new ApiError(409, "El producto ya existe en el carrito");
  }

  return cartItemRepository.create(cartId, productId, quantity);
}

export async function updateCartItemQuantity(
  cartId: number,
  id: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> {
  const foundCartItemById = await cartItemRepository.findById(id);

  if (!foundCartItemById || foundCartItemById.cartId !== cartId) {
    throw new ApiError(404, "El item no existe en el carrito");
  }

  // Update quantity
  const updatedCartItem = await cartItemRepository.updateQuantity(id, quantity);
  await cartRepository.touch(cartId);

  return updatedCartItem;
}

export async function deleteCartItem(
  cartId: number,
  id: number,
): Promise<void> {

  const foundCartItemById = await cartItemRepository.findById(id);
  if (!foundCartItemById || cartId !== foundCartItemById.cartId) {
    throw new ApiError(404, "El item no existe en el carrito");
  }

  await cartItemRepository.remove(id);
  await cartRepository.touch(cartId)
}

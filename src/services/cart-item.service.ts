import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
 
export async function createCartItem(
  cartId: number,
  productId: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> {
  const productFind = await cartItemRepository.findByCartAndProduct(
    cartId,
    productId,
  );
  if (productFind) {
    throw new ApiError(409, "El producto ya existe en el carrito");
  }

  return cartItemRepository.create(cartId, productId, quantity);
}
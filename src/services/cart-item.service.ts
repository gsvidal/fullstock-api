import * as cartItemRepository from "../repositories/cart-item.repository.ts";
 
export async function createCartItem(
  cartId: number,
  productId: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> {
  return cartItemRepository.create(cartId, productId, quantity);
}
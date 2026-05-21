import * as cartRepository from "../repositories/cart.repository.ts";
import * as cartItemService from "./cart-item.service.ts";

export interface HydratedCart {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  items: cartItemService.HydratedCartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export async function createCart(): Promise<cartRepository.Cart> {
  return cartRepository.create();
}

export async function getCart(id: number): Promise<cartRepository.Cart | null> {
  return cartRepository.findById(id);
}

export async function getHydratedCart(
  id: number,
): Promise<HydratedCart | null> {
  const cart = await getCart(id);

  if (cart === null) return null;

  const items = await cartItemService.getHydratedItemsByCartId(id);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const cartHydrated = {
    ...cart,
    items,
    totalQuantity,
    totalPrice,
  };

  return cartHydrated;
}

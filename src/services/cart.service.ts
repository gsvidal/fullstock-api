import * as cartRepository from "../repositories/cart.repository.ts";
 
export async function createCart(): Promise<cartRepository.Cart> {
  return cartRepository.create();
}
 
export async function getCart(id: number): Promise<cartRepository.Cart | null> {
  return cartRepository.findById(id);
}
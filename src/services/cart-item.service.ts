import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";
import type { CreateCartItemBody } from "../schemas/cart-item.schema.ts";

export interface HydratedCartItem {
  id: number;
  quantity: number;
  lineTotal: number;
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    imgSrc: string;
  };
}

export async function createCartItem(
  cartId: number,
  data: CreateCartItemBody,
): Promise<cartItemRepository.CartItem> {
  const foundCartItem = await cartItemRepository.findByCartAndProduct(
    cartId,
    data.productId,
  );
  if (foundCartItem) {
    throw new ApiError(409, "El producto ya existe en el carrito");
  }

  const foundProduct = await productRepository.findById(data.productId);

  if (!foundProduct) {
    throw new ApiError(404, "El Producto no existe");
  }

  return cartItemRepository.create({cartId, ...data});
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
  await cartRepository.touch(cartId);
}

export async function getHydratedItemsByCartId(
  cartId: number,
): Promise<HydratedCartItem[]> {
  const items = await cartItemRepository.getItemsWithProductByCartId(cartId);

  return items.map((item: cartItemRepository.CartItemWithProduct) => {
    const { id, quantity, price, productId, title, slug, imgSrc } = item;
    return {
      id,
      quantity,
      lineTotal: quantity * price,
      product: {
        id: productId,
        title,
        slug,
        price,
        imgSrc,
      },
    };
  });
}

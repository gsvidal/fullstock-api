import * as db from "../db/index.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import type { CreateOrderBody } from "../schemas/order.schema.ts";
import * as cartService from "../services/cart.service.ts";

export type OrderWithItems = orderRepository.Order & {
  items: orderRepository.OrderItem[];
};

export async function createOrder(
  cartId: number,
  shippingInfo: CreateOrderBody,
  userId?: number,
): Promise<orderRepository.Order> {
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) throw new Error("No se encontró carrito");
  if (cart.items.length === 0) throw new ApiError(400, "El carrito está vacío");

  const order = await db.withTransaction(async (client) => {
    const orderData: orderRepository.CreateOrderData = {
      ...shippingInfo,
      userId: userId ?? null,
      total: cart.totalPrice,
    };
    const order = await orderRepository.createOrder(orderData, client);

    const items = cart.items.map((item) => {
      const {
        product: { id, title, price, imgSrc },
        quantity,
      } = item;

      return {
        orderId: order.id,
        productId: id,
        title,
        price,
        imgSrc,
        quantity,
      };
    });

    await orderRepository.createOrderItems(items, client);
    await cartRepository.remove(cartId, client);

    return order;
  });

  return order;
}

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await orderRepository.findById(id);
  if (order === null) return null;

  const items = await orderRepository.findItemsByOrderId(id);
  return { ...order, items };
}

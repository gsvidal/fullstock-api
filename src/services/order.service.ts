import * as db from "../db/index.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import * as cartService from "../services/cart.service.ts";

type CreateOrderBody = {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
};

export async function createOrder(
  cartId: number,
  shippingInfo: CreateOrderBody,
): Promise<orderRepository.Order | null> {
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) throw new Error("No se encontró carrito");
  if (cart.items.length === 0) throw new ApiError(400, "El carrito está vacío");

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const orderData = { ...shippingInfo, total: cart.totalPrice };
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

    await client.query("COMMIT");
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

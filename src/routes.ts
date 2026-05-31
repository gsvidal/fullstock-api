import { Router } from "express";
import * as cartItemController from "./controllers/cart-item.controller.ts";
import * as cartController from "./controllers/cart.controller.ts";
import * as categoryController from "./controllers/category.controller.ts";
import * as orderController from "./controllers/order.controller.ts";
import * as productController from "./controllers/product.controller.ts";
import * as sessionController from "./controllers/session.controller.ts";
import * as userController from "./controllers/user.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fullstock Api" });
});

router.get("/categories", categoryController.getCategories);
router.get("/categories/:slug", categoryController.getCategory);

router.get("/categories/:slug/products", productController.getProducts);
router.get("/products/:slug", productController.getProduct);

router.post("/cart/items", cartItemController.createCartItem);

router.patch("/cart/items/:id", cartItemController.updateCartItem);

router.delete("/cart/items/:id", cartItemController.deleteCartItem);

router.get("/cart", cartController.getCart);

router.post("/orders", orderController.createOrder);

router.post("/users", userController.createUser);

router.post("/sessions", sessionController.createSession);

router.delete("/sessions", sessionController.deleteSession);

export default router;

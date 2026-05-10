import { Router } from "express";
import * as cartItemController from "./controllers/cart-item.controller.ts";
import * as categoryController from "./controllers/category.controller.ts";
import * as productController from "./controllers/product.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fullstock Api" });
});

router.get("/categories", categoryController.getCategories);
router.get("/categories/:slug", categoryController.getCategory);

router.get("/categories/:slug/products", productController.getProducts);
router.get("/products/:slug", productController.getProduct);

router.post("/cart/items", cartItemController.createCartItem);

export default router;

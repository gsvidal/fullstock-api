import { Router } from "express";
import * as categoryController from "./controllers/category.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fullstock Api" });
});

router.get("/categories", categoryController.getCategories);
router.get("/categories/:slug", categoryController.getCategory);

export default router;

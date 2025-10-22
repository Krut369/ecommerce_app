import express from "express";
import {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  getProduct
} from "../controllers/productController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// public routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// admin routes
router.post("/", auth, requireRole("admin"), createProduct);
router.put("/:id", auth, requireRole("admin"), updateProduct);
router.delete("/:id", auth, requireRole("admin"), deleteProduct);

export default router;

import express from "express";
import { auth, requireRole } from "../middleware/auth.js";
import { checkout } from "../controllers/checkoutController.js";
import { listOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/checkout", auth, requireRole("customer"), checkout);
router.get("/", auth, listOrders);

export default router;

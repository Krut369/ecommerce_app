import express from "express";
import { auth, requireRole } from "../middleware/auth.js";
import { sqlDailyRevenue, mongoCategorySales } from "../controllers/reportController.js";

const router = express.Router();

router.get("/sql", auth, requireRole("admin"), sqlDailyRevenue);
router.get("/mongo", auth, requireRole("admin"), mongoCategorySales);

export default router;

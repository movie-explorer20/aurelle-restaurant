import { Router } from "express";
import Reservation from "../models/Reservation.js";
import MenuItem from "../models/MenuItem.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", requireAdmin, async (req, res, next) => {
  try {
    const today = new Date().toLocaleDateString("en-CA");
    const [total, pending, confirmed, todayCount, menuItems] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: "Pending" }),
      Reservation.countDocuments({ status: "Confirmed" }),
      Reservation.countDocuments({ date: today, status: { $ne: "Cancelled" } }),
      MenuItem.countDocuments()
    ]);
    res.json({ stats: { total, pending, confirmed, today: todayCount, menuItems } });
  } catch (error) {
    next(error);
  }
});

export default router;

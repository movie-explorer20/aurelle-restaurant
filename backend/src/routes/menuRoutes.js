import { Router } from "express";
import MenuItem from "../models/MenuItem.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/all", requireAdmin, async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ message: "Menu item created", item });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item updated", item });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;

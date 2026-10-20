import { Router } from "express";
import mongoose from "mongoose";
import Reservation from "../models/Reservation.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];

// Get local date in YYYY-MM-DD format.
function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// PUBLIC: Create a reservation.
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      requests = ""
    } = req.body || {};

    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !time ||
      guests === undefined ||
      guests === null ||
      guests === ""
    ) {
      return res.status(400).json({
        message: "Please complete all required booking fields."
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const cleanDate = String(date).trim();
    const cleanTime = String(time).trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        message: "Name must be between 2 and 100 characters."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (cleanPhone.length < 7 || cleanPhone.length > 25) {
      return res.status(400).json({
        message: "Please enter a valid phone number."
      });
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(cleanTime)
    ) {
      return res.status(400).json({
        message: "Invalid booking date or time format."
      });
    }

    // Reject impossible calendar dates.
    const [year, month, day] = cleanDate.split("-").map(Number);
    const calendarDate = new Date(year, month - 1, day);

    if (
      calendarDate.getFullYear() !== year ||
      calendarDate.getMonth() !== month - 1 ||
      calendarDate.getDate() !== day
    ) {
      return res.status(400).json({
        message: "Please select a valid booking date."
      });
    }

    // Do not accept dates before today.
    if (cleanDate < getLocalDate()) {
      return res.status(400).json({
        message: "Please select today or a future booking date."
      });
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 20
    ) {
      return res.status(400).json({
        message: "Guests must be between 1 and 20."
      });
    }

    const cleanRequests = String(requests || "").trim().slice(0, 1000);

    const reference =
      `AUR-${Date.now().toString().slice(-8)}-` +
      Math.random().toString(36).slice(2, 5).toUpperCase();

    // Save the reservation in MongoDB.
    const reservation = await Reservation.create({
      reference,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      date: cleanDate,
      time: cleanTime,
      guests: guestCount,
      requests: cleanRequests
    });

    console.log(
      `Reservation created: ${reservation.reference} (${reservation._id})`
    );

    return res.status(201).json({
      message: "Reservation request received successfully.",
      reservation: {
        _id: reservation._id,
        reference: reservation.reference,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        requests: reservation.requests,
        status: reservation.status,
        createdAt: reservation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get reservations.
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          message: "Invalid reservation status filter."
        });
      }

      filter.status = req.query.status;
    }

    if (req.query.date) {
      const date = String(req.query.date);

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          message: "Invalid date filter."
        });
      }

      filter.date = date;
    }

    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 100);
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { reference: { $regex: escapedSearch, $options: "i" } }
      ];
    }

    const reservations = await Reservation.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      reservations
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Update reservation status.
router.patch("/:id/status", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid reservation ID."
      });
    }

    const { status } = req.body || {};

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reservation status."
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found."
      });
    }

    return res.status(200).json({
      message: "Reservation status updated successfully.",
      reservation
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Delete reservation.
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid reservation ID."
      });
    }

    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found."
      });
    }

    return res.status(200).json({
      message: "Reservation deleted successfully."
    });
  } catch (error) {
    next(error);
  }
});

export default router;

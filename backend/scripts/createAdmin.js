import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../src/models/Admin.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

try {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  }

  await connectDB();
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  let admin = await Admin.findOne({ email });

  if (admin) {
    console.log(`Admin already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    admin = await Admin.create({
      name: process.env.ADMIN_NAME || "AURELLE Administrator",
      email,
      passwordHash
    });
    console.log(`Admin created successfully: ${admin.email}`);
  }
} catch (error) {
  console.error("Admin setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}

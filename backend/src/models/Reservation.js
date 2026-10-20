import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  reference: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  requests: { type: String, default: "", maxlength: 1000 },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

reservationSchema.index({ date: 1, time: 1, status: 1 });

export default mongoose.model("Reservation", reservationSchema);

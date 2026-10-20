import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri) || uri.includes("YOUR_DB_PASSWORD")) {
    throw new Error("Set a valid MONGODB_URI in backend/.env");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected successfully");
}


import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) return;

  let uri = process.env["MONGODB_URI"];

  if (!uri) {
    logger.warn("MONGODB_URI not set — starting in-memory MongoDB for development");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    logger.info({ uri }, "In-memory MongoDB started");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    isConnected = true;
    logger.info("MongoDB connected");
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
    throw err;
  }
}

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "MongoDB error");
});

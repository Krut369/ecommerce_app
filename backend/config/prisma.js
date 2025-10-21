import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL (Prisma) connected");
  } catch (err) {
    console.error("Prisma connection error:", err.message);
  }
};

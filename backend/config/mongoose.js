import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDb Connected");
  } catch (err) {
    console.error("Mongodb Connection Error:", err.message);
  }
};

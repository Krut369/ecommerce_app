import express from "express";
import { connectPrisma } from "./config/prisma.js";
import { connectMongoose } from "./config/mongoose.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

await connectPrisma();
await connectMongoose();

app.get("/", (req, res) => res.send("Backend running with MySQL + MongoDB"));

app.listen(8000, () => console.log("Server running on port 8000"));

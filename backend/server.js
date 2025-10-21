import express from "express";
import { connectPrisma } from "./config/prisma.js";
import { connectMongoose } from "./config/mongoose.js";

const app = express();
app.use(express.json());

await connectPrisma();
await connectMongoose();

app.get("/", (req, res) => res.send("Backend running with MySQL + MongoDB"));

app.listen(8000, () => console.log("Server running on port 8000"));

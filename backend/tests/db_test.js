import { prisma } from "../config/mongoose.js";
import Product from "../models/Product.js";
import { connectDB } from "../config/mongoose.js";

await connectDB();
await prisma.users.create({ data: { name: "TestUser", email: "t@t.com", passwordHash: "abc", role: "admin" } });
await Product.create({ sku: "P001", name: "Test Product", price: 50, category: "general" });
console.log("DB insert success");
process.exit();

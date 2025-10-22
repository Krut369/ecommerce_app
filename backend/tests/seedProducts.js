import Product from "../models/Product.js";
import { connectDB } from "../config/db.js";
await connectDB();

await Product.insertMany([
  { sku: "P001", name: "Laptop", price: 700, category: "electronics" },
  { sku: "P002", name: "Headphones", price: 120, category: "electronics" },
  { sku: "P003", name: "Shoes", price: 90, category: "fashion" }
]);
console.log("Seed done");
process.exit();

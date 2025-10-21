import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  category: { type: String, required: true, index: true },
  updatedAt: { type: Date, default: Date.now, index: true }
});

ProductSchema.index({ category: 1, price: -1 });
export default mongoose.model("Product", ProductSchema);

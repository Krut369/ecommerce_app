import { prisma } from "../config/prisma.js";
import Product from "../models/Product.js";

export const sqlDailyRevenue = async (req, res) => {
  try {
    const data = await prisma.$queryRaw`
      SELECT DATE(createdAt) AS day, SUM(total) AS revenue
      FROM orders
      GROUP BY day
      ORDER BY day DESC
      LIMIT 30;
    `;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mongoCategorySales = async (req, res) => {
  try {
    const orderItems = await prisma.order_items.findMany();
    if (orderItems.length === 0)
      return res.json({ message: "No order data" });

    const ids = orderItems.map(o => o.productId);
    const products = await Product.find(
      { _id: { $in: ids } },
      { _id: 1, category: 1 }
    ).lean();

    const categoryTotals = {};
    for (const item of orderItems) {
      const product = products.find(p => p._id.toString() === item.productId);
      const cat = product ? product.category : "unknown";
      const amount = parseFloat(item.priceAtPurchase) * item.quantity;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    }

    const result = Object.entries(categoryTotals).map(([category, sales]) => ({
      category,
      sales: parseFloat(sales.toFixed(2))
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
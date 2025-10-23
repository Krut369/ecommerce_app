import { prisma } from "../config/prisma.js";
import Product from "../models/Product.js";

export const checkout = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "No items provided" });

    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } });

    let total = 0;
    const orderItems = [];
    for (const i of items) {
      const prod = products.find(p => p._id.toString() === i.productId);
      if (!prod) continue;
      const subtotal = prod.price * i.quantity;
      total += subtotal;
      orderItems.push({
        productId: i.productId,
        quantity: i.quantity,
        priceAtPurchase: prod.price
      });
    }

    if (orderItems.length === 0)
      return res.status(400).json({ error: "No valid products" });

    const order = await prisma.$transaction(async tx => {
      const newOrder = await tx.orders.create({
        data: {
          userId: req.user.id,
          total
        }
      });
      const itemsData = orderItems.map(i => ({
        ...i,
        orderId: newOrder.id
      }));
      await tx.order_items.createMany({ data: itemsData });
      return newOrder;
    });

    res.status(201).json({ message: "Order placed", orderId: order.id, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

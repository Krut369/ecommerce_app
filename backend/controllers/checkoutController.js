import { prisma } from "../config/prisma.js";
import Product from "../models/Product.js";

/**
 * Expected request body:
 * [
 *   { "productId": "652a...", "quantity": 2 },
 *   { "productId": "652b...", "quantity": 1 }
 * ]
 */
export const checkout = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "No items provided" });

    // fetch products from Mongo
    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } });

    // build order_items array with priceAtPurchase
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

    // create order + order_items inside one transaction
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

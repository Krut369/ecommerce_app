import { prisma } from "../config/prisma.js";

export const listOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

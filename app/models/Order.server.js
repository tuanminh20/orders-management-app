import db from "../db.server";

export async function getOrders() {
  const orders = await db.order.findMany({
    orderBy: { id: "desc" },
    include: {
      customer: true,
      tags: true,
    },
  });

  if (orders.length === 0) return [];

  return orders;
}

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

  // Fix TypeError: Do not know how to serialize a BigInt
  return orders.map((order) => ({
    ...order,
    id: order.id.toString(),
    customerId: order.customerId.toString(),
    customer: {
      ...order.customer,
      id: order.customer.id.toString(),
    },
    tags: order.tags.map((tag) => ({
      ...tag,
    })),
  }));
}

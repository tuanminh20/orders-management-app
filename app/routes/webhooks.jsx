import { authenticate } from "../shopify.server";
import db from "../db.server";
import { create } from "domain";
import { Tag } from "@shopify/polaris";
import { connect } from "http2";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "ORDERS_CREATE":
      console.log("orders/create: ", payload);
      // Save the order to the database.

      await db.order.create({
        data: {
          id: payload.id,
          orderNumber: payload.order_number,
          totalPrice: payload.total_price,
          createdAt: payload.created_at,
          updatedAt: payload.updated_at,
          paymentGatewayNames: payload.payment_gateway_names.join(", ") || "not defined",
          customer: {
            connectOrCreate: {
              where: { id: payload.customer.id },
              create: {
                id: payload.customer.id,
                email: payload.customer.email,
                firstName: payload.customer.first_name,
                lastName: payload.customer.last_name,
                address: payload.customer.default_address.country,
              },
            },
          },
          tags: {
            connectOrCreate: payload.tags.split(',').map((tag) => ({
              where: { name: tag.trim() },
              create: {
                name: tag.trim(),
              },
            })),
          },
        },
        include: {
          customer: true,
          tags: true,
        },
      });
      break;
    case "ORDERS_UPDATED":
      console.log("orders/updated: ", payload);

      const order = await db.order.findUnique({
        where: { id: payload.id }
      });

      if (order) {
        await db.order.update({
          data: {
            orderNumber: payload.order_number,
            totalPrice: payload.total_price,
            createdAt: payload.created_at,
            updatedAt: payload.updated_at,
            paymentGatewayNames: payload.payment_gateway_names.join(", ") || "not defined",
            customer: {
              connectOrCreate: {
                where: { id: payload.customer.id },
                create: {
                  id: payload.customer.id,
                  email: payload.customer.email,
                  firstName: payload.customer.first_name,
                  lastName: payload.customer.last_name,
                  address: payload.customer.default_address.country,
                },
              },
            },
            tags: {
              connectOrCreate: payload.tags.split(',').map((tag) => {
                return {
                  where: { name: tag },
                  create: { name: tag },
                };
              }),
            },
          },
          include: {
            customer: true,
            tags: true,
          },
        });
      }
      break;
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};

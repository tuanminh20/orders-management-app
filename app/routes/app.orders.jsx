import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Tag,
  useBreakpoints,
  Page,
  LegacyStack,
} from '@shopify/polaris';
import { getOrders } from '../models/Order.server';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import saveAs from "file-saver";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const orders = await getOrders(session.shop);

  return json({
    orders,
  });
}

const EmptyOrderState = (onAction) => {
};

const OrderTable = ({ orders }) => {
};

const OrderRow = ({ order }) => {
};

const exportOrdersToCsv = (orders) => {
  const headers = [
    'Order Number',
    'Total Price',
    'Payment Gateway',
    'Customer Email',
    'Customer Full Name',
    'Customer Address',
    'Tags',
    'Created At',
  ];
  let csv = '';
  csv += headers.join(',') + '\n';

  orders.forEach((order) => {
    csv += [
      order.orderNumber,
      order.total,
      order.paymentGateway,
      order.customer.email,
      order.customer.fullName,
      `"${order.customer.address}"`,
      `"${order.tags.map((tag) => tag.name).join(',')}"`,
      order.createdAt,
    ].join(',') + '\n';
  });

  saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'orders.csv');
}

export default function Index() {
  const { orders } = useLoaderData();
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (order, index) => (
      <IndexTable.Row
        id={order.id}
        key={order.id}
        selected={selectedResources.includes(order.id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            #{order.orderNumber}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {new Date(order.createdAt).toDateString()}
        </IndexTable.Cell>
        <IndexTable.Cell>{order.paymentGatewayNames}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {order.totalPrice}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const promotedBulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Export to CSV',
      onAction: () => {
        const selectedOrders = orders.filter((order) => selectedResources.includes(order.id));
        exportOrdersToCsv(selectedOrders);
      }
    },
  ];
  const bulkActions = [];

  return (
    <Page
      title="Orders Page"
      fullWidth={true}>
      <Card>
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Order'},
            {title: 'Date'},
            {title: 'Customer'},
            {title: 'Email'},
            {title: 'Address'},
            {title: 'Tags'},
            {title: 'Payment Gateway'},
            {title: 'Total'},
          ]}
          bulkActions={bulkActions}
          promotedBulkActions={promotedBulkActions}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}

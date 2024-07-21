import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Badge,
  useBreakpoints,
  Page,
} from '@shopify/polaris';
import { getOrders } from '../models/Order.server';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

export default function Index() {
  const { orders } = useLoaderData();
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      {id, orderNumber, createdAt, customerId, total, paymentGateway},
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            #{orderNumber}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {new Date(createdAt).toDateString()}
        </IndexTable.Cell>
        <IndexTable.Cell>{customerId}</IndexTable.Cell>
        <IndexTable.Cell>{customerId}</IndexTable.Cell>
        <IndexTable.Cell>{customerId}</IndexTable.Cell>
        <IndexTable.Cell>Todo: Tags</IndexTable.Cell>
        <IndexTable.Cell>{paymentGateway}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
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
      onAction: () => console.log('Todo: implement CSV exporting'),
    },
  ];
  const bulkActions = [];

  return (
    <Page
      title="Orders Page">
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

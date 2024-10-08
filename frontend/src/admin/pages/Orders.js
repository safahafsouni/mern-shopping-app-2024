import { Table, Select, Badge } from 'antd'; // Import Select and Badge
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { listOrders, deliverOrder } from '../../actions/orderActions'; // Ensure deliverOrder is imported
import Loader from '../../components/shared/Loader';
import Message from '../../components/shared/Message';

const { Option } = Select; // Destructure Option from Select

const Orders = () => {
  const dispatch = useDispatch();

  // Get the list of all orders from state
  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, orders, error: errorOrders } = orderList;

  // Admin order list effect
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  // Handle delivery status change
  const handleDeliveryChange = (orderId, value) => {
    if (value === 'yes') {
      dispatch(deliverOrder(orderId));
      dispatch(listOrders());
    }
  };

  // Define columns for the Table
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (user ? user.name : 'Unknown User'),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text.substring(0, 10), // Format the date
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `$${totalPrice.toFixed(2)}`,
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (text, record) =>
        record.isPaid ? (
          record.paidAt.substring(0, 10)
        ) : (
          <FaTimes color="red" />
        ), // Show FaTimes icon for unpaid orders
    },
    {
      title: 'Delivered',
      dataIndex: 'isDelivered',
      key: 'isDelivered',
      render: (text, record) => (
        <>
          {record.isDelivered ? (
            <>
              <Badge
                status="success"
                text={`Yes (${record.deliveredAt.substring(0, 10)})`}
              />
            </>
          ) : (
            <>
              <Badge status="error" text="No" />
              <Select
                defaultValue="no"
                style={{ marginLeft: 8 }}
                onChange={(value) => handleDeliveryChange(record._id, value)}
              >
                <Option value="no">No</Option>
                <Option value="yes">Yes</Option>
              </Select>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">All Orders</h1>

      {/* Orders Table */}
      {loadingOrders ? (
        <Loader />
      ) : errorOrders ? (
        <Message variant="error">{errorOrders}</Message>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;

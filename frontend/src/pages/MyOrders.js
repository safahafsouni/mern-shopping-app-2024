import { Button, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Loader from '../components/shared/Loader';
import Message from '../components/shared/Message';
import { listMyOrders } from '../actions/orderActions';

const MyOrders = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, orders, error: errorOrders } = orderListMy;

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyOrders());
    }
  }, [userInfo, dispatch]);

  // Define columns for the Table
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
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
        ), // Replaced with FaTimes icon
    },
    {
      title: 'Delivered',
      dataIndex: 'isDelivered',
      key: 'isDelivered',
      render: (text, record) =>
        record.isDelivered ? (
          record.deliveredAt.substring(0, 10)
        ) : (
          <FaTimes color="red" />
        ), // Replaced with FaTimes icon
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Link to={`/order/${record._id}`}>
          {/* Styled button for "Details" */}
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out">
            View Details
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>

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

export default MyOrders;

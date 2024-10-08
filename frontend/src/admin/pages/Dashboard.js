import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../../actions/userActions';
import { listOrders } from '../../actions/orderActions';
import { listProducts } from '../../actions/productActions';
import { listCategories } from '../../actions/categoryActions';
import { FaShoppingCart, FaUsers, FaListAlt } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const orderList = useSelector((state) => state.orderList);
  const { orders } = orderList;

  const productList = useSelector((state) => state.productList);
  const { total } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    dispatch(listUsers());
    dispatch(listOrders());
    dispatch(listProducts());
    dispatch(listCategories());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold md:text-2xl">Dashboard</h1>
      <Row gutter={16} className="mt-3">
        <Col span={6}>
          <Card title="Users" bordered={false} style={{ textAlign: 'center' }}>
            <FaUsers style={{ fontSize: '26px', color: '#1890ff' }} />
            <p style={{ fontSize: '32px', margin: '10px 0' }}>
              {users?.length}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Orders" bordered={false} style={{ textAlign: 'center' }}>
            <FaShoppingCart style={{ fontSize: '26px', color: '#28a745' }} />
            <p style={{ fontSize: '32px', margin: '10px 0' }}>
              {orders?.length}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Products"
            bordered={false}
            style={{ textAlign: 'center' }}
          >
            <FiPackage style={{ fontSize: '26px', color: '#dc3545' }} />
            <p style={{ fontSize: '32px', margin: '10px 0' }}>{total}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Categories"
            bordered={false}
            style={{ textAlign: 'center' }}
          >
            <FaListAlt style={{ fontSize: '26px', color: '#ffc107' }} />
            <p style={{ fontSize: '32px', margin: '10px 0' }}>
              {categories?.length}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

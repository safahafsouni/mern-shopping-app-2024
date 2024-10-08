import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import moment from 'moment';
import { listUsers } from '../../actions/userActions';
import Message from '../../components/shared/Message';
import Loader from '../../components/shared/Loader';

const Users = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1, // Renders index in the table
    },
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'),
    },
  ];

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold md:text-2xl">All Users</h1>
      </div>

      <div className="mt-2">
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>
    </>
  );
};

export default Users;

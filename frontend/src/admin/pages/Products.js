import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Table, Dropdown, Menu, Pagination } from 'antd';
import moment from 'moment';
import { AiOutlineMore } from 'react-icons/ai';
import { listProducts, deleteProduct } from '../../actions/productActions';
import Loader from '../../components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../../constants/productConstant';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [page, setPage] = useState(1); // Current page state
  const pageSize = 5; // Number of items per page

  // Fetch products from state
  const {
    products,
    loading: listLoading,
    total,
  } = useSelector((state) => state.productList);
  const { success: deleteSuccess, message: deleteMessage } = useSelector(
    (state) => state.productDelete
  );

  useEffect(() => {
    dispatch(listProducts(page, pageSize));
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (deleteSuccess) {
      toast.success(deleteMessage);
      dispatch(listProducts(page, pageSize)); // Refetch products after deletion
      setVisible(false);
      setDeleteProductId(null);
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
  }, [dispatch, deleteMessage, deleteSuccess, page]);

  // Handle modal for delete confirmation
  const handleDelete = (id) => {
    setDeleteProductId(id);
    setVisible(true);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      dispatch(deleteProduct(deleteProductId));
    }
  };

  // Handle page change
  const onPageChange = (pageNumber) => {
    setPage(pageNumber);
    dispatch(listProducts(pageNumber, pageSize));
  };

  // Action menu for edit and delete
  const menu = (product) => (
    <Menu>
      <Menu.Item
        onClick={() => navigate(`/admin/products/update/${product._id}`)}
      >
        Edit
      </Menu.Item>
      <Menu.Item onClick={() => handleDelete(product._id)}>Delete</Menu.Item>
    </Menu>
  );

  // Columns for the product table
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => (page - 1) * pageSize + index + 1, // Adjust the index based on page
    },
    {
      title: 'Image',
      dataIndex: 'picture',
      key: 'picture',
      render: (picture) => (
        <img
          alt={picture.name}
          className="aspect-square rounded-md object-cover"
          height="64"
          src={picture.secure_url}
          width="64"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name,
    },
    {
      title: 'Stock',
      dataIndex: 'countInStock',
      key: 'countInStock',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (product) => (
        <Dropdown overlay={menu(product)} trigger={['click']}>
          <Button icon={<AiOutlineMore />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link to="/admin/products/create">
          <Button type="primary">Add Product</Button>
        </Link>
      </div>

      {/* Products Table Section */}
      <section className="mt-3">
        {listLoading ? (
          <Loader />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={products}
              rowKey="_id"
              pagination={false} // Disable default pagination
            />
            <Pagination
              className="mt-4 justify-end"
              current={page}
              total={total}
              pageSize={pageSize}
              onChange={onPageChange}
            />
          </>
        )}
      </section>

      {/* Delete Product Modal */}
      <Modal
        title="Delete Product"
        open={visible}
        onOk={confirmDelete}
        onCancel={() => setVisible(false)}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </>
  );
};

export default Products;

import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, Button, Card, Input, Table, Dropdown, Menu } from 'antd';
import { AiOutlineMore } from 'react-icons/ai';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../../actions/categoryActions';
import Loader from '../../components/shared/Loader';

const Categories = () => {
  const [category, setCategory] = useState(''); // For new category creation
  const [editCategory, setEditCategory] = useState(''); // For editing category
  const [visible, setVisible] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // Store the category to be edited

  const dispatch = useDispatch();

  const { loading, success, error, message } = useSelector(
    (state) => state.categoryCreate
  );
  const {
    success: deleteSuccess,
    error: deleteError,
    message: deleteMessage,
  } = useSelector((state) => state.categoryDelete);
  const {
    success: updateSuccess,
    error: updateError,
    message: updateMessage,
  } = useSelector((state) => state.categoryUpdate);
  const {
    categories,
    loading: listLoading,
    error: listError,
  } = useSelector((state) => state.categoryList);

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Combined success/error handling for both create and delete actions
  useEffect(() => {
    if (success) {
      toast.success(message);
      setCategory('');
      dispatch(listCategories());
    } else if (error) {
      toast.error(error);
    }

    if (deleteSuccess) {
      toast.success(deleteMessage);
      dispatch(listCategories());
      setVisible(false);
      setDeleteSlug(null);
    } else if (deleteError) {
      toast.error(deleteError);
    }

    if (updateSuccess) {
      toast.success(updateMessage);
      setEditVisible(false);
      dispatch(listCategories());
    } else if (updateError) {
      toast.error(updateError);
    }

    if (listError) {
      toast.error(listError);
    }
  }, [
    success,
    error,
    deleteSuccess,
    deleteError,
    listError,
    message,
    deleteMessage,
    updateSuccess,
    updateError,
    updateMessage,
    dispatch,
  ]);

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditCategory(category.name);
    setEditVisible(true);
  };

  const submitEditHandler = () => {
    if (currentCategory && editCategory) {
      dispatch(updateCategory(currentCategory.slug, editCategory));
    }
  };

  const handleDelete = (slug) => {
    setDeleteSlug(slug);
    setVisible(true);
  };

  const confirmDelete = () => {
    if (deleteSlug) {
      dispatch(deleteCategory(deleteSlug));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createCategory(category));
  };

  const menu = (category) => (
    <Menu>
      <Menu.Item onClick={() => handleEdit(category)}>Edit</Menu.Item>
      <Menu.Item onClick={() => handleDelete(category.slug)}>Delete</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Date Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (category) => (
        <Dropdown overlay={menu(category)} trigger={['click']}>
          <Button icon={<AiOutlineMore />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      {/* Category Create Form */}
      <div>
        <Card title="Add Category">
          {loading && <div>Loading...</div>}
          <form onSubmit={submitHandler}>
            <Input
              id="category"
              placeholder="Category Name"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button type="primary" htmlType="submit" className="mt-4">
              Add Category
            </Button>
          </form>
        </Card>
      </div>

      {/* Category List */}
      <section className="mt-3">
        {listLoading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </section>

      {/* Delete Category Modal */}
      <Modal
        title="Delete Category"
        visible={visible}
        onOk={confirmDelete}
        onCancel={() => setVisible(false)}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        visible={editVisible}
        onOk={submitEditHandler}
        onCancel={() => setEditVisible(false)}
      >
        <Input
          id="edit-category"
          placeholder="Category Name"
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default Categories;

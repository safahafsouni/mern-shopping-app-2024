import { Button, Card, Input, Select, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';
import { listCategories } from '../../actions/categoryActions';
import { createProduct } from '../../actions/productActions';
import Loader from '../../components/shared/Loader';

const { Title, Text } = Typography;

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [picture, setPicture] = useState(null); // Change to null initially
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.categoryList);
  const { loading, success, error, message } = useSelector(
    (state) => state.productCreate
  );

  useEffect(() => {
    if (success) {
      toast.success(message);
      navigate('/admin/products'); // Redirect after success
    }
  }, [success, message, navigate]);

  const submitHandler = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const formData = new FormData(); // Create form data object
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('picture', picture);
    formData.append('description', description);
    formData.append('countInStock', countInStock);

    dispatch(createProduct(formData)); // Dispatch createProduct action
  };

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Card className="w-full">
      <Title level={2}>Products details</Title>
      <Text>Enter your information to create a product</Text>
      {/* Form */}
      <form
        className="mt-4"
        onSubmit={submitHandler}
        encType="multipart/form-data"
      >
        <div className="grid gap-4">
          <div>
            <Text strong>Product name</Text>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Text strong>Price</Text>
              <Input
                id="price"
                type="number"
                placeholder="Enter product price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <Text strong>Stock</Text>
              <Input
                id="stock"
                type="number"
                placeholder="Enter product stock"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div>
              <Text strong>Category</Text>
              <Select
                onChange={(value) => setCategory(value)}
                value={category}
                allowClear
                style={{ width: '100%' }}
              >
                <Select.Option value="" disabled>
                  Select Category
                </Select.Option>
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
          {/* Picture Upload */}
          <div className="grid gap-2">
            <Text strong>Picture</Text>
            <Upload
              id="picture"
              beforeUpload={(file) => {
                setPicture(file); // Capture the selected file
                return false; // Prevent automatic upload
              }}
              listType="picture"
              multiple={false}
            >
              <Button icon={<UploadOutlined />}>Upload Picture</Button>
            </Upload>
          </div>
          <div>
            <Text strong>Description</Text>
            <Input.TextArea
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="primary" htmlType="submit" className="max-w-36">
            Add Product
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateProduct;

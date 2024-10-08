import { Button, Card, Input, Select, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listCategories } from '../../actions/categoryActions';
import {
  listProductDetails,
  updateProduct,
} from '../../actions/productActions';
import { toast } from 'react-toastify';
import Loader from '../../components/shared/Loader';

const { TextArea } = Input;
const { Text } = Typography;

const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from route params
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.categoryList);
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
    message,
  } = useSelector((state) => state.productUpdate);

  // Fetch product details whenever productId changes
  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  // Update form fields when product data is available
  useEffect(() => {
    if (product && product._id === id) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category?._id);
      setDescription(product.description);
      setCountInStock(product.countInStock);
    }
  }, [product, id]);

  // Handle successful product update
  useEffect(() => {
    if (updateSuccess) {
      toast.success(message);
      navigate('/admin/products');
    }
  }, [updateSuccess, message, navigate]);

  useEffect(() => {
    dispatch(listCategories()); // Fetch categories
  }, [dispatch]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const submitHandler = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('picture', picture); // Send the new picture if uploaded
    formData.append('description', description);
    formData.append('countInStock', countInStock);

    dispatch(updateProduct(id, formData)); // Dispatch updateProduct action
  };

  if (loading || updateLoading) {
    return <Loader />;
  }

  return (
    <>
      <Card title="Update Product" bordered={false} style={{ width: '100%' }}>
        <Text>Modify the product details below</Text>
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          style={{ marginTop: '20px' }}
        >
          <div className="grid gap-4">
            {/* Product Name */}
            <div className="grid gap-2">
              <Text strong>Product Name</Text>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Price, Stock, Category */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Text strong>Price</Text>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Text strong>Stock</Text>
                <Input
                  id="stock"
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Text strong>Category</Text>
                <Select
                  placeholder="Select Category"
                  value={category}
                  onChange={handleCategoryChange}
                  allowClear
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
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
                  setPicture(file);
                  return false; // Prevent automatic upload
                }}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Picture</Button>
              </Upload>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Text strong>Description</Text>
              <TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button type="primary" htmlType="submit" className="max-w-36">
              Update Product
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default UpdateProduct;

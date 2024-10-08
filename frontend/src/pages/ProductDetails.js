import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  listProductDetails,
  deleteProductReview,
  listRelatedProducts,
} from '../actions/productActions';
import Rating from '../components/Rating';
import { Badge, Button, Modal } from 'antd';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReviewModal from '../components/ReviewModal';
import { addToCart } from '../actions/cartActions';
import ProductCard from '../components/ProductCard';
import Loader from '../components/shared/Loader';
import Message from '../components/shared/Message';

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const dispatch = useDispatch();
  const { id } = useParams();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product, relatedProducts } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
    dispatch(listRelatedProducts(id)); // Fetch related products
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, qty));
    toast.success('Item added to cart!');
  };

  const showReviewModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const showDeleteModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedReviewId) {
      dispatch(deleteProductReview(id, selectedReviewId));
      setIsDeleteModalVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-4">
          {/* Product Image */}
          <div className="flex-1 flex justify-center mb-4">
            <img
              src={product?.picture?.secure_url}
              alt={product.name}
              className="w-full max-w-xs rounded-lg shadow-md"
            />
          </div>
          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center my-2">
              <Rating value={product.rating} />
              <span className="text-gray-600 ml-2">
                {product.numReviews} Review{product.numReviews > 1 ? 's' : ''}
              </span>
            </div>
            <div className="my-2">
              <div>
                <span className="font-semibold">Category:</span>
                <span className="text-gray-600 ml-2">
                  {product.category?.name}
                </span>
              </div>
            </div>
            <div className="my-2">
              <div>
                <span className="font-semibold">Price:</span>
                <span className="text-gray-600 ml-2 text-lg">
                  ${product.price}
                </span>
              </div>
            </div>
            <div className="my-2">
              <h2 className="text-lg font-semibold">Status:</h2>
              <Badge
                count={product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                style={{
                  backgroundColor:
                    product.countInStock > 0 ? '#52c41a' : '#f5222d',
                  color: '#fff',
                }}
              />
            </div>
            {product.countInStock > 0 && (
              <div className="flex items-center mb-4">
                <label htmlFor="qty" className="mr-4 text-lg font-semibold">
                  Quantity:
                </label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Button Section */}
            <div className="flex space-x-4 mt-2">
              <button
                onClick={addToCartHandler}
                className={`flex items-center justify-center w-32 py-2 text-sm font-semibold border-2 transition duration-200 ease-in-out ${
                  product.countInStock > 0
                    ? 'bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={product.countInStock === 0}
              >
                <FaShoppingCart className="mr-1" />
                Add to Cart
              </button>

              <button
                onClick={showReviewModal}
                className="flex items-center justify-center w-32 py-2 text-sm font-semibold border-2 border-red-600 bg-white text-red-600 transition duration-200 ease-in-out hover:bg-red-600 hover:text-white"
              >
                Write a Review
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Description:</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Customer Reviews
        </h2>
        {product.reviews.length === 0 ? (
          <div className="text-gray-500">No reviews yet.</div>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex-1">
                  <Rating value={review.rating} />
                  <p className="mt-2">{review.comment}</p>
                  <p className="mt-2 text-gray-600">
                    Reviewed by: {review.name}
                  </p>
                </div>
                <Button
                  type="link"
                  onClick={() => showDeleteModal(review._id)}
                  className="text-red-500 flex items-center"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer mt-2">
          {relatedProducts?.length > 0 ? (
            relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        productId={id}
      />
      {/* Delete Review Modal */}
      <Modal
        title="Delete Review"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this review?</p>
      </Modal>
    </div>
  );
};

export default ProductDetails;

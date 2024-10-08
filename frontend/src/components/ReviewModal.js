import React, { useState } from 'react';
import { Modal, Form, Rate, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { createProductReview } from '../actions/productActions'; // Ensure this import exists
import { listProductDetails } from '../actions/productActions'; // Import the listProductDetails action

const ReviewModal = ({ visible, onClose, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(createProductReview(productId, { rating, comment }));
      setComment('');
      setRating(0);
      onClose();
      // Refetch product details to get the updated reviews
      dispatch(listProductDetails(productId)); // Refetch the product details here
    } catch (error) {
      // Optionally handle the error here
      console.error(error);
    }
  };

  return (
    <Modal
      title="Add a Review"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form onFinish={handleSubmit}>
        <Form.Item>
          <Rate value={rating} onChange={setRating} />
        </Form.Item>
        <Form.Item>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            style={{ width: '100%', borderRadius: '4px', padding: '10px' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;

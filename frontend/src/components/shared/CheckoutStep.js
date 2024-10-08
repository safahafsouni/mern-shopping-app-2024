import React from 'react';
import { Steps } from 'antd';
import { Link } from 'react-router-dom';

const { Step } = Steps;

const CheckoutStep = ({ step1, step2, step3, step4 }) => {
  return (
    <Steps
      current={getCurrentStep(step1, step2, step3, step4)}
      style={{ padding: '20px' }}
    >
      <Step
        title={step1 ? <Link to="/login">Sign In</Link> : 'Sign In'}
        status={step1 ? 'finish' : 'wait'}
      />
      <Step
        title={step2 ? <Link to="/shipping">Shipping</Link> : 'Shipping'}
        status={step2 ? 'finish' : 'wait'}
      />
      <Step
        title={step3 ? <Link to="/payment">Payment</Link> : 'Payment'}
        status={step3 ? 'finish' : 'wait'}
      />
      <Step
        title={
          step4 ? <Link to="/place-order">Place Order</Link> : 'Place Order'
        }
        status={step4 ? 'finish' : 'wait'}
      />
    </Steps>
  );
};

const getCurrentStep = (step1, step2, step3, step4) => {
  if (step4) return 3;
  if (step3) return 2;
  if (step2) return 1;
  if (step1) return 0;
  return -1; // No steps completed
};

export default CheckoutStep;

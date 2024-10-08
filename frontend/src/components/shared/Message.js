import React from 'react';
import { Alert } from 'antd';

const Message = ({ variant, children }) => {
  return <Alert message={children} type={variant} showIcon />;
};

export default Message;

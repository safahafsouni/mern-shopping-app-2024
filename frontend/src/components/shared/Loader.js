import React from 'react';
import { Spin } from 'antd';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Adjust as needed to fit the layout
      }}
    >
      <Spin
        size="large"
        style={{
          fontSize: '24px', // Adjust the size of the spinning indicator if needed
        }}
      />
    </div>
  );
};

export default Loader;

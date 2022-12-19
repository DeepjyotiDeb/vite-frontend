import React from 'react';
import { Circles } from 'react-loader-spinner';
const CustomLoader = () => {
  return (
    <div className='loader__container'>
      <Circles color='#eeeeee' width={50} height={50} />
    </div>
  );
};

export default CustomLoader;

import React from 'react';
import { Link } from 'react-router-dom';

const CustomError = ({
  errorCode,
  errorMessage,
  errorRoute,
  hint,
  routeText,
}) => {
  return (
    <div className='error_container'>
      <div className='error-text'>
        <span>{errorCode}</span>
        <p className='errorMessage'>{errorMessage}</p>
        <p className='errorHint'>{hint}</p>
        <p className='homepage'>
          <Link className='back' to={errorRoute}>
            {routeText ? routeText : 'Back to Homepage'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomError;

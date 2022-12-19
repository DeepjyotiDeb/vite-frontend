/* eslint-disable unused-imports/no-unused-imports */

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Typography } from '@mui/material';

import { ImageViewContainer } from '../../../styles/smartpaperStyles/ImageViewer';
// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars

const ErrorImageComponent = (props) => {
  const { requestArray, errorProps, deleteErrorImg } = props;

  const newFoo = errorProps.map((element, id) => {
    let errImg;
    if (requestArray.some((item) => element.errorId === item.requestId)) {
      // console.log('condtion passed');
      errImg = requestArray.find(
        (errImgElement) => errImgElement.requestId === element.errorId
      );
    } else {
      // console.log('err img', element, requestArray);
      errImg = requestArray[id];
    }
    // console.log('req array', element, errImg);
    return (
      <div
        className='errorImage'
        key={id}
        style={{
          border: '1px solid red',
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingBottom: '10px',
          marginTop: '10px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '40px',
            textAlign: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0,
            paddingRight: 0,
          }}
        >
          <span style={{ color: 'red' }}> Error Image</span>
          <IconButton
            onClick={() => {
              deleteErrorImg(errImg);
            }}
            size='small'
            style={{
              color: '#000000',
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        </div>

        <Typography variant='body2' style={{ paddingBottom: '8px' }}>
          {element.errorDetail ? element.errorDetail : 'Internal server Error'}
        </Typography>
        <ImageViewContainer>
          <img
            src={errImg.imageSource}
            alt={`Your Work - ${id}`}
            id={`output - ${id}`}
            className='outputImage'
          />
        </ImageViewContainer>
      </div>
    );
  });
  return <div>{newFoo}</div>;
};

export default ErrorImageComponent;

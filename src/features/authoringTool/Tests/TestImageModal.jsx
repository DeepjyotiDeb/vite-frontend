import { Box, Modal } from '@mui/material';

export const TestImageModal = ({ imageProps, setState }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '400px',
    // minWidth: '50rem',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };
  return (
    <Modal
      open={imageProps.modalState}
      onClose={() =>
        setState((pre) => ({
          ...pre,
          imageModal: { image: '', modalState: false },
        }))
      }
      aria-labelledby='test-title'
      aria-describedby='test-description'
    >
      <Box sx={style}>
        <img
          src={imageProps.image}
          alt='Question Paper'
          style={{
            maxWidth: '80vw',
            maxHeight: '90vh',
            border: '1px solid black',
          }}
        />
      </Box>
    </Modal>
  );
};

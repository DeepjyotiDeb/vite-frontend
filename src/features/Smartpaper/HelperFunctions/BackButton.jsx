import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const GoBack = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <>
      <IconButton
        color='primary'
        aria-label='go-back'
        component='span'
        onClick={handleClick}
      >
        <ArrowBack color='primary' sx={{ padding: 0, color: '#0d47a1' }} />
      </IconButton>
    </>
  );
};

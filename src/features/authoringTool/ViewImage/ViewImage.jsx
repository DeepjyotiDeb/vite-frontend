import { Button, Paper, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ViewImage = () => {
  useEffect(() => {
    document.title = 'Authoring Tool | View Image';
  }, []);
  const [url, setUrl] = useState('');
  const [urlImg, setUrlImg] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setUrlImg(url);
  };
  return (
    <Paper
      sx={{
        pl: 2,
        py: 2,
        pr: 2,
        minWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '95%',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <TextField
          variant='standard'
          label='URL'
          name='URL'
          size='medium'
          required
          sx={{ width: '80%', margin: 'auto' }}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <Button
          variant='contained'
          sx={{ width: '10%', ml: 1, margin: 'auto', height: '40px' }}
          type='submit'
          color='secondary'
        >
          Send
        </Button>
      </form>
      {urlImg && <img src={urlImg} alt='url' />}
    </Paper>
  );
};

export default ViewImage;

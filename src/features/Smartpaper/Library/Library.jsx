/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */

import { Button, List, ListItem, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import JsFileDownloader from 'js-file-downloader';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';
import { downloadTest } from '../../../api/api';
import { getAllTests } from '../../../api/authoringApi';

const Library = () => {
  const [testList, setTestList] = useState([]);
  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTests({
      body: { organizationId: user.organizationId },
      headers: { headers: { Authorization: user.token } },
    })
      .then((res) => {
        const { tests } = res.data;
        const testNames = tests.map((item) => item.testName);
        setTestList(testNames);
      })
      .catch((err) => console.log({ err }));
  }, []);

  const handleDownload = async (e, test) => {
    e.preventDefault();
    downloadTest({
      body: {
        testName: test,
        organizationId: user.organizationId,
      },
      headers: {
        headers: {
          Authorization: user.token,
        },
      },
    }).then((res) => {
      // console.log({ res });
      const { pdfUrl } = res.data.urls[0];
      // new JsFileDownloader({
      //   url: pdfUrl[0],
      //   filename: `${test}.pdf`,
      // })
      //   .then((res) => console.log('success', res))
      //   .catch((err) => console.log('fail', err));
    }
    );
  };

  return (
    <Container
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component='main'
        // maxWidth="xs"
        sx={{
          marginTop: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            height: '98vh',
            padding: { xs: '2rem 0', sm: '2rem 0rem' },
          }}
          width={{ xs: '90%', sm: '90%', md: '60%', lg: '50%' }}
          maxWidth='50rem'
        >
          {testList.map((test, index) => (
            <List key={index}>
              <ListItem
                sx={{
                  borderRadius: '20px',
                  border: '1px solid lightgrey',
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%  ',
                  margin: 'auto',
                }}
              >
                <Typography sx={{ fontSize: '15px' }}>{test}</Typography>
                <Button variant='text' onClick={(e) => handleDownload(e, test)}>
                  Download
                </Button>
              </ListItem>
            </List>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Library;

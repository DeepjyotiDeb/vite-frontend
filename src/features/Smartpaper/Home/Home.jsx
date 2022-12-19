/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Assessment, DocumentScanner } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TestNames2Obj } from '../Data/TestData';
import { currentUser } from '../../auth/userSlice';

// const useStoreValue = () => {
//   const { user1, orgName1 } = useStore(
//     store => (
//       {
//         user1: store.userName,
//         orgName1: store.orgName1
//       },
//       shallow
//     )
//   );
//   return { user1, orgName1 };
// };

export const Home = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testList, setTestList] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(currentUser);
  const { t } = useTranslation();

  useEffect(() => {
    // if (orgName === 'csf' || orgName === 'csf_test') {
    //   setTestList(TestNames2Obj);
    // } else {
    //   setTestList(TestNames);
    // }
    // !user.organisation && navigate('/smartpaper/onboarding', { replace: true });
    setTestList(TestNames2Obj);
    // if (router.isReady) {
    //   if (!userName) {
    //     router.push(`/${router.query.org_name}`);
    //   }
    // }
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleScan = (e) => {
    e.preventDefault();
    navigate(`scan`);
    setLoading(true);
  };

  const handleResult = (e) => {
    e.preventDefault();
    navigate(`result`);
    setLoading(true);
  };

  const handleLogout = () => {
    // setUser('');
    navigate(`/org`);
    setLoading(true);
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
      {/* {loading && <Loader loadingMessage={'Loading...'} />} */}
      <Box
        component='main'
        // maxWidth="xs"
        sx={{
          // marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'space-around',
          width: '100%',
          height: '100%',
          margin: 'auto',
          // border: '1px solid red',
        }}
      >
        <Box
          sx={{
            minHeight: '95vh',
            padding: '2rem 0',
          }}
          width={{ xs: '90%', sm: '90%', md: '80%' }}
          maxWidth='50rem'
        >
          <Box
            sx={{
              // mb: 3,
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
              // justifyContent: 'center',
              padding: '0px',
              gap: { xs: '2rem', md: '4rem' },
              // ml: 'auto',
              // mr: 'auto',
              margin: 'auto',
            }}
          >
            <Button
              variant='contained'
              // disabled={!(text.length > 0)}
              sx={{
                width: { md: '140px', xs: '160px' },
                height: { md: '120px', xs: '160px' },
                fontSize: '1.6rem',
                textTransform: 'none',
                alignSelf: 'center',
                borderRadius: '0.5rem',
                backgroundColor: '#0d47a1',
                mt: 2,
                flexDirection: 'column',
              }}
              onClick={handleScan}
            >
              <DocumentScanner sx={{ fontSize: '45px', margin: '10px' }} />
              {t('scan')}
            </Button>
            <Button
              variant='contained'
              // disabled={!(text.length > 0)}
              sx={{
                width: { md: '140px', xs: '160px' },
                height: { md: '120px', xs: '160px' },
                fontSize: '1.6rem',
                textTransform: 'none',
                alignSelf: 'center',
                borderRadius: '0.5rem',
                backgroundColor: '#0d47a1',
                mt: 2,
                flexDirection: 'column',
              }}
              onClick={handleResult}
            >
              <Assessment sx={{ fontSize: '45px', margin: '10px' }} />
              {t('results')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

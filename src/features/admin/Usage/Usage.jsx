/* eslint-disable react-hooks/exhaustive-deps */
import {  ExpandMore } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enLocale from 'date-fns/locale/en-IN';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
import IsoTimeConverter from '../../Smartpaper/HelperFunctions/IsoTimeConverter';
import { getUsageDetails } from '../../../api/adminApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from '../../../styles/CustomAccordion';
import { DateTheme } from '../../../styles/smartpaperStyles/CustomDateStyle';
import { CustomLabel, CustomTextField } from '../../../styles/smartpaperStyles/CustomForm';
// import TableStyles from '../../../styles/smartpaperStyles/TableStyles';

export const Usage = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
    useState(false);
  const user = useSelector(currentUser);
  // const [testList, setTestList] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({ startDate: new Date(),
    endDate: new Date(),
    organizationId: user.organizationId, });
  const [expanded, setExpanded] = useState('panel1'); //accordion states
  // const [tableState, setTableState] = useState({
  //   data: [],
  //   resultFetched: false,
  //   nullReport: false,
  // });
  // const [inputImages, setInputImages] = useState([]);
  // const [outputImages, setOutputImages] = useState([]);
  const [images, setImages] = useState([]);
  const [state, setState] = useState({
    success: false,
    error: false,
    loading: false,
    message: '',
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentTab(0);
    const startDate = IsoTimeConverter(formData.startDate);
    const endDate = IsoTimeConverter(formData.endDate);
    let obj = {
      startDate: startDate.split('T')[0] ,
      endDate: endDate.split('T')[0] ,
      organizationId: user.organizationId,
    };
    console.log(obj)
    setState({ ...state, loading: true });
    await getUsageDetails(obj, {
      headers: {
        Authorization: user.token,
      },
    })
      .then((res) => {
        console.log('result', res);
        setState({ ...state, loading: false });
        if (res.status === 200) {
          setState({ ...state, success: true });
          // setInputImages(res.data.body[0].inputImg);
          // setOutputImages(res.data.body[0].outputImg);
          setImages(res.data.body);
          setState({
            ...state,
            success: true,
            loading: false,
            message: `${res.data.body.length} result${
              res.data.body.length > 1 ? 's' : ''
            } found!`,
          });
          setTimeout(() => {
            setState({ ...state, success: false, message: '' });
          }, 3000);
        } else {
          setState({
            ...state,
            error: true,
            loading: false,
            message: `No results found!`,
          });
          setTimeout(() => {
            setState({ ...state, error: false, message: '' });
          }, 3000);
        }
      })
      .catch((_err) => {
        console.log('error - ', _err);
        // console.log('error', { err });
        setState({
          ...state,
          loading: false,
          success: false,
          error: true,
          message: _err.response.data.message,
        });
        setTimeout(() => {
          setState({ ...state, error: false, message: '' });
        }, 3000);
      });
  };


  
  return (
    <Container
      sx={{
        mt: 0,
        mb: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
    >
      <Box
        component="main"
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        
          <Box
            sx={{ width: '100%', padding: { xs: '2rem 0', sm: '2rem 2rem' } }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 0,
                mb: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0px',
                width: '100%',
              }}
            >
              <CustomAccordion
                expanded={expanded === 'panel1'}
                onChange={handleAccordionChange('panel1')}
                sx={{ width: '100%', mb: 0 }}
              >
                <CustomAccordionSummary
                  expandIcon={<ExpandMore sx={{ fontSize: '2rem' }} />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  width={{ xs: '90%', md: '80%', lg: '70%' }}
                  sx={{ margin: 'auto', padding: 0, maxWidth: '40rem' }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item xs={5}>
                      <Typography
                        sx={{ margin: '0', textAlign: 'center' }}
                        fontSize={{ xs: '1.5rem', md: '2rem' }}
                      >
                        Usage
                      </Typography>
                    </Grid>
                  </Grid>
                </CustomAccordionSummary>
                <CustomAccordionDetails
                  sx={{ mb: 0, margin: 'auto', padding: 0, maxWidth: '35rem' }}
                  width={{ xs: '90%', md: '80%', lg: '70%' }}
                >
                  <Grid
                  container
                  spacing={2}
                  justifyContent='center'
                  alignItems='center'
                >
                  <Grid item xs={6} sm={6}>
                    <CustomLabel
                      required
                      id='startDatePickerLabel'
                      htmlFor='startDatePicker'
                    >
                      {t('from')}
                    </CustomLabel>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={enLocale}
                      id='startDatePicker'
                    >
                      <ThemeProvider theme={DateTheme}>
                        <MobileDatePicker
                          inputFormat='dd/MM/yyyy'
                          value={formData.startDate}
                          // onChange={newValue => setStartDate(newValue)}
                          onChange={(newValue) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              startDate: newValue,
                            }))
                          }
                          renderInput={(params) => (
                            <CustomTextField {...params} fullWidth />
                          )}
                        />
                      </ThemeProvider>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <CustomLabel
                      required
                      id='endDatePickerLabel'
                      htmlFor='endDatePicker'
                    >
                      {t('to')}
                    </CustomLabel>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={enLocale}
                      id='endDatePicker'
                    >
                      <ThemeProvider theme={DateTheme}>
                        <MobileDatePicker
                          inputFormat='dd/MM/yyyy'
                          value={formData.endDate}
                          onChange={(newValue) => {
                            setFormData((prevState) => ({
                              ...prevState,
                              endDate: newValue,
                            }));
                          }}
                          renderInput={(params) => (
                            <CustomTextField {...params} fullWidth />
                          )}
                          sx={{ marginLeft: '12px' }}
                        />
                      </ThemeProvider>
                    </LocalizationProvider>
                  </Grid></Grid>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      margin: '1rem 0',
                      width: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <LoadingButton
                      variant="contained"
                      loading={state.loading}
                      disabled={
                        state.loading ||
                        !formData.startDate ||
                        !formData.endDate
                      }
                      type="submit"
                      sx={{
                        width: '15rem',
                        fontSize: '16px',
                        borderRadius: '10px',
                        margin: '0.5rem 0.25rem',
                        backgroundColor: 'rgb(32, 70, 155)',
                      }}
                    >
                      {t('view')}
                    </LoadingButton>
                  </div>
                </CustomAccordionDetails>
              </CustomAccordion>
            </Box>

            {images?.length > 0 && (
              <Box>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    marginTop: '2rem',
                    position: 'sticky',
                    top: '0',
                    backgroundColor: 'white',
                  }}
                >
                  <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => setCurrentTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {images?.map((image, index) => {
                      return (
                        <Tab
                          label={`${t('result')} ${index + 1}`}
                          value={index}
                          key={index}
                        />
                      );
                    })}
                  </Tabs>
                  <Divider />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button
                      startIcon={<ArrowBackIcon />}
                      disabled={currentTab === 0}
                      onClick={() => setCurrentTab(currentTab - 1)}
                      fullWidth
                      sx={{
                        margin: '2px',
                      }}
                    >
                      {t('previous')}
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      disabled={currentTab === images.length - 1}
                      onClick={() => setCurrentTab(currentTab + 1)}
                      fullWidth
                      sx={{
                        margin: '2px',
                      }}
                    >
                      {t('next2')}
                    </Button>
                  </Box>
                </Box>
                {/* {currentTab === 'input' ? (
                <Box sx={{ padding: '1.5rem', display:'flex', flexDirection:'column', justifyContent:'center', gap:'1rem' }}>
                  {images.map((image) => {
                    return (
                      <img
                        src={image.inputImg}
                        alt="Input"
                        style={{ maxWidth: '100%' }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ padding: '1.5rem', display:'flex', flexDirection:'column', justifyContent:'center', gap:'1rem' }}>
                  {images.map((image) => {
                    return (
                      <img
                        src={image.outputImg}
                        alt="Output"
                        style={{ maxWidth: '100%' }}
                      />
                    );
                  })}
                </Box>
              )} */}

                <Box
                  sx={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    // alignItems: 'center',
                    gap: '1rem',
                  }}
                  flexDirection={{ xs: 'column', md: 'row' }}
                >
                  <Box
                    // width='100%'
                    width={{ xs: '100%', md: '50%' }}
                  >
                    <Typography
                      textAlign={'center'}
                      my="2rem"
                      fontSize={{ xs: '1.25rem', md: '1.75rem' }}
                    >
                      {t('input')}
                    </Typography>
                    <img
                      src={images[currentTab]?.inputImg}
                      alt="Input"
                      style={{ width: '100%', border: '1px solid lightgrey' }}
                    />
                  </Box>
                  {images[currentTab].outputImg && (
                    <Box
                      // width='100%'
                      width={{ xs: '100%', md: '50%' }}
                    >
                      <Typography
                        textAlign={'center'}
                        my="2rem"
                        fontSize={{ xs: '1.25rem', md: '1.75rem' }}
                      >
                        {t('output')}
                      </Typography>

                      <img
                        src={images[currentTab]?.outputImg}
                        alt="Output"
                        style={{ width: '100%', border: '1px solid lightgrey' }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {state.success && <CustomSuccessTemplate message={state.message} />}
            {state.error && <CustomErrorTemplate message={state.message} />}
          </Box>
        
      </Box>
    </Container>
  );
};

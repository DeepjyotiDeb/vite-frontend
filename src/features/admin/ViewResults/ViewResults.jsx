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
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { ResultColumn } from './ResultColumn';
// import { Table } from '../HelperFunctions/CustomTable';
// import { currentUser } from '../../auth/userSlice';
import { viewResults } from '../../../api/api';
import { getAllTests } from '../../../api/authoringApi';
// import { getAllTests } from '../../../api/authoringApi';
import CustomErrorTemplate from '../../../elements/CustomErrorTemplate';
import CustomSuccessTemplate from '../../../elements/CustomSuccessTemplate';
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from '../../../styles/CustomAccordion';
import { CustomLabel } from '../../../styles/smartpaperStyles/CustomForm';
// import TableStyles from '../../../styles/smartpaperStyles/TableStyles';

export const ViewResults = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
    useState(false);
  const user = useSelector(currentUser);
  // const [testList, setTestList] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({ count: '', type: 'scans' });
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
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleChange = (event, newValue) => {
    if (event.target.name === 'count') {
      if (event.target.value > 2000 || event.target.value < 1) {
        setErrorMessage('Only 1-2000 results allowed!');
      } else {
        setErrorMessage('');
      }
      setFormData((prevState) => ({
        ...prevState,
        count: Number(event.target.value),
      }));
    } else if (event.target.name === 'type') {
      setFormData((prevState) => ({
        ...prevState,
        type: event.target.value,
      }));
    } else {
      setCurrentTest(event.target.value);
      const {
        target: { value },
      } = event;
      console.log('value', value);
      setFormData((prevState) => ({
        ...prevState,
        testId: newValue.props.obj._id,
      }));
    }

    // setTests(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentTab(0);
    setState({ ...state, loading: true });
    await viewResults(formData, {
      headers: {
        Authorization: user.token,
      },
    })
      .then((res) => {
        console.log('result', res);
        setState({ ...state, loading: false });
        if (res.status === 200) {
          setState({ ...state, loading: false });
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

  const [allTests, setAllTests] = useState([])
  useEffect(() => {
    getAllTests({
      body: { organizationId: user.organizationId },
      headers: { headers: { Authorization: user.token } },
    })
      .then((res) => {
        const { tests } = res.data;
        // const testNames = tests.map((item) => item.testName);
        setAllTests(tests);
      })
      .catch((err) => console.log({ err }));
  }, []);

  // const tempCol = ResultColumn();
  // const resultColumns = useMemo(() => tempCol, [tempCol]);
  // const resultData = useMemo(() => tableState.data, [tableState.data]);
 
  const [currentTest, setCurrentTest] = useState('');
  
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
                    {/* <Grid item xs={4}>
                      <IconButton
                        color="primary"
                        aria-label="go-back"
                        component="span"
                        onClick={() => {
                          navigate('/admin');
                        }}
                      >
                        <ArrowBack
                          color="primary"
                          sx={{ padding: 0, color: '#0d47a1' }}
                        />
                      </IconButton>
                    </Grid> */}
                    <Grid item xs={5}>
                      <Typography
                        sx={{ margin: '0', textAlign: 'center' }}
                        fontSize={{ xs: '1.5rem', md: '2rem' }}
                      >
                        {t('results')}
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
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={12}>
                      <CustomLabel
                        id="testNameLabel"
                        htmlFor="testName"
                        required
                      >
                        {t('testName')}
                      </CustomLabel>

                      <Select
                        labelId="testNameLabel"
                        id="testName"
                        required
                        label="test"
                        value={currentTest || ''}
                        onChange={handleChange}
                        sx={{ padding: 0, width: '100%' }}
                      >
                        {/* {orgName === 'csf' || orgName === 'csf_test'? */}
                        {/* {testList.map((test, index) => {
                        return (
                          <MenuItem
                            sx={{ fontSize: 14 }}
                            value={test}
                            key={index}
                          >
                            {test}
                          </MenuItem>
                        );
                      })} */}
                        {allTests.map((test) => {
                          return (
                            <MenuItem
                              sx={{ fontSize: 14 }}
                              value={test.testName}
                              key={test._id}
                              obj={test}
                            >
                              {test.testName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={{ xs: '1.5rem', md: '0rem' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '2rem 1rem 0 1rem',
                        width: '100%',
                      }}
                    >
                      <FormControl sx={{ display: 'flex' }}>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                          {t('typeOfResults')}
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="type"
                          value={formData.type}
                          row
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="scans"
                            control={<Radio />}
                            label={t('scan')}
                          />
                          <FormControlLabel
                            value="error"
                            control={<Radio />}
                            label={t('error')}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                      }}
                      flexDirection={{ xs: 'column', md: 'row' }}
                      px="1rem"
                      gap={{ xs: '0', md: '1rem' }}
                    >
                      <Typography
                        margin={{ xs: '1rem 0 0 0', md: '2rem 0 0 0' }}
                      >
                        {t('pleaseEnterNumberOfResults')}
                      </Typography>

                      <FormControl style={{ width: '10rem' }} error>
                        <TextField
                          margin="normal"
                          required
                          name="count"
                          label={t('results')}
                          type="text"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          id="count"
                          value={formData.count || ''}
                          autoComplete="count"
                          onChange={handleChange}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleSubmit(e)
                          }
                        />
                        <FormHelperText
                          sx={{ lineHeight: '1', width: '10rem', margin: '0' }}
                        >
                          {errorMessage}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  </Box>
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
                        !formData.testId ||
                        formData.count < 1 ||
                        formData.count > 2000
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
                      {/* {t('view')} {formData.count>0 && formData.count<16 && `${formData.count} result${formData.count>1 ? 's':''}`} */}
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

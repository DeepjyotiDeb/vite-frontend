/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline, ExpandMore } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enLocale from 'date-fns/locale/en-IN';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ResultColumn } from './ResultColumn';
import { DeleteDialog, ExportResult } from './ResultFunctions';
import { GoBack } from '../HelperFunctions/BackButton';
import { Table } from '../HelperFunctions/CustomTable';
import IsoTimeConverter from '../HelperFunctions/IsoTimeConverter';
import { currentUser } from '../../auth/userSlice';
import { generateReport, removeReport } from '../../../api/api';
import { getAllTests } from '../../../api/authoringApi';
import { getGroupDetailsApi } from '../../../api/groupApi';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';
// import useForm from '../../../elements/useForm';
import {
  CustomAccordion,
  CustomAccordionDetails,
  CustomAccordionSummary,
} from '../../../styles/CustomAccordion';
import { DateTheme } from '../../../styles/smartpaperStyles/CustomDateStyle';
import {
  CustomInput,
  CustomLabel,
  CustomTextField,
} from '../../../styles/smartpaperStyles/CustomForm';
import TableStyles from '../../../styles/smartpaperStyles/TableStyles';

export const Result = () => {
  const { t } = useTranslation();
  const user = useSelector(currentUser);
  let params = useParams();
  const [targetList, setTargetList] = useState([]);
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    targets: [],
    organizationId: user.organizationId,
  });
  const [expanded, setExpanded] = useState('panel1'); //accordion states
  const [tableState, setTableState] = useState({
    data: [],
    resultFetched: false,
    nullReport: false,
  });
  const [toast, setToast] = useState({
    state: false,
    severity: 'error',
    message: 'No reports found!',
  });
  const [dialog, setDialog] = useState({
    handleDialog: false,
  });
  const [loader, setLoader] = useState({
    loading: false,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleMultiSelect = (event) => {
    const {
      target: { value },
    } = event;
    // console.log('value', value);
    setFormData((prevState) => ({
      ...prevState,
      targets: typeof value === 'string' ? value.split(',') : value,
    }));
    // setTests(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const customStartDate =
    //   formData.startDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const targetIds = targetList.map(
      (item) => item.targetName.includes(formData.targets) && item._id
    );
    // console.log('first', fullTargetList, formData.targets, targetIds);
    const startDate = IsoTimeConverter(formData.startDate);
    const endDate = IsoTimeConverter(formData.endDate);
    let obj = {
      targetNames: formData.targets,
      targetIds,
      startDate: startDate.split('T')[0] + 'T00:00:00',
      endDate: endDate.split('T')[0] + 'T23:59:59',
      organizationId: user.organizationId,
    };
    if (params.classId) {
      obj['groupId'] = params.classId;
    } else {
      obj['groupId'] = user._id;
    }
    setLoader({ loading: true });
    try {
      const res = await generateReport(obj);
      //* If no response
      if (res.data.statusCode !== 200) {
        setLoader({ loading: false });
        setToast((prevState) => ({
          ...prevState,
          state: true,
          message: 'No reports found',
        }));
        return;
      }
      //* if response has data (success condition)
      console.log('res', res);
      if (res.data.data.length > 0) {
        setTableState((prevState) => ({
          ...prevState,
          data: res.data.data,
          resultFetched: true,
        }));
        setLoader({ loading: false });
      }
    } catch (error) {
      //* if response throws error
      console.error(error);
      setLoader({ loading: false });
      setToast((prevState) => ({
        ...prevState,
        state: true,
        message: 'Internal Server Error',
      }));
    }

    // await generateReport(obj)
    //   .then((res) => {
    //     if (res.data.statusCode === 200) {
    //       setTableState((prevState) => ({
    //         ...prevState,
    //         data: res.data.data,
    //         resultFetched: true,
    //       }));
    //     } else {
    //       setLoader({ loading: false });
    //       setToast((prevState) => ({
    //         ...prevState,
    //         state: true,
    //         message: 'No reports found',
    //       }));
    //     }
    //   })
    //   .catch((_err) => {
    //     console.log('obj', _err);
    //     // console.log('error', { err });
    //     setLoader({ loading: false });
    //     setToast((prevState) => ({
    //       ...prevState,
    //       state: true,
    //       message: 'Internal Server Error',
    //     }));
    //   });
  };

  let deleteRows;
  const SelectDeleteData = (deleteId) => {
    deleteRows = deleteId.map((item) => item.original.scanId);
    // console.log('delete', deleteId);
  };
  const onDelete = async () => {
    if (!deleteRows.length) {
      setToast((prevState) => ({
        ...prevState,
        state: true,
        message: 'select a row first!',
      }));
      return;
    }
    const deleteObj = {
      scanId: deleteRows.flat(),
      organizationId: user.organizationId,
    };
    // console.log('data', deleteObj);
    let result = await removeReport(deleteObj);
    // console.log('data', result);
    if (result.status !== 200) return;
    let temp = tableState.data.filter(
      (item) => deleteRows.indexOf(item.scanId) === -1
    );
    setTableState((prevState) => ({
      ...prevState,
      data: temp,
    }));
    //enlarging the accordion again
    if (deleteRows.length === tableState.data.length) {
      setExpanded('panel1');
      setLoader((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  //TODO for classes get targetDetails using the test id in url
  useEffect(() => {
    if (params.classId) {
      if (params.testId) {
        let temp = [params.testId];
        setTargetList(temp);
      } else {
        getGroupDetailsApi(
          { groupId: params.classId },
          { headers: { authorization: user.token } }
        )
          .then((res) => {
            console.log(res);
            const { targets } = res.data;
            setTargetList(targets);
          })
          .catch((err) => console.log({ err }));
      }
    } else {
      getAllTests({
        body: { organizationId: user.organizationId },
        headers: { headers: { Authorization: user.token } },
      })
        .then((res) => {
          const { targets } = res.data;
          setTargetList(targets);
        })
        .catch((err) => console.log({ err }));
    }
  }, []);

  const tempCol = ResultColumn();
  const resultColumns = useMemo(() => tempCol, [tempCol]);
  const resultData = useMemo(() => tableState.data, [tableState.data]);

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
        component='main'
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        width={{ xs: '90%', md: '80%', lg: '70%' }}
        maxWidth='50rem'
      >
        <Box sx={{ width: '100%', padding: { xs: '2rem 0', sm: '2rem 2rem' } }}>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              mt: 0,
              mb: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px',
            }}
          >
            <CustomAccordion
              expanded={expanded === 'panel1'}
              onChange={handleAccordionChange('panel1')}
              sx={{ width: '100%', mb: 0 }}
            >
              <CustomAccordionSummary
                expandIcon={<ExpandMore sx={{ fontSize: '2rem' }} />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
                sx={{ padding: 0 }}
              >
                <Grid
                  container
                  direction='row'
                  justifyContent='flex-start'
                  alignItems='center'
                >
                  <Grid item xs={4}>
                    <GoBack />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography
                      variant='h4'
                      sx={{ margin: '0', textAlign: 'center' }}
                    >
                      {t('results')}
                    </Typography>
                  </Grid>
                </Grid>
              </CustomAccordionSummary>
              <CustomAccordionDetails sx={{ mb: 0, padding: 0 }}>
                <Grid
                  container
                  spacing={2}
                  justifyContent='center'
                  alignItems='center'
                >
                  <Grid item xs={12} sm={12}>
                    <CustomLabel id='testNameLabel' htmlFor='testName' required>
                      {t('testName')}
                    </CustomLabel>

                    <Select
                      labelId='testNameLabel'
                      id='testName'
                      name='testName'
                      multiple
                      required
                      value={params.testId ? [params.testId] : formData.targets}
                      input={
                        <CustomInput
                          fullWidth
                          placeholder={t('testName')}
                          sx={{ height: '1rem' }}
                        />
                      }
                      onChange={handleMultiSelect}
                      renderValue={(selected) => {
                        return (
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                            }}
                          >
                            {selected.map((value) => {
                              return (
                                <Chip
                                  key={value}
                                  label={value}
                                  sx={{ fontSize: '13px' }}
                                />
                              );
                            })}
                          </Box>
                        );
                      }}
                      sx={{ padding: 0, width: '100%' }}
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: { xs: 400, md: '60vh' } },
                        },
                      }}
                    >
                      {/* {orgName === 'csf' || orgName === 'csf_test'? */}
                      {targetList.map((target, index) => {
                        return (
                          <MenuItem
                            sx={{ fontSize: 14 }}
                            value={target}
                            key={index}
                          >
                            {target}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
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
                  </Grid>
                </Grid>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '5px',
                    width: '100%',
                  }}
                >
                  <LoadingButton
                    variant='contained'
                    type='submit'
                    sx={{
                      width: '120px',
                      fontSize: '16px',
                      borderRadius: '10px',
                      mt: 1,
                      mb: 2,
                      backgroundColor: 'rgb(32, 70, 155)',
                    }}
                    loading={loader.loading}
                  >
                    {t('view')}
                  </LoadingButton>
                </div>
              </CustomAccordionDetails>
            </CustomAccordion>
          </Box>
          {/* {loader.loading && !tableState.data.length && (
            <Loader
              loadingMessage={t('loading') + '...'}
              sx={{ left: { xs: 0, sm: 0, md: 0 } }}
            />
          )} */}
          {/* {loader.loading && !tableState.data.length && (
            <CustomCircular message={t('loading') + '...'} />
          )} */}
          {tableState.resultFetched && tableState.data.length > 0 && (
            <TableStyles style={{ display: 'flex', flexDirection: 'column' }}>
              <Table
                columns={resultColumns}
                data={resultData}
                deleteData={SelectDeleteData}
                getHeaderProps={(_column) => ({
                  style: {
                    color: 'white',
                    fontSize: '13px',
                  },
                })}
              />
              <DeleteDialog
                handleDialog={dialog.handleDialog}
                setHandleDialog={setDialog}
                onDelete={onDelete}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteOutline />}
                  sx={{
                    width: '150px',
                    height: '36px',
                    fontSize: '16px',
                    lineHeight: '20px',
                    textTransform: 'none',
                    alignSelf: 'center',
                    // marginTop: '8px',
                    borderRadius: '8px',
                    mr: 1,
                  }}
                  onClick={() =>
                    setDialog((prevState) => ({
                      ...prevState,
                      handleDialog: true,
                    }))
                  }
                >
                  {t('delete')}
                </Button>
                {/* //TODO PENDING */}
                <ExportResult
                  // testName={inputs.testName}
                  targetNames={formData.targets}
                  targetList={targetList}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  // userName={userName}
                  orgId={user.organizationId}
                />
              </div>
            </TableStyles>
          )}
          <CustomSnackbar toast={toast} setToast={setToast} />
        </Box>
      </Box>
    </Container>
  );
};

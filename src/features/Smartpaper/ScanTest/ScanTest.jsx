/* eslint-disable react-hooks/exhaustive-deps */
import { Close, DeleteOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ImageQueue } from './QueueClass';
import { customCol } from './ScanTestColumns';
import { GoBack } from '../HelperFunctions/BackButton';
import { CustomCircular } from '../HelperFunctions/CustomCircular';
import {
  RefImgDialog,
  ResetDialog,
  SameErrorImageModal,
} from '../HelperFunctions/CustomDialog';
import { Table } from '../HelperFunctions/CustomTable';
import ErrorImageComponent from '../HelperFunctions/ErrorImageComponent';
import ErrorMessage from '../HelperFunctions/ErrorMessage';
import { hashImage, resizeFile } from '../HelperFunctions/ImageFileResizer';
import IsoTimeConverter from '../HelperFunctions/IsoTimeConverter';
import { currentOrganization } from '../../auth/organizationSlice';
import { currentUser } from '../../auth/userSlice';
import { addReport, updateScan } from '../../../api/api';
import { getAllTests } from '../../../api/authoringApi';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';
import Loader from '../../../elements/Loader';
import useForm from '../../../elements/useForm';
import {
  CustomInput,
  CustomLabel,
} from '../../../styles/smartpaperStyles/CustomForm';
import {
  CustomButton,
  Input,
} from '../../../styles/smartpaperStyles/CustomInput';
import ImageViewer, {
  ImageViewContainer,
} from '../../../styles/smartpaperStyles/ImageViewer';
import TableStyles from '../../../styles/smartpaperStyles/TableStyles';

export default function ScanTest() {
  // const columns = useMemo(() => DemoMCQ, []);

  // const tempElement = useRef();

  // const blurUrl =
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/el3PQAJQQNprtNiowAAAABJRU5ErkJggg==';
  const { t } = useTranslation();
  const { classId, testId } = useParams();
  const [state, setState] = useState({
    // counter: 0,
    imageLoading: false,
    sameImage: false,
    imageLabel: '',
    imageSource: [],
    imageAdded: false,
    loading: false,
    loadingMessage: '',
    isError: false,
    error: {
      message: '',
    },
    errorProps: [],
    totalErrorImages: 0,
    resultFetched: false,
    studentResult: [],
    testImages: [],
    // isDisabled: true,
    // isClearDisabled: true,
    inputImage: createRef(),
    resultImages: [],
    testResult: [],
    originalResult: [],
    saveRollButtonState: false,
    progressStatus: 0,
    totalImages: 0,
    open: false,
    requestArray: [],
    hashList: [],
    refDialogOpen: false,
    refImgSrc: '',
    refEvent: null,
    refImgLoader: false,
    autoSaveState: true,
    targetList: [], //store all test names
    hideColumn: [],
    hideCheckbox: false,
  });
  const [save, setSave] = useState({
    saveState: true,
    newResponse: [],
  });

  // const location = useLocation();
  // const navigate = useNavigate();
  const user = useSelector(currentUser);
  const organization = useSelector(currentOrganization);
  let newResponseArray = [];

  const [toast, setToast] = useState({
    state: false,
    severity: 'success',
    message: '',
  });

  // console.log('router', router);
  const { inputs, handleChange } = useForm({
    school: '',
    testName: testId ? testId : '',
    rollNo: '',
    grade: '',
    subject: '',
  });

  useEffect(() => {
    document.getElementById('testImages').value = '';
    if (testId) {
      let temp = [testId];
      setState({ ...state, targetList: temp });
      console.log('temp', testId);
    } else {
      getAllTests({
        body: { organizationId: user.organizationId },
        headers: { headers: { Authorization: user.token } },
      }).then((res) => {
        // console.log({ res });
        const { targets } = res.data;
        const targetNames = targets.map((item) => item.targetName);
        setState({ ...state, targetList: targetNames });
      });
    }

    // };
  }, []);

  const customHandleChange = (e) => {
    if (
      state.testImages.length === 0 &&
      state.testResult.length === 0 &&
      state.errorProps.length === 0
    ) {
      resetData(e);
      handleChange(e);
      // const tmpRefImg = TestRefImages[e.target.value];
      setState((prevState) => ({
        ...prevState,
        // refImgSrc: tmpRefImg,
        refEvent: { target: e.target },
        // refImgLoader: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        refDialogOpen: true,
        refEvent: { target: e.target },
      }));
    }
  };
  const handleRefClose = () => {
    setState((prevState) => ({
      ...prevState,
      refDialogOpen: false,
    }));
  };
  const handleRefClick = (e) => {
    resetData(e);
    // console.log('ref', state.refEvent);
    handleChange(state.refEvent);
    // const tmpRefImg = TestRefImages[state.refEvent.target.value];
    setState((prevState) => ({
      ...prevState,
      refDialogOpen: false,
      // refImgSrc: tmpRefImg,
      // refImgLoader: false,
    }));
  };

  // const refImgOnLoadComplete = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     refImgLoader: true,
  //   }));
  // };

  let counter = useRef(0); //used for showing the loader
  const handleFileChange = async (e) => {
    // document.getElementById('testImages').value = '';
    setState((prevState) => ({
      ...prevState,
      imageAdded: false,
      imageLabel: '',
      // isDisabled: true,
      // isClearDisabled: true,
      pageMetadata: [],
    }));
    const { files } = e.target;
    if (files.length === 0) {
      setState((prevState) => ({
        ...prevState,
        // testImages: [],
        imageLabel: '',
        imageAdded: true,
        // imageSource: [],
        // isDisabled: false,
        // isClearDisabled: false,
      }));
    } else {
      const fileList = Object.values(files);
      // console.log('image hash');
      setState((prevState) => ({
        ...prevState,
        imageLoading: true, //showing the loader
      }));
      fileList.map(async (file) => {
        await resizeFile(file).then(async (res) => {
          // console.log('res', res.name);
          let imageHash = await hashImage(res);
          if (
            state.hashList.find(
              (errorFile) => errorFile.imageHash === imageHash
            )
          ) {
            setState((prevState) => ({
              ...prevState,
              sameImage: true,
              imageLoading: false,
            }));
            return;
          }
          const blob = URL.createObjectURL(res);
          let tempHashObj = {
            imageName: res.name,
            imageHash: imageHash,
          };
          setState((prevState) => ({
            ...prevState,
            imageSource: [...prevState.imageSource, blob], //.blob
            testImages: [...prevState.testImages, res], //.res {img: file, id:int}
            hashList: [...prevState.hashList, tempHashObj],
            totalImages: [...prevState.testImages, res].length,
          }));
        });
      });
      setState((prevState) => ({
        ...prevState,
        imageAdded: true,
        resultFetched: false,
        imageLabel: 'Your Work',
        // isDisabled: false,
        // isClearDisabled: false,
      }));
    }
    e.target.value = '';
  };
  const resetData = (e) => {
    e.preventDefault();
    document.getElementById('testImages').value = '';
    // resetForm();
    // state.inputImage.current.value = '';
    // state.sameImage.current = false;
    // counter = 0; //image loading counter
    setState((prevState) => ({
      ...prevState,
      // counter: 0,
      sameImage: false,
      testImages: [],
      imageLabel: '',
      imageAdded: false,
      imageSource: [],
      imageLoading: false,
      resultImages: [],
      requestArray: [],
      // isDisabled: true,
      // isClearDisabled: true,
      resultFetched: false,
      isError: false,
      error: {
        message: '',
      },
      errorProps: [],
      totalErrorImages: 0,
      loading: false,
      loadingMessage: '',
      testResult: [],
      originalResult: [],
      saveRollButtonState: false,
      progressStatus: 0,
      open: false,
      totalImages: 0,
      hashList: [],
      // refImgSrc: '',
      refEvent: null,
      refDialogOpen: false,
      autoSaveState: true,
    }));
    setSave((prevState) => ({
      ...prevState,
      newResponse: [],
      saveState: true,
    }));
    console.clear();
  };

  const updateState = (res, requestNo) => {
    console.log(
      `Res from queue class - ${requestNo}`,
      res,
      new Date().toLocaleTimeString('en-US')
    );
    const hashIndex = state.hashList.findIndex(
      (item) => item.imageName === res.data.fileNames
    );
    state.hashList.splice(hashIndex, 1);
    setSave((prevState) => ({
      saveState: false,
      newResponse: [...prevState.newResponse, res.data.scanId],
    }));
    // console.log('res scanId', res.data.scanId);
    // if (state.testResult.length === 0) {
    //   //logic - at some point test result must be zero
    //   if (JSON.stringify(res.data.studentInfo) === '{}') {
    //     setState((prevState) => ({
    //       ...prevState,
    //       hideColumn: ['id', 'rollNo', 'name'],
    //     }));
    //   }
    // }

    newResponseArray.push(res.data.scanId);
    if (requestNo === state.totalImages) {
      saveResponse(newResponseArray); //save image to db
    }
    const tempResultObj = {
      data: res.data,
    };
    // // console.log('temp res obj', tempResultObj);
    setState((prevState) => ({
      ...prevState,
      loading: false,
      loadingMessage: '',
      // imageLoading: true,
      imageLabel: 'Your Result',
      // isDisabled: true,
      // isClearDisabled: false,
      testImages: [],
      imageSource: [],
      resultFetched: true,
      // resultImages: [...prevState.resultImages, ...res.data.data.output_res],
      testResult: [...prevState.testResult, tempResultObj],
      originalResult: [...prevState.originalResult, tempResultObj],
      progressStatus: requestNo,
      totalImages: state.testImages.length, // TODO - Check this again
    }));
  };

  const handleError = (err, requestNo) => {
    console.log(
      `Error from queue class - ${requestNo}`,
      { err },
      new Date().toLocaleTimeString('en-US')
    );
    if (
      requestNo === state.totalImages &&
      !state.testResult.length
      // && state.autoSaveState
    ) {
      saveResponse(newResponseArray); //save image to db
    }
    let tempErrorProps = {};
    try {
      tempErrorProps['errorId'] = err.response.data.scanId;
      tempErrorProps['errorImageIndex'] = 0;
      tempErrorProps['errorResponseReceived'] = true;
      tempErrorProps['errorDetail'] = err.response.data.status;
    } catch (error) {
      // console.log('error response is empty', error);
      tempErrorProps['errorResponseReceived'] = false;
    }
    setState((prevState) => ({
      ...prevState,
      // imageLoading: true,
      loading: false,
      loadingMessage: '',
      // imageLabel: 'Your Result',
      // isDisabled: true,
      // isClearDisabled: false,
      testImages: [],
      imageSource: [],
      isError: true,
      resultFetched: true,
      errorProps: [...prevState.errorProps, tempErrorProps],
      totalErrorImages: prevState.totalErrorImages + 1,
      error: {
        message: 'Errors have been found',
      },
      progressStatus: requestNo,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { testName, school, grade, rollNo, subject } = inputs;
    const { testImages, imageSource } = state;
    // console.log('testImage, imsource', state.imageSource, state.testImages);
    const receivedAt = new Date();
    const iso = IsoTimeConverter(receivedAt);
    // console.log('created at', iso);
    let tempReqArray = testImages.map((image, id) => {
      let obj = {};
      obj['requestId'] = uuidv4();
      obj['targetName'] = testName;
      obj['targetImages'] = image;
      obj['fileName'] = image.name;
      obj['imageSource'] = imageSource[id];
      obj['userName'] = user.name ?? user.mobile;
      obj['receivedAt'] = iso;
      obj['saveCrops'] = true;
      obj['doQualityCheck'] = true;
      obj['metadata'] = JSON.stringify({ 'pending': 'meta' });
      obj['groupId'] = user._id;
      if (classId) {
        obj['groupId'] = classId;
      } else {
        obj['groupId'] = user._id;
      }
      obj['organizationId'] = user.organizationId;
      return obj;
    });
    setState((prevState) => ({
      ...prevState,
      // counter: 0,
      // imageLoading: true,
      sameImage: false,
      requestArray: [...prevState.requestArray, ...tempReqArray], // needed for finding error images
      isError: false,
      errorProps: [],
      error: {
        message: '',
      },
      totalErrorImages: 0,
      // isDisabled: true,
      // isClearDisabled: true,
      loading: true,
      loadingMessage: 'Please wait, we are getting results for you...',
      // totalImages: tempReqArray.length, // TODO - check this again
      progressStatus: 0,
    }));
    const imageQ = new ImageQueue(
      tempReqArray,
      school,
      grade,
      rollNo,
      subject,
      updateState,
      handleError
    );
    imageQ.start();
    // setTimeout(() => {
    //   setState((prevState) => ({
    //     ...prevState,
    // isDisabled: true,
    // isClearDisabled: true,
    //     loading: false,
    //     loadingMessage: '',
    //   }));
    // }, 6000);
  };

  const handleClickOpen = () => {
    setState((prevState) => ({
      ...prevState,
      open: true,
    }));
    // state.errorProps.find(ele => console.log('ele', ele.errorHash))
    console.log('state', state.testResult);
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const sameImageFunction = (sameImageState) => {
    if (sameImageState === true) {
      setState((prevState) => ({
        ...prevState,
        sameImage: false,
      }));
    }
  };

  const deleteErrorComponent = (errorCompProp) => {
    const errorIndex = state.errorProps.findIndex(
      (element) => element.errorId === errorCompProp.requestId
    );
    state.errorProps.splice(errorIndex, 1);
    setState((prevState) => ({
      ...prevState,
      errorProps: [...state.errorProps],
      isError: state.errorProps.length < 1 ? false : state.isError,
    }));
  };

  const removeAddedImage = (index) => {
    // document.getElementById('testImages').value = '';
    // const imgSrcIndex = state.testImages.findIndex(
    //   // TODO - check again, try with testImages
    //   (element) => element === source
    // );
    // console.log('img src index', imgSrcIndex);
    // console.log('ref current', state.inputImage.current.value)
    // state.inputImage.current.value = ''; //MUST revisit
    state.imageSource.splice(index, 1);
    const tempTestImage = state.testImages.splice(index, 1);
    const hashIndex = state.hashList.findIndex((item) => {
      // console.log('temp', tempTestImage[0].name, item.imageName);
      return item.imageName === tempTestImage[0].name;
    }); //array[obj1, obj2, obj3]
    // console.log('image name', hashIndex);
    state.hashList.splice(hashIndex, 1);
    setState((prevState) => ({
      ...prevState,
      hashList: [...state.hashList],
      imageSource: [...state.imageSource],
      testImages: [...state.testImages],
      totalImages: prevState.totalImages - 1,
    }));
  };

  const addImageAsError = (id) => {
    // console.log('tempNewRes', save, id);
    if (save.newResponse.find((item) => item === id)) {
      // console.log('in condition');
      let tempNewRes = save.newResponse.filter((item) => item !== id);
      setSave((prevState) => ({
        ...prevState,
        newResponse: tempNewRes,
      }));
      if (!tempNewRes.length) {
        setSave((prevState) => ({
          ...prevState,
          saveState: true,
        }));
      }
    }
    const dropIndex = state.testResult.findIndex((item) => item.scanId === id);
    state.testResult.splice(dropIndex, 1);
    state.originalResult.splice(dropIndex, 1);
    const addErrorProp = {
      errorId: id,
      errorImageIndex: 0,
      errorResponseReceived: true,
      errorDetail: 'Image marked by user as an error',
    };
    setState((prevState) => ({
      ...prevState,
      testResult: [...prevState.testResult],
      originalResult: [...prevState.originalResult],
      errorProps: [...prevState.errorProps, addErrorProp],
      isError: true,
      totalErrorImages: prevState.totalErrorImages + 1,
    }));
  };

  const imageLoaded = () => {
    counter.current += 1;
    // console.log('counter value: ', counter.current);
    setState((prevState) => ({
      ...prevState,
      imageLoading: counter.current >= state.imageSource.length ? false : true,
    }));
  };

  const saveResponse = async (newRes) => {
    // console.log('new res array', newRes);
    if (!newRes.length) return; //if array is empty then return
    const report = newRes.map((item) => ({
      scanId: item,
      organizationId: user.organizationId,
    }));
    await addReport(report, { headers: { Authorization: organization.apiKey } })
      .then((res) => {
        // console.log({ res });
        if (res.status === 200) {
          setSave({
            saveState: true, //disabled if true
            newResponse: [],
          });
          newResponseArray = [];
          // setToast(prevState => ({
          //   ...prevState,
          //   state: true,
          //   message: 'Report Saved'
          // }));
        }
      })
      .catch((err) => console.log({ err }));
  };

  const handleHideCheckbox = (e) => {
    setState((prevState) => ({
      ...prevState,
      hideColumn:
        e.target.checked === false
          ? state.hideColumn.filter((item) =>
              item.includes(['id', 'markAsError', 'comments'])
            )
          : [...prevState.hideColumn, 'id', 'markAsError', 'comments'],
    }));
  };
  // const handleAutoSave = e => {
  //   console.log('auto state', state.autoSaveState);
  //   setState(prevState => ({
  //     ...prevState,
  //     autoSaveState: e.target.checked
  //   }));
  // };
  // console.log('imag loading state', state.imageLoading , state.counter);
  const updateRollNo = (rowIndex, value) => {
    //triggered right after change
    // console.log(
    //   'roll',
    //   value,
    //   'display value',
    //   state.testResult[rowIndex].data.studentInfo.studentNumber.number
    // );
    state.testResult[rowIndex].data.studentInfo.studentNumber.number = value;
    setState((prevState) => ({
      ...prevState,
      testResult: [...state.testResult],
    }));
  };

  const updateMyData = (rowIndex, columnId, value) => {
    // state.testResult[rowIndex].data.studentInfo.studentNumber.number = value;
    // setState((prevState) => ({
    //   ...prevState,
    //   testResult: [...state.testResult],
    // }));
    setState((prevState) => ({
      ...prevState,
      testResult: state.testResult.map((row, index) => {
        if (index === rowIndex) {
          console.log('value', row, value);
          return {
            ...state.testResult[rowIndex],
            data: {
              ...prevState.testResult[rowIndex].data,
              studentInfo: {
                ...prevState.testResult[rowIndex].data.studentInfo,
                studentNumber: {
                  ...prevState.testResult[rowIndex].data.studentInfo
                    .studentNumber,
                  number: value,
                },
              },
            },
          };
        }
        return row;
      }),
    }));
  };

  // function traverseObjectBreadthWise(obj) {
  //   for (let key in obj) {
  //     if (typeof obj[key] == 'object') {
  //       traverseObjectBreadthWise(obj[key]);
  //       // console.log(key);
  //     } else {
  //       // console.log(key, '=', obj[key]);
  //       if (key === 'number') {
  //         obj[key] = 20;
  //         console.log('found the key!', key, obj[key]);
  //       }
  //     }
  //   }
  // }

  const saveRollNo = async () => {
    let updatedTest = state.testResult.filter(
      (testItem) =>
        !state.originalResult.some(
          (originalItem) =>
            testItem.data.studentInfo.studentNumber.number ===
            originalItem.data.studentInfo.studentNumber.number
        )
    );
    if (!updatedTest.length) {
      setToast((prevState) => ({
        ...prevState,
        message: 'No Roll Numbers changed',
        severity: 'warning',
        state: true,
      }));
      return;
    }
    const filtered = updatedTest.map((item) => item.data);
    try {
      setState((prevState) => ({ ...prevState, saveRollButtonState: true }));
      const res = await updateScan(filtered);
      // console.log('res', res);
      if (res.status === 200) {
        setState((prevState) => ({
          ...prevState,
          originalResult: state.testResult,
          saveRollButtonState: false,
        }));
        setToast((prevState) => ({
          ...prevState,
          message: 'Updated Roll Number/Numbers Successfully',
          severity: 'success',
          state: true,
        }));
      }
    } catch (error) {
      console.log('error', error);
      setToast((prevState) => ({
        ...prevState,
        message: 'Failed to update Roll No',
        severity: 'error',
        state: true,
      }));
      setState((prevState) => ({ ...prevState, saveRollButtonState: false }));
    }
    // traverseObjectBreadthWise(state.testResult[0]);
  };
  const newColumns = customCol({ addImageAsError });
  const columns = useMemo(() => newColumns, [newColumns]);
  const data = useMemo(() => state.testResult, [state.testResult]);
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
      {state.loading && state.progressStatus === 0 && (
        <Loader
          loadingMessage={state.loadingMessage}
          sx={{ left: { xs: 0, sm: 0, md: 0 } }}
        />
      )}
      <Box
        component='main'
        // maxWidth="xs"
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        // width="80%"
        width={{ xs: '90%', md: '80%', lg: '70%' }}
        maxWidth='50rem'
      >
        <CustomSnackbar toast={toast} setToast={setToast} />
        <Box sx={{ width: '100%', padding: { xs: '2rem 0', sm: '2rem 2rem' } }}>
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item xs={1}>
              <GoBack />
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant='h4'
                sx={{ margin: '0', textAlign: 'center', marginLeft: '10px' }}
              >
                {t('scan')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              // sx={{ marginLeft: '80px' }}
            >
              <IconButton
                color='primary'
                aria-label='go-back'
                component='span'
                onClick={handleClickOpen}
                sx={{ width: '45px', height: '45px' }}
              >
                <DeleteOutline sx={{ color: '#ff0000' }} />
              </IconButton>
            </Grid>
          </Grid>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              mt: 0,
              mb: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px',
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent='center'
              alignItems='center'
            >
              {/* <Grid item xs={12} sm={12}>
                <GoBack/>
              </Grid> */}
              <Grid item xs={12} sm={12}>
                <CustomLabel id='testNameLabel' htmlFor='testName' required>
                  {t('testName')}
                </CustomLabel>
                <Select
                  labelId='testNameLabel'
                  id='testName'
                  name='testName'
                  required
                  value={inputs.testName}
                  input={<CustomInput fullWidth placeholder={t('testName')} />}
                  onChange={(e) => {
                    // handleChange(e);
                    customHandleChange(e);
                    // refImgListChange(e);
                  }}
                  fullWidth
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: { xs: 400, md: '60vh' } },
                    },
                  }}
                >
                  {state.targetList &&
                    state.targetList.map((target, index) => {
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
                  {/* {TestNames.map((testName, index) => {
                    console.log('testNames', testName);

                    return (
                      <MenuItem
                        sx={{ fontSize: 14 }}
                        value={testName}
                        key={index}
                      >
                        {testName}
                      </MenuItem>
                    );
                  })} */}
                </Select>
              </Grid>
            </Grid>
          </Box>
          {state.resultFetched &&
            state.testResult.length < 1 &&
            state.progressStatus !== state.totalImages && (
              <CustomCircular message={t('fetchingResults') + '...'} />
            )}

          {state.imageAdded && (
            <ImageViewer style={{ overflowY: 'auto' }}>
              {state.testResult.length > 0 && (
                // <CircularProgress/>:
                <TableStyles>
                  <div style={{ display: 'flex' }}>
                    <Typography
                      variant='h6'
                      gutterBottom
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                        paddingTop: '12px',
                        marginBottom: '0',
                        paddingBottom: '5px',
                        flexGrow: 1,
                      }}
                    >
                      {t('results')} ({state.testResult.length})
                    </Typography>
                  </div>
                  {/* <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}
                  >
                    <Checkbox
                      checked={state.autoSaveState}
                      onChange={handleAutoSave}
                      sx={{
                        color: 'rgb(32,70,155)',
                        '&.Mui-checked': { color: 'rgb(32,70,155)' }
                      }}
                    />
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mt: 1, fontSize: '13px', paddingRight: '5px' }}
                    >
                      Check to autosave (Save button will be disabled)
                    </Typography>
                  </div> */}
                  <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    mb={1}
                  >
                    <FormControlLabel
                      control={<Checkbox defaultValue={false} />}
                      value={state.hideCheckbox}
                      name='precisionMode'
                      onChange={(e) => {
                        console.log('e', e.target.checked);
                        handleHideCheckbox(e);
                      }}
                      label='Show/Hide all columns'
                    />
                    <LoadingButton
                      loading={state.saveRollButtonState}
                      onClick={saveRollNo}
                      size='small'
                      variant='contained'
                      sx={{
                        backgroundColor: '#0d47a1',
                        fontSize: 14,
                        borderRadius: 2,
                        textTransform: 'none',
                        mt: 1,
                      }}
                    >
                      Save
                    </LoadingButton>
                  </Box>

                  <Table
                    columns={columns}
                    data={data}
                    hideColumn={state.hideColumn}
                    getHeaderProps={(_column) => ({
                      style: {
                        color: 'white',
                        fontSize: '13px',
                      },
                    })}
                    updateRollNo={updateRollNo}
                    updateMyData={updateMyData}
                  />
                </TableStyles>
              )}

              {state.resultFetched ? (
                state.testResult.length > 0 && (
                  <div>
                    <Box
                      sx={{
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant='h6'
                        component='div'
                        textAlign='center'
                      >
                        {state.progressStatus}/{state.totalImages}
                      </Typography>
                      <LinearProgress
                        variant={
                          state.progressStatus < state.totalImages
                            ? 'indeterminate'
                            : 'determinate'
                        }
                        value={
                          state.progressStatus >= state.totalImages
                            ? (state.progressStatus / state.totalImages) * 100
                            : null
                        }
                        sx={{
                          height: 10,
                          borderRadius: '50px',
                          backgroundColor: '#9aafc8',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'rgb(32,70,155)',
                          },
                        }}
                      />
                    </Box>
                  </div>
                )
              ) : (
                <>
                  {/* User uploaded images displayed here */}
                  <Box sx={{ display: state.imageLoading ? 'block' : 'none' }}>
                    <CustomCircular message={t('preparing') + '...'} />
                  </Box>
                  <Box
                    style={{ display: state.imageLoading ? 'none' : 'block' }}
                  >
                    {
                      <Typography
                        variant='h6'
                        gutterBottom
                        sx={{
                          mt: 1,
                          mb: 1,
                          textAlign: 'center',
                          display:
                            state.imageSource.length <= 0 ? 'none' : 'block',
                        }}
                      >
                        {t('pages')} ({state.imageSource.length})
                      </Typography>
                    }
                    <SameErrorImageModal
                      sameImage={state.sameImage}
                      sameImageFunction={sameImageFunction}
                      errorType={t('warning')}
                      errorTextValue={t('errorImagesNotAllowed')}
                    />

                    {state.imageSource.map((source, index) => (
                      <div key={index}>
                        <IconButton
                          onClick={() => {
                            removeAddedImage(index);
                          }}
                          size='medium'
                          style={{
                            display: 'flex',
                            color: '#000000',
                            marginLeft: 'auto',
                            marginRight: 0,
                          }}
                        >
                          <Close fontSize='inherit' />
                        </IconButton>
                        <ImageViewContainer key={index}>
                          <img
                            src={source}
                            alt={`${t('yourWork')} - ${index}`}
                            id='output'
                            // blurDataURL={blurUrl}
                            className='outputImage'
                            onLoad={() => {
                              imageLoaded();
                            }}
                            style={{ margin: 0 }}
                            // onLoadingComplete={() => {
                            //   imageLoaded();
                            // }}
                            // placeholder='blur'
                          />
                        </ImageViewContainer>
                      </div>
                    ))}
                  </Box>
                </>
              )}
            </ImageViewer>
          )}
          {/* Error Images */}
          {state.isError && (
            <ImageViewer style={{ overflowY: 'auto' }}>
              <Typography
                variant='h6'
                textAlign='center'
                style={{ marginTop: '0px' }}
              >
                {t('errors')} ({state.totalErrorImages})
              </Typography>
              {state.isError ? <ErrorMessage error={state.error} /> : null}
              {/* {errorComponent()} */}
              <ErrorImageComponent
                requestArray={state.requestArray}
                errorProps={state.errorProps}
                deleteErrorImg={deleteErrorComponent}
              />
            </ImageViewer>
          )}
          {/* {state.refImgSource && !state.testImages.length && (
            <div>
              <Image
                src={state.refImgSource}
                alt={`Your Work`}
                id="output"
                loading="lazy"
                width={2}
                height={3}
                layout="responsive"
                objectFit="contain"
                className="outputImage"
                // onClick={() => upLoad(source)}
              />
            </div>
          )} */}
          {/* ref image*/}
          {!state.testResult.length &&
            state.refImgSrc.length > 0 &&
            state.testImages.length === 0 && (
              <>
                <Typography
                  variant='h6'
                  sx={{ textAlign: 'center', mt: '10px', mb: '10px' }}
                >
                  {t('pleaseAddFilledPhotosOfPageBelow')}
                </Typography>
                <ImageViewContainer
                  style={{
                    position: 'relative',
                    border: '1px solid #c3c0c0',
                    overflowY: 'auto',
                  }}
                >
                  <img
                    // loader={myLoader}
                    src={state.refImgSrc}
                    alt={`Reference`}
                    id='output'
                    // loading='eager'
                    // priority
                    // layout='fill'
                    // objectFit='contain'
                    className='outputImage'
                    // blurDataURL={blurUrl}
                    // placeholder='blur'
                  />
                </ImageViewContainer>
              </>
            )}
          <RefImgDialog
            open={
              (state.testImages.length > 0 ||
                state.testResult.length > 0 ||
                state.errorProps.length > 0) &&
              state.refDialogOpen
            }
            handleClose={handleRefClose}
            handleClick={handleRefClick}
            imgOnScreen={state.testImages.length}
          />
          {/* <button
            onClick={() => {
              console.log('status', state.totalImages);
            }}
          >
            log
          </button> */}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#ffffff',
          width: '100%',
          padding: '8px', //needs to be fixed
        }}
      >
        <ResetDialog
          open={state.open}
          onClose={handleClose}
          onReset={resetData}
        />
        {/* <SaveResult
              save={save}
              setSave={setSave}
              autoSaveState={state.autoSaveState}
            /> */}
        <label htmlFor='testImages'>
          <Input
            disabled={!inputs.testName}
            accept='image/*'
            id='testImages'
            name='testImages'
            type='file'
            multiple
            ref={state.inputImage}
            // ref={tempElement}
            aria-label='Select photo(s)'
            onChange={handleFileChange}
            // value={state.testImages}
          />
          <CustomButton
            variant='contained'
            component='span'
            disabled={!inputs.testName}
            sx={{
              width: '106px',
              height: '36px',
              fontSize: '16px',
              lineHeight: '20px',
              textTransform: 'none',
              alignSelf: 'center',
              // marginTop: '8px',
              borderRadius: '8px',
              mr: 1,
              mb: 0,
            }}
          >
            + {t('add')}
          </CustomButton>
        </label>
        <CustomButton
          variant='contained'
          type='submit'
          disabled={!(state.testImages.length > 0 && inputs.testName)}
          sx={{
            width: '106px',
            minWidth: '80px',
            height: '36px',
            fontSize: '16px',
            lineHeight: '20px',
            textTransform: 'none',
            alignSelf: 'center',
            // marginTop: '8px',
            borderRadius: '8px',
            mb: 0,
          }}
          onClick={handleSubmit}
        >
          {t('submit')}
        </CustomButton>
      </Box>
    </Container>
  );
}

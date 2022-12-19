/* eslint-disable array-callback-return */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { DeleteOutline, ExpandMore, InfoRounded } from '@mui/icons-material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ContentSubtypeList, ContentType } from './ContentTypes';
import { validateAnswer, validateItemLabel } from './ValidateField';
import { currentBook } from '../Book/BookSlice';
import { KonvaCropper } from '../Konva/KonvaCropper';
// import { KonvaCropper } from '../Konva/KonvaCropper1';
import { currentUser } from '../../auth/userSlice';
import {
  addPageMetaDataApi,
  getAllSkillsApi,
  getPageMetaDataApi,
  getSplitPageDetailsApi,
} from '../../../api/authoringApi';
import { CustomDrawer } from '../../../elements/CustomDrawer';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';
import {
  ArucoCustomAccordion,
  ArucoCustomAccordionDetails,
  ArucoCustomAccordionSummary,
  ArucoHtmlTooltip,
} from '../../../styles/AuthoringStyles/editArucoAccordion';

export const EditAruco = () => {
  // const modes = ['tree', 'code', 'text'];
  const FIXED_HT = 1280;
  // const FIXED_WT = 960;
  const [state, setState] = useState({
    file: null,
    // src: null,
    answer: '',
    metaData: [],
    // jsonData: [],
    // text: '',
    question: 1, //number of questions
    questionLabelValidation: false,
    coordinates: [],
    pageId: 0,
    pageNumber: 0,
    type: 'practice',
    pageType: 'subj_nonuniform_practice',
    dewarp: false,
    gridHeight: 1280, // default height
    gridWidth: 960, //default width
    book: [],
    author: [],
    skills: [], //input from the api
    skill: [], //input from the textfield
    contentSubType: '',
    contentType: 'question',
    maxScore: 1,
    bookType: 'Practice',
    tabValue: '1',
    questionLabel: '',
    accordionState: false, //edit tab accordions
    // deleteSnackbarStatus: false,
    editState: false, //for konva
    editAnswer: false, //for textfield in edit tab
    editAnswerField: '',
    tempMetaData: null, //forwarded to Konva to show the previously coordinates
    validate: false, //validates the inputfield of answer
    tooltipMessage: '',
    // draw: true,
    clearScreen: false, //forwarded to Konva for clearing the screen when contentType changes
    buttonLoader: false, //save button loader
    addQuestion: false, //allow adding question, only if set to true
  });
  const [toast, setToast] = useState({
    state: false,
    severity: 'error',
    message: 'Page can have only one Student Name and Number',
  });
  const { splitPageId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(currentUser);
  const book = useSelector(currentBook);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return;
    const handleTabClose = (event) => {
      event.preventDefault();
      console.log('beforeunload event triggered');
      return (event.returnValue = 'Are you sure you want to exit?');
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  useEffect(() => {
    if (state.contentType === 'studentInfo')
      setState((prevState) => ({ ...prevState, contentSubType: 'name' }));
  }, [state.contentType]);

  useEffect(() => {
    // if (state.contentSubType !== 'checkbox')
    if (['subjective', 'checkbox'].includes(state.contentSubType))
      setState((prevState) => ({ ...prevState, addQuestion: true }));
    else setState((prevState) => ({ ...prevState, addQuestion: false }));
  }, [state.contentSubType]);

  useEffect(() => {
    getPageDetails();
    // if (location.state === undefined) {
    //   navigate(`/authoring/books/${book._id}/resources`);
    // } else {
    document.title = 'Authoring Tool | Create Questions';

    // console.log('page id', pageDetails.bookPageNumber);
    // }
  }, []);

  const getPageDetails = async () => {
    const res = await getSplitPageDetailsApi(
      { splitPageId },
      { headers: { Authorization: user.token } }
    );
    // console.log('res', res);
    const { splitPage } = res.data;
    const pageImg = `${splitPage.imageUrl ?? splitPage.pdfUrl + '.png'}`;
    // console.log('pageImg', pageImg);

    const img = new Image();
    img.onload = function () {
      // console.log(this.naturalHeight, ' ', this.naturalWidth);
      if (this.naturalHeight > FIXED_HT || this.naturalWidth > FIXED_HT) {
        let factor;
        if (this.naturalHeight > this.naturalWidth) {
          factor = this.naturalHeight / FIXED_HT;
        } else factor = this.naturalWidth / FIXED_HT;
        setState((prevState) => ({
          ...prevState,
          gridHeight: this.naturalHeight / factor,
          gridWidth: this.naturalWidth / factor,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          gridHeight: this.naturalHeight,
          gridWidth: this.naturalWidth,
        }));
      }
    };
    img.src = pageImg;
    setState((prevState) => ({
      ...prevState,
      book: book,
      bookType: book.bookType,
      author: user,
      bookId: splitPage.bookId, //can be obtained from book
      pageNumber: splitPage.pageNumber, //can be obtained from api
      pageId: splitPage.pageId, // can be obtained from api
      // src: pageImg,
      file: pageImg,
    }));
    getMetaDataSkills(user.token); //could be structured better?
  };

  const getMetaDataSkills = async (token) => {
    await getSkills(token);
    await getMetaData(token);
  };
  async function getSkills(token) {
    await getAllSkillsApi(
      // { userId: location.state.author._id },
      { organizationId: user.organizationId },
      { headers: { Authorization: token } }
    )
      .then((response) => {
        // console.log({ response });
        setState((prevState) => ({
          ...prevState,
          skills: response.data.skills,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getMetaData(token) {
    state.pageId !== 0 &&
      (await getPageMetaDataApi(
        { pageId: state.pageId },
        { headers: { Authorization: token } }
      )
        .then((res) => {
          const { data, questions } = res.data.pageMetadata;
          //if item id does not exist
          if (!data.length) return;
          data.forEach((item) => {
            item.editState = false;
            if (!Object.prototype.hasOwnProperty.call(item, 'id')) {
              item.id = uuidv4();
            }
          });
          // console.log('data', data);
          // const noOfQuestions = data.filter(
          //   (item) => item.contentType === 'question'
          // );
          const questionNumber = data[data.length - 1].item;
          setState((prevState) => ({
            ...prevState,
            metaData: data,
            question:
              questions && Number.isInteger(questionNumber)
                ? questionNumber + 1
                : questionNumber,
          }));
        })
        .catch((err) => console.log('error', { err })));
  }

  // const logStuff = () => {
  //   console.log('metaData', state.metaData, 'coordinates', state.coordinates);
  // };

  const changeCoordinate = (coordinates) => {
    // console.log(coordinates);
    setState((prevState) => ({ ...prevState, coordinates: coordinates }));
  };

  const handleTabChange = (e, newValue) => {
    setState((prevState) => ({ ...prevState, tabValue: newValue }));
  };

  // const onChangeText = (text) => {
  //   setState((prevState) => ({ ...prevState, text }));
  // };

  const showQuestionType = (subType) => {
    const questionSubtype = ContentSubtypeList.find(
      (item) => item.value === subType
    );
    return questionSubtype.name;
  };

  //helper functions
  // const applyCustomOrder = (arrayToSort) => {
  //   let ordering = {},
  //     sortOrder = [
  //       'pageInfo',
  //       //  'studentInfo',
  //       'question',
  //     ];
  //   for (const [index, value] of sortOrder.entries()) ordering[value] = index;
  //   const tempArray = [...arrayToSort];
  //   const orderedList = tempArray.sort(function (a, b) {
  //     return ordering[a.contentType] - ordering[b.contentType];
  //   });
  //   return orderedList;
  // };

  const validateMaxScore = (e) => {
    let val = e.target.value;
    let data = val.replace(/[^0-9]/g, '');
    e.target.value = data.slice(0, 4);
    setState((prevState) => ({ ...prevState, maxScore: e.target.value }));
  };

  const handleMultiSelect = (event) => {
    const {
      target: { value },
    } = event;
    // console.log('value', value);
    setState((prevState) => ({
      ...prevState,
      // skill: [{skillId: tempSkill._id, skillName: tempSkill.skillName}]
      skill: typeof value === 'string' ? value.split(',') : value,
    }));
    // setTests(typeof value === 'string' ? value.split(',') : value);
  };

  const addMultiJson = () => {
    let {
      coordinates,
      question,
      answer,
      contentType,
      //   questionLabel,
      contentSubType,
      maxScore,
      skill,
    } = state;
    let qBoxFinal = [];
    let ansBoxFinal = [];
    if (contentType === 'studentInfo') {
      let ele = coordinates[0];
      let box = {
        x: Math.round(ele.x),
        y: Math.round(ele.y),
        h: Math.ceil(ele.height),
        w: Math.ceil(ele.width),
        boxType: ele.boxType,
        id: ele.id,
      };
      qBoxFinal.push(box);
      ansBoxFinal.push(box);
    }
    if (contentType === 'question') {
      coordinates.forEach((ele) => {
        if (ele.boxType === 'question') {
          let box = {
            x: Math.round(ele.x),
            y: Math.round(ele.y),
            h: Math.ceil(ele.height),
            w: Math.ceil(ele.width),
            boxType: ele.boxType,
            id: ele.id,
          };
          qBoxFinal.push(box);
        } else if (ele.boxType === 'answer') {
          let box = {
            x: Math.round(ele.x),
            y: Math.round(ele.y),
            h: Math.ceil(ele.height),
            w: Math.ceil(ele.width),
            boxType: ele.boxType,
            id: ele.id,
          };
          ansBoxFinal.push(box);
        }
      });
    }
    // console.log('ans', state.metaData);
    if (contentSubType === 'name') {
      if (
        state.metaData.some((item) => item.contentSubType === contentSubType)
      ) {
        setToast({
          state: true,
          severity: 'error',
          message: 'Page can have only one Student Name and Number',
        });
        return;
      }
    }
    if (contentSubType === 'number') {
      if (
        state.metaData.some((item) => item.contentSubType === contentSubType)
      ) {
        setToast({
          state: true,
          severity: 'error',
          message: 'Page can have only one Student Name and Number',
        });
        return;
      }
    }
    //retreiving the list of skill names in state.skills and mapping them from the skill object
    //received from the api to get skill_id and skill_name
    let tempSkill = skill.map((item) => {
      const newSkill = state.skills.find(
        (element) => element.skillName === item
      );
      return { skillId: newSkill._id, skillName: newSkill.skillName };
    });
    // console.log('skill object', tempSkill);
    let meta = {
      item: question, // TODO needs to be string
      // label: questionLabel,
      ans: answer.replace(' ', '').split(','),
      modelType: 'mathpix',
      contentType: contentType,
      contentSubType: contentSubType,
      maxScore: maxScore,
      difficulty: 50,
      // skillName: skill,
      skills: tempSkill,
      qBox: qBoxFinal,
      ansBox: ansBoxFinal,
      editState: false,
      id: uuidv4(),
    };
    // state.metaData.push(meta);
    setState((prevState) => ({
      ...prevState,
      // text: JSON.stringify(state.metaData, null, 2),
      question:
        contentType === 'question' && Number.isInteger(state.question)
          ? prevState.question + 1
          : prevState.question,
      questionLabel: '',
      answer: '',
      // contentSubType: '',
      metaData: [...state.metaData, meta],
      clearScreen: contentSubType !== 'checkbox' ? true : false,
      // coordinates:
      //   contentSubType === 'name' || contentSubType === 'number'
      //     ? []
      //     : prevState.coordinates,
    }));
    setToast({ state: true, message: 'Field Added!', severity: 'success' });
  };

  const saveAruco = async (_e) => {
    // const distinct = (value, index, self) => {
    //   return self.indexOf(value) === index;
    // };

    // const skillArr = state.metaData.map((item, _index) => {
    //   return item.skillName;
    // });

    // const skills = skillArr.filter(distinct);

    let qNumbers = [];
    // const { editState, id, ...all } = state.metaData;
    state.metaData.forEach((item, _index) => {
      delete item.editState;
      qNumbers.push(item.item);
    });
    qNumbers.sort((a, b) => a - b);
    // let questionsStart = qNumbers[0];
    // const endIndex = qNumbers.length - 1;
    // let questionsEnd = qNumbers[endIndex];
    try {
      setState((prevState) => ({ ...prevState, buttonLoader: true }));
      const res = await addPageMetaDataApi(
        {
          data: state.metaData,
          dewarp: false,
          pageId: state.pageId,
          pageNumber: state.pageNumber,
          // type: state.type,
          pageType: state.pageType,
          gridHeight: state.gridHeight,
          gridWidth: state.gridWidth,
          questions: state.metaData.length,
          // questionsStart: questionsStart,
          // questionsEnd: questionsEnd,
          // skills: skills,
        },
        { headers: { Authorization: user.token } }
      );
      if (res.status === 200) {
        navigate(`/authoring/books/${state.book._id}/resources`); //TODO: check state.book
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleImport = async (e) => {
    // console.log('handle e', e);
    const { files } = e.target;
    if (files.length === 0) {
      console.log('enter a file');
    } else console.log('files', e.target);

    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      console.log('file content', JSON.parse(e.target.result));
      setState((prevState) => ({
        ...prevState,
        metaData: JSON.parse(e.target.result),
      }));
      // console.log('meta data', state.metaData);
    };
  };

  const deleteQuestion = (questionNo, questionType) => {
    let tempIndex = state.metaData.findIndex(
      (question) => question.id === questionNo
    );
    // console.log('question', questionNo, tempIndex);
    state.metaData.splice(tempIndex, 1);
    setState((prevState) => ({
      ...prevState,
      metaData: state.metaData,
      question:
        questionType === 'question'
          ? prevState.question - 1
          : prevState.question,
    }));
  };

  const handleEdit = (question) => {
    // console.log({ question });
    // console.log(state.editState);
    setState((prevState) => ({
      ...prevState,
      tempMetaData: question,
      editState: true,
      editAnswer: false,
      editAnswerField: '',
      answer: question.ans[0], //TODO: needs workaround
    }));
    // console.log('somedata', state.metaData);
  };

  const handleAccordionChange = (panel, _question) => (event, newExpanded) => {
    console.log(state.metaData);
    // question.editState = false;
    setState((prevState) => ({
      ...prevState,
      accordionState: newExpanded ? panel : false,
      tempMetaData: {},
    }));
  };
  // const handleDeleteSnackBar = () => {
  //   setState((prevState) => ({ ...prevState, deleteSnackbarStatus: false }));
  // };

  const validateAddButton = () => {
    if (
      state.contentType === 'question' &&
      state.coordinates.length > 0 &&
      !state.validate
    ) {
      if (state.question && state.maxScore) {
        if (state.contentSubType === 'subjective') return true;
        if (state.answer.length > 0) return true;
      }
    }
    return (
      (state.coordinates.length > 1 && //need to revisit
        state.contentType === 'pageInfo') ||
      (state.coordinates.length > 0 &&
        state.contentType === 'studentInfo' &&
        state.contentSubType &&
        !state.validate)
    );
  };

  const validateSave = () => {
    return state.metaData.length > 0;
  };

  const handleEditAnswer = (e, questionProps) => {
    // console.log('answer', e, questionProps);
    setState((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const saveEditAnswer = (questionNo) => {
    // console.log('meta', state.metaData);
    // const questionIndex = state.metaData.findIndex(
    //   (question) => question.id === questionNo
    // );
    // const question = state.metaData[questionIndex];
    // let updatedQuestion = {
    //   ...question,
    //   ans: [state.editAnswerField],
    // };
    // state.metaData.splice(questionIndex, 1, updatedQuestion);
    for (const obj of state.metaData) {
      if (obj.id === questionNo) {
        obj.ans = [state.editAnswerField];
      }
    }
    setState((prevState) => ({
      ...prevState,
      metaData: state.metaData,
      editAnswer: false,
    }));
  };

  return (
    <div
      style={{
        maxWidth: 'calc(100% - 240px)',
      }}
    >
      <BreadcrumbsItem to={`/authoring/books/${book._id}/resources/aruco`}>
        Edit Crops
        <ArucoHtmlTooltip
          placement='bottom-start'
          title={
            <React.Fragment>
              <ul style={{ listStyleType: 'none' }}>
                <li>{'Press d to copy a selected object'}</li>
                <li>
                  {
                    'Hold Shift and drag with left mouse button to select multiple items'
                  }
                </li>
                <li>{'Press r to clear screen'}</li>
              </ul>
            </React.Fragment>
          }
        >
          <IconButton color='secondary' size='small'>
            <InfoRounded fontSize='small' />
          </IconButton>
        </ArucoHtmlTooltip>
      </BreadcrumbsItem>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          id='toolBar'
          style={{
            position: 'sticky',
            top: '20px',
            zIndex: '1000',
            margin: 'auto',
          }}
        >
          {/* <button onClick={logStuff}>log konva</button> */}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            width: '100%',
          }}
        >
          <div
            style={{
              border: '1px solid black',
              maxWidth: '75vw',
              overflowX: 'auto',
              // height: '1300px',
            }}
          >
            <KonvaCropper
              stageHeight={state.gridHeight}
              stageWidth={state.gridWidth}
              imgSrc={state.file}
              coordinates={state.coordinates}
              setState={setState}
              onChange={changeCoordinate}
              metaData={state.tempMetaData}
              editState={state.editState}
              contentType={state.contentType}
              contentSubType={state.contentSubType}
              clearScreen={state.clearScreen}
              addQuestion={state.addQuestion}
              answer={state.answer}
              tabValue={state.tabValue}
            />
          </div>
        </div>
      </div>

      <CustomDrawer variant='permanent' anchor='right' open={true}>
        <TabContext value={state.tabValue}>
          <Box
            sx={{
              borderBottom: '1',
              borderColor: 'ActiveBorder',
            }}
          >
            <TabList onChange={handleTabChange} sx={{ margin: '0 0 0 30px' }}>
              <Tab
                label='Edit'
                value='1'
                sx={{ borderBottom: '1px solid grey' }}
              />
              <Tab
                label='Review'
                value='2'
                sx={{
                  borderBottom: '1px solid grey',
                  // boxShadow: '1px green',
                }}
              />
            </TabList>
            <TabPanel
              value='1'
              sx={{
                margin: 0,
                px: 1,
                py: 0,
              }}
            >
              <Grid
                container
                sx={{
                  m: 0,
                  // px: '0.5rem',
                  // py: '1rem',
                  p: '0.5rem 0.5rem',
                  width: '100%',
                }}
                gap={1}
                spacing={0}
                justifyContent='center'
                alignItems='center'
                direction='row'
              >
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle1'
                    sx={{ margin: '0 0 10px 0', textAlign: 'center' }}
                  >
                    <b style={{ fontSize: '20px' }}>{state.metaData.length}</b>{' '}
                    Item(s)
                  </Typography>
                </Grid>
                {state.contentType !== 'pageInfo' &&
                  state.contentType !== 'studentInfo' &&
                  state.bookType === 'Practice' && (
                    <Grid item xs={12}>
                      <Tooltip
                        arrow
                        title={state.tooltipMessage}
                        open={state.questionLabelValidation}
                        placement='top'
                      >
                        <TextField
                          variant='outlined'
                          label='Item Label'
                          type='text'
                          required
                          fullWidth
                          error={state.questionLabelValidation}
                          helperText={
                            state.questionLabelValidation
                              ? 'Please use letters like A.1 or 1.A'
                              : ''
                          }
                          onChange={(e) =>
                            validateItemLabel({
                              input: e.target.value,
                              setState,
                            })
                          }
                          value={state.question}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                <Grid item xs={12}>
                  <FormControl
                    variant='outlined'
                    required
                    size='medium'
                    fullWidth
                  >
                    <InputLabel id='contentType'>Content Type</InputLabel>
                    {/* {state.contentTypeList.map((item, i) => <>
                        <MenuItem value={item.value}
                        </>)} */}
                    <Select
                      labelId='contentType'
                      value={state.contentType}
                      id='contentType'
                      name='contentType'
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                      onChange={(e) => {
                        setState((prevState) => ({
                          ...prevState,
                          contentType: e.target.value,
                          contentSubType: '',
                          skill: [],
                          coordinates: [],
                        }));
                      }}
                      label='Question Type'
                    >
                      {ContentType.map((content, index) => (
                        <MenuItem value={content.value} selected key={index}>
                          {content.name}
                        </MenuItem>
                      ))}
                      {/* <MenuItem value='question' selected>
                            Question
                          </MenuItem>
                          <MenuItem value='studentInfo' selected>
                            Student Info
                          </MenuItem>
                          <MenuItem value='pageInfo' selected>
                            Page Info
                          </MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    variant='outlined'
                    required
                    size='medium'
                    fullWidth
                  >
                    <InputLabel id='contentSubtype'>Content Subtype</InputLabel>
                    <Select
                      labelId='contentSubtype'
                      value={state.contentSubType}
                      id='contentSubtype'
                      name='contentSubtype'
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                      onChange={(e) => {
                        setState((prevState) => ({
                          ...prevState,
                          contentSubType: e.target.value,
                          answer: '',
                        }));
                      }}
                      label='Content Subtype'
                    >
                      {/* <MenuItem value='subjective' selected>
                              Subjective
                            </MenuItem>
                            <MenuItem value='checkbox' selected>
                              Checkbox
                            </MenuItem> */}
                      {ContentType.map((item) => {
                        if (state.contentType === item.value) {
                          return item.contentSubType.map(
                            (subItem, subIndex) => (
                              <MenuItem
                                value={subItem.value}
                                selected
                                key={subIndex}
                              >
                                {subItem.name}
                              </MenuItem>
                            )
                          );
                        }
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item>
                        <TextField
                          variant='outlined'
                          required
                          id='pageNumber'
                          label='Page Number'
                          name='pageNumber'
                          InputProps={{ readOnly: true }}
                          autoComplete='pageNumber'
                          onChange={(e) =>
                            this.setState({ pageNumber: e.target.value })
                          }
                          value={this.state.pageNumber}
                        />
                      </Grid> */}

                {state.contentType !== 'pageInfo' &&
                  state.contentType !== 'studentInfo' && (
                    <>
                      {state.bookType === 'Practice' ? (
                        <>
                          <Grid item xs={12} mb={0.8}>
                            <ToggleButtonGroup
                              size='small'
                              value={state.addQuestion}
                              exclusive
                              fullWidth
                              onChange={(event, newAlignment) => {
                                if (newAlignment !== null) {
                                  setState((pre) => ({
                                    ...pre,
                                    addQuestion: newAlignment,
                                    answer: '',
                                  }));
                                }
                              }}
                              aria-label='question or answer'
                              sx={{
                                '& .MuiToggleButtonGroup-grouped': {
                                  '&.Mui-selected': {
                                    backgroundColor: '#3366fc',
                                    color: 'white',
                                  },
                                  '&.Mui-selected:hover': {
                                    color: 'white',
                                    backgroundColor: '#0e58c7',
                                  },
                                },
                              }}
                            >
                              <ToggleButton
                                value={false}
                                aria-label='question false'
                              >
                                <Typography textTransform='none'>
                                  Answer
                                </Typography>
                              </ToggleButton>
                              <ToggleButton
                                value={true}
                                aria-label='question true'
                              >
                                <Typography textTransform='none'>
                                  Question
                                </Typography>
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Grid>
                          {!(
                            state.contentSubType === 'subjective' ||
                            state.addQuestion
                          ) && (
                            <Grid item xs={12}>
                              <Tooltip
                                arrow
                                title={state.tooltipMessage}
                                open={state.validate}
                                placement='top'
                              >
                                <TextField
                                  error={state.validate}
                                  helperText={
                                    state.validate ? 'Incorrect Datatype' : ''
                                  }
                                  variant='outlined'
                                  id='answer'
                                  size='medium'
                                  label='Answer'
                                  name='answer'
                                  fullWidth
                                  // className={classes.answerBox}
                                  autoComplete='answer'
                                  onChange={(e) => {
                                    validateAnswer({
                                      input: e.target.value,
                                      contentSubType: state.contentSubType,
                                      setState,
                                      message: state.tooltipMessage,
                                    });
                                    // console.log('state', state.validate);
                                  }}
                                  value={state.answer}
                                />
                              </Tooltip>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <TextField
                              variant='outlined'
                              id='maxScore'
                              label='Max Score'
                              name='maxScore'
                              // className={classes.qBox}
                              size='medium'
                              autoComplete='maxScore'
                              required
                              fullWidth
                              InputProps={{ inputProps: { min: 1 } }}
                              onChange={
                                (e) => validateMaxScore(e)
                                // setState((prevState) => ({
                                //   ...prevState,
                                //   maxScore: e.target.value,
                                // }))
                              }
                              value={state.maxScore}
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      {state.bookType === 'Practice' ? (
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-multiple-chip-label'>
                              Skills
                            </InputLabel>
                            <Select
                              labelId='demo-multiple-chip-label'
                              id='demo-multiple-chip'
                              multiple
                              value={state.skill}
                              onChange={handleMultiSelect}
                              input={
                                <OutlinedInput
                                  id='select-multiple-chip'
                                  label='Chip'
                                />
                              }
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={{
                                PaperProps: {
                                  // sx: { maxHeight: { xs: 400, md: '60vh' } },
                                },
                              }}
                            >
                              {state.skills.map((skill, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={skill.skillName}
                                    // style={getStyles(name, personName, theme)}
                                  >
                                    {skill.skillName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          {/* <Grid item xs={12}>
                            <FormControlLabel
                              control={<Checkbox checked={state.addQuestion} />}
                              label='Add Question'
                              onChange={(e) => {
                                console.log(
                                  'e',
                                  e.target.checked,
                                  state.contentSubType
                                );
                                setState((pre) => ({
                                  ...pre,
                                  addQuestion: e.target.checked,
                                }));
                              }}
                            />
                          </Grid> */}
                          {/* <FormControl
                            variant='outlined'
                            required
                            size='medium'
                            fullWidth
                            // className={classes.formControl}
                          >
                            <InputLabel id='skill'>Skill</InputLabel>
                            <Select
                              labelId='skill'
                              value={state.skill}
                              id='skill'
                              name='skill'
                              MenuProps={{
                                disableScrollLock: true,
                              }}
                              onChange={(e) => {
                                setState((prevState) => ({
                                  ...prevState,
                                  skill: e.target.value,
                                }));
                              }}
                              label='Skill'
                            >
                              <MenuItem value=''>
                                <em>None</em>
                              </MenuItem>
                              {state.skills
                                .sort((a, b) =>
                                  a.skillName > b.skillName ? 1 : -1
                                )
                                .map((skill, index) => (
                                  <MenuItem
                                    key={index}
                                    value={`${skill.skillName}`}
                                  >
                                    {skill.skillName}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl> */}
                        </Grid>
                      ) : (
                        <></>
                      )}
                    </>
                  )}

                <Grid
                  container
                  direction='row'
                  justifyContent='center'
                  alignItems='center'
                  spacing={2}
                  style={{ margin: '10px 12px 10px 10px' }}
                >
                  <Grid item xs={6}>
                    <Button
                      variant='contained'
                      disabled={!validateAddButton()}
                      // className={classes.uploadButton}
                      // color='secondary'
                      onClick={addMultiJson}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <LoadingButton
                      loading={state.buttonLoader}
                      type='submit'
                      size='medium'
                      variant='contained'
                      color='primary'
                      // className={classes.uploadButton}
                      onClick={saveAruco}
                      disabled={!validateSave()}
                    >
                      Save
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel
              value='2'
              style={{ margin: 0, padding: 0 }}
              // onClick={() => {
              //   logStuff();
              // }}
            >
              <Grid container direction='column'>
                <Grid
                  item
                  sx={{
                    // height: '80vh',
                    paddingBottom: '3rem',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {state.metaData.some(
                    (item) => item.contentType === 'studentInfo'
                  ) && (
                    <Typography
                      variant='subtitle1'
                      sx={{
                        paddingLeft: '10px',
                        marginTop: '5px',
                        textAlign: 'center',
                      }}
                    >
                      Student Info:
                    </Typography>
                  )}
                  {state.metaData.map((question, index) => {
                    if (question.contentType === 'studentInfo')
                      return (
                        <List dense={true} key={index}>
                          <ListItem>
                            <ArucoCustomAccordion
                              sx={{ width: '100%' }}
                              expanded={state.accordionState === question.id}
                              onChange={handleAccordionChange(
                                question.id,
                                question
                              )}
                            >
                              <ArucoCustomAccordionSummary
                                aria-controls='panel1d-content'
                                id='panel1d-header'
                                expandIcon={
                                  <ExpandMore
                                  // onClick={toggleAccordion}
                                  />
                                }
                                onClick={() => {
                                  // logStuff();
                                  // console.log('question', question);
                                  handleEdit(question);
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={{
                                    paddingTop: '7px',
                                    width: '110px',
                                  }}
                                >
                                  {
                                    ContentType.find(
                                      (item) =>
                                        item.value === question.contentType
                                    ).name
                                  }
                                  {/* {question.contentType
                                          .charAt(0)
                                          .toUpperCase() +
                                          question.contentType.slice(1)} */}
                                </Typography>
                                <IconButton
                                  edge='end'
                                  aria-label='delete'
                                  onClick={() =>
                                    deleteQuestion(
                                      question.id,
                                      question.contentType
                                    )
                                  }
                                  sx={{ color: 'red' }}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </ArucoCustomAccordionSummary>

                              <ArucoCustomAccordionDetails
                                sx={{
                                  marginLeft: '5px',
                                  paddingLeft: '5px',
                                }}
                                // onClick={() => {
                                //   logStuff();
                                // }}
                              >
                                <Typography
                                  noWrap
                                  sx={{ whiteSpace: 'pre-line' }}
                                >
                                  Subtype :{' '}
                                  {showQuestionType(question.contentSubType)}
                                  {/* numeric_integer_english */}
                                </Typography>
                              </ArucoCustomAccordionDetails>
                            </ArucoCustomAccordion>
                          </ListItem>
                        </List>
                      );
                  })}
                  <Typography
                    variant='subtitle1'
                    sx={{
                      paddingLeft: '10px',
                      marginTop: '5px',
                      textAlign: 'center',
                    }}
                  >
                    Question List:
                  </Typography>
                  {!state.metaData.length && (
                    <Typography
                      sx={{
                        margin: '10px 0 10px 0',
                        textAlign: 'center',
                      }}
                    >
                      No questions made yet.
                    </Typography>
                  )}
                  {state.metaData.length > 0 &&
                    state.metaData.map((question, index) => {
                      if (question.contentType === 'question')
                        return (
                          <List dense={true} key={index}>
                            <ListItem>
                              <ArucoCustomAccordion
                                sx={{ width: '100%' }}
                                expanded={state.accordionState === question.id}
                                onChange={handleAccordionChange(
                                  question.id,
                                  question
                                )}
                              >
                                <ArucoCustomAccordionSummary
                                  aria-controls='panel1d-content'
                                  id='panel1d-header'
                                  expandIcon={
                                    <ExpandMore
                                    // onClick={toggleAccordion}
                                    />
                                  }
                                  onClick={() => {
                                    // logStuff();
                                    // console.log('question', question);
                                    handleEdit(question);
                                  }}
                                >
                                  <Typography
                                    noWrap
                                    sx={{
                                      paddingTop: '7px',
                                      width: '110px',
                                    }}
                                  >
                                    {
                                      ContentType.find(
                                        (item) =>
                                          item.value === question.contentType
                                      ).name
                                    }
                                    {/* {question.contentType
                                          .charAt(0)
                                          .toUpperCase() +
                                          question.contentType.slice(1)} */}
                                    :{question.item}
                                  </Typography>
                                  <IconButton
                                    edge='end'
                                    aria-label='delete'
                                    onClick={() =>
                                      deleteQuestion(
                                        question.id,
                                        question.contentType
                                      )
                                    }
                                    sx={{ color: 'red' }}
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </ArucoCustomAccordionSummary>

                                <ArucoCustomAccordionDetails
                                  sx={{
                                    marginLeft: '5px',
                                    paddingLeft: '5px',
                                  }}
                                  // onClick={() => {
                                  //   logStuff();
                                  // }}
                                >
                                  {!!question.ans[0].length &&
                                    state.editAnswer === false && (
                                      <Typography>
                                        Answer : {question.ans}
                                      </Typography>
                                    )}
                                  {!!question.ans[0].length &&
                                    state.editAnswer === true && (
                                      <div>
                                        Answer :{' '}
                                        <input
                                          type='text'
                                          style={{
                                            border: '1px solid black',
                                            borderRadius: '5px',
                                            padding: '5px',
                                            width: '7rem',
                                          }}
                                          placeholder={question.ans}
                                          name='editAnswerField'
                                          onChange={(e) =>
                                            handleEditAnswer(e, question)
                                          }
                                          value={state.editAnswerField}
                                        />
                                      </div>
                                    )}

                                  <Typography
                                    noWrap
                                    sx={{ whiteSpace: 'pre-line' }}
                                  >
                                    Subtype :{' '}
                                    {showQuestionType(question.contentSubType)}
                                    {/* numeric_integer_english */}
                                  </Typography>
                                  {!!question.skills.length && (
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                      Skill :{' '}
                                      {question.skills
                                        .map((item) => item.skillName)
                                        .join(', ')}
                                    </Typography>
                                  )}

                                  <Box
                                    sx={{
                                      mt: '1rem',
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'space-evenly',
                                    }}
                                  >
                                    {!state.editAnswer && (
                                      <Button
                                        variant='contained'
                                        size='small'
                                        onClick={() =>
                                          setState((pre) => ({
                                            ...pre,
                                            editAnswer: true,
                                          }))
                                        }
                                        color='secondary'
                                        sx={{
                                          maxWidth: '130px',
                                          textTransform: 'none',
                                        }}
                                      >
                                        Edit Answer
                                      </Button>
                                    )}
                                    {state.editAnswer && (
                                      <>
                                        <Button
                                          variant='contained'
                                          size='small'
                                          onClick={() =>
                                            saveEditAnswer(question.id)
                                          }
                                          color='secondary'
                                          sx={{
                                            maxWidth: '130px',
                                            textTransform: 'none',
                                          }}
                                        >
                                          Save Answer
                                        </Button>
                                        <Button
                                          variant='contained'
                                          size='small'
                                          onClick={() => handleEdit(question)}
                                          color='secondary'
                                          sx={{
                                            maxWidth: '130px',
                                            textTransform: 'none',
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    )}
                                  </Box>
                                </ArucoCustomAccordionDetails>
                              </ArucoCustomAccordion>
                            </ListItem>
                          </List>
                        );
                    })}
                </Grid>

                <Grid item sx={{ position: 'fixed', bottom: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      backgroundColor: '#ffffff',
                      width: '240px',
                      pt: 1,
                      pb: 1,
                    }}
                  >
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{ height: '35px' }}
                      onClick={() => console.log('exporting meta data')}
                    >
                      <a
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                          JSON.stringify(state.metaData)
                        )}`}
                        download={`Page${state.pageNumber}.json`}
                        style={{
                          color: '#ffffff',
                          textDecoration: 'none',
                        }}
                      >
                        Export
                      </a>
                    </Button>
                    <label htmlFor='importJson'>
                      <Input
                        type='file'
                        accept='application/json'
                        id='importJson'
                        name='importJson'
                        aria-label='Select JSON'
                        onChange={handleImport}
                      />
                      <Button
                        variant='contained'
                        component='span'
                        sx={{ height: '35px' }}
                      >
                        Import
                      </Button>
                    </label>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </TabContext>
      </CustomDrawer>
      <CustomSnackbar toast={toast} setToast={setToast} />
      {/* {state.deleteSnackbarStatus && (
        <Snackbar
          open={state.deleteSnackbarStatus}
          autoHideDuration={4000}
          onClose={handleDeleteSnackBar}
        >
          <Alert
            variant='filled'
            elevation={6}
            severity='success'
            onClose={handleDeleteSnackBar}
          >
            Deleted Successfully
          </Alert>
        </Snackbar>
      )} */}
    </div>
  );
};

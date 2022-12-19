/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
// import { makeStyles } from '@mui/styles';
import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { TestImageModal } from './TestImageModal';
import { currentBook } from '../Book/BookSlice';
import { currentUser } from '../../auth/userSlice';
import { getBookPagesApi, getUnusedPagesApi } from '../../../api/authoringApi';

const AddTest = () => {
  // let actions = [
  //   {
  //     tooltip: 'Add All Selected Pages to Test',
  //     icon: 'save',
  //     onClick: (evt, data) => addSelection(data),
  //   },
  // ];
  const [state, setState] = useState({
    targetName: '',
    language: 'en',
    dataEndpoint: '',
    applyShadowRemoval: false,
    apiResponseType: 'realTime',
    showCorrectAnswer: false,
    precisionMode: false,
    responseAPIFormat: 'simple',
    targetType: 'test',
    itemPdf: [],
    csvFile: [],
    pdfPages: 0,
    ansRow: 1,
    pdfFile: [],
    // skillsPractised: 0,
    totalQuestions: 0,
    loading: false,
    book: null,
    unused: [],
    data: [],
    author: null,
    isPDFAdded: false,
    isCSVAdded: false,
    answerCsv: [],
    chapter: '',
    pages: [],
    loadingMessage: 'Retreiving Pages...',
    hoverImg: false,
    imageModal: {
      image: '',
      modalState: false,
    },
  });
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(currentUser);
  const book = useSelector(currentBook);
  const [checked, setChecked] = useState();
  const handleSelectionProps = (rowData) => {
    try {
      if (!checked) return;
      // console.log('row data', rowData, checked[0]);
      // if (checked.tableData.id !== rowData.tableData.id)
      //   rowData.tableData.checked = false;
    } catch (error) {
      console.log(error);
    }
    // return rowData.splice(1);
    // return (rowData.tableData.checked = false);
    return {
      disabled:
        checked && checked.length >= 1 && !rowData.tableData.checked
          ? true
          : false,
    };
  };

  useEffect(() => {
    if (typeof location.state === 'undefined') {
      navigate('/authoring/books');
    } else {
      document.title = 'Authoring Tool | Add Assessment';
      setState((prevState) => ({
        ...prevState,
        book: book,
        author: user,
      }));
      if (state.book && state.author) {
        getUnusedPages(user.token);
        getBookPages(user.token);
      }
    }
  }, [state.book && state.author]);

  const getBookPages = async (token) => {
    await getBookPagesApi(
      { bookId: state.book._id },
      { headers: { Authorization: token } }
    )
      .then((response) => {
        if (response.data.bookPage.length > 0) {
          setState((prevState) => ({
            ...prevState,
            data: response.data.bookPage,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            data: response.data.bookPage,
            loading: false,
            loadingMessage: 'No Pages Found, Please Add Pages to Book',
          }));
        }
      })
      .catch(() => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          loadingMessage: 'No Page Found, please add some pages',
        }));
      });
  };
  //  'https://prod.paperflowapp.com/authoring-page-metadata/pagemetadata/unusedPages'
  const getUnusedPages = async (token) => {
    await getUnusedPagesApi(
      { bookId: state.book._id },
      { headers: { Authorization: token } }
    )
      .then((response) => {
        const { unusedPages } = response.data;
        let temp = {};
        unusedPages.forEach((aruco, index) => {
          const { pageId } = aruco;
          temp[index] = pageId;
        });
        setState((prevState) => ({ ...prevState, unused: temp }));
      })
      .catch(() => {});
  };

  const handleChecked = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };
  const handleChange = (e) => {
    // console.log('e', e.target.name, e.target.value);
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const saveTest = (e) => {
    e.preventDefault();
    let pageIds = [];
    const {
      apiResponseType,
      applyShadowRemoval,
      dataEndpoint,
      precisionMode,
      responseAPIFormat,
      targetName,
      targetType,
      showCorrectAnswer,
      language,
    } = state;
    // console.log({
    //   apiResponseType,
    //   applyShadowRemoval,
    //   dataEndpoint,
    //   precisionMode,
    //   responseAPIFormat,
    //   testName,
    //   targetType,
    //   showCorrectAnswer,
    // });
    let pages = [],
      newPageId = [];
    // eslint-disable-next-line unused-imports/no-unused-vars
    checked.forEach(({ tableData, pageId, ...all }) => {
      pages.push(all);
      newPageId.push(pageId);
    });
    // console.log('cleaned', pages, newPageId);
    state.data.forEach((page) => {
      if (
        // eslint-disable-next-line no-prototype-builtins
        page.tableData.hasOwnProperty('checked') &&
        page.tableData.checked === true
      ) {
        state.pages.push(page);
        pageIds.push(page.pageId);
        // setState(prevState => ({
        //   ...prevState,
        //   pages: state.pages
        // }))
      }
    });
    // console.log('first', pageIds, state.pages);
    const sentState = {
      book,
      pages,
      pageIds,
      type: 'create',
      target: {
        targetName,
        targetType,
        bookId: state.book._id,
        precisionMode,
        responseAPIFormat,
        applyShadowRemoval,
        showCorrectAnswer,
        dataEndpoint,
        apiResponseType,
        language,
      },
    };
    // console.log('sent obj', sentState);
    navigate(`/authoring/books/${book._id}/tests/view`, {
      // state: {
      //   book: state.book,
      //   pages: state.pages,
      //   test: {
      //     testName: state.testName,
      //     targetType: state.targetType,
      //     bookId: state.book._id,
      //     dataEndpoint: state.dataEndpoint,
      //     precisionMode: state.precisionMode,
      //     responseAPIFormat: state.responseAPIFormat,
      //   },
      //   pageIds: pageIds,
      //   author: state.author,
      //   type: 'create',
      // },
      state: sentState,
    });
  };

  const handleUrlValidation = () => {
    var res = state.dataEndpoint.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
  };

  const validateCreateTest = () => {
    // console.log('checked', checked);
    let isChecked;
    if (checked && checked.length > 0) {
      isChecked = true;
    } else isChecked = false;
    // let isChecked = false;
    // if (state.data.length > 0) {
    //   isChecked = state.data.forEach((page) => {
    //     console.log('page', page);
    //     if (page.tableData) {
    //       // eslint-disable-next-line no-prototype-builtins
    //       if (page.tableData.hasOwnProperty('checked')) return true;
    //     } else return false;
    //   });
    // }
    // console.log('isChecked', isChecked);
    return (
      state.targetName.length > 0 &&
      (handleUrlValidation() || state.dataEndpoint.length === 0) &&
      isChecked
    );
  };

  // const addSelection = (data) => {
  //   let pages = [];
  //   console.log('state pages', state.pages);
  //   data.forEach((element) => {
  //     pages.push(element);
  //   });
  //   setState((prevState) => ({ ...prevState, pages: pages }));
  // };

  return (
    <>
      <BreadcrumbsItem to={`/authoring/books/${book._id}/tests/add`}>
        Add Test
      </BreadcrumbsItem>
      <Box
        sx={{
          mb: 3,
          // minWidth: '500px',
          // maxWidth: '80%',
          width: '100%',
          pl: 0,
        }}
      >
        <Grid
          spacing={2}
          container
          direction='row'
          justifyContent='flex-start'
          wrap='nowrap'
          paddingLeft={3}
          // alignItems='center'
        >
          <TestImageModal imageProps={state.imageModal} setState={setState} />
          <Grid item xs={8}>
            <MaterialTable
              style={{
                minWidth: 'auto',
                maxWidth: '100%',
                textAlign: 'center',
                marginBottom: '1rem',
                paddingLeft: '1rem',
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: state.loadingMessage,
                  // editRow: {
                  //   deleteText: 'Are you sure you want to delete?',
                  // },
                  // fontSize: '12px',
                },
              }}
              options={{
                paging: true,
                search: false,
                actionsColumnIndex: -1,
                selection: true,
                showSelectAllCheckbox: false,
                selectionProps: handleSelectionProps,
                cellStyle: {
                  // borderBottom: 'none',
                  // zIndex: '1000',
                },
              }}
              onSelectionChange={(rows) => setChecked(rows)}
              // onSelectionChange={handleRow}
              title='SELECT SMART PAGES'
              columns={[
                {
                  title: 'PAGE NUMBER',
                  field: 'pageNumber',
                  lookup: state.lookup,
                  maxWidth: '7rem',
                  headerStyle: { padding: '0.5rem' },
                  render: (rowData) => (
                    <div
                      style={{
                        padding: 0,
                        // width: '20px',
                        // border: '1px solid green',
                      }}
                    >
                      {rowData.pageNumber}
                    </div>
                  ),
                },
                {
                  title: 'THUMBNAIL',
                  field: 'pdfUrl',
                  editable: 'never',
                  headerStyle: {
                    textAlign: 'center',
                  },
                  cellStyle: {
                    textAlign: 'center',
                  },
                  render: (rowData) => (
                    <div
                      style={{
                        // width: 100,
                        // height: 120,
                        display: 'inline-block',
                        // verticalAlign: 'top',
                        // backgroundImage: `url(${rowData.imageUrl})`,
                        // boxShadow: 'inset 0 0 99999px rgba(0, 120, 255, 0.5)',
                        // zIndex: 1000,
                      }}
                    >
                      <img
                        src={`${rowData.imageUrl ?? rowData.pdfUrl + '.png'}`}
                        // src={`${rowData.imageUrl}`}
                        alt={rowData.pageNumber}
                        onClick={() => {
                          // console.log('image', rowData.imageUrl);
                          setState((pre) => ({
                            ...pre,
                            imageModal: {
                              image:
                                rowData.imageUrl ?? rowData.pdfUrl + '.png',
                              modalState: true,
                            },
                          }));
                        }}
                        style={{
                          // width: 100,
                          height: 120,
                          cursor: 'pointer',
                          // border: `${state.hoverImg ? '1px solid black' : ''}`,
                          // color: `${state.hoverImg ? 'black' : ''}`,
                          zIndex: -1,
                          // transform: `${
                          //   state.hoverImg ? 'scale(1.5)' : 'scale(1)'
                          // }`,
                        }}
                      />
                    </div>
                  ),
                },
              ]}
              data={state.data}
              // actions={actions}
            />
          </Grid>
          <Grid item xs={4}>
            <Box
              display='flex'
              flexDirection='column'
              gap={1}
              m={1}
              component='form'
              onSubmit={saveTest}
              position='sticky'
              top={10}
            >
              <Typography variant='h5' pl={1}>
                Details
              </Typography>
              <TextField
                required
                autoComplete='off'
                // fullWidth
                type='text'
                id='targetName'
                name='targetName'
                value={state.targetName}
                label='Name'
                onChange={handleChange}
              />
              <FormControl variant='outlined' required fullWidth>
                <InputLabel id='language'>Language</InputLabel>
                <Select
                  labelId='language'
                  value={state.language}
                  id='language'
                  name='language'
                  onChange={handleChange}
                  label='Language'
                  defaultValue='en'
                >
                  <MenuItem value='en'>English</MenuItem>
                  <MenuItem value='ja'>Japanese</MenuItem>
                  <MenuItem value='hi'>Hindi</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant='outlined' required fullWidth>
                <InputLabel id='responseAPIFormat'>
                  Response API Format
                </InputLabel>
                <Select
                  labelId='responseAPIFormat'
                  value={state.responseAPIFormat}
                  id='responseAPIFormat'
                  name='responseAPIFormat'
                  onChange={handleChange}
                  label='Response API Format'
                  defaultValue='simple'
                >
                  <MenuItem value='simple'>Simple</MenuItem>
                  <MenuItem value='detailed'>Detailed</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant='outlined' required fullWidth>
                <InputLabel id='apiResponseType'>API Response Type</InputLabel>
                <Select
                  labelId='apiResponseType'
                  value={state.apiResponseType}
                  id='apiResponseType'
                  name='apiResponseType'
                  onChange={handleChange}
                  label='API Response Type'
                  // defaultValue='practice'
                >
                  <MenuItem value='realTime'>Real Time</MenuItem>
                  <MenuItem value='asynchronous'>Asynchronous</MenuItem>
                </Select>
              </FormControl>
              {state.apiResponseType === 'asynchronous' && (
                <TextField
                  error={
                    handleUrlValidation() || state.dataEndpoint.length === 0
                      ? false
                      : true
                  }
                  helperText={
                    handleUrlValidation() || state.dataEndpoint.length === 0
                      ? ''
                      : 'invalid url'
                  }
                  type='text'
                  id='dataEndpoint'
                  name='dataEndpoint'
                  value={state.dataEndpoint}
                  label='Data Endpoint'
                  onChange={handleChange}
                />
              )}
              <FormControlLabel
                control={<Checkbox />}
                value={state.precisionMode}
                name='precisionMode'
                onChange={handleChecked}
                label='Precision Mode'
                sx={{ pl: '0.1rem', m: '0.1rem 0 0 0', ml: 0 }}
              />
              <FormControlLabel
                control={<Checkbox />}
                value={state.applyShadowRemoval}
                name='applyShadowRemoval'
                onChange={handleChecked}
                label='Apply Shadow Removal'
                sx={{ pl: '0.1rem', m: '0.1rem 0 0.1rem 0', ml: 0 }}
              />
              <FormControlLabel
                control={<Checkbox />}
                value={state.showCorrectAnswer}
                name='showCorrectAnswer'
                onChange={handleChecked}
                label='Show Answer in Checked Image'
                sx={{ pl: '0.1rem', m: '0.1rem 0 0.5rem 0', ml: 0 }}
              />

              <Button
                disabled={!validateCreateTest()}
                width='auto'
                variant='contained'
                color='primary'
                className='submitButton'
                type='submit'
                // onClick={(e) => saveTest(e)}
                sx={{ width: '12rem', m: 'auto' }}
              >
                Create Assessment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddTest;

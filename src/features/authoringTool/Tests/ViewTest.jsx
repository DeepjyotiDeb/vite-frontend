/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckBox, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { TestImageModal } from './TestImageModal';
import { setCurrentBook } from '../Book/BookSlice';
import { currentUser } from '../../auth/userSlice';
import {
  addTestApi,
  getBookDetailsApi,
  getPageDetailsApi,
  getQuestionsApi,
  getSkillsApi,
  getTestsApi,
} from '../../../api/authoringApi';

const ViewTest = () => {
  const options = {
    paging: true,
    // pageSize: 5,
    pageSizeOptions: [3, 5, 15, 20],
    search: false,
    selection: false,
    searchFieldAlignment: 'left',
    searchFieldStyle: {
      backgroundColor: '#FFFFFF',
      // border: '1px solid #B5CCEC',
      borderRadius: '2px',
      fontFamily: 'Rubik',
      fontWeight: '400',
      fontSize: '14px',
      color: '#A4A9AF',
      letterSpacing: '0px',
    },
    actionsColumnIndex: -1,

    headerStyle: {
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 12,
      color: '#707A85',
      borderTop: '1px solid',
      borderColor: '#E6EEF8',
      textTransform: 'uppercase',
      // paddingLeft: 0,
      // marginLeft: 0
    },
    cellStyle: {
      textAlign: 'center',
      fontWeight: '400',
      fontSize: 16,
      color: '#01204A',
      borderColor: '#E6EEF8',
    },
    actionsCellStyle: {
      // display: "flex",
      justifyContent: 'center',
      borderBottom: '1px solid #E6EEF8',
      color: '#A4A9AF',
      fontSize: '22px',
      fontWeight: 'bold',
      texTransform: 'uppercase',
    },
    rowStyle: {
      textAlign: 'center',
      padding: 'auto',
    },
  };

  const infoColumns = [
    {
      title: '#',
      // field: 'item',
      render: (row) => <>{row.tableData.id + 1}</>,
      editable: 'never',
      width: '15%',
      cellStyle: {
        textAlign: 'left',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
      },
      headerStyle: {
        textAlign: 'left',
      },
    },
    {
      title: 'Content Type',
      field: 'contentType',
      width: '20%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'Content Subtype',
      field: 'contentSubType',
      width: '20%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    // {
    //   title: 'PAGE ID',
    //   field: 'pageId',
    //   width: '30%',
    //   cellStyle: {
    //     textAlign: 'center',
    //     padding: 0,
    //     paddingRight: '20px',
    //   },
    //   headerStyle: {
    //     textAlign: 'center',
    //   },
    // },
  ];
  const columns = [
    {
      title: '#',
      field: 'item',
      editable: 'never',
      width: '15%',
      cellStyle: {
        textAlign: 'left',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
      },
      headerStyle: {
        textAlign: 'left',
      },
    },
    {
      title: 'Content Type',
      field: 'contentType',
      width: '20%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'Content Subtype',
      field: 'contentSubType',
      width: '20%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'ANSWER',
      field: 'ans',
      width: '20%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    {
      title: 'SKILL',
      field: 'skills',
      render: (rowData) => (
        <p>
          {/* {console.log('rowData', rowData.skills)} */}
          {rowData.skills
            ? rowData.skills.map((item) => item.skillName.concat()).join(', ')
            : ''}
        </p>
      ),
      editable: 'never',
      width: '35%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
    // {
    //   title: 'PAGE ID',
    //   field: 'pageId',
    //   width: '30%',
    //   cellStyle: {
    //     textAlign: 'center',
    //     padding: 0,
    //     paddingRight: '20px',
    //   },
    //   headerStyle: {
    //     textAlign: 'center',
    //   },
    // },
    {
      title: 'MAX SCORE',
      field: 'maxScore',
      width: '10%',
      cellStyle: {
        textAlign: 'center',
        padding: 0,
        paddingRight: '20px',
      },
      headerStyle: {
        textAlign: 'center',
      },
    },
  ];

  const [state, setState] = useState({
    book: [],
    data: [],
    infoData: [],
    target: undefined,
    tableTitle: '',
    arucos: [],
    skills: [],
    totalQuestions: 0,
    arucoDetails: [],
    pages: [],
    pageIds: [],
    type: '',
    pageInfoSize: { pageSize: 3 },
    pageDataSize: { pageSize: 20 },
    error: false,
    errorMessage: '',
    errorTitle: '',
    success: false,
    successMessage: '',
    successTitle: '',
    author: [],
    buttonLoader: false,
    infoMessage: 'Loading Student Info...',
    imageModal: {
      modalState: false,
      image: '',
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  // const book = useSelector(currentBook);
  const { id, testId } = useParams();

  useEffect(() => {
    getTest(user.token);
  }, []);

  const getTest = async (token) => {
    if (location.state === null) {
      document.title = 'Authoring Tool | View Assessment';
      const [bookRes, testRes] = await Promise.all([
        getBookDetailsApi(
          { bookId: id },
          { headers: { Authorization: user.token } }
        ),
        getTestsApi(
          //* api call for tests
          { bookId: id },
          { headers: { Authorization: token } }
        ),
      ]);
      const { book } = bookRes.data;
      dispatch(setCurrentBook(book));
      const { targets } = testRes.data;
      if (!targets.length) {
        setState((prevState) => ({
          ...prevState,
          tableMessage: 'No Tests Found',
        }));
        return;
      }
      // console.log('tests', tests);
      const target = targets.find((item) => item.targetId === testId);
      // console.log('target', target);
      getQuestions({ token, targetId: testId }); //* api call for questions

      setState((prevState) => ({
        ...prevState,
        target: target,
        tableTitle: `${target.targetName}`,
      }));
      return;
    }
    // if (book === undefined || location.state === undefined) {
    //   navigate('/authoring/books');
    // } else {

    // console.log('location', location.state);
    if (location.state.type === 'create') {
      const { book, target, pages, pageIds, type } = location.state;
      document.title = 'Authoring Tool | Add Assessment';

      await getSkillsApi(
        { userId: user._id },
        { headers: { Authorization: token } }
      )
        .then((response) => {
          setState((prevState) => ({
            ...prevState,
            skills: response.data.skills,
          }));
        })
        .catch((err) => console.log({ err }));
      // console.log('pages', pages);
      setState((prevState) => ({
        ...prevState,
        book: book,
        target: target,
        pages: pages,
        pageIds: pageIds,
        tableTitle: `${target.targetName}`,
        type: type,
        author: user,
      }));
      getPageDetails(pageIds, token);
    }
  };

  const getQuestions = async ({ token, targetId }) => {
    try {
      const res = await getQuestionsApi(
        { targetId: targetId },
        { headers: { Authorization: token } }
      );
      const { questions } = res.data;
      let dataTable = [],
        infoTable = [];
      questions.forEach((item) => {
        item.contentType === 'question'
          ? dataTable.push(item)
          : infoTable.push(item);
      });

      setState((prevState) => ({
        ...prevState,
        data: dataTable,
        infoData: infoTable,
        infoMessage: !infoTable.length ? 'No Student Information Added' : '',
        pageDataSize: {
          pageSize:
            dataTable.length <= 5 ? 5 : dataTable.length <= 15 ? 15 : 20,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getPageDetails = async (pageIds, token) => {
    await getPageDetailsApi(
      { pageIds: pageIds },
      { headers: { Authorization: token } }
    )
      .then((response) => {
        // console.log('page details', response.data);
        setState((prevState) => ({
          ...prevState,
          pageDetails: response.data.pageDetails,
        }));

        let questionsData = [];
        let infoData = [];
        // console.log('new res', newRes);
        response.data.pageDetails.forEach((page, _index) => {
          page.data.forEach(async (item, _index) => {
            // let skillDetails = state.skills.find(
            //   (sk) => sk.skillName === item.skillName
            // );
            let result = {};
            // console.log('item', item);
            result['item'] = item?.item;
            result['ans'] = `${item.ans}`;
            result['maxScore'] = item.maxScore;
            result['contentType'] = item.contentType;
            result['contentSubType'] = item.contentSubType;
            result['difficulty'] = item.difficulty;
            result['skills'] = item?.skills;
            // result['skillId'] = skillDetails?.skillId;
            result['explanation'] = '';
            result['modelType'] = item.modelType;
            result['pageId'] = page.pageId;
            /* let pageNumber = await this.state.bookPageDetails.find(ar => ar.arucoId === aruco.arucoId);
                                    result[""] */
            if (item.contentType === 'question') {
              questionsData.push(result);
            } else infoData.push(result);
          });
        });
        setState((prevState) => ({
          ...prevState,
          data: questionsData,
          totalQuestions: questionsData.length + infoData.length,
          infoData: infoData,
          infoMessage: !infoData.length ? 'No Student Information Added' : '',
          pageDataSize: {
            pageSize:
              questionsData.length <= 5
                ? 5
                : questionsData.length <= 15
                ? 15
                : 20,
          },
        }));
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      success: false,
      successMessage: '',
      successTitle: '',
    }));
  };

  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      error: false,
      errorMessage: '',
      errorTitle: '',
    }));
  };

  const itemSubmit = async (e) => {
    e.preventDefault();
    if (location.state.type === 'create') {
      const { target, book, pageIds, totalQuestions, data, infoData } = state;
      const newData = [...data, ...infoData].map(
        // eslint-disable-next-line unused-imports/no-unused-vars
        ({ tableData, ...item }) => item
      );
      // console.log({ newData, test, book, pageIds, totalQuestions });

      setState((pre) => ({ ...pre, buttonLoader: true }));
      await addTestApi(
        {
          items: newData,
          target: target,
          book,
          pageId: pageIds,
          totalQuestions,
          organizationId: user.organizationId,
          organizationCode:
            user.organizationCode ?? user.organizationName.toLowerCase().trim(),
        },
        { headers: { Authorization: user.token } }
      )
        .then((_response) => {
          // console.log('res', _response);
          setTimeout(() => {
            navigate(`/authoring/books/${book._id}/tests`, {
              state: {
                book: state.book,
                author: state.author,
              },
            });
          }, 1500);
        })
        .catch((_error) => {
          setTimeout(() => {
            navigate(`/authoring/books/${book._id}/tests`);
          }, 1500);
        });
    }
  };
  const validateItemData = () => {
    return state.data.length !== 0;
  };

  return (
    <>
      {state.target && (
        <BreadcrumbsItem to={`/authoring/books/${id}/tests/${testId}`}>
          {state.target.targetName}
        </BreadcrumbsItem>
      )}
      {state.tableTitle && (
        <Typography variant='h6' textAlign='center' m={1}>
          Test Name - {state.tableTitle}
        </Typography>
      )}
      {state.target && (
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Box>
            <Typography variant='h6' textAlign='center' mb={1}>
              Details
            </Typography>
          </Box>
          <Box display='flex' justifyContent='space-evenly'>
            <Box display='flex' flexDirection='column'>
              {/* <Typography variant='h6' textAlign='center'>
                Test Image Used:
              </Typography> */}
              <img
                alt='test page'
                src={`${
                  location.state
                    ? state.pages[0].imageUrl
                    : state.target.imageUrl[0]
                }`}
                style={{
                  maxHeight: '16rem',
                  border: '1px solid black',
                  cursor: 'zoom-in',
                }}
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    imageModal: {
                      modalState: true,
                      image: location.state
                        ? state.pages[0].imageUrl
                        : state.target.imageUrl[0],
                    },
                  }))
                }
              />
            </Box>
            <Divider orientation='vertical' sx={{ mr: 4 }} />
            <Box>
              <List dense={false} sx={{ pt: 1.8, minWidth: '20rem' }}>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={state.target.responseAPIFormat}
                >
                  <ListItemText
                    primary={<strong>Response API Format:</strong>}
                  ></ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.language === 'en'
                      ? 'English'
                      : state.target.language === 'ja'
                      ? 'Japanese'
                      : 'Hindi'
                  }
                >
                  <ListItemText
                    primary={<strong>Language:</strong>}
                  ></ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.dataEndpoint
                      ? state.target.dataEndpoint
                      : 'Not Found'
                  }
                >
                  <ListItemText
                    primary={<strong>Data Endpoint: </strong>}
                  ></ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.apiResponseType === 'realTime'
                      ? 'Real Time'
                      : 'Asynchronous'
                  }
                >
                  <ListItemText
                    primary={<strong>API Response Type: </strong>}
                  ></ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.precisionMode ? <CheckBox /> : <Cancel />
                  }
                >
                  <ListItemText primary={<strong>Precision Mode:</strong>}>
                    {/* <strong style={{ marginBottom: '10px' }}>
                      Precision Mode:
                    </strong> */}
                    {/* {state.target.precisionMode ? <CheckBox /> : <Cancel />} */}
                  </ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.applyShadowRemoval ? <CheckBox /> : <Cancel />
                  }
                >
                  <ListItemText
                    primary={<strong>Apply Shadow Removal: </strong>}
                  ></ListItemText>
                </ListItem>
                <ListItem
                  sx={{ p: 0 }}
                  secondaryAction={
                    state.target.showCorrectAnswer ? <CheckBox /> : <Cancel />
                  }
                >
                  <ListItemText
                    primary={<strong>Show Answer in Checked Image: </strong>}
                  ></ListItemText>
                </ListItem>
              </List>
            </Box>
          </Box>
          {/* <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Typography>
                Response API Format: {state.target.responseAPIFormat}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography>
                Language:{' '}
                {state.target.language === 'en'
                  ? 'English'
                  : state.target.language === 'ja'
                  ? 'Japanese'
                  : 'Hindi'}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography sx={{ display: 'flex', gap: 0.5 }}>
                Precision Mode:
                {state.target.precisionMode ? <CheckBox /> : <Cancel />}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography sx={{ display: 'flex', gap: 0.5 }}>
                Apply Shadow Removal:{' '}
                {state.target.applyShadowRemoval ? <CheckBox /> : <Cancel />}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography sx={{ display: 'flex', gap: 0.5 }}>
                Show Answer in Checked Image:{' '}
                {state.target.showCorrectAnswer ? <CheckBox /> : <Cancel />}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography sx={{ display: 'flex', gap: 0.5 }}>
                API Response Type:{' '}
                {state.target.apiResponseType === 'realTime'
                  ? 'Real Time'
                  : 'Asynchronous'}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Typography>
                Data Endpoint:{' '}
                {state.target.dataEndpoint
                  ? state.target.dataEndpoint
                  : 'Not Found'}
              </Typography>
            </Grid>
          </Grid> */}
        </Paper>
      )}

      <MaterialTable
        style={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        localization={{
          body: {
            emptyDataSourceMessage: `${state.infoMessage}`,
            editRow: { deleteText: 'Are you sure you want to delete?' },
            fontSize: '14px',
          },
        }}
        options={{ ...options, ...state.pageInfoSize }}
        title={
          <Typography
            variant='body1'
            style={{ color: '#000', fontWeight: '500', fontSize: '16px' }}
          >
            Student Info
          </Typography>
        }
        actions={state.actions}
        columns={infoColumns}
        data={state.infoData}
      />
      {state.data.length > 0 && (
        <MaterialTable
          style={{
            minWidth: '500px',
            width: '100%',
            maxWidth: '100%',
            textAlign: 'center',
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'Loading questions. . .',
              editRow: { deleteText: 'Are you sure you want to delete?' },
              fontSize: '14px',
            },
          }}
          options={{ ...options, ...state.pageDataSize }}
          title={
            <Typography
              variant='body1'
              style={{ color: '#000', fontWeight: '500', fontSize: '16px' }}
            >
              Question Info
            </Typography>
          }
          actions={state.actions}
          columns={columns}
          data={state.data}
        />
      )}
      <br />
      {state.type === 'create' && (
        <div
          style={{
            marginTop: '20px',
            marginRight: 'auto',
            marginBottom: '10px',
            position: 'sticky',
            bottom: '1rem',
            width: '100%',
            backgroundColor: 'white',
            padding: '0.75rem',
            boxShadow: '0px 3px 15px rgb(0 0 0 / 20%)',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <LoadingButton
            disabled={!validateItemData()}
            loading={state.buttonLoader}
            width='auto'
            variant='contained'
            // color='secondary'
            startIcon={<Save />}
            onClick={itemSubmit}
          >
            Submit
          </LoadingButton>
        </div>
      )}
      <TestImageModal imageProps={state.imageModal} setState={setState} />
      {state.error && (
        <Snackbar
          open={state.error}
          autoHideDuration={4500}
          onClose={handleError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            variant='filled'
            elevation={6}
            onClose={handleError}
            severity='error'
          >
            <AlertTitle>{state.errorTitle}</AlertTitle>
            <Typography variant='body2'>{state.errorMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
      {state.success && (
        <Snackbar
          open={state.success}
          autoHideDuration={4500}
          onClose={handleSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            variant='filled'
            elevation={6}
            onClose={handleSuccess}
            severity='success'
          >
            <AlertTitle>{state.successTitle}</AlertTitle>
            <Typography variant='body2'>{state.successMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ViewTest;

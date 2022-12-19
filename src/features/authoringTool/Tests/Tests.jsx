/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Delete, Visibility } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Link,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import MaterialTable from 'material-table';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { currentBook } from '../Book/BookSlice';
import { currentUser } from '../../auth/userSlice';
import { deleteTestApi, getTestsApi } from '../../../api/authoringApi';

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: '0px',
    padding: '0px',
    width: '300',
    outline: 'none',
    fontSize: '0px',
    lineHeight: '0px',
    maxWidth: 335,
    // fontSize: 40,
    // height: 'auto'
  },
  media: {
    width: '100%',
    // height: 300,
    borderRadius: '4px',
    position: 'relative',
    zIndex: 1000,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: 'red[500]',
  },
  addBook: {
    width: 'auto',
    maxWidth: 325,
    height: 'auto',
    textAlign: 'center',
  },
  cardImage: {
    margin: '0px',
    padding: '0px',
    width: '100%',
    outline: 'none',
    // height:'auto'
  },
  cardHeader: {
    fontSize: '12px',
  },
  button: {
    background: '#005792',
    borderRadius: '2px',
    color: '#FBFAF2',
    fontFamily: 'Rubik',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'none',
    '&:hover': {
      // background: '#B5CCEC',
      background: '#01204A',
    },
  },
  alert: {
    // width: "250px",
  },
}));

const Tests = () => {
  const options = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 20],
    paging: true,
    search: true,
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
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    rowStyle: {
      textAlign: 'center',
      padding: 'auto',
    },
  };

  const columns = [
    {
      title: 'ASSESSMENT NAME',
      field: 'targetName',
      editable: 'onUpdate',
      cellStyle: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
      },
      // headerStyle: { textAlign: 'center' },
      render: (rowData) => (
        <Link
          style={{
            color: '#01204A',
            cursor: 'pointer',
          }}
          rel='noopener noreferrer'
          underline='hover'
          onClick={(e) => viewTest(e, rowData)}
        >
          {rowData.targetName}
          {/* {console.log('row', rowData)} */}
        </Link>
      ),
    },
    {
      title: 'TOTAL QUESTIONS',
      field: 'totalQuestions',
      editable: 'never',
      width: 'auto',
    },
    {
      title: 'ACTION',
      editable: 'never',
      width: 'auto',
      cellStyle: {
        textAlign: 'center',
      },
      render: (rowData) => (
        <>
          <Tooltip title='View Assessment'>
            <IconButton
              aria-label='View Assessment'
              // disabled={rowData.status === 'Processing'}
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              onClick={(e) => {
                viewTest(e, rowData);
                // console.log('state', state);
              }}
            >
              {/* <Edit style={{ fontSize: "22px" }} /> */}
              <Visibility style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete Assessment'>
            <IconButton
              aria-label='Delete Assessment'
              // disabled={rowData.status === 'Processing'}
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              onClick={() => {
                deleteTest(rowData);
              }}
            >
              <Delete style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const [state, setState] = useState({
    book: null,
    author: [],
    data: [],
    testError: false,
    testErrorTitle: '',
    testSuccess: false,
    testSuccessTitle: '',
    testSuccessMessage: '',
    emptyDataSourceMessage: 'Loading assessments. . .',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const user = useSelector(currentUser);
  const book = useSelector(currentBook);

  useEffect(() => {
    // console.log('location', location.state);
    if (location.state === undefined) {
      navigate(-1);
    } else {
      document.title = 'Authoring Tool | Assessments';
      //   console.log('book and user', book, user);
      setState((prevState) => ({
        ...prevState,
        book: book,
        author: user,
      }));
      state.book && getTests(user.token);
    }
  }, [state.book]);

  const getTests = async (token) => {
    if (state.book === null) return;
    await getTestsApi(
      { bookId: state.book._id },
      { headers: { Authorization: token } }
    )
      .then((res) => {
        const { targets } = res.data;
        // console.log('res data', res.data);
        if (targets.length > 0) {
          setState((prevState) => ({ ...prevState, data: targets }));
        }
        setState((prevState) => ({
          ...prevState,
          emptyDataSourceMessage: 'No assessments found',
        }));
      })
      .catch((err) => console.log({ err }));
  };

  const addNewTest = (e) => {
    // const { pathname } = location
    // console.log('adding', state.book);
    navigate('add', {
      state: {
        type: 'create',
      },
    });
  };

  const viewTest = (e, test) => {
    e.preventDefault();
    navigate(`${test.targetId}`, {
      // state: {
      //   test: test,
      //   type: 'view',
      // },
    });
  };

  const deleteTest = async (target) => {
    const targetName = target.targetName;
    console.log('target', target);
    const enteredName = window.prompt(`Please type ${targetName} to confirm.`);
    if (enteredName === targetName) {
      await deleteTestApi(
        {
          targetId: target.targetId,
          targetName: target.targetName,
          organizationId: user.organizationId,
        },
        { headers: { Authorization: user.token } }
      )
        .then((response) => {
          setState((prevState) => ({
            ...prevState,
            testSuccess: true,
            testSuccessTitle: 'Assessment Delete Success',
            testSuccessMessage: `Assessment: ${targetName} deleted successfully.`,
          }));
          getTests(user.token);
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            testError: true,
            testErrorTitle: 'Assessment Delete Error',
            testErrorMessage: error.response.data.message,
          }));
        });
    } else {
      setState((prevState) => ({
        ...prevState,
        testError: true,
        testErrorTitle: 'Assessment Delete Error',
        testErrorMessage: 'Incorrect assessment name entered.',
      }));
    }
  };

  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      testError: false,
      testErrorTitle: '',
    }));
  };
  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      testSuccess: false,
      testSuccessTitle: '',
    }));
  };
  const { id } = useParams();
  return (
    <>
      <BreadcrumbsItem to={`/authoring/books/${id}/tests`}>
        Tests
      </BreadcrumbsItem>
      <MaterialTable
        style={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        localization={{
          body: {
            emptyDataSourceMessage: `${state.emptyDataSourceMessage}`,
            editRow: { deleteText: 'Are you sure you want to delete?' },
            fontSize: '14px',
          },
          toolbar: { searchPlaceholder: 'Search Assessments' },
        }}
        options={options}
        title=''
        columns={columns}
        data={state.data}
        actions={state.actions}
        components={{
          Actions: (props) => (
            <Button
              onClick={(event) => addNewTest(event)}
              variant='contained'
              color='secondary'
              // className={classes.button}
              startIcon={<Add />}
              size='small'
              style={{ marginRight: '50px' }}
            >
              Add Assessment
            </Button>
          ),
        }}
      />

      {state.testError && (
        <Snackbar
          open={state.testError}
          autoHideDuration={4500}
          onClose={handleError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            variant='filled'
            elevation={6}
            onClose={handleError}
            severity='error'
            className={classes.alert}
          >
            <AlertTitle>{state.testErrorTitle}</AlertTitle>
            <Typography variant='body2'>{state.testErrorMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
      {state.testSuccess && (
        <Snackbar
          open={state.testSuccess}
          autoHideDuration={4500}
          onClose={handleSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            variant='filled'
            elevation={6}
            onClose={handleSuccess}
            severity='success'
            className={classes.alert}
          >
            <AlertTitle>{state.testSuccessTitle}</AlertTitle>
            <Typography variant='body2'>{state.testSuccessMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Tests;

/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from '@mui/icons-material';
import { IconButton, Link, Tooltip } from '@mui/material';
import MaterialTable from 'material-table';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';
import { deleteTestApi, getAllTests } from '../../../api/authoringApi';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';

const AllTests = () => {
  const columns = [
    {
      title: 'BOOK NAME',
      field: 'bookName',
      render: (rowData) => (
        <Link
          style={{
            color: '#01204A',
            cursor: 'pointer',
          }}
          rel='noopener noreferrer'
          underline='hover'
          onClick={(e) => viewBook(e, rowData)}
          // href={`/authoring/books/${rowData.bookId}/tests/${rowData._id}`}
        >
          {rowData.bookName}
          {/* {console.log('row', rowData)} */}
        </Link>
      ),
    },
    {
      title: 'TEST NAME',
      field: 'targetName',
      render: (rowData) => (
        <Link
          style={{
            color: '#01204A',
            cursor: 'pointer',
          }}
          rel='noopener noreferrer'
          underline='hover'
          onClick={(e) => viewTest(e, rowData)}
          // href={`/authoring/books/${rowData.bookId}/tests/${rowData._id}`}
        >
          {rowData.targetName}
          {/* {console.log('row', rowData)} */}
        </Link>
      ),
    },
    {
      title: 'TOTAL QUESTIONS',
      field: 'totalQuestions',
      headerStyle: { textAlign: 'center' },
      cellStyle: {
        textAlign: 'center',
        paddingLeft: 0,
      },
    },
    {
      title: 'RESPONSE API FORMAT',
      field: 'responseAPIFormat',
    },
    {
      title: 'DELETE TEST',
      // field: 'testName',
      render: (rowData) => (
        <Tooltip title='Delete Test'>
          <IconButton
            aria-label='Delete Book'
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
      ),
    },
  ];
  const options = {
    sorting: true,
    paging: true,
    pageSize: 10,
    pageSizeOptions: [10, 15, 20],
    search: true,
    selection: false,
    searchFieldAlignment: 'left',
    searchFieldStyle: {
      backgroundColor: '#FFFFFF',
      // border: '1px solid #B5CCEC',
      borderRadius: '2px',
      // fontFamily: 'Rubik',
      fontWight: '400',
      fontSize: '14px',
      color: '#000',
      letterSpacing: '0px',
    },
    actionsColumnIndex: -1,

    headerStyle: {
      textAlign: 'left',
      fontWeight: '500',
      fontSize: 12,
      // color: '#707A85',
      color: '#000',
      borderTop: '1px solid',
      borderColor: '#E6EEF8',
      // paddingLeft: 0,
      // marginLeft: 0
    },
    cellStyle: {
      textAlign: 'left',
      fontWeight: '400',
      fontSize: 16,
      color: '#01204A',
      borderColor: '#E6EEF8',
    },
    rowStyle: {
      textAlign: 'center',
      padding: 'auto',
    },
  };
  const user = useSelector(currentUser);

  const [state, setState] = useState({
    targets: [],
    tableMessage: 'Searching for tests',
  });
  const [toast, setToast] = useState({
    state: false,
    message: '',
    severity: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Authoring Tool | All Tests';
    getTests();
  }, []);

  const getTests = async () => {
    await getAllTests({
      body: { organizationId: user.organizationId },
      headers: { headers: { Authorization: user.token } },
    }).then((res) => {
      const { targets } = res.data;
      if (!targets.length) {
        setState((prevState) => ({
          ...prevState,
          tableMessage: 'No Tests Found',
        }));
        return;
      }
      const sortedTests = targets.sort((a, b) =>
        a.bookName > b.bookName ? 1 : b.bookName > a.bookName ? -1 : 0
      );
      setState((prevState) => ({ ...prevState, targets: sortedTests }));
    });
  };

  const viewTest = (e, rowData) => {
    e.preventDefault();
    navigate(`/authoring/books/${rowData.bookId}/tests/${rowData._id}`);
  };
  const viewBook = (e, rowData) => {
    e.preventDefault();
    navigate(`/authoring/books/${rowData.bookId}`);
  };
  const deleteTest = async (rowData) => {
    const targetName = rowData.targetName;
    const enteredName = window.prompt(`Please type ${targetName} to confirm.`);
    if (enteredName === targetName) {
      await deleteTestApi(
        {
          targetId: rowData._id,
          targetName: rowData.targetName,
          organizationId: user.organizationId,
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      )
        .then((_response) => {
          setToast((prevState) => ({
            ...prevState,
            state: true,
            message: `Assessment: ${targetName} deleted successfully.`,
            severity: 'success',
          }));
          getTests(user.token);
        })
        .catch((error) => {
          setToast((prevState) => ({
            ...prevState,
            state: true,
            message: error.response.data.message,
            severity: 'error',
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
  return (
    <div>
      <BreadcrumbsItem to='/authoring/tests'>Tests</BreadcrumbsItem>
      <MaterialTable
        style={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
        }}
        localization={{
          body: {
            emptyDataSourceMessage: `${state.tableMessage}`,
            editRow: { deleteText: 'Are you sure you want to delete?' },
            fontSize: '14px',
          },
          toolbar: { searchPlaceholder: 'Search Books' },
        }}
        options={options}
        title=''
        columns={columns}
        data={state.targets}
      />
      <CustomSnackbar toast={toast} setToast={setToast} />
    </div>
  );
};

export default AllTests;

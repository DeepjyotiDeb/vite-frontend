/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Add, Close, Delete, Refresh, Visibility } from '@mui/icons-material';
import {
  Alert,
  Button,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';
import { deleteSkillApi, getAllSkillsApi } from '../../../api/authoringApi';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));
export const Skills = () => {
  const columns = [
    {
      title: 'SKILL NAME',
      field: 'skillName',
      editable: 'onUpdate',
      cellStyle: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
      },
      headerStyle: {},
    },
    {
      title: 'USED',
      field: 'used',
      editable: 'onUpdate',
      width: '20px',
      cellStyle: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
        color: '#01204A',
        borderColor: '#E6EEF8',
        // marginRight: '10px',
      },
      headerStyle: {},
      render: (rowData) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {rowData.used ? (
            <div className='processed'>True</div>
          ) : (
            <div className='processing'>False</div>
          )}
        </div>
      ),
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
          <Tooltip title='View Skill'>
            <IconButton
              aria-label='View Skill'
              // disabled={rowData.status === 'Processing'}
              style={{
                background: 'none',
                color: '#A4A9AF',
                marginRight: '6px',
              }}
              size='small'
              // eslint-disable-next-line unused-imports/no-unused-vars
              onClick={(_e) => {
                viewSkill(rowData);
              }}
            >
              <Visibility style={{ fontSize: '22px' }} />
            </IconButton>
          </Tooltip>
          {!rowData.used && (
            <Tooltip title='Delete Skill'>
              <IconButton
                aria-label='Delete Skill'
                // disabled={rowData.used === true}
                style={{
                  background: 'none',
                  color: '#A4A9AF',
                  marginRight: '6px',
                }}
                size='small'
                onClick={(_e) => {
                  deleteSkill(rowData, user);
                }}
              >
                <Delete style={{ fontSize: '22px' }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];
  const options = {
    paging: true,
    pageSize: 5,
    search: true,
    selection: false,
    searchFieldAlignment: 'left',
    searchFieldStyle: {
      backgroundColor: '#FFFFFF',
      // border: '1px solid #B5CCEC',
      borderRadius: '2px',
      fontFamily: 'Rubik',
      fontWight: '400',
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
      width: '50px',
    },
  };
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    emptyDataSourceMessage: 'No Skill is created yet!',
    data: [],
  });

  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      emptyDataSourceMessage: 'Wait while we get your skills',
    }));
    document.title = 'Authoring Tool | Skills ';
    // console.log('user skills', user);
    user.token && getSkills(user);
  }, []);

  // 'https://prod.paperflowapp.com/author-skills/getSkills'
  const getSkills = async (userProps) => {
    // console.log('skill user', userProps);
    await getAllSkillsApi(
      {
        userId: userProps._id, //TODO: need to change
        organizationId: userProps.organizationId,
      },
      {
        headers: {
          Authorization: userProps.token,
        },
      }
    )
      .then((response) => {
        // setSkills(response.data.skills);
        // console.log('skills', response.data.skills);
        setState((prevState) => ({
          ...prevState,
          emptyDataSourceMessage: 'No Skill is created yet!',
          data: response.data.skills,
        }));
      })
      .catch((err) => {
        console.log('get skill error', err);
      });
  };
  // const editSkill = () => {};
  const viewSkill = (_skill) => {};

  // "https://prod.paperflowapp.com/author-skills/delete";
  const deleteSkill = (skill, userProps) => {
    const skillName = skill.skillName;
    // console.log({ skill, userProps });
    const enteredName = window.prompt(`Please type ${skillName} to confirm.`);
    if (enteredName === skill.skillName) {
      deleteSkillApi(
        {
          skillId: skill._id,
        },
        {
          headers: {
            Authorization: userProps.token,
          },
        }
      )
        .then(() => {
          getSkills(userProps);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  };
  const addNewSkill = () => {
    navigate('add');
  };

  const classes = useStyles();
  return (
    <>
      <Collapse
        in={open}
        sx={{
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          flexGrow: 1,
          mb: open ? 2 : 'auto',
        }}
      >
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close fontSize='inherit' />
            </IconButton>
          }
          severity='info'
          variant='outlined'
        >
          Used skills cannot be deleted.
        </Alert>
      </Collapse>

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
          toolbar: { searchPlaceholder: 'Search Skills' },
        }}
        options={options}
        title=''
        columns={columns}
        data={state.data}
        actions={state.actions}
        components={{
          Actions: () => (
            <Grid
              container
              direction='row'
              justifyContent='flex-end'
              alignItems='center'
              spacing={2}
            >
              <Grid item>
                <Tooltip title='Add New Skill' placement='top'>
                  <Button
                    onClick={(event) => addNewSkill(event)}
                    variant='contained'
                    style={{ background: '#01204A' }}
                    color='secondary'
                    className={classes.button}
                    startIcon={<Add />}
                    size='small'
                  >
                    Add Skill
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title='Refresh' placement='top'>
                  <IconButton
                    style={{ color: '#01204A' }}
                    aria-label='Refresh'
                    onClick={() => getSkills(user)}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ),
        }}
      />
    </>
  );
};

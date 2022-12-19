/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Grid,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';
import { addSkillApi } from '../../../api/authoringApi';
import Btn from '../../../elements/Button';

const AddSkill = () => {
  const [state, setState] = useState({
    skillName: '',
    user: null,
    skillError: false,
    skillErrorMessage: '',
    loading: false,
    success: false,
  });

  const user = useSelector(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('add skill', user);
    if (user === null) {
      navigate('/login');
    } else {
      document.title = 'Authoring Tool | Add Skill';
      setState((prevState) => ({
        ...prevState,
        user: user,
      }));
    }
  }, []);

  const clearForm = () => {
    setState((prevState) => ({
      ...prevState,
      skillName: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('user id', state);
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    // 'https://prod.paperflowapp.com/author-skills/add'
    await addSkillApi(
      {
        userId: user._id,
        organizationId: user.organizationId,
        skillName: state.skillName,
      },
      { headers: { Authorization: state.user.token } }
    )
      .then(() => {
        clearForm();
        setState((prevState) => ({
          ...prevState,
          success: true,
          loading: false,
        }));
        setTimeout(() => {
          setState({ loading: false, success: false });
          navigate('/authoring/skills');
        }, 3000);
      })
      .catch(() => {
        setState((prevState) => ({
          ...prevState,
          skillError: true,
          loading: false,
          skillErrorMessage: 'Check Skill Name and try again!',
        }));
      });
  };

  const validateForm = () => {
    return state.skillName.length > 0;
  };
  const handleSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({ ...prevState, success: false }));
  };

  const handleError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prevState) => ({ ...prevState, skillError: false }));
  };
  // console.log('add skill page');
  return (
    <div className='skill' style={{ minWidth: '400px', maxWidth: '50%' }}>
      <BreadcrumbsItem to='/authoring/skills/add'>Add Skills</BreadcrumbsItem>
      <h1>Add New Skill</h1>
      <form className='skill__form' onSubmit={handleSubmit}>
        {state.loading ? <LinearProgress color='secondary' /> : <></>}
        <fieldset disabled={state.loading}>
          <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={3}
          >
            <Grid item>
              <TextField
                style={{ minWidth: '300px', maxWidth: '50%' }}
                margin='dense'
                required
                size='medium'
                fullWidth
                type='text'
                id='skillName'
                name='skillName'
                value={state.skillName}
                label='Skill Name'
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    skillName: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs sm={6}>
              <Btn
                type='submit'
                disabled={!validateForm()}
                style={{ minWidth: '200px' }}
              >
                Add Skill
              </Btn>
            </Grid>
          </Grid>
        </fieldset>
      </form>

      {state.success && (
        <Snackbar
          open={state.success}
          autoHideDuration={2000}
          onClose={handleSuccess}
        >
          <Alert onClose={handleSuccess} variant='filled' severity='success'>
            <Typography variant='body2'>Skill Added Successfully</Typography>
          </Alert>
        </Snackbar>
      )}
      {state.skillError && (
        <Snackbar
          open={state.skillError}
          autoHideDuration={2000}
          onClose={handleError}
        >
          <Alert onClose={handleError} variant='filled' severity='error'>
            <Typography variant='body2'>{state.skillErrorMessage}</Typography>
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default AddSkill;

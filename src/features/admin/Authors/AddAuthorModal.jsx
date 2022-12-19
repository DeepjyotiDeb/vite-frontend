import { LoadingButton } from '@mui/lab'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { currentUser } from '../../auth/userSlice';
import { getOrgDetails } from '../../../api/adminApi';

const AddAuthorModal = ({handleClose, handleAddAuthor, loading}) => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'author',
    inviteCode: '',
    name: '',
  });
    const validateForm = () => {
      const { email, password, username,  inviteCode } = inputs;
      return (
        password.trim().length > 4 &&
        username.trim().length > 0 &&
        inviteCode.trim().length>0 &&
        email.trim().length > 0 &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      );
    };
    function handleChange(e) {
      // if (state.contentSubType === 'checkbox') {
      const { name, value } = e.target;
      
        setInputs((inputs) => ({ ...inputs, [name]: value }));
      
    }
  const user = useSelector(currentUser);

    const org = {
      organizationName: user.organizationName,
      organizationId: user.organizationId,
      userType:'admin',
    };
     useEffect(() => {
      getOrgDetails(org)
        .then((res) => {
          console.log(res);
          const { inviteCode } = res.data.organizations;
        setInputs((inputs) => ({ ...inputs, inviteCode: inviteCode }));
        console.log(inputs)
        })
        .catch((err) => console.log({ err })); 
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])
     
  return (
    <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Add a new author </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the author you would like to add to your organization.
          </DialogContentText>
          <form onSubmit={handleAddAuthor}>
                      {' '}
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='username'
                          label='Username'
                          name='username'
                          value={inputs.username}
                          autoComplete='username'
                          autoFocus
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormControl style={{ width: '100%' }}>
                        {/* todo: Password visibility to be added before deploying */}
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          name='password'
                          label='Password '
                          type='password'
                          id='password'
                          value={inputs.password}
                          autoComplete='current-password'
                          onChange={handleChange}
                          // onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                        />
                      </FormControl>
                      <FormControl style={{ width: '100%' }}>
                        <TextField
                          margin='normal'
                          required
                          fullWidth
                          id='email'
                          label='Email address'
                          name='email'
                          value={inputs.email}
                          autoComplete='email'
                          onChange={handleChange}
                        />
                      </FormControl>{' '}
                      
                    </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton  color='primary'
                            variant='contained'
                            type='submit'
                            style={{ margin: '0.5rem 0', width: '10rem' }}
                            onClick={() => handleAddAuthor(inputs)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleAddAuthor(inputs)
                            }
                            disabled={
                              !validateForm() ||
                             loading 
                            }
                            loading={loading}>Submit</LoadingButton>
        </DialogActions>
      </Dialog>
  )
}

export default AddAuthorModal
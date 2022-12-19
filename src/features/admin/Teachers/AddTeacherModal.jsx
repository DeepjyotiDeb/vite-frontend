import { LoadingButton } from '@mui/lab'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { matchIsValidTel, MuiTelInput } from 'mui-tel-input'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { currentUser } from '../../auth/userSlice'
import { getOrgDetails } from '../../../api/adminApi'


const AddTeacherModal = ({handleClose, handleAddTeacher, loading}) => {
    const [phoneNumber, setPhoneNumber] = useState('+91 ')
    const [inviteCode, setInviteCode] = useState('')
    const handlePhoneChange = (newPhone) => {
        setPhoneNumber(newPhone);
      };
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
          setInviteCode(inviteCode)
          })
          .catch((err) => console.log({ err })); 
       // eslint-disable-next-line react-hooks/exhaustive-deps
       }, [])
  return (
    <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Add a new teacher </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the phone number of the teacher you would like to add to your organization.
          </DialogContentText>
          <MuiTelInput
          autoFocus
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      style={{ width: '100%', marginTop:'1rem' }}
                    //   onlyCountries={['IN', 'US', 'JP', 'NL']}
                    onlyCountries={['IN']}
                    />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={()=>{handleAddTeacher(phoneNumber, inviteCode)}} loading={loading} disabled = {loading || !matchIsValidTel(phoneNumber)}>Submit</LoadingButton>
        </DialogActions>
      </Dialog>
  )
}

export default AddTeacherModal
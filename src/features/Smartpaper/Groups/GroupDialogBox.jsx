/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Edit, GroupAdd } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';



export const NewGroupDialog = ({ open, handleClose, handleClick, loading, inputs, setInputs }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" margin="auto">
          {'New Class'}
        </DialogTitle>

        <DialogContent
          sx={{
            width: { xs: '250px', sm: '400px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pb: 1
          }}
        >
          <TextField
            name="name"
            label="Class Name"
            fullWidth
            required
            type="text"
            value={inputs.name}
            onChange={(e)=>{setInputs(inputs=>({...inputs, name:e.target.value}))}}
            sx={{ mt: 1 }}
          />
          <TextField
            name="numStudents"
            label="Number of students"
            fullWidth
            required
            type="number"
            value={inputs.totalStudents}
            onChange={(e)=>{setInputs(inputs=>({...inputs, totalStudents:e.target.value}))}}
            sx={{ mt: 4 }}
          />
          

        </DialogContent>
        <DialogActions sx={{ margin: 'auto', mb: 2 }}>
          <LoadingButton
            variant="contained"
            startIcon={<GroupAdd />}
            disabled={!inputs.name.length || inputs.totalStudents<1}
            loading={loading}
            sx={{
              backgroundColor: '#0d47a1',
              fontSize: '13px',
              textDecoration: 'none',
              borderRadius: '0.5rem'
            }}
            onClick={() =>
              handleClick()
            }
          >
            Add Class
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const EditGroupDialog = ({ open, handleClose, handleClick, loading, inputs, setInputs }) => {

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" margin="auto">
          {'Edit Group'}
        </DialogTitle>

        <DialogContent
          sx={{
            width: { xs: '250px', sm: '400px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pb: 1
          }}
        >
          <TextField
            name="groupName"
            label="Group Name"
            fullWidth
            required
            type="text"
            value={inputs.name}
            onChange={(e)=>{setInputs(inputs=>({...inputs, name:e.target.value}))}}
            sx={{ mt: 1 }}
          />
          <TextField
            name="numStudents"
            label="Number of students"
            fullWidth
            required
            type="number"
            value={inputs.totalStudents}
            onChange={(e)=>{setInputs(inputs=>({...inputs, totalStudents:e.target.value}))}}
            sx={{ mt: 4 }}
          />
        </DialogContent>
        <DialogActions sx={{ margin: 'auto', mb: 2 }}>
          <LoadingButton
            variant="contained"
            startIcon={<Edit />}
            sx={{
              backgroundColor: '#0d47a1',
              fontSize: '13px',
              textDecoration: 'none',
              borderRadius: '0.5rem'
            }}
            loading={loading}
            disabled={!inputs.name.length || inputs.totalStudents<1}
            onClick={() =>
              handleClick()
            }
          >
            Edit Class
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

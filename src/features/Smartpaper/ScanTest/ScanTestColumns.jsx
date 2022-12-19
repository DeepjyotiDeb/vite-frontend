// import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

import { ReportGmailerrorredOutlined } from '@mui/icons-material';
import { Button, Link } from '@mui/material';

export const customCol = ({ addImageAsError }) => {
  // export const test_page4_1 =
  return [
    // {
    //   Header: 'Update',
    //   id: 'update',
    //   accessor: (row) => row.data,
    //   Cell: (rowData) => (
    //     <Button
    //       onClick={() => {
    //         console.log('e', rowData.value.studentInfo.studentNumber.number);
    //         saveRollNo(rowData);
    //       }}
    //       variant='contained'
    //       size='small'
    //       style={{
    //         padding: 0.6,
    //         height: '1.8rem',
    //         minWidth: '3rem',
    //         textTransform: 'none',
    //         backgroundColor: '#0d47a1',
    //       }}
    //     >
    //       Save
    //     </Button>
    //   ),
    //   collapse: true,
    //   style: {
    //     minWidth: 40,
    //     lineHeight: '25px',
    //   },
    // },
    {
      Header: 'ID',
      id: 'id',
      // maxWidth: 50,
      editable: true,
      accessor: (row) =>
        row.data.studentInfo.studentNumber
          ? row.data.studentInfo.studentNumber.number
          : '',
      style: {
        // minWidth: '1rem',
        // fontSize: '0.9rem',
      },
      // collapse: true,
    },

    {
      Header: 'Roll No',
      id: 'rollNo',
      accessor: (row) => {
        if (row.data.studentInfo.studentNumber)
          return row.data.studentInfo.studentNumber.crops;
      },
      Cell: (e) => (
        <>
          {e.cell.value ? (
            <div
              style={{ width: '100%', height: '35px', position: 'relative' }}
            >
              <img
                alt='Student Name'
                src={e.cell.value}
                style={{ height: '35px' }}
              />
            </div>
          ) : (
            <p>No Image</p>
          )}
        </>
      ),
      collapse: false,
      style: {
        // minWidth: '180px',
      },
    },
    {
      Header: 'Name',
      id: 'name',
      accessor: (row) => {
        if (row.data.studentInfo.studentName)
          return row.data.studentInfo.studentName.crops;
      },
      Cell: (e) => (
        <>
          {e.cell.value ? (
            <div
              style={{ width: '100%', height: '35px', position: 'relative' }}
            >
              <img
                alt='Student Name'
                src={e.cell.value}
                style={{ height: '35px' }}
              />
            </div>
          ) : (
            <p>No Image</p>
          )}
        </>
      ),
      collapse: false,
      style: {
        minWidth: '180px',
      },
    },
    {
      Header: 'Correct',
      id: 'correct',
      accessor: (row) => {
        // console.log('row', row);
        return row.data.targetInfo[0].countCorrect;
      },
      // Cell: e => console.log('correct', e),
      collapse: true,
      style: {
        fontSize: '1.2rem',
        color: 'green',
        minWidth: 80,
      },
    },
    {
      Header: 'Incorrect',
      id: 'incorrect',
      accessor: (row) => row.data.targetInfo[0].countIncorrect,
      collapse: true,
      style: {
        fontSize: '1.2rem',
        color: 'red',
        minWidth: 90,
      },
    },
    {
      Header: 'Blank',
      id: 'blank',
      accessor: (row) => row.data.targetInfo[0].countBlank,
      collapse: true,
      style: {
        fontSize: '1.2rem',
        // color: 'red',
        minWidth: 90,
      },
    },
    {
      Header: 'Result',
      id: 'result',
      accessor: (row) => row.data.outputImg[0],
      Cell: (e) => (
        <Link href={e.value} target='_blank' rel='noreferrer'>
          View
        </Link>
      ),
      style: {
        fontSize: '13px',
        minWidth: 80,
      },
    },
    {
      Header: 'Mark as Error',
      id: 'markAsError',
      accessor: (row) => {
        // console.log('row', row.data);
        return row.data.scanId;
      },
      Cell: (e) => (
        <>
          <Button
            size='small'
            variant='contained'
            sx={{
              padding: 0.6,
              height: '1.8rem',
              minWidth: '3rem',
              textTransform: 'none',
              backgroundColor: '#0d47a1',
            }}
            onClick={() => {
              // console.log('e value', e.value);
              addImageAsError(e.value);
            }}
          >
            Mark
          </Button>
        </>
      ),
      style: {
        fontSize: '13px',
        minWidth: 100,
        lineHeight: 1.5,
      },
    },
    {
      Header: 'Comments',
      id: 'comments',
      accessor: (row) => row.data.warningMessage,
      Cell: (e) => (
        <>
          {/* {console.log('row values', e.cell)} */}
          {/* {e.cell.value === '' && <DoneOutlinedIcon sx={{color: '#0000f6d4', paddingTop: '0'}}/>} */}
          {e.cell.value && (
            <ReportGmailerrorredOutlined
              sx={{ paddingTop: '0', marginTop: '4px', color: '#e7b10ffd' }}
            />
          )}
          <p style={{ margin: '6px', marginTop: 0, color: '#fbbc000' }}>
            {e.cell.value}
          </p>
        </>
      ),
      style: {
        fontSize: '13px',
        minWidth: 90,
        lineHeight: 1.4,
        // color: '#0000004e'
      },
    },
  ];
};

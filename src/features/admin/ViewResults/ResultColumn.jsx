/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
import { Link } from '@mui/material';
import React from 'react';

export const ResultColumn = () => {
  return [
    {
      Header: 'ID',
      accessor: (row) => row.stu_number,
      collapse: true,
      style: {
        minWidth: 40,
        lineHeight: '25px',
      },
    },
    {
      Header: 'Name',
      accessor: (row) => row.stu_name,
      SelectBox: true,
      Cell: (e) => (
        <>
          <div style={{ width: '100%', height: '35px', position: 'relative' }}>
            <img
              alt='Student Name'
              src={e.cell.value}
              style={{ height: '35px' }}
            />
          </div>
        </>
      ),
      collapse: false,
      style: {
        minWidth: '180px',
      },
    },
    {
      Header: 'Correct',
      accessor: (row) => row.count_correct,
      collapse: true,
      style: {
        color: 'green',
        minWidth: 80,
      },
    },
    {
      Header: 'Incorrect',
      accessor: (row) => row.count_incorrect,
      collapse: true,
      style: {
        color: 'red',
        minWidth: 90,
      },
    },
    {
      Header: 'Blank',
      accessor: (row) => row.count_blank,
      collapse: true,
      style: {
        minWidth: 90,
      },
    },
    // {
    //   Header: 'User Name',
    //   accessor: row => row.userName,
    //   collapse: true,
    //   style: {
    //     fontSize: '13px',
    //     lineHeight: '20px',
    //     minWidth: 90
    //   }
    // },
    {
      Header: 'Result',
      accessor: (row) => row.output_img,
      Cell: (e) => (
        <>
          {e.value.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {/* {console.log('e value', item)} */}
                <Link href={item} target='_blank' rel='noreferrer'>
                  Result {index + 1}
                </Link>
                <br />
              </React.Fragment>
            );
          })}
        </>
      ),
      style: {
        fontSize: '13px',
        minWidth: 80,
        lineHeight: '20px',
      },
    },
    {
      Header: 'Test IDs',
      accessor: (row) =>
        row.test_id.map((item, id) => (
          <React.Fragment key={id}>
            {item}
            <br />
          </React.Fragment>
        )),
      collapse: true,
      style: {
        // color: 'green',
        fontSize: '13.5px',
        lineHeight: '15px',
        minWidth: 120,
      },
    },
  ];
};

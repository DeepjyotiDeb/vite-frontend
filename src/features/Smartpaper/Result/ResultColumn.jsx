/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
import { Link } from '@mui/material';
import React from 'react';

export const ResultColumn = () => {
  return [
    {
      Header: 'ID',
      SelectBox: true, // only needs to be used once to make whole row selectable
      accessor: (row) => row.stuNumber,
      collapse: true,
      style: {
        minWidth: 40,
        lineHeight: '25px',
      },
    },
    {
      Header: 'Name',
      accessor: (row) => row.stuName[0],
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
      accessor: (row) => row.countCorrect,
      collapse: true,
      style: {
        color: 'green',
        minWidth: 80,
      },
    },
    {
      Header: 'Incorrect',
      accessor: (row) => row.countIncorrect,
      collapse: true,
      style: {
        color: 'red',
        minWidth: 90,
      },
    },
    {
      Header: 'Blank',
      accessor: (row) => row.countBlank,
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
      accessor: (row) => row.outputImg,
      Cell: (e) => {
        try {
          return (
            <>
              {/* <Link href={row.output_img} target='_blank' rel='noreferrer'> */}
              {/* <a href={e.cell.value} target='_blank' rel='noreferrer'>
                    Result {e.cell.row.index+1}
                  </a>
                  <br /> */}
              {e.value.map((item, index) => (
                <React.Fragment key={index}>
                  <Link href={item} target='_blank' rel='noreferrer'>
                    Result {index + 1}
                  </Link>
                  <br />
                </React.Fragment>
              ))}
            </>
          );
        } catch (error) {
          console.log('error', error);
        }
      },
      style: {
        fontSize: '13px',
        minWidth: 80,
        lineHeight: '20px',
      },
    },
    {
      Header: 'Test Name',
      accessor: (row) => row.targetNames,
      Cell: (e) => {
        try {
          return <p>{e.cell.value.join(', ')}</p>;
        } catch (error) {
          console.log(error);
        }
      },
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

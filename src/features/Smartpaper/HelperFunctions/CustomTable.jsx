import { forwardRef, useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useRowSelect, useSortBy, useTable } from 'react-table';

import TableStyles from '../../../styles/smartpaperStyles/TableStyles';

//* for checkboxes
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type='checkbox' ref={resolvedRef} {...rest} />
    </>
  );
});
const defaultPropGetter = () => ({});
export const Table = ({
  columns,
  data,
  deleteData,
  getHeaderProps = defaultPropGetter,
  getColumnprops = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  // updateRollNo,
  updateMyData,
  hideColumn,
}) => {
  // const [dataRows, setData] = useState(data);

  // useEffect(() => {
  //   // console.log({ data, columns });
  //   dataRows.forEach((item) => {
  //     if ('data' in item) {
  //       if (item.data.studentInfo?.length === 0) {
  //         setHiddenColumns('Name');
  //       } else setHiddenColumns('');
  //     }
  //   });
  // }, [dataRows[0].data, hideColumn]);

  // const updateMyData = (rowIndex, columnId, value) => {
  //   setData((old) =>
  //     old.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...old[rowIndex],
  //           [columnId]: value,
  //         };
  //       }
  //       return row;
  //     })
  //   );
  // };

  //* making cells editable - updateRollNo was incorrectly labelled
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id, editable },
    updateMyData,
  }) => {
    const [value, setValue] = useState(initialValue);
    // const [iconState, setIconState] = useState(false);

    useEffect(() => {
      setValue(initialValue);
      // if (initialValue === '') {
      //   setIconState(true);
      // }
    }, [initialValue]);
    // console.log('value',  initialValue,id);

    const onChange = (e) => {
      // e.preventDefault();
      setValue(e.target.value);
      // updateMyData(index, id, e.target.value);
      // updateRollNo(index, e.target.value);
      // updateRollNo(e.target.value, index);
    };
    const onBlur = () => {
      updateMyData(index, id, value);
      // updateRollNo(index, value);
      // setIconState(true);
    };

    // const settingIconState = () => {
    //   setIconState(false);
    //   setTimeout(() => {
    //     focusField.current.focus();
    //   });
    // };

    // const onFocus = () => {
    //   setIconState(false);
    // };
    // Check to make sure not all columns are editable
    if (editable === true) {
      // console.log('id', iconState, value);
      return (
        <>
          {/* {iconState === true && (
            <EditIcon onClick={(e) => settingIconState(e)} />
          )} */}
          {/* {iconState === false && ( */}
          <input
            type='text'
            value={value}
            // onFocus={resetInput} //MUST fix: other components inside table
            onChange={onChange} //remain unusable until click elsewhere
            onBlur={onBlur}
            style={{
              fontSize: '1.1rem',
              padding: 0,
              margin: 0,
              border: 0,
              width: '2.5rem',
              textAlign: 'center',
            }}
          />
          {/* )} */}
        </>
      );
    }
    return value;
  };

  const defaultColumn = {
    Cell: EditableCell,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    // allColumns,
    // state: { selectedRowIds },
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData,
      initialState: {
        // pageIndex: 0,
        hiddenColumns: '', //* probaly used to set hidden columns on first instantiation
        //use property option, in columns define id name "id
      },
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      // console.log('new', hiddenColumns);
      //* making checkboxes
      if (columns.some((item) => item.SelectBox === true)) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection1',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                {/* {console.log('get all', getToggleAllRowsSelectedProps)} */}
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    }
  );
  useEffect(() => {
    // console.log('hide', hideColumn);
    // if (hideColumn.length === 0) setHiddenColumns([]);
    if (!hideColumn) return;
    if (hideColumn.length > 0) setHiddenColumns(hideColumn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideColumn]);

  useEffect(() => {
    try {
      deleteData(selectedFlatRows);
    } catch (error) {
      // console.log('null');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlatRows]);
  return (
    <TableStyles>
      <div className='tableWrap'>
        <table {...getTableProps}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps([
                      column.getSortByToggleProps(),
                      {
                        className: column.className,
                        style: column.style,
                      },
                      getColumnprops(column),
                      getHeaderProps(column),
                    ])}
                  >
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps(getRowProps(row))}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            className: cell.column.className,
                            style: cell.column.style,
                          },
                          getColumnprops(cell.column),
                          getCellProps(cell),
                        ])}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TableStyles>
  );
};

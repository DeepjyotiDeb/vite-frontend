import styled from 'styled-components';

const TableStyles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;
  margin-bottom: 10px;
  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    max-height: 75vh;
    overflow-x: scroll;
    overflow-y: scroll;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    border-radius: 8px;
    tr {
      height: 60px;
      padding: 0;

      :last-child {
        td {
          border-bottom: 0;
          /* height: 65px; */
        }
      }
    }

    th {
      margin: 0;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 0;
      padding-bottom: 0;
      background-color: #20469b;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      height: 10px;
      text-align: center;
      position: sticky;
      position: -webkit-sticky; /* safari */
      top: 0;
      z-index: 1;
      :last-child {
        border-right: 0;
      }
    }

    td {
      margin: 0;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 0;
      padding-bottom: 0;
      max-height: 40px;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align: center;
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;
export default TableStyles;

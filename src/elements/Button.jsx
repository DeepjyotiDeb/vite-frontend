import styled from 'styled-components';

const Btn = styled.button`
  padding: 10px 20px;
  margin-bottom: 10px;
  font-size: 1rem;
  position: relative;
  user-select: none;
  color: #fff;
  background-color: #013086;
  border: 0;
  border-radius: 5px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  transition: all 200ms ease-in-out;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    box-shadow: 0px 5px 8px -3px rgba(0, 0, 0, 0.3);
  }
  &:focus {
    outline: none;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;

export default Btn;

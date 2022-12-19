import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import styled from 'styled-components';

const CustomAccordion = styled(props => (
  <Accordion disableGutters elevation={0} square {...props} />
))(() => ({
  margin: '0',
  padding: '0',
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const CustomAccordionSummary = styled(props => (
  <MuiAccordionSummary {...props} />
))(() => ({
  border: 'rgb(0,0,0)',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
    border: 'rgb(0,0,0)'
  }
}));
const CustomAccordionDetails = styled(AccordionDetails)(() => ({
  padding: 0
}));

export { CustomAccordion, CustomAccordionDetails, CustomAccordionSummary };

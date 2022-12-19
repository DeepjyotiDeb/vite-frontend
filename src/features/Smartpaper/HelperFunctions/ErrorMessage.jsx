import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
const ErrorMessage = ({ error }) => {
  const [open, setOpen] = useState(true);
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <Alert variant="outlined" key={i} severity="error">
        <AlertTitle>Error!</AlertTitle>
        <p data-test="graphql-error">
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </Alert>
    ));
  }
  return (
    <Box sx={{ mb: 0, mt: 2 }}>
      <Collapse in={open}>
        <Alert
          variant="outlined"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Error!</AlertTitle>
          <p
            data-test="graphql-error"
            style={{
              fontSize: '12px',
              margin: '0',
              fontWeight: '400'
            }}
          >
            {error.message.replace('GraphQL error: ', '')}
          </p>
        </Alert>
      </Collapse>
    </Box>
  );
};

ErrorMessage.defaultProps = {
  error: {}
};

ErrorMessage.propTypes = {
  error: PropTypes.object
};

export default ErrorMessage;

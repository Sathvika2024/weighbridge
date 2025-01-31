import PropTypes from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import { forwardRef } from 'react';
// material
import { Box } from '@mui/material';
import AlertDialog from './AlertDialog';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', ...other }, ref) => (
  <Box ref={ref} {...other}>
    <HelmetProvider>
      <title>{title}</title>
    </HelmetProvider>
    {children}

  
  </Box>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;

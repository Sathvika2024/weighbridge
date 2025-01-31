import React, { useState } from 'react';
import { Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/customContextProviders/AuthContext';
import Logo from '../components/Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logoutSession } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Stack 
      position="sticky" 
      sx={{ color: 'black', backgroundColor: 'transparent' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Sidebar Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', direction: 'row' }}>
        <Logo sx={{ width: '30px', pr:2 }} />

        <Typography
            sx={{
              cursor: 'pointer',
              fontFamily: "'Digital-7 Mono', sans-serif",
              fontSize: 25,
              fontWeight: 700,
            }}
            onClick={() => handleNavigate('/')}
          >
            WEIGHBRIDGE
          </Typography>
        </Box>
      

        {/* Logout Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            variant="text"
            size="large"
            sx={{ fontSize: '16px' }}
            onClick={()=>{
              logoutSession();
            }}
          >
            LOGOUT
          </Button>
        </Box>

      </Toolbar>
    </Stack>
  );
};

export default Navbar;

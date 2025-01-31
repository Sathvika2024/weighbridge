import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
// components
import Page from '../components/Page';
import { LoginForm } from '../components/Login'

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  },
  height: '100%',  // Ensure it fills the height of the viewport
  overflow: 'hidden'  // Prevent any unwanted scrolling
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
  minHeight: 'calc(100vh - 250px)', // Adjust based on your header/footer height
  overflow: 'hidden' // Prevent any content overflow
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login">
      <Container maxWidth="false">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography gutterBottom sx={{lineHeight:1, fontSize:'22px', fontWeight:600, fontFamily: "'Digital-7 Mono', sans-serif"}}>
              Sign in to your account
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

import * as Yup from 'yup';
import { useState,forwardRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent,
  Button,
  Slide


} from '@mui/material';
import { LoadingButton } from '@mui/lab';


import { useAuth } from '../customContextProviders/AuthContext';
import { AdminLogin } from '../../network/User';
import AlertDialog from '../AlertDialog';
import { parseValidationErrorMessage } from '../../utils/Utilities'
/* eslint-disable */
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {authenticateSession}=useAuth()




  const [errorData, setErrorData] = useState({
    visible: false,
    message: "",
    title:""
  })

  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [alertDialogMetas, setAlertDialogMetas] = useState({
    message: "",
    title: "",
    btnLabel: "",

  });

  const LoginSchema = Yup.object().shape({
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      doLogin(formik.values.email, formik.values.password);
    }
  });

  const handleAlertDialogClose = () => {
    setErrorData({ ...errorData, visible: false, message: "" })
  }

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  function doLogin(email, password) {

    AdminLogin(email,password).then((res)=>{
      formik.setSubmitting(false)
      authenticateSession(res?.data)
      navigate('/dashboard', { replace: true });
    }).catch((error)=>{
      formik.setSubmitting(false)
      setAlertDialogMetas({ ...alertDialogMetas, message: parseValidationErrorMessage(error), title: "Failed to process your request", btnLabel: "OK" });
      setOpenAlertDialog(true)
     
    })
  }


  return (
    <div>
      <FormikProvider value={formik}>
        <Form autoComplete="off"  noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              type="email"
              autoComplete="username"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ mt: 3, backgroundColor:'#171d40',
              '&:hover': {
            backgroundColor: '#007b55', // Keep the same color on hover
            },
             }}>
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>

      <Dialog
        open={errorData?.visible}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleAlertDialogClose()}
        aria-describedby="iot_res_alert-dialog-slide-description"
      >
        <DialogTitle>{errorData?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="aiot_res_alert-dialog-slide-description">
            {errorData?.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={() => handleAlertDialogClose()}>OK</Button>
        </DialogActions>
      </Dialog>

      <AlertDialog openAlertDialog={openAlertDialog} message={alertDialogMetas?.message} title={alertDialogMetas?.title}
        btnLabel={alertDialogMetas?.btnLabel} handleClose={() => setOpenAlertDialog(false)} />
    </div>
  );
}

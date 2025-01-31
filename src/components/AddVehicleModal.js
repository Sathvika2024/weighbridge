

import React, { useState } from "react";
import { makeStyles } from '@mui/styles'
import { Link as RouterLink, useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';
import {
  Dialog, DialogTitle, DialogContent,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Box,

} from '@mui/material';

// components
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Page from '../components/Page';
import AlertDialog from "../components/AlertDialog";
import { addVehicle } from "../network/weighBridge";
import { useAuth } from "./customContextProviders/AuthContext";


const useStyles = makeStyles({
  cardStyle: {
    background: '#D9D9D9',
    borderRadius: '15px',
    padding: '10px',
    margin: 5
  },
  cardTitle: {
    color: '#000',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
  }
})

const ColorButton = styled(Button)(({ _theme }) => ({
  color: 'black',
  backgroundColor: 'white',
  '&:hover': {
    // backgroundColor: purple[700],
    color: 'white'
  },
}));

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  // paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));


const UserSchema = Yup.object().shape({
  userName: Yup.string()
    .required('Required'),
    passCode: Yup.string()
    .required('Required'),
  organization: Yup.string()
    .required('Required'),
    deviceFirmware: Yup.string()
    .required('Required'),
});

const ProcuredDevicesSchema = Yup.object().shape({
  deviceLotNumber: Yup.string()
    .required('Required'),
  deviceId: Yup.string()
    .required('Required'),
  organization: Yup.string()
    .required('Required'),
   
});


export default function AddVehicleModal({ open, onClose }) {

  const navigate=useNavigate();
  const location=useLocation()

  const {sessionUserData}=useAuth()

  const [openAlertDialog, setOpenAlertDialog] = useState(false)
  const [alertDialogMetas, setAlertDialogMetas] = useState({
    message: "",
    title: "",
    btnLabel: "",
  });

  const [scannedDeviceId,setScannedDeviceId]=useState("")
  const [isOrganizationListLoading, setIsOrganizationListLoading] = useState(false)
  const [organizationList, setOrganizationList] = useState([]);


  const [fileName, setFileName] = useState("");


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setFileName(file.name);
      const fileURL = URL.createObjectURL(file);
      addUserFormik.setFieldValue("driverImage", fileURL); // Store file URL
    }
  };
  
  const addUserFormik = useFormik({
    initialValues: {
      numberPlate: "",
      type: "Truck",
      driverName: "",
      driverImage: "",
      driverLicenseNumber: "",
    },
    validationSchema: "", // Add validation schema here
    onSubmit: (values) => {
      addVehicle(sessionUserData?.user?.organizationId, values?.numberPlate, values?.type, values?.driverName, values?.driverImage, values?.driverLicenseNumber)
      .then((_res)=>{
        setAlertDialogMetas({ ...alertDialogMetas, message:'Added Vehicle', title: 'Success', btnLabel: "OK" });
        setOpenAlertDialog(true)
        resetForm();
      }).catch((err)=>{
        setAlertDialogMetas({ ...alertDialogMetas, message: err, title: 'Failed to Add the vehicle', btnLabel: "OK" });
        setOpenAlertDialog(true)
        resetForm()
      })
    },
  });
  const { errors, touched, values, isSubmitting, resetForm, handleSubmit, getFieldProps, setFieldValue } =  addUserFormik;


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Add Vehicle</DialogTitle>
    <DialogContent>
    
            <Box sx={{ width: '95%' , textAlign: 'center' }}>      
            <FormikProvider  enableReinitialize="true" value={addUserFormik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>        
              <Stack spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth >
                <TextField
                    label="Number Plate*"
                    name="numberPlate"
                    value={addUserFormik.values.numberPlate}
                    onChange={addUserFormik.handleChange}
                    error={addUserFormik.touched.numberPlate && Boolean(addUserFormik.errors.numberPlate)}
                    helperText={addUserFormik.touched.numberPlate && addUserFormik.errors.numberPlate}
                />
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth >
                <InputLabel id="device-org-select-label">Type* </InputLabel>
                <Select
                  fullWidth
                  sx={{textAlign:'left'}}                  
                  name="type"
                  label="Type*"
                  labelId="device-org-select-label"
                  id="device-org-select"
                  value={addUserFormik.values.type}
                  onChange={addUserFormik.handleChange}
                  error={addUserFormik.touched.type && Boolean(addUserFormik.errors.type)}
                >
                  <MenuItem value="Truck">Truck</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>

                </Select>
                </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth >

                <TextField
                  fullWidth
                  label="Driver Name*"
                  name="driverName"
                  value={addUserFormik.values.driverName}
                  onChange={addUserFormik.handleChange}
                  error={addUserFormik.touched.driverName && Boolean(addUserFormik.errors.driverName)}
                  helperText={addUserFormik.touched.driverName && addUserFormik.errors.driverName}
                />
                </FormControl>  
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth >

                <TextField
                  fullWidth
                  label="Driver License Number*"
                  name="driverLicenseNumber"
                  value={addUserFormik.values.driverLicenseNumber}
                  onChange={addUserFormik.handleChange}
                  error={addUserFormik.touched.driverLicenseNumber && Boolean(addUserFormik.errors.driverLicenseNumber)}
                  helperText={addUserFormik.touched.driverLicenseNumber && addUserFormik.errors.driverLicenseNumber}
                />
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth >

                <TextField
                  fullWidth
                  label="Driver Image Link"
                  name="driverImage"
                  value={addUserFormik.values.driverImage}
                  onChange={addUserFormik.handleChange}
                  error={addUserFormik.touched.driverImage && Boolean(addUserFormik.errors.driverImage)}
                  helperText={addUserFormik.touched.driverImage && addUserFormik.errors.driverImage}
                />
                </FormControl>
                </Grid>
               
            
            <Grid item xs={6} sm={6} sx={{justifyContent:'flex-end'}}>
              <Button type="submit" variant="contained"  sx={{backgroundColor: '#171d40', borderRadius: '20px'}}>
                Submit
              </Button>
            </Grid>
          
        </Stack>
      </Form>
      </FormikProvider>
            </Box>
</DialogContent>
<AlertDialog openAlertDialog={openAlertDialog} message={alertDialogMetas?.message} title={alertDialogMetas?.title}
                  btnLabel={alertDialogMetas?.btnLabel} handleClose={() => setOpenAlertDialog(false)} />
</Dialog>
         
  )
}
  
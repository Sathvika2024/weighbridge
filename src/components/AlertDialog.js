import { Icon } from '@iconify/react';
import { useRef, forwardRef, useState } from 'react';


// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Slide,
  Box,
  Typography
} from '@mui/material';
import { Key } from '@mui/icons-material';



/* eslint-disable */
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/* eslint-enable */



export default function AlertDialog({ openAlertDialog, message, title, btnLabel, handleClose }) {



  

  return (
    <>
      <Dialog
        open={openAlertDialog}
        sx={{ zIndex: 10000000 }}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">

            {(() => {
              if (Array.isArray(message)) {
                return <>
                  {
                    message.map((merchant,index) => (
                      <Box sx={{p:2}}>
                        <Typography sx={{fontWeight:700,color:"rgba(195, 10, 10, 1)"}}>{merchant}</Typography>
                      </Box>
                    ))}
                </>
              } if (typeof message === 'object' && message !== null && message!==undefined){
                const objectKeys = Object.keys(message);
                return <>
                  {
                     objectKeys?.map((key) => (
                      <Box sx={{p:2}}>
                        <Typography sx={{fontWeight:700,color:"rgba(195, 10, 10, 1)"}}>{key} : {message[key]}</Typography>
                      </Box>
                    ))}
                </>
              }
              return <Typography>{message}</Typography>
            })()}


          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

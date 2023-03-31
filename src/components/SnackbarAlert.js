import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MUIAlert from '@mui/material/Alert';
import { useAlertContext } from 'src/context/alert-context';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarAlert() {
    const { alertMessage, isError, alertOpen, setAlertOpen } =
        useAlertContext();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    return (
        <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={isError ? 'error' : 'success'}
                sx={{ width: '100%' }}
            >
                {alertMessage}
            </Alert>
        </Snackbar>
    );
}

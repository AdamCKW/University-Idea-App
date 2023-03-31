import React, { useEffect, useState } from 'react';
import { Box, Modal, Button, Typography } from '@mui/material';

import axios from 'axios';
import { useAlertContext } from '@/context/alert-context';
import { useSWRConfig } from 'swr';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function DeleteClosureModal({
    closure,
    showDeleteClosure,
    setShowDeleteClosure,
}) {
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();
    const { _id } = closure;
    const { mutate } = useSWRConfig();

    const handleClose = () => {
        setShowDeleteClosure(false);
    };

    const handleConfirm = async () => {
        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.delete(`/api/closure/${_id}`, options);
            mutate('/api/closure');
            setAlertMessage('Closure Dates Deleted Successfully');
            setIsError(false);
            setAlertOpen(true);
            setShowDeleteClosure(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
            setShowDeleteClosure(false);
        }
    };

    return (
        <>
            <Modal
                open={showDeleteClosure}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Delete Closure Dates?
                    </Typography>
                    <br />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete the closure dates?
                    </Typography>
                    <br />
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirm
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

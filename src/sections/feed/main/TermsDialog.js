import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { usePostContext } from 'src/context/post-context';
import { useAlertContext } from 'src/context/alert-context';
import TermsText from './TermsText';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    LinearProgress,
    Box,
} from '@mui/material';

export default function TermsDialog({
    values,
    dialog,
    setDialog,
    uploadProps,
    setShowAddPost,
}) {
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();
    const { feedUrl } = usePostContext();
    const { mutate } = useSWRConfig();
    const [progress, setProgress] = useState(0);

    const handleClose = () => {
        setDialog(false);
    };

    const handleAgree = async () => {
        const { setImageFiles, setDocFiles } = uploadProps;

        const options = {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setProgress(percentCompleted);
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        try {
            await axios.post('/api/post', values, options);

            setAlertMessage('Post Added Successfully');
            setIsError(false);
            setAlertOpen(true);
            setProgress(0);
            setImageFiles([]);
            setDocFiles([]);
            mutate(feedUrl);
            setShowAddPost(false);
            setDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
            setDialog(false);
        }
    };

    const descriptionElementRef = React.useRef(null);

    useEffect(() => {
        if (dialog) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialog]);

    return (
        <>
            <Dialog
                open={dialog}
                onClose={handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Terms and Condition
                </DialogTitle>

                <DialogContent dividers={true}>
                    <div
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <TermsText />
                    </div>
                </DialogContent>

                {progress > 0 && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                        />
                    </Box>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAgree}>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

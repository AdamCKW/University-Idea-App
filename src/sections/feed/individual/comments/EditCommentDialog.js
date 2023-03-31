import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CssBaseline,
    MenuItem,
    Checkbox,
    Grid,
    Box,
    FormGroup,
    FormControlLabel,
    createTheme,
    ThemeProvider,
} from '@mui/material';

import { useFormik } from 'formik';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { useAlertContext } from '@/context/alert-context';

export default function EditDialog({
    dialog,
    setDialog,
    userId,
    comment,
    postId,
}) {
    const handleClose = () => {
        setDialog(false);
    };

    return (
        <>
            <Dialog open={dialog} onClose={handleClose}>
                <DialogTitle>Edit Dialog</DialogTitle>

                <Form
                    userId={userId}
                    comment={comment}
                    setDialog={setDialog}
                    dialog={dialog}
                    postId={postId}
                />
            </Dialog>
        </>
    );
}

function Form({ userId, comment, setDialog, dialog, postId }) {
    const { mutate } = useSWRConfig();
    const { _id, isAuthHidden, author } = comment;
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();

    const formik = useFormik({
        initialValues: {
            userId: userId || '',
            comment: comment.comment || '',
            isAuthHidden: isAuthHidden || false,
        },
        //validate: update_post_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${process.env.NEXT_PUBLIC_API_SECRET}`,
            },
        };
        try {
            const response = await axios.put(
                `/api/comments/${_id}`,
                values,
                options
            );

            mutate(`/api/posts/${postId}`);

            setAlertMessage('Comment updated successfully');
            setIsError(false);
            setAlertOpen(true);
            setDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
            setDialog(false);
        }
    }

    const handleClose = () => {
        setDialog(false);
    };

    return (
        <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ padding: 2 }}
        >
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="comment"
                            label="Comment"
                            name="title"
                            {...formik.getFieldProps('comment')}
                            error={
                                formik.touched.comment &&
                                Boolean(formik.errors.comment)
                            }
                            helperText={formik.errors.comment}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isAuthHidden"
                                        onChange={formik.handleChange}
                                    />
                                }
                                label="Comment as Anonymous"
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Update</Button>
            </DialogActions>
        </Box>
    );
}

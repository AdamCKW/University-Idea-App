import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CssBaseline from '@mui/material/CssBaseline';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import { update_post_validate } from '@/utils/validate';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { useAlertContext } from '@/context/alert-context';

export default function EditDialog({ dialog, setDialog, userId, post }) {
    const handleClose = () => {
        setDialog(false);
    };

    return (
        <>
            <Dialog open={dialog} onClose={handleClose}>
                <DialogTitle>Edit Post</DialogTitle>

                <Form
                    userId={userId}
                    post={post}
                    setDialog={setDialog}
                    dialog={dialog}
                />
            </Dialog>
        </>
    );
}

function Form({ userId, post, setDialog, dialog }) {
    const { mutate } = useSWRConfig();
    const { _id, title, category, desc, isAuthHidden, author } = post;
    const { setAlertOpen, setAlertMessage, setIsError } = useAlertContext();
    const formik = useFormik({
        initialValues: {
            userId: userId || '',
            title: title || '',
            desc: desc || '',
            isAuthHidden: isAuthHidden || false,
        },
        validate: update_post_validate,
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
                `/api/posts/${_id}`,
                values,
                options
            );
            mutate(`/api/posts/${_id}`);
            setAlertMessage('Post updated successfully!');
            setIsError(false);
            setAlertOpen(true);
            setDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
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
                    {/* Post Title */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="title"
                            label="Post Title"
                            name="title"
                            {...formik.getFieldProps('title')}
                            error={
                                formik.touched.title &&
                                Boolean(formik.errors.title)
                            }
                            helperText={formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            fullWidth
                            id="outlined-disabled"
                            label="Category Selected"
                            name="category"
                            defaultValue={category.name}
                        />
                    </Grid>

                    {/* Post Description */}
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="desc"
                            label="Description"
                            fullWidth
                            multiline
                            maxRows={4}
                            {...formik.getFieldProps('desc')}
                            error={
                                formik.touched.desc &&
                                Boolean(formik.errors.desc)
                            }
                            helperText={formik.errors.desc}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isAuthHidden"
                                        onChange={formik.handleChange}
                                        checked={formik.values.isAuthHidden}
                                    />
                                }
                                label="Post As Anonymous"
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

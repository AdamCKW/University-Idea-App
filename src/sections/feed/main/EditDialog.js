import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { update_post_validate } from '@/utils/validate';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { usePostContext } from '@/context/post-context';
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
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();
    const { mutate } = useSWRConfig();
    const { id, title, category, desc, isAuthHidden, author } = post;
    const { feedUrl } = usePostContext();

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
            await axios.put(`/api/posts/${id}`, values, options);
            mutate(feedUrl);
            setAlertMessage('Post Updated Successfully');
            setIsError(false);
            setAlertOpen(true);
            setDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(false);
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
                            inputProps={{ maxLength: 50 }}
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
                            inputProps={{ maxLength: 1000 }}
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

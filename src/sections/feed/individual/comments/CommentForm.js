import React, { useState, useEffect } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    MenuItem,
    Checkbox,
    Grid,
    Box,
    Typography,
    Container,
    Card,
    CardActions,
    CardContent,
    FormGroup,
    FormControlLabel,
    useTheme,
    ThemeProvider,
} from '@mui/material';

import { useFormik, resetForm } from 'formik';
import { comment_validate } from '@/utils/validate';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';
import { useAlertContext } from '@/context/alert-context';

export default function AddComment({ userId, setShowForm, postId }) {
    const theme = useTheme();
    const { mutate } = useSWRConfig();
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();

    const formik = useFormik({
        initialValues: {
            author: userId || '',
            comment: '',
            isAuthHidden: false,
        },
        validate: comment_validate,
        onSubmit,
    });

    async function onSubmit(values, { resetForm }) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.post(
                `/api/posts/${postId}/comment`,
                values,
                options
            );
            mutate(`/api/posts/${postId}`);
            setAlertMessage('Comment added successfully');
            setIsError(false);
            setAlertOpen(true);
            setShowForm(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        }
        resetForm();
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Card>
                    <Box
                        sx={{
                            //marginTop: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="form"
                            noValidate
                            onSubmit={formik.handleSubmit}
                            sx={{ padding: 2 }}
                        >
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
                                        inputProps={{ maxLength: 200 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="isAuthHidden"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                />
                                            }
                                            label="Comment as Anonymous"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Comment
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </ThemeProvider>
        </>
    );
}

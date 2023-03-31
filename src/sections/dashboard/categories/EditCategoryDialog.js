import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Modal,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Box,
} from '@mui/material';
import { useFormik } from 'formik';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { useAlertContext } from '@/context/alert-context';
import { add_category_validate } from '@/utils/validate';

export default function UpdateCategory({
    category,
    editDialog,
    setEditDialog,
}) {
    const { _id, name } = category;
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();

    const { mutate } = useSWRConfig();
    const formik = useFormik({
        initialValues: {
            name: name || '',
        },
        validate: add_category_validate,
        onSubmit,
    });

    const handleClose = () => {
        setEditDialog(false);
    };

    async function onSubmit(values) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.put(`/api/categories/${_id}`, values, options);

            mutate('/api/categories');
            setAlertMessage('Category Updated Successfully');
            setIsError(false);
            setAlertOpen(true);
            setEditDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
            setEditDialog(false);
        }
    }

    return (
        <>
            <Dialog open={editDialog} onClose={handleClose}>
                <DialogTitle>Edit Category</DialogTitle>
                <Box
                    component="form"
                    noValidate
                    onSubmit={formik.handleSubmit}
                    sx={{ padding: 2, width: 400 }}
                >
                    <DialogContent>
                        <Grid container spacing={3}>
                            {/* Category Name */}
                            <Grid item xs={12} md={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Category Name"
                                    name="name"
                                    {...formik.getFieldProps('name')}
                                    error={
                                        formik.touched.name &&
                                        formik.errors.name
                                    }
                                    helperText={formik.errors.name}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

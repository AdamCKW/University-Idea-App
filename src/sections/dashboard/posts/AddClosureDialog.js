import React, { useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { useFormik } from 'formik';
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
import { closure_validate } from '@/utils/validate';
import { useAlertContext } from '@/context/alert-context';
import { getSession, useSession } from 'next-auth/react';

import axios from 'axios';

export default function AddClosure({ showAddClosure, setShowAddClosure }) {
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();
    const { mutate } = useSWRConfig();
    const { data: session } = useSession();

    const formik = useFormik({
        initialValues: {
            startDate: '',
            initialClosureDate: '',
            finalClosureDate: '',
        },
        validate: closure_validate,
        onSubmit,
    });

    const handleClose = () => {
        setShowAddClosure(false);
    };

    async function onSubmit(values) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.post('/api/closure', values, options);

            mutate('/api/closure');
            setAlertMessage('Closure Dates Added Successfully');
            setIsError(false);
            setAlertOpen(true);
            setShowAddClosure(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        }
    }

    return (
        <>
            <Dialog open={showAddClosure} onClose={handleClose}>
                <DialogTitle>Add Closure</DialogTitle>

                <Box
                    component="form"
                    noValidate
                    onSubmit={formik.handleSubmit}
                    sx={{ padding: 2 }}
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="startDate"
                                    label="Start Date"
                                    type="date"
                                    id="startDate"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formik.getFieldProps('startDate')}
                                    error={
                                        formik.touched.startDate &&
                                        Boolean(formik.errors.startDate)
                                    }
                                    helperText={formik.errors.startDate}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="initialClosureDate"
                                    label="Initial Closure Date"
                                    type="date"
                                    id="initialClosureDate"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formik.getFieldProps(
                                        'initialClosureDate'
                                    )}
                                    error={
                                        formik.touched.initialClosureDate &&
                                        Boolean(
                                            formik.errors.initialClosureDate
                                        )
                                    }
                                    helperText={
                                        formik.errors.initialClosureDate
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="finalClosureDate"
                                    label="Final Closure Date"
                                    type="date"
                                    id="finalClosureDate"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formik.getFieldProps(
                                        'finalClosureDate'
                                    )}
                                    error={
                                        formik.touched.finalClosureDate &&
                                        Boolean(formik.errors.finalClosureDate)
                                    }
                                    helperText={formik.errors.finalClosureDate}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    if (session.user.role !== 'admin') {
        return {
            props: {
                error: 'You do not have permission to access this page',
            },
        };
    }

    return {
        props: { session },
    };
}

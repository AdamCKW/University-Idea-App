import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    useTheme,
    ThemeProvider,
    MenuItem,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { useFormik } from 'formik';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { register_validate } from '@/utils/validate';
import { useAlertContext } from '@/context/alert-context';

export default function AddUser({ setShowAddUser }) {
    const theme = useTheme();
    const { mutate } = useSWRConfig();
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: '',
            dateOfBirth: '',
            department: '',
        },
        validate: register_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        const trimmedValues = Object.entries(values).reduce(
            (acc, [key, value]) => {
                acc[key] = typeof value === 'string' ? value.trim() : value;
                return acc;
            },
            {}
        );

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.post('/api/auth/register', trimmedValues, options);
            mutate('/api/users');
            setAlertMessage('User Added Successfully');
            setIsError(false);
            setAlertOpen(true);
            setShowAddUser(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Card>
                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <CardHeader
                        // subheader="The information can be edited"
                        title="Add User"
                    />
                    <CardContent sx={{ pt: 0 }}>
                        <Box sx={{ m: -1.5 }}>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        {...formik.getFieldProps('name')}
                                        error={
                                            formik.touched.name &&
                                            Boolean(formik.errors.name)
                                        }
                                        helperText={formik.errors.name}
                                    />
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        {...formik.getFieldProps('email')}
                                        error={
                                            formik.touched.email &&
                                            Boolean(formik.errors.email)
                                        }
                                        helperText={formik.errors.email}
                                    />
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        {...formik.getFieldProps('password')}
                                        error={
                                            formik.touched.password &&
                                            Boolean(formik.errors.password)
                                        }
                                        helperText={formik.errors.password}
                                    />
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        type="date"
                                        id="dateOfBirth"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        {...formik.getFieldProps('dateOfBirth')}
                                        error={
                                            formik.touched.dateOfBirth &&
                                            Boolean(formik.errors.dateOfBirth)
                                        }
                                        helperText={formik.errors.dateOfBirth}
                                    />
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <TextField
                                        required
                                        name="role"
                                        label="Role"
                                        fullWidth
                                        id="role"
                                        select
                                        defaultValue=""
                                        {...formik.getFieldProps('role')}
                                        error={
                                            formik.touched.role &&
                                            Boolean(formik.errors.role)
                                        }
                                        helperText={formik.errors.role}
                                    >
                                        <MenuItem value="staff">Staff</MenuItem>
                                        <MenuItem value="qaCoordinator">
                                            QA Coordinator
                                        </MenuItem>
                                        <MenuItem value="qaManager">
                                            QA Manager
                                        </MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid xs={12} md={6}>
                                    <TextField
                                        required
                                        name="department"
                                        label="Department"
                                        fullWidth
                                        id="department"
                                        select
                                        defaultValue=""
                                        {...formik.getFieldProps('department')}
                                        error={
                                            formik.touched.department &&
                                            Boolean(formik.errors.department)
                                        }
                                        helperText={formik.errors.department}
                                    >
                                        <MenuItem value="Arts and Humanities">
                                            Arts and Humanities
                                        </MenuItem>
                                        <MenuItem value="Business and Economics">
                                            Business and Economics
                                        </MenuItem>
                                        <MenuItem value="Education">
                                            Education
                                        </MenuItem>
                                        <MenuItem value="Law">Law</MenuItem>
                                        <MenuItem value="Science and Engineering">
                                            Science and Engineering
                                        </MenuItem>
                                        <MenuItem value="Communication Studies">
                                            Communication Studies
                                        </MenuItem>
                                        <MenuItem value="Health and Human Services">
                                            Health and Human Services
                                        </MenuItem>
                                        <MenuItem value="Music">Music</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add User
                        </Button>
                    </CardActions>
                </Box>
            </Card>
        </ThemeProvider>
    );
}

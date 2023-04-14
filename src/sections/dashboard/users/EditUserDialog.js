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
import { update_user_validate } from '@/utils/validate';
import { useAlertContext } from '@/context/alert-context';
import { getSession, useSession, signOut } from 'next-auth/react';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UpdateUser({ user, editDialog, setEditDialog }) {
    const { data: session } = useSession();
    const { _id, name, email, dateOfBirth, department, role } = user;
    const [data, setData] = useState();
    const [openModal, setOpenModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            userId: session.user.id || '',
            name: name || '',
            email: email || '',
            password: '',
            role: role || '',
            dateOfBirth: formatDate(dateOfBirth) || '',
            department: department || '',
        },
        validate: update_user_validate,
        onSubmit,
    });

    const handleClose = () => {
        setEditDialog(false);
    };

    async function onSubmit(values) {
        const trimmedValues = Object.entries(values).reduce(
            (acc, [key, value]) => {
                acc[key] = typeof value === 'string' ? value.trim() : value;
                return acc;
            },
            {}
        );

        setData(trimmedValues);
        setOpenModal(true);
    }

    return (
        <>
            <Dialog open={editDialog} onClose={handleClose}>
                <ConfirmationModal
                    data={data}
                    _id={_id}
                    name={name}
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                    setEditDialog={setEditDialog}
                />
                <DialogTitle>Edit User</DialogTitle>

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

                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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

function ConfirmationModal({
    data,
    _id,
    name,
    openModal,
    setOpenModal,
    setEditDialog,
}) {
    const handleClose = () => setOpenModal(false);
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();

    const { mutate } = useSWRConfig();

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/users/${_id}`, data);

            mutate('/api/users');
            setAlertMessage('User updated successfully');
            setIsError(false);
            setAlertOpen(true);
            setOpenModal(false);
            setEditDialog(false);
        } catch (error) {
            setAlertMessage(error.response.data || 'Something went wrong');
            setIsError(true);
            setAlertOpen(true);
            setOpenModal(false);
        }
    };

    return (
        <>
            <Modal
                open={openModal}
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
                        Confirmation
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to update this user?
                    </Typography>
                    <p>{name}</p>
                    <Button onClick={handleUpdate}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </Box>
            </Modal>
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

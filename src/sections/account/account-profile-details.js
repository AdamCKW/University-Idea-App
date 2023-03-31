import { useCallback, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    MenuItem,
    Modal,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { useFormik } from 'formik';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { useAlertContext } from '@/context/alert-context';

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

import { update_profile_validate } from '@/utils/validate';

export const AccountProfileDetails = ({ user }) => {
    const { _id, name, email, role, dateOfBirth, department } = user;
    const [data, setData] = useState();
    const [openModal, setOpenModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            userId: _id || '',
            name: name || '',
            email: email || '',
            password: '',
            role: role || '',
            dateOfBirth: formatDate(dateOfBirth) || '',
            department: department || '',
        },
        validate: update_profile_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        setData(values);
        setOpenModal(true);
    }

    return (
        <>
            <ConfirmationModal
                data={data}
                _id={_id}
                name={name}
                setOpenModal={setOpenModal}
                openModal={openModal}
            />
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                <Card>
                    <CardHeader
                        subheader="The information can be edited"
                        title="Profile"
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

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        disabled
                                        name="role"
                                        label="Role"
                                        fullWidth
                                        id="role"
                                        select
                                        defaultValue=""
                                        {...formik.getFieldProps('role')}
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
                                        disabled
                                        name="department"
                                        label="Department"
                                        fullWidth
                                        id="department"
                                        select
                                        defaultValue=""
                                        {...formik.getFieldProps('department')}
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
                        <Button variant="contained">Save details</Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function ConfirmationModal({ data, _id, name, openModal, setOpenModal }) {
    const handleClose = () => setOpenModal(false);
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();

    const { mutate } = useSWRConfig();

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/users/${_id}`, data);

            mutate(`/api/users/${_id}`);
            setAlertMessage('User updated successfully');
            setIsError(false);
            setAlertOpen(true);
            setOpenModal(false);
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

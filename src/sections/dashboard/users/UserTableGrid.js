import React, { useState } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import useSWR, { useSWRConfig } from 'swr';
import axios from 'axios';
import {
    Card,
    CardContent,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    SvgIcon,
    useTheme,
    ThemeProvider,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditUserDialog from './EditUserDialog';
import { useAlertContext } from 'src/context/alert-context';
import Loading from '@/components/Loading';

const fetcher = (url) => axios.get(url).then((res) => res.data);
export default function UserTable() {
    const theme = useTheme();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const {
        data: Users,
        isLoading,
        error,
    } = useSWR('/api/users', fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 300000,
    });

    if (isLoading) return <Loading />;

    if (error)
        return (
            <Card>
                <CardContent>
                    <h3>Error loading data, {error}</h3>
                </CardContent>
            </Card>
        );

    const columns = [
        { field: 'displayId', headerName: 'No.' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            align: 'right',
            sortable: false,
            renderCell: (params) => <ActionsCell user={params.row} />,
        },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'email', headerName: 'Email', width: 350 },
        {
            field: 'dateOfBirth',
            headerName: 'Date of Birth',
            width: 110,
            valueGetter: (params) =>
                new Date(params.value).toLocaleDateString('en-GB'),
        },
        { field: 'department', headerName: 'Department', width: 250 },
        // { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'displayRole', headerName: 'Role', width: 150 },
    ];

    const roleDisplayNames = {
        qaManager: 'QA Manager',
        admin: 'Admin',
        staff: 'Staff',
        qaCoordinator: 'QA Coordinator',
    };

    const rows = Users.map((user, index) => ({
        ...user,
        displayId: index + 1,
        id: user._id,
        role: user.role,
        displayRole: roleDisplayNames[user.role],
        //dateOfBirth: new Date(user.dateOfBirth),
    }));

    const handleSelectionModelChange = (newSelection) => {
        setSelectedUsers(newSelection);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                        m: 1,
                    }}
                >
                    <h1>User List</h1>
                </Box>
                {selectedUsers.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            m: 1,
                        }}
                    >
                        <ActionsButton selectedUsers={selectedUsers} />
                    </Box>
                )}
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Card>
                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            loading={isLoading}
                            rows={rows}
                            columns={columns}
                            checkboxSelection
                            onRowSelectionModelChange={
                                handleSelectionModelChange
                            }
                            rowSelectionModel={selectedUsers}
                            disableRowSelectionOnClick
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            autoHeight
                        />
                    </Box>
                </Card>
            </ThemeProvider>
        </>
    );
}

function ActionsCell({ user }) {
    const [editDialog, setEditDialog] = useState(false);

    return (
        <>
            <Button
                startIcon={
                    <SvgIcon fontSize="small">
                        <EditIcon />
                    </SvgIcon>
                }
                aria-label="edit"
                onClick={() => setEditDialog(true)}
            >
                Edit
            </Button>

            {editDialog && (
                <EditUserDialog
                    user={user}
                    setEditDialog={setEditDialog}
                    editDialog={editDialog}
                />
            )}
        </>
    );
}

function ActionsButton({ selectedUsers }) {
    const { setAlertOpen, setAlertMessage, setIsError } = useAlertContext();
    const { mutate } = useSWRConfig();
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const handleDelete = async () => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${process.env.NEXT_PUBLIC_API_SECRET}`,
            },
            data: selectedUsers,
        };
        try {
            await axios.delete('/api/users', options);

            mutate('/api/users');
            setAlertMessage('Users Deleted Successfully');
            setIsError(false);
            setAlertOpen(true);
        } catch (error) {
            setMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        }
    };

    return (
        <div>
            <IconButton aria-label="delete" onClick={handleOpenModal}>
                <DeleteIcon />
            </IconButton>

            <ConfirmationDialog
                open={open}
                handleCloseModal={handleCloseModal}
                handleConfirm={handleDelete}
                title={`Delete Users?`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete selected users?
            </ConfirmationDialog>
        </div>
    );
}

function ConfirmationDialog({
    open,
    handleCloseModal,
    handleConfirm,
    title,
    confirmLabel,
    children,
}) {
    return (
        <Dialog open={open} onClose={handleCloseModal}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

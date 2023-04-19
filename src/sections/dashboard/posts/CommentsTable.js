import React, { useState } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import useSWR, { useSWRConfig } from 'swr';
import axios from 'axios';
import {
    Chip,
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

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loading from '@/components/Loading';

import { useAlertContext } from 'src/context/alert-context';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CommentTable() {
    const [selectedComments, setSelectedComments] = useState([]);

    const {
        data: Comments,
        isLoading,
        error,
    } = useSWR('/api/comments', fetcher, {
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
        { field: 'displayId', headerName: 'No.', width: 100 },
        { field: 'comment', headerName: 'Comment', width: 300 },
        {
            field: 'deleted',
            headerName: 'Deleted',
            sortable: false,
            width: 100,
            type: 'boolean',
        },
        { field: 'author', headerName: 'Author', width: 300 },
        {
            field: 'isAuthHidden',
            headerName: 'Hidden',
            sortable: false,
            width: 100,
            type: 'boolean',
        },
        { field: 'department', headerName: 'Department', width: 300 },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 190,
            type: 'dateTime',
        },
    ];

    const rows = Comments.map((comment, i) => ({
        ...comment,
        displayId: i + 1,
        id: comment._id, // use the _id field as the id
        createdAt: new Date(comment.createdAt), // convert the endDate field to a Date object
        author: comment.author?.name || 'Deleted User',
        department: comment.author?.department || 'Deleted User',
    }));

    const handleSelectionModelChange = (newSelection) => {
        setSelectedComments(newSelection);
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
                    <h1>Comments List</h1>
                </Box>
                {selectedComments.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            m: 1,
                        }}
                    >
                        <ActionsButton selectedComments={selectedComments} />
                    </Box>
                )}
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <Card>
                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionModelChange}
                        rowSelectionModel={selectedComments}
                        disableRowSelectionOnClick
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                        getRowClassName={(params) =>
                            `super-app-theme--${params.row.isAuthHidden} super-app-theme--${params.row.deleted}`
                        }
                    />
                </Box>
            </Card>
        </>
    );
}

function ActionsButton({ selectedComments }) {
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();
    const { mutate } = useSWRConfig();
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const handleDelete = async () => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            data: selectedComments,
        };
        try {
            const response = await axios.delete('/api/comments', options);

            mutate('/api/comments');
            setAlertMessage('Comments Deleted Successfully');
            setIsError(false);
            setAlertOpen(true);
        } catch (error) {
            setAlertMessage(error.response.data);
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
                title={`Delete Comments?`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete selected comments? This is
                permanent and cannot be reverted.
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

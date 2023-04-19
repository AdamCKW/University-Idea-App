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

export default function PostTable() {
    const [selectedPosts, setSelectedPosts] = useState([]);

    const {
        data: Posts,
        isLoading,
        error,
    } = useSWR('/api/posts', fetcher, {
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
        { field: 'title', headerName: 'Title', width: 300 },
        {
            field: 'deleted',
            headerName: 'Deleted',
            width: 100,
            type: 'boolean',
            sortable: false,
        },
        { field: 'category', headerName: 'Category', width: 300 },
        { field: 'author', headerName: 'Author', width: 300 },
        {
            field: 'isAuthHidden',
            headerName: 'Hidden',
            sortable: false,
            width: 100,
            type: 'boolean',
        },
        { field: 'department', headerName: 'Department', width: 300 },
        { field: 'comments', headerName: 'Comments', width: 100 },
        { field: 'views', headerName: 'Views', width: 100 },
        { field: 'likes', headerName: 'Likes', width: 100 },
        { field: 'dislikes', headerName: 'Dislikes', width: 100 },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 190,
            type: 'dateTime',
        },
    ];

    const rows = Posts.map((post, i) => ({
        ...post,
        displayId: i + 1,
        id: post._id, // use the _id field as the id
        createdAt: new Date(post.createdAt), // convert the endDate field to a Date object
        category: post.category.name,
        author: post.author?.name || 'Deleted User',
        comments: post.comments.length,
        likes: post.likes.length,
        dislikes: post.dislikes.length,
        department: post.author?.department || 'Deleted User',
    }));

    const handleSelectionModelChange = (newSelection) => {
        setSelectedPosts(newSelection);
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
                    <h1>Post List</h1>
                </Box>
                {selectedPosts.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            m: 1,
                        }}
                    >
                        <ActionsButton selectedPosts={selectedPosts} />
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
                        rowSelectionModel={selectedPosts}
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

function ActionsButton({ selectedPosts }) {
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
            data: selectedPosts,
        };
        try {
            const response = await axios.delete('/api/posts', options);

            mutate('/api/posts');
            setAlertMessage('Posts Deleted Successfully');
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
                title={`Delete Post?`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete selected posts? This is
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

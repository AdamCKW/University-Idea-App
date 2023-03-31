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
import EditCategoryDialog from '@/sections/dashboard/categories/EditCategoryDialog';
import { useAlertContext } from '@/context/alert-context';
import Loading from '@/components/Loading';

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

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CategoryTable() {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const {
        data: Categories,
        isLoading,
        error,
    } = useSWR('/api/categories', fetcher, {
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
        { field: 'name', headerName: 'Category Type', width: 500 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            align: 'right',
            sortable: false,
            renderCell: (params) => <ActionsCell category={params.row} />,
        },
    ];

    const rows = Categories.map((category, i) => ({
        ...category,
        displayId: i + 1,
        id: category._id, // use the _id field as the id
    }));

    const handleSelectionModelChange = (newSelection) => {
        setSelectedCategories(newSelection);
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
                    <h1>Category List</h1>
                </Box>
                {selectedCategories.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            m: 1,
                        }}
                    >
                        <ActionsButton
                            selectedCategories={selectedCategories}
                        />
                    </Box>
                )}
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <Card>
                <Box
                    sx={{
                        width: '100%',
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionModelChange}
                        rowSelectionModel={selectedCategories}
                        disableRowSelectionOnClick
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                    />
                </Box>
            </Card>
        </>
    );
}

function ActionsCell({ category }) {
    const { mutate } = useSWRConfig();
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
                <EditCategoryDialog
                    category={category}
                    setEditDialog={setEditDialog}
                    editDialog={editDialog}
                />
            )}
        </>
    );
}

function ActionsButton({ selectedCategories }) {
    const { setAlertOpen, setAlertMessage, setIsError } = useAlertContext();
    const { mutate } = useSWRConfig();
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const handleDelete = async () => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            data: selectedCategories,
        };
        try {
            await axios.delete('/api/categories', options);

            mutate('/api/categories');
            setAlertMessage('Categories Deleted Successfully');
            setIsError(false);
            setAlertOpen(true);
            setOpen(false);
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
                title={`Delete Categories?`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete selected categories?
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

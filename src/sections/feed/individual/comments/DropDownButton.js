import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useAlertContext } from '@/context/alert-context';

export default function DropDownButton({ userId, comment, setDialog, postId }) {
    const { author, _id } = comment;
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { mutate } = useSWRConfig();
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = async () => {
        if (userId === author._id) {
            setDialog(true);
            setAnchorEl(null);
        }
    };

    const handleDelete = async () => {
        if (userId === author._id) {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    userId,
                },
            };

            try {
                await axios.delete(`/api/comments/${_id}`, options);

                mutate(`/api/posts/${postId}`);
                setAlertMessage('Comment deleted successfully');
                setIsError(false);
                setAlertOpen(true);
            } catch (error) {
                setAlertMessage(error.response.data);
                setIsError(true);
                setAlertOpen(true);
            }
        }
    };

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <IconButton
                    id="positioned-button"
                    aria-controls={open ? 'positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    id="positioned-menu"
                    aria-labelledby="positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit Comment</MenuItem>

                    <MenuItem onClick={handleDelete}>
                        <Typography variant="body1" color="error">
                            Delete Comment
                        </Typography>
                    </MenuItem>
                </Menu>
            </div>

            <ConfirmationDialog
                open={openModal}
                handleCloseModal={handleCloseModal}
                handleConfirm={handleDelete}
                title={`Delete Post`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete this post?
            </ConfirmationDialog>
        </Stack>
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
